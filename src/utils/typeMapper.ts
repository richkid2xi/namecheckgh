export const OFFICIAL_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'Private Limited Company',
  'Public Limited Company',
  'Company Limited by Guarantee',
  'Unlimited Company',
  'External Company'
];

export function getDisplayType(type: string): string {
  const t = type.trim().toLowerCase();
  
  if (t.includes('sole proprietorship') || t.includes('sole proprietor') || t === 'individual') {
    return 'Sole Proprietorship';
  }
  if (t.includes('partnership')) {
    return 'Partnership';
  }
  if (
    t.includes('private limited company') || 
    t.includes('private company limited') || 
    t.includes('company limited by shares') || 
    t === 'ltd' || 
    t === 'limited company'
  ) {
    return 'Private Limited Company';
  }
  if (t.includes('public limited company') || t === 'plc') {
    return 'Public Limited Company';
  }
  if (t.includes('company limited by guarantee') || t.includes('limited by guarantee') || t === 'lbg') {
    return 'Company Limited by Guarantee';
  }
  if (t.includes('unlimited company') || t.includes('unlimited')) {
    return 'Unlimited Company';
  }
  if (t.includes('external company') || t.includes('external')) {
    return 'External Company';
  }
  
  // Fallback to Others
  return 'Others';
}
