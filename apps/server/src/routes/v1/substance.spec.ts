import {beforeEach, describe, expect, it, jest, test}              from '@jest/globals'
import {Test, TestingModule}                                       from "@nestjs/testing"
import createPrismaMock                                            from "prisma-mock"
import {createPrismaMockContext}                                   from "../../../test/setup/prisma-context"
import {Prisma, Substance}                                         from '../../../vendor/prisma'
import {PrismaClient}                                              from '../../core/modules/database/prisma/prisma'
import {PrismaService}                                             from "../../core/modules/database/prisma/services/prisma-service"
import {SubstanceController, SubstanceNotFound, SubstanceResponse} from "./substance"



describe(SubstanceController.name, () => {
	let substanceController: SubstanceController;
	let prismaClient: PrismaClient;

	beforeEach(async () => {
		const mockSubstance: Substance = {
			id:                 "f5503696-b65b-4b27-85c5-7394fa2b0f5f",
			name:               "Caffeine",
			common_names:       null,
			brand_names:        null,
			substitutive_name:  null,
			systematic_name:    null,
			unii:               null,
			cas_number:         null,
			inchi_key:          null,
			iupac:              null,
			smiles:             null,
			psychoactive_class: 'stimulant',
			chemical_class:     null,
			description:        null,
		}

		prismaClient = createPrismaMock({substance: [mockSubstance]}, Prisma.dmmf.datamodel, createPrismaMockContext().prisma as any)

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SubstanceController, {
					provide:  PrismaService,
					useValue: prismaClient,
				},
			],
		}).overrideProvider(PrismaService).useValue(prismaClient).compile();

		substanceController = module.get<SubstanceController>(SubstanceController);
	});

	describe("getSubstanceById", () => {
		/**
		 * This test ensures that the mocked implementation of prisma retrieves and correctly returns data
		 * from the ORM or other storage implementations.
		 */
		it(`should correctly transform information from database`, async () => {
			const substance = await substanceController.getSubstanceById("f5503696-b65b-4b27-85c5-7394fa2b0f5f")

			expect(substance).toStrictEqual({
				"chemical_classes":         [],
				"common_names":             [],
				"id":                       "f5503696-b65b-4b27-85c5-7394fa2b0f5f",
				"name":                     "Caffeine",
				"psychoactive_classes":     [
					"stimulant",
				],
				"routes_of_administration": null,
			} as SubstanceResponse)
		})

		it(`should throw NotFoundException when no substance found`, async () => {
			const testId = 'non-existing-id';
			try {
				await substanceController.getSubstanceById(testId);
			} catch (// @ts-ignore
				error: Error) {
				console.log(`Test id used: ${testId}`);
				console.log(`Caught error: ${error}`);
				expect(error).toBeInstanceOf(SubstanceNotFound);
				expect(error.message).toBe('Substance not found');
			}
		});

		it(`should have debug logging`, async () => {
			const loggerSpy = jest.spyOn(substanceController['logger'], 'debug');
			await substanceController.getSubstanceById('f5503696-b65b-4b27-85c5-7394fa2b0f5f');
			expect(loggerSpy).toHaveBeenNthCalledWith(1, expect.stringContaining('f5503696-b65b-4b27-85c5-7394fa2b0f5f'));
			expect(loggerSpy).toHaveBeenNthCalledWith(2, expect.stringContaining('Found substance'));
		});
	})

	describe("listSubstances", () => {
		it("should list one substance", async () => {
			const substances = await substanceController.getAllSubstances()
			expect(substances).toHaveLength(1)
			expect(substances[0].id).toBe("f5503696-b65b-4b27-85c5-7394fa2b0f5f")
			expect(substances[0].name).toBe("Caffeine")
			expect(substances[0].psychoactive_classes).toEqual(["stimulant"])
			expect(substances[0].chemical_classes).toEqual([])
			expect(substances[0].routes_of_administration).toBeNull()
			expect(substances[0].common_names).toEqual([])
		})

		/**
		 * This test ensures that the mocked implementation of prisma retrieves and correctly returns data
		 * from the ORM or other storage implementations.
		 * Specifically, it calls the getAllSubstances method from the substanceController
		 * and checks that the returned data matches the expected outcome (i.e., there is one substance and its details are as expected).
		 * This test is here to ensure that the getAllSubstances method, which is responsible for retrieving
		 * all substances, performs as expected.
		 */
		test('should return one result', async () => {
			allure.layer("controller")
			allure.issue("Listing Substances", "https://linear.app/keinsell/issue/NEU-18/🧪-automated-testing")
			const substances = await substanceController.getAllSubstances()
			expect(substances).toHaveLength(1)
			expect(substances[0].id).toBe("f5503696-b65b-4b27-85c5-7394fa2b0f5f")
			expect(substances[0].name).toBe("Caffeine")
			expect(substances[0].psychoactive_classes).toEqual(["stimulant"])
			expect(substances[0].chemical_classes).toEqual([])
			expect(substances[0].routes_of_administration).toBeNull()
			expect(substances[0].common_names).toEqual([])
		});

	})

})