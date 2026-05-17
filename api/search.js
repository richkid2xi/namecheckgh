import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // STEP 1 — Validate the incoming request
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.query;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: "Enter a valid business name" });
  }

  // Sanitize name: trim, allow letters, numbers, spaces, hyphens, and ampersands. Strip other symbols.
  const sanitizedName = name.replace(/[^a-zA-Z0-9\s&\-]/g, "").trim();

  if (sanitizedName.length < 2) {
    return res.status(400).json({ error: "Enter a valid business name" });
  }

  console.log(`[NAMECHECKGH] Searching for: "${sanitizedName}"`);

  try {
    // STEP 2 — Fetch session and CSRF token
    const initialUrl = 'https://rgdonline.gegov.gov.gh/orc-app/';
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    const getResponse = await axios.get(initialUrl, {
      headers: {
        "User-Agent": userAgent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      },
      timeout: 12000
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

    console.log('[NAMECHECKGH] Session obtained successfully');

    // STEP 3 — POST the search
    const postUrl = 'https://rgdonline.gegov.gov.gh/orc-app/search-for-name';
    
    const params = new URLSearchParams();
    params.append('_csrf', csrfToken);
    params.append('bizName', sanitizedName);
    params.append('searchType', 'cn');

    const postResponse = await axios.post(postUrl, params.toString(), {
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
        "Referer": "https://rgdonline.gegov.gov.gh/orc-app/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
      },
      timeout: 12000
    });

    if (postResponse.status !== 200) {
      throw new Error("POST search returned non-200 status");
    }

    // STEP 4 — Parse the HTML response with cheerio
    const $results = cheerio.load(postResponse.data);
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

    const hasNoDataText = postResponse.data.toLowerCase().includes('no data found') || postResponse.data.trim() === '';

    if (results.length === 0 || hasNoDataText) {
      console.log('[NAMECHECKGH] Results found: 0');
      return res.status(200).json({
        searched: sanitizedName,
        status: "available",
        count: 0,
        results: [],
        source: "ORC Ghana Registry"
      });
    }

    console.log(`[NAMECHECKGH] Results found: ${results.length}`);
    return res.status(200).json({
      searched: sanitizedName,
      status: "taken",
      count: results.length,
      results: results,
      source: "ORC Ghana Registry"
    });

  } catch (error) {
    console.error('[NAMECHECKGH] Error occurred during search:', error);

    const message = error.message || '';
    
    if (message.includes('CSRF') || message.includes('Session')) {
      return res.status(503).json({ error: "Could not connect to ORC registry" });
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || message.includes('timeout')) {
      return res.status(503).json({ error: "ORC registry timed out" });
    }

    if (error.response && error.response.status !== 200) {
      return res.status(503).json({ error: "ORC registry returned an error" });
    }

    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
