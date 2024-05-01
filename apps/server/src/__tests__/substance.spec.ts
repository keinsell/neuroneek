import {beforeEach, describe, expect, test, jest} from '@jest/globals'
import {Test, TestingModule}                from "@nestjs/testing"
import {randomUUID}                         from "node:crypto"
import createPrismaMock                           from "prisma-mock"
import {createPrismaMockContext}                  from "../../test/prisma-context"
import {PrismaService}                          from "../core/modules/database/prisma/services/prisma-service"
import {SubstanceController, SubstanceResponse} from "../routes/v1/substance"
import { PrismaClient }                         from '../core/modules/database/prisma/prisma'
import { Prisma, Substance } from 'db'



describe("SubstanceController", () => {
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
				SubstanceController,
				{
					provide: PrismaService,
					useValue: prismaClient,
				},
			],
		}).overrideProvider(PrismaService).useValue(prismaClient).compile();

		substanceController = module.get<SubstanceController>(SubstanceController);
	});

	/**
	 * This test will test mocked implementation of prisma, and ensure data that we get from
	 * ORM or any other storage implementation is properly returned to user.
	 */
	test("should get single substance", async () => {
		const substance = await substanceController.getSubstanceById("f5503696-b65b-4b27-85c5-7394fa2b0f5f")

		expect(substance).toStrictEqual({
			"chemical_classes": [],
			"common_names": [],
			"id": "f5503696-b65b-4b27-85c5-7394fa2b0f5f",
			"name": "Caffeine",
			"psychoactive_classes":  [
			"stimulant",
				],
			"routes_of_administration": null,
	} as SubstanceResponse)
	})

	/**
   * This test ensures that the mocked implementation of prisma retrieves and correctly returns data
   * from the ORM or other storage implementations.
   * Specifically, it calls the getAllSubstances method from the substanceController
   * and checks that the returned data matches the expected outcome (i.e., there is one substance and its details are as expected).
   * This test is here to ensure that the getAllSubstances method, which is responsible for retrieving
   * all substances, performs as expected.
	 */
  test('should list one substance', async () => {
    const substances = await substanceController.getAllSubstances();
    expect(substances).toHaveLength(1);
    expect(substances[0].id).toBe('f5503696-b65b-4b27-85c5-7394fa2b0f5f');
    expect(substances[0].name).toBe('Caffeine');
    expect(substances[0].psychoactive_classes).toEqual(['stimulant']);
    expect(substances[0].chemical_classes).toEqual([]);
    expect(substances[0].routes_of_administration).toBeNull();
    expect(substances[0].common_names).toEqual([]);
  });
})