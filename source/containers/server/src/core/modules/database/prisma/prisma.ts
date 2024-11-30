import { PrismaClient, Prisma } from 'db'

const prisma = new PrismaClient()

const substanceWithRouteOfAdministrationWithDosage = Prisma.validator<Prisma.SubstanceDefaultArgs>()({
  include: { routes_of_administration: { include: { dosage: true } } },
})

export type SubstanceWithRouteOfAdministrationWithDosage = Prisma.SubstanceGetPayload<typeof substanceWithRouteOfAdministrationWithDosage>

export default prisma
export { PrismaClient, Prisma }
