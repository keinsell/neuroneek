import { Injectable }             from '@nestjs/common'
import zxcvbn                     from 'zxcvbn'
import { Pwnproc }                from '../pwnproc.js'
import { PasswordAttack }         from '../report/password-attack.js'
import { PasswordSecurityLevel }  from '../report/password-security-level.js'
import { PasswordSecurityReport } from '../report/password-security-report.js'



@Injectable()
export class ZxcvbnPasswordStrengthEstimator
  extends Pwnproc
  {
	 public async generateReport(password : string) : Promise<PasswordSecurityReport>
		{
		  const result = zxcvbn( password )

		  // Map ZXCBN Score to PasswordSecurityReport Score
		  let score = this.mapZxcvbnScoreToPasswordSecurityReportScore( result.score )

		  // Return PasswordSecurityReport
		  return new PasswordSecurityReport( {
															score               : score,
															crackingTime        : {
															  [ PasswordAttack.OFFLINE_FAST_HASHING_1E10_PER_SECOND ] : Number(
																 result.crack_times_seconds.offline_fast_hashing_1e10_per_second ),
															  [ PasswordAttack.OFFLINE_SLOW_HASHING_1E4_PER_SECOND ]  : Number(
																 result.crack_times_seconds.offline_slow_hashing_1e4_per_second ),
															  [ PasswordAttack.ONLINE_NO_THROTTLING_10_PER_SECOND ]   : Number(
																 result.crack_times_seconds.online_no_throttling_10_per_second ),
															  [ PasswordAttack.ONLINE_THROTTLING_100_PER_HOUR ]       : Number(
																 result.crack_times_seconds.online_throttling_100_per_hour ),
															},
															crackingTimeDisplay : {
															  [ PasswordAttack.OFFLINE_FAST_HASHING_1E10_PER_SECOND ] : result.crack_times_display.offline_fast_hashing_1e10_per_second.toString(),
															  [ PasswordAttack.OFFLINE_SLOW_HASHING_1E4_PER_SECOND ]  : result.crack_times_display.offline_slow_hashing_1e4_per_second.toString(),
															  [ PasswordAttack.ONLINE_NO_THROTTLING_10_PER_SECOND ]   : result.crack_times_display.online_no_throttling_10_per_second.toString(),
															  [ PasswordAttack.ONLINE_THROTTLING_100_PER_HOUR ]       : result.crack_times_display.online_throttling_100_per_hour.toString(),
															},
															feedback            : {
															  warning     : result.feedback.warning,
															  suggestions : result.feedback.suggestions,
															},
														 } )
		}


	 private mapZxcvbnScoreToPasswordSecurityReportScore(score : 0 | 1 | 2 | 3 | 4) : PasswordSecurityLevel
		{
		  // Cast score to correspond PasswordSecurityLevel value
		  let passwordSecurityReportScore : PasswordSecurityLevel = score as PasswordSecurityLevel

		  // Validation to ensure provided score exists within the enumeration
		  if ( !Object.values( PasswordSecurityLevel ).includes( passwordSecurityReportScore ) )
			 {
				throw new Error( 'Invalid score provided. Expected a number between 0 and 4 inclusive.' )
			 }

		  return passwordSecurityReportScore
		}
  }