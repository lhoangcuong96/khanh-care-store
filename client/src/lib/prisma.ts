/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/prisma.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma: any = global;

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // Trong môi trường phát triển, sử dụng một instance duy nhất
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
