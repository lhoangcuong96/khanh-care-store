import { PrismaClient } from '@prisma/client'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function migrateCategoryImages() {
  const client = new MongoClient(process.env.DATABASE_URL!)

  try {
    await client.connect()
    const db = client.db()
    const collection = db.collection('Category')

    // Find all categories
    const categories = await collection.find({}).toArray()
    console.log(`Found ${categories.length} categories to migrate`)

    // Update each category
    for (const category of categories) {
      try {
        // Get the old image value
        const oldImage = category.image as string | null

        // Create new image structure with required fields
        const newImage = {
          thumbnail: oldImage || '', // Required field, never null
          banner: oldImage || null, // Optional field
          featured: oldImage || null, // Optional field
          gallery: [] // Required field, never null
        }

        // Update the category
        await collection.updateOne({ _id: category._id }, { $set: { image: newImage } })

        console.log(`Migrated category: ${category.name} (${oldImage || 'no image'} -> thumbnail)`)
      } catch (error) {
        console.error(`Error migrating category ${category.name}:`, error)
      }
    }

    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Error during migration:', error)
  } finally {
    await client.close()
    await prisma.$disconnect()
  }
}

// Run the migration
migrateCategoryImages()
