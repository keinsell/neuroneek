import {beforeEach, describe, expect, test} from '@jest/globals'
import {Test, TestingModule}                from "@nestjs/testing"
import {PrismaClient, Prisma}               from 'db'
import {DeepMockProxy, mockDeep}            from "jest-mock-extended"
import {randomUUID}                         from "node:crypto"
import {default as createPrismaMock}        from "prisma-mock"
import {PrismaService}                      from "../core/modules/database/prisma/services/prisma-service"
import {SubstanceController}                from "../routes/v1/substance"



describe("SubstanceController", () => {
	let substanceController: SubstanceController;
	let prismaClient: DeepMockProxy<PrismaClient>;

	beforeEach(async () => {
		prismaClient = createPrismaMock({
			substance: [
				{
					id: "f5503696-b65b-4b27-85c5-7394fa2b0f5f",
				},
			],
		}, Prisma.dmmf.datamodel, new PrismaClient())

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SubstanceController, {
					provide:  PrismaService,
					useValue: prismaClient,
				},
			],
		}).compile();

		substanceController = module.get<SubstanceController>(SubstanceController);
	});

	/**
	 * This test will test mocked implementation of prisma, and ensure data that we get from
	 * ORM or any other storage implementation is properly returned to user.
	 */
	test("should get single substance", async () => {

		let substanceId: string = randomUUID();

		const substance = await substanceController.getSubstanceById("f5503696-b65b-4b27-85c5-7394fa2b0f5f")

		expect(substance).toBe({})
	})
})