import axios from 'axios';
import * as cheerio from 'cheerio';

export const config = {
  maxDuration: 10
};

// Create standard optimized client without keep-alive to prevent AWS Lambda frozen socket hangs
const client = axios.create({
  timeout: 6500,
  maxRedirects: 3,
  decompress: true
});

// Cache for warm serverless execution to make identical queries sub-millisecond fast!
const searchCache = new Map();

export default async function handler(req, res) {
  // Set CORS and security headers immediately
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // STEP 1 — Validate the incoming request
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, searchType: querySearchType } = req.query;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: "Enter a valid business name" });
  }

  // Sanitize name: trim, allow letters, numbers, spaces, hyphens, and ampersands. Strip other symbols.
  const sanitizedName = name.replace(/[^a-zA-Z0-9\s&\-]/g, "").trim();

  if (sanitizedName.length < 2) {
    return res.status(400).json({ error: "Enter a valid business name" });
  }

  // Determine searchType parameter (default to cn if not matching)
  const validTypes = ['exact', 'sw', 'ew', 'cn'];
  const searchType = validTypes.includes(querySearchType) ? querySearchType : 'cn';
  console.log(`[NAMECHECKGH] Filter: ${searchType}`);

  const cacheKey = `${sanitizedName.toLowerCase()}_${searchType}`;

  // If we have cached results for this query during warm execution, return results instantly!
  if (searchCache.has(cacheKey)) {
    console.log(`[NAMECHECKGH] Cache hit for: "${sanitizedName}"`);
    const results = searchCache.get(cacheKey);

    const hasPageOrLimit = req.query.page !== undefined || req.query.limit !== undefined;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = hasPageOrLimit 
      ? Math.min(50, parseInt(req.query.limit) || 10) 
      : results.length;
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(results.length / limit);

    if (results.length === 0) {
      return res.status(200).json({
        searched: sanitizedName,
        searchType: searchType,
        status: "available",
        count: 0,
        page: page,
        totalPages: 0,
        limit: limit,
        results: [],
        source: "ORC Ghana Registry"
      });
    }

    return res.status(200).json({
      searched: sanitizedName,
      searchType: searchType,
      status: "taken",
      count: results.length,
      page: page,
      totalPages: totalPages,
      limit: limit,
      results: paginated,
      source: "ORC Ghana Registry"
    });
  }

  console.log(`[NAMECHECKGH] Querying live ORC for: "${sanitizedName}"`);

  // Global 8.5s timeout to prevent Vercel 504 Gateway Timeouts (max 10s)
  const controller = new AbortController();
  const globalTimeoutId = setTimeout(() => {
    controller.abort();
  }, 8500);

  let attempts = 0;
  const maxAttempts = 2;
  let responseData = null;

  try {
    while (attempts < maxAttempts) {
      try {
        attempts++;
        
        // STEP 2 — Fetch session and CSRF token
        const initialUrl = 'https://rgdonline.gegov.gov.gh/orc-app/';
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

        const getResponse = await client.get(initialUrl, {
          headers: {
            "User-Agent": userAgent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive"
          },
          timeout: 6500,
          signal: controller.signal
        });

        const $ = cheerio.load(getResponse.data);

        // Look for CSRF token
        const csrfToken = 
          $('input[name="_csrf"]').val() ||
          $('meta[name="_csrf"]').attr('content') ||
          $('meta[name="csrf-token"]').attr('content');

        if (!csrfToken) {
          throw new Error("CSRF token not found");
        }

        // Extract JSESSIONID from cookie headers
        const cookies = getResponse.headers['set-cookie'] || [];
        const sessionCookie = cookies
          .map(c => c.split(';')[0])
          .find(c => c.startsWith('JSESSIONID'));

        if (!sessionCookie) {
          throw new Error("Session cookie not found");
        }

        // STEP 3 — POST the search
        const postUrl = 'https://rgdonline.gegov.gov.gh/orc-app/search-for-name';
        
        const params = new URLSearchParams();
        params.append('_csrf', csrfToken);
        params.append('bizName', sanitizedName);
        params.append('searchType', searchType);

        const postResponse = await client.post(postUrl, params.toString(), {
          headers: {
            "User-Agent": userAgent,
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": sessionCookie,
            "HX-Current-URL": "https://rgdonline.gegov.gov.gh/orc-app/",
            "HX-Request": "true",
            "HX-Target": "search-results",
            "HX-Trigger": "saveRequest",
            "Origin": "https://rgdonline.gegov.gov.gh",
            "Referer": "https://rgdonline.gegov.gov.gh/orc-app/"
          },
          timeout: 6500,
          signal: controller.signal
        });

        if (postResponse.status !== 200) {
          throw new Error("POST search returned non-200 status");
        }

        responseData = postResponse.data;
        break; // Success, break retry loop!

      } catch (err) {
        console.warn(`[NAMECHECKGH] Attempt ${attempts} failed:`, err.message);
        if (attempts < maxAttempts) {
          await new Promise(r => setTimeout(r, 800));
          continue;
        }
        // Re-throw if all attempts fail
        throw err;
      }
    }

    // STEP 4 — Parse the HTML response with cheerio
    const $results = cheerio.load(responseData);
    const results = [];

    // 1. Try checking table rows
    $results('table tr').each((i, el) => {
      // Skip header rows containing th
      if ($results(el).find('th').length > 0) return;

      const cells = $results(el).find('td');
      if (cells.length >= 2) {
        const businessName = $results(cells[0]).text().trim();
        const businessType = $results(cells[1]).text().trim();

        if (businessName && businessName.toLowerCase() !== 'no data found') {
          results.push({ businessName, businessType });
        }
      }
    });

    // 2. Try checking lists (ul/li) or div.result-item if no table rows matched
    if (results.length === 0) {
      $results('ul li, div.result-item').each((i, el) => {
        const text = $results(el).text().trim();
        const nameEl = $results(el).find('.name, .business-name, strong').first();
        const typeEl = $results(el).find('.type, .business-type, span').first();

        let businessName = nameEl.text().trim();
        let businessType = typeEl.text().trim();

        if (!businessName) {
          if (text && text.includes(' - ')) {
            const parts = text.split(' - ');
            businessName = parts[0].trim();
            businessType = parts[1].trim();
          } else if (text) {
            businessName = text;
            businessType = 'Unknown';
          }
        }

        if (businessName && businessName.toLowerCase() !== 'no data found') {
          results.push({
            businessName,
            businessType: businessType || 'Unknown'
          });
        }
      });
    }

    const hasNoDataText = responseData.toLowerCase().includes('no data found') || responseData.trim() === '';

    // Cache the full scraped list in-memory for lightning fast warm-start paginations!
    searchCache.set(cacheKey, results);

    // Prune cache if it grows too large (e.g. > 100 entries)
    if (searchCache.size > 100) {
      const firstKey = searchCache.keys().next().value;
      searchCache.delete(firstKey);
    }

    // Pagination calculations
    const hasPageOrLimit = req.query.page !== undefined || req.query.limit !== undefined;
    
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = hasPageOrLimit 
      ? Math.min(50, parseInt(req.query.limit) || 10)
      : results.length;
      
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(results.length / limit);

    if (results.length === 0 || hasNoDataText) {
      console.log('[NAMECHECKGH] Results found: 0');
      clearTimeout(globalTimeoutId);
      return res.status(200).json({
        searched: sanitizedName,
        searchType: searchType,
        status: "available",
        count: 0,
        page: page,
        totalPages: 0,
        limit: limit,
        results: [],
        source: "ORC Ghana Registry"
      });
    }

    console.log(`[NAMECHECKGH] Results found: ${results.length}`);
    clearTimeout(globalTimeoutId);
    return res.status(200).json({
      searched: sanitizedName,
      searchType: searchType,
      status: "taken",
      count: results.length,
      page: page,
      totalPages: totalPages,
      limit: limit,
      results: paginated,
      source: "ORC Ghana Registry"
    });

  } catch (error) {
    if (typeof globalTimeoutId !== 'undefined') {
      clearTimeout(globalTimeoutId);
    }
    console.error('[NAMECHECKGH] Error occurred during search:', error);

    const message = error.message || '';
    
    if (
      axios.isCancel(error) ||
      error.name === 'CanceledError' ||
      error.name === 'AbortError' ||
      error.code === 'ECONNABORTED' || 
      error.code === 'ETIMEDOUT' ||
      message.includes('timeout') ||
      message.includes('canceled')
    ) {
      return res.status(503).json({
        error: "ORC registry is taking too long to respond. Please try again in a few seconds.",
        code: "TIMEOUT"
      });
    }

    if (
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED'
    ) {
      return res.status(503).json({
        error: "Cannot reach ORC registry right now. The server may be down.",
        code: "UNREACHABLE"
      });
    }

    if (message.includes('CSRF') || message.includes('Session')) {
      return res.status(503).json({ error: "Could not connect to ORC registry" });
    }

    if (error.response && error.response.status !== 200) {
      return res.status(503).json({ error: "ORC registry returned an error" });
    }

    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
