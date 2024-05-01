import { PrismaClient } from '@prisma/client'
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