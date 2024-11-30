import { PrismaClient }            from '../../vendor/prisma'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

export type Context = {
	prisma: PrismaClient
}

export type MockContext = {
	prisma: DeepMockProxy<PrismaClient>
}

export const createPrismaMockContext = (): MockContext => {
	return {
		prisma: mockDeep<PrismaClient>(),
	} as any
}