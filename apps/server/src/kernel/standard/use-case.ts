import {Result} from "neverthrow"



export abstract class UseCase<I, O, E = never> {
	abstract execute(input: I): Promise<Result<O, E>>
}