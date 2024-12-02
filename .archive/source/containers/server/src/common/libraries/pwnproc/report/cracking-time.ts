import { PasswordAttack } from './password-attack.js'



export type CrackingTime = {
  [key in PasswordAttack] : number
}