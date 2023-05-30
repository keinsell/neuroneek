import { Command } from '~foundry/cqrs'

interface SolveAuthorizationChallangeProperties {
	challengeId: string
	code: string
}

export class SolveAuthorizationChallenge extends Command implements SolveAuthorizationChallangeProperties {
	public challengeId: string
	public code: string

	constructor(payload: SolveAuthorizationChallangeProperties) {
		super()
		Object.assign(this, payload)
	}
}
