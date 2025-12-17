function parseStringArrayParam(param) {
  if (param == null) return [];
  try {
    const val = JSON.parse(param);           // works for '["A","B"]' or '"A"'
    if (Array.isArray(val)) return val.map(String);
    return [String(val)];
  } catch {
    return String(param)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
}

module.exports = { parseStringArrayParam };