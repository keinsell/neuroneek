import {beforeEach, describe, expect, test} from '@jest/globals'
import {randomUUID}                         from "node:crypto"
import {PrismaService}                      from "../core/modules/database/prisma/services/prisma-service"
import {SubstanceController}                from "../routes/v1/substance"



describe("SubstanceController", () => {
	let substanceController: SubstanceController;

	beforeEach(() => {
		substanceController = new SubstanceController(
			new PrismaService(),
		);
	});

	/**
	 * This test will test mocked implementation of prisma, and ensure data that we get from
	 * ORM or any other storage implementation is properly returned to user.
	 */
	test("should get single substance", async() =>{

		let substanceId: string = randomUUID();

		const substance = await substanceController.getSubstanceById(substanceId)

		expect(substance).toBe({})
	})
})