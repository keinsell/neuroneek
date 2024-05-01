import { PrismaClient, Prisma } from 'db'

const prisma = new PrismaClient()

export default prisma
export {PrismaClient, Prisma}