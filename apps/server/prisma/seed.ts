// 1. Seed Caffeine

import { PrismaClient } from '@prisma/client'
import { RouteOfAdministrationClassification } from '../src/modules/substance-index/route-of-administration-table/route-of-administration/route-of-administration-classification'

const prisma = new PrismaClient()

async function main() {
	// Seed Caffeine
	const caffeine = await prisma.substance.create({
		data: {
			name: 'Caffeine',
			description:
				'1,3,7-Trimethylxanthine (also known as caffeine) is a naturally-occurring stimulant substance of the xanthine class. Notable effects include stimulation, wakefulness, enhanced focus and motivation. It is the most widely consumed psychoactive substance in the world. ',
			substitutive_name: '1,3,7-Trimethylxanthine',
			systematic_name: '1,3,7-Trimethylpurine-2,6-dione',
			common_names: ['Caffeine'],
			routes_of_administration: {
				createMany: {
					skipDuplicates: true,
					data: [{ name: RouteOfAdministrationClassification.ORAL, bioavailability: [0.1] }]
				}
			}
		}
	})

	await prisma.dosage.create({
		data: {
			intensivity: 'COMMON',
			perKilogram: false,
			amount_max: 200,
			amount_min: 50,
			unit: 'mg',
			RouteOfAdministration: {
				connect: {
					name_substanceName: {
						name: RouteOfAdministrationClassification.ORAL,
						substanceName: 'Caffeine'
					}
				}
			}
		}
	})
}
