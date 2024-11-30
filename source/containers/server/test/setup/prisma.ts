// eslint-disable-next-line @typescript-eslint/no-var-requires
// @formatter:off


//import {mockDeep, mockReset} from "jest-mock-extended"
//import createPrismaMock from "prisma-mock"
//import {jest, beforeEach} from '@jest/globals'
//import {PrismaClient, Prisma} from "db"
//
//
//
//jest.mock("db", () => ({
//	__esModule: true,
//	default: mockDeep(),
//	Prisma:    mockDeep(),
//	PrismaClient: new PrismaClient()
//}))
//
//beforeEach(() => {
//	mockReset(PrismaClient)
//	createPrismaMock({}, Prisma.dmmf.datamodel)
//})

import {jest, beforeEach} from '@jest/globals'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import { PrismaClient, Prisma } from 'db'
import prisma from '../../src/core/modules/database/prisma/prisma'

jest.mock('../../src/core/modules/database/prisma/prisma', () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
	PrismaClient: function () {
		return mockDeep<PrismaClient>()
	},
	Prisma: Prisma
}))

beforeEach(() => {
	mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>