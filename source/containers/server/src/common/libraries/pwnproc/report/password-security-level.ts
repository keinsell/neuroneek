export enum PasswordSecurityLevel
  {
	 /** too guessable: risky password. (guesses < 10^3)  */
	 RISKY     = 0,
	 /** very guessable: protection from throttled online attacks. (guesses < 10^6)  */
	 WEAK      = 1,
	 /** somewhat guessable: protection from unthrottled online attacks. (guesses < 10^8)  */
	 MODERATE  = 2,
	 /** safely unguessable: moderate protection from offline slow-hash scenario. (guesses < 10^10) */
	 STRONG    = 3,
	 /** Very Unguessable. strong protection from offline slow-hash scenario. (guesses >= 10^10) */
	 EXCELLENT = 4,
  }