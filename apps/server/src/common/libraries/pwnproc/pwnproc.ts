import { PasswordSecurityReport } from './report/password-security-report.js'



export abstract class Pwnproc
  {
	 abstract generateReport(password : string) : Promise<PasswordSecurityReport>
  }