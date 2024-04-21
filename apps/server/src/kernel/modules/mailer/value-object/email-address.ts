import {
	BadRequestException,
	Logger,
}                          from '@nestjs/common'
import {SpanStatusCode}    from '@opentelemetry/api'
import {startInactiveSpan} from '@sentry/opentelemetry'
import {
	err,
	ok,
	Result,
}                          from 'neverthrow'
import {
	Opaque,
	UnwrapOpaque,
}                          from 'type-fest'
import typia, {
	createAssert,
	createIs,
}                          from 'typia'



export type EmailAddress = Opaque<string & typia.tags.Format<'email'>, 'email'>

const assertEmailAddress      = createAssert<UnwrapOpaque<EmailAddress>>()
const isEmailAddressValidator = createIs<UnwrapOpaque<EmailAddress>>()


export class InvalidEmailAddressError
	extends BadRequestException
{
	constructor()
	{
		super('Invalid email address')
	}
}


export function isEmailAddress(value: unknown): value is EmailAddress
{
	return isEmailAddressValidator(value)
}


export function createEmailAddress(value: string): Result<EmailAddress, Error>
{
	const span = startInactiveSpan({
		                               name: 'create-email-address',
		                               op  : 'function',
	                               })

	Logger.debug('Validating email address...', {value: value})

	try
	{
		const emailAddress = assertEmailAddress(value) as EmailAddress
		span.end()
		return ok(emailAddress)
	}
	catch (e)
	{
		span.setStatus({
			               code   : SpanStatusCode.ERROR,
			               message: e.message,
		               })
		span.recordException(e)
		span.end()
		return err(new InvalidEmailAddressError())
	}

}
