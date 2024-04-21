import { EmailAttachment } from './email-attachment.js'
import { Html }            from './html.js'
import { PlainText }       from './plain-text.js'



export type EmailContent = {
  subject? : string
  body? : Html | PlainText
  attachments? : EmailAttachment[]
}

export function isEmailContent(value : unknown) : value is EmailContent
  {
	 // Perform simple validation by checking if there is subject in object

	 return typeof value === 'object' && value !== null && 'subject' in value
  }