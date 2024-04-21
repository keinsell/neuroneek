// This configuration should be parsed from configuration file or dotenv configuration,
// Then there should be key required for encryption of clientIds and clientSecrets, however,
// encryption may be required only for secrets as leaving clientIds unencrypted and publicly available to
// everyone with access to a database is "good enough" security.
// There should be ENV discovery implemented which will spot variables in format OAUTH_CLIENT_{IDP}_{VARIABLE}
// and automatically parse them into objects,
// then validate them and notify the administrator of the application if things are fine or something gone wrong.



import {CombinedLogger} from '../logger/logger.js'



/** Interface dedicated for adding OAuth 2.0 clients to application be used in SSO for example */
export interface OAuthClientConfig
{
	/** @example "github"
	 * @link [GitHub Developer Apps](https://github.com/settings/applications/new)
	 */
	IdP?: string
	/** @example "f2c6*****************" */
	clientId: string,
	/** @example "f90**************************************" */
	clientSecret?: string,
	/** Some of OAuth providers do not support discovery endpoint ("authority" in configuration)
	 * (we're talking about you: GitHub) in this case to deal with such cases we need to turn off `discoverEndpoints`
	 * functionality and provide `userinfoEndpoint`, `tokenEndpoint` and `authorizationEndpoint` - things should be
	 * fine */
	discoverEndpoints: boolean,
	authority?: string,
	/** @example "https://api.github.com/user" */
	userinfoEndpoint?: string,
	/** @example "https://github.com/login/oauth/access_token" */
	tokenEndpoint?: string
	/** @example "https://github.com/login/oauth/authorize" */
	authorizationEndpoint?: string
	/** @example "api.github.com" */
	issuer?: string
	/** @example "openid email profile" */
	scope: string
	/** @example "http://localhost:1337/sso/github" */
	redirectUri: string
}



export function discoverSSOClients(): OAuthClientConfig[]
{
	const ENV    = process.env
	const clients: {
		[idp: string]: OAuthClientConfig
	}            = {}
	const logger = new CombinedLogger()

	for (const [key, value] of Object.entries(ENV))
	{
		// OAUTH_CLIENT_{IDP}_{VARIABLE}
		if (key.startsWith('OAUTH_CLIENT_') && typeof value === 'string')
		{
			// Get a IDP name
			const parts = key.split('_')
			const idp   = parts[2].toLowerCase()
			logger.debug(`Discovered configuration of "${idp}" OAuth 2.0 Client`)

			if (!(
				idp in clients
			))
			{
				clients[idp] = {
					IdP              : idp,
					discoverEndpoints: false,
					scope            : 'openid email profile',
					redirectUri      : `http://localhost:1337/sso/${idp}`,
				} as any
			}

			const config = clients[idp]

			// Parse additional fields
			const setting = parts.slice(3).join('_')

			if (setting === 'CLIENT_ID')
			{
				logger.debug(`${key}=${value}`)
				config.clientId = value
			}
			else if (setting === 'SECRET')
			{
				logger.debug(`${key}=${value}`)
				config.clientSecret = value
			}
			else if (setting === 'AUTHORITY')
			{
				logger.debug(`${key}=${value}`)
				config.authority = value
			}
			else if (setting === 'USERINFO_ENDPOINT')
			{
				logger.debug(`${key}=${value}`)
				config.userinfoEndpoint = value
			}
			else if (setting === 'TOKEN_ENDPOINT')
			{
				logger.debug(`${key}=${value}`)
				config.tokenEndpoint = value
			}
			else if (setting === 'AUTH_ENDPOINT')
			{
				logger.debug(`${key}=${value}`)
				config.authorizationEndpoint = value
			}
			else if (setting === 'ISSUER')
			{
				logger.debug(`${key}=${value}`)
				config.issuer = value
			}
		}
	}

	// Filter out invalid clients
	return Object.values(clients).filter(validateSSOClient)
}

function validateSSOClient(client: OAuthClientConfig): boolean
{
	const logger               = new CombinedLogger()
	let missingParts: string[] = []

	logger.debug(JSON.stringify(client))

	// Validate that the client is valid and return true
	return true
}
