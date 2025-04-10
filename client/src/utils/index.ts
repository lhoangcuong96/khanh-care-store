export const slugToText = (slug: string) => {
  return slug
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\b\w/g, (char: string) => char.toUpperCase()); // Capitalize each word
};
