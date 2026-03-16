// Recursively rename "address" keys to "address_hash" in API responses
// to bridge older backend versions (blockscout v7) with newer frontend expectations.
// Only renames when the object has "address" but not "address_hash" and the value is a hex string.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeAddressFields(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(normalizeAddressFields);
  }

  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (
      key === 'address' &&
      typeof value === 'string' &&
      value.startsWith('0x') &&
      !('address_hash' in obj)
    ) {
      result.address_hash = value;
    }

    result[key] =
      typeof value === 'object' ? normalizeAddressFields(value) : value;
  }

  return result;
}
