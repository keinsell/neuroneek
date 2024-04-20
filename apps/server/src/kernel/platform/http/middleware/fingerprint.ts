import {
	createParamDecorator,
	ExecutionContext,
	Injectable,
	NestMiddleware,
}                       from '@nestjs/common'
import {
	NextFunction,
	Request,
	Response,
}                       from 'express'
import murmurhash       from 'murmurhash3js'
import ua               from 'useragent'
import {ExpressRequest} from '../../../../types/express-response.js'
import {__logger}       from '../../../modules/logger/logger.js'



function getUserAgentFromRequest(req: Request): ua.Agent
{
	return ua.parse(req.headers['user-agent'])
}

/**
 * Generate a fingerprint for the given request and parameters.
 *
 * @param {Request} req - The request object.
 * @return {object} - An object containing the generated fingerprint.
 */
export function generateFingerprint(req: Request): string
{
	const logger = __logger('fingerprint')
	logger.debug('Called generateFingerprint')

	// Get the user agent from the request
	logger.debug('Getting user agent from request...')
	const ua = getUserAgentFromRequest(req)

	// Create a new fingerprint object
	const fingerprint: any = {
		headers  : {
			accept  : req.headers['accept'],
			language: req.headers['accept-language'],
			encoding: req.headers['accept-encoding'],
		},
		userAgent: {
			browser: {
				family : ua.family,
				version: ua.major,
			},
			device : {
				family : ua.device.family,
				version: ua.device.major,
			},
			os     : {
				family: ua.os.family,
				major : ua.os.major,
				minor : ua.os.minor,
			},
		},
		ipAddress: req.ip,
	}

	logger.debug(`Dug fingerprint metadata: ${JSON.stringify(fingerprint)}`)

	logger.debug('Generating hash for fingerprint...')
	const hash = murmurhash.x86.hash128(JSON.stringify(fingerprint))
	logger.debug(`Generated hash for fingerprint: ${hash}`)


	logger.debug('Adding fingerprint to request headers...')
	req.headers['x-fingerprint'] = hash
	req.fingerprint              = hash

	logger.debug(`Returning hash...`, {data: {hash}})
	// Generate a unique hash for the fingerprint
	return hash
}


/**
 * A middleware to generate a fingerprint for each request.
 */
@Injectable()
export class FingerprintMiddleware
	implements NestMiddleware
{
	use(req: ExpressRequest, _res: Response, next: NextFunction): void
	{
		// Generate a fingerprint for the request
		const fingerprint = generateFingerprint(req)

		// Add the fingerprint to the request object
		req.headers['x-fingerprint'] = fingerprint
		req.fingerprint              = fingerprint

		// Pass the request
		next()
	}
}


// Fingerprint decorator that will take the fingerprint from the request and attach it to parameter
// Ex. @Fingerprint() fingerprint: string

/**
 * Get fingerprint by request
 */
export const Fingerprint = createParamDecorator((_, ctx: ExecutionContext): string | undefined =>
                                                {
	                                                const request: Request = ctx
		                                                .switchToHttp()
		                                                .getRequest()
	                                                return request.fingerprint
                                                })
