import {
  Global,
  Module,
}                                          from '@nestjs/common'
import { Pwnproc }                         from './pwnproc.js'
import { ZxcvbnPasswordStrengthEstimator } from './zxcbn/zxcvbn-password-strength-estimator.js'



@Global() @Module( {
							imports   : [],
							providers : [
							  {
								 provide  : Pwnproc,
								 useClass : ZxcvbnPasswordStrengthEstimator,
							  },
							],
							exports   : [ Pwnproc ],
						 } )
export class PwnprocModule {}