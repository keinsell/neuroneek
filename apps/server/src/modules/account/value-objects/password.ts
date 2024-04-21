import {ApiProperty}            from '@nestjs/swagger'
import {Pwnproc}                from '../../../common/libraries/pwnproc/pwnproc.js'
import {PasswordSecurityReport} from '../../../common/libraries/pwnproc/report/password-security-report.js'
import {PhcString}              from '../../../common/libraries/unihash/types/phc-string.js'
import {UnihashAlgorithm}       from '../../../common/libraries/unihash/unihash-algorithm.js'
import {ApiAccountMockup}       from '../../../utilities/fixtures/api-account-mockup.js'



export const ApiPropertyAccountPassword = ApiProperty({
	name       : 'password',
	description: 'The account\'s username',
	example    : ApiAccountMockup.password,
	examples   : ApiAccountMockup._examples.passwords,
})


interface PasswordProperties {
	hash: PhcString
	plain?: string
	report?: PasswordSecurityReport
}


export class Password
	implements PasswordProperties {
	hash: PhcString
	plain?: string
	report?: PasswordSecurityReport


	private constructor(payload: PasswordProperties) {
		this.hash   = payload.hash
		this.plain  = payload.plain
		this.report = payload.report
	}


	static fromHash(hash: PhcString): Password {
		return new Password({
			hash,
		})
	}


	static async fromPlain(plain: string, hashingService: UnihashAlgorithm): Promise<Password> {
		const hash = await hashingService.hash(plain)
		return new Password({
			hash: PhcString.deserialize(hash),
			plain,
		})
	}


	public async compare(plain: string, hashingService: UnihashAlgorithm): Promise<boolean> {
		return hashingService.verify(
			this.hash.serialize(),
			plain,
		)
	}


	public async generateReport(passwordStrengthEstimator: Pwnproc): Promise<PasswordSecurityReport> {
		if (!this.plain)
			{
				throw new Error('Cannot generate report for a password that was not created from plain text.')
			}

		return await passwordStrengthEstimator.generateReport(this.plain)
	}


	public addReport(report: PasswordSecurityReport): Password {
		this.report = report
		return this
	}
}
