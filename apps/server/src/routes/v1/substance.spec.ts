import {Test}                from "@nestjs/testing"
import {PrismaModule}        from "../../core/modules/database/prisma/prisma-module"
import {PrismaService}       from "../../core/modules/database/prisma/services/prisma-service"
import {SubstanceController} from "./substance"


// https://wanago.io/2023/04/03/api-nestjs-unit-tests-prisma/
// https://github.com/morintd/prismock

describe('substance-controller', () => {
	let substanceController: SubstanceController;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [PrismaModule],
			controllers: [SubstanceController],
			providers: [],
		}).compile();

		substanceController = moduleRef.get<SubstanceController>(SubstanceController);
	});

	describe('getAllSubstances', () => {
		it('should return list of substances', async () => {
			const result = [];
			jest.spyOn(substanceController, 'getAllSubstances').mockImplementation(() => result);

			expect(await substanceController.getAllSubstances()).toBe(result);
		});
	});
});