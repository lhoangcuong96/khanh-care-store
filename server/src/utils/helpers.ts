import fs from 'fs'
import crypto from 'crypto'

export const randomId = () => crypto.randomUUID().replace(/-/g, '')
export const createFolder = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }
}

export function slugify(name: string): string {
  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove extra spaces
    .normalize('NFD') // Normalize accents (e.g., é → e)
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
}
