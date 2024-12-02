import { CrackingTime }              from './cracking-time.js'
import { PasswordAttackTimeDisplay } from './password-attack-time-display.js'
import { PasswordFeedback }          from './password-feedback.js'
import { PasswordSecurityLevel }     from './password-security-level.js'



export class PasswordSecurityReport
  {
	 public feedback : PasswordFeedback
	 public crackingTime : CrackingTime
	 public crackingTimeDisplay : PasswordAttackTimeDisplay
	 public score : PasswordSecurityLevel


	 constructor(payload : {
		feedback : PasswordFeedback, crackingTime : CrackingTime, crackingTimeDisplay : PasswordAttackTimeDisplay,
		score : PasswordSecurityLevel
	 })
		{
		  this.feedback            = payload.feedback
		  this.crackingTime        = payload.crackingTime
		  this.crackingTimeDisplay = payload.crackingTimeDisplay
		  this.score               = payload.score
		}


	 isScoreHigherThan(score : PasswordSecurityLevel)
		{
		  const scoreMapping : {
			 [key in PasswordSecurityLevel] : number
		  } = {
			 0 : 0,
			 1 : 1,
			 2 : 2,
			 3 : 3,
			 4 : 4,
		  }

		  const actualScore   = scoreMapping[ this.score ]
		  const expectedScore = scoreMapping[ score ]

		  return actualScore > expectedScore
		}


	 isScoreLowerThan(score : PasswordSecurityLevel)
		{
		  const scoreMapping : {
			 [key in PasswordSecurityLevel] : number
		  } = {
			 0 : 0,
			 1 : 1,
			 2 : 2,
			 3 : 3,
			 4 : 4,
		  }

		  const actualScore   = scoreMapping[ this.score ]
		  const expectedScore = scoreMapping[ score ]

		  return actualScore < expectedScore
		}
  }