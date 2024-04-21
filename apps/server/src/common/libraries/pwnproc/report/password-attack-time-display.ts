import { PasswordAttack } from './password-attack.js'



/** "less than a second", "3 hours", "centuries", etc. */
export type PasswordAttackTimeDisplay = {
  [key in PasswordAttack] : string
}