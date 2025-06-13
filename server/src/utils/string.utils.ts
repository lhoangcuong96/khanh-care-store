/**
 * Converts Vietnamese text to non-accented text
 * @param str The input string to convert
 * @returns The string without Vietnamese accents
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}
