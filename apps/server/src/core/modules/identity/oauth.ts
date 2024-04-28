import {
	NotFoundException,
	OnApplicationBootstrap,
}                from '@nestjs/common'
import * as http from 'http'
import {
	discoverSSOClients,
	OAuthClientConfig,
}                from '../configuration/oauth-config.js'



export interface Account
{
	id: string
	password: string
	username: string
}


// OAuth was created to remove the need for users to share their passwords with third-party applications. It actually
// started as a way to solve an OpenID problem: if you support OpenID on your site, you can't use HTTP Basic
// credentials (username and password) to provide an API because the users don't have a password on your site.


// The main design consideration was to store or not store OAuth 2.0 Clients in database,
// eventually come up to conclusion
// where they should be stored in a database
// as this do not require
// exposing thousands of endpoints for the same fucking thing
// as it's commonly presented by all of these india suckers - people will complain it's not secure to store such
// information in database - ofc it's not, but it can be made secure by asynchronous encryption or secret store, so it's
// not really that big deal.
// FFs, I just wanted to see one "correct" by book implementation,
// but I guess this code can be now called "IAM Solution" by Today's standards.
export interface OAuthClient
{
	id: string
	name: 'google'
	authority: string
	clientId: string
	clientSecret: string
	redirectUri: string
	scope: string
}


export interface OauthToken
{
	id: string
	type: 'Bearer'
	accessToken: string
	refreshToken: string
	accountId: string
}


// OpenID was created for federated authentication, that is, letting a third party authenticate your users for you, by
// using accounts they already have. The term federated is critical here because the whole point of OpenID is that any
// provider can be used (except allowlists). You don't need to pre-choose or negotiate a deal with the
// providers to allow users to use any other account they have.

export interface OIDC
{
	id: string
}


/**
 * The name of the external identity provider that manages the user's identity. This should be a string value, such as
 * "google", "facebook", or "github".
 */
type IdentityProvider =
	'google'
	| 'github'


export interface FederatedIdentity
{
	id: string
	// Internal Account ID
	accountId: string
	provider: IdentityProvider
	/** The unique identifier for the user's identity within the external identity provider.
	 * This should be a string value that is provided by the IdP.
	 */
	provider_id: string
	email: string
	name: string
	/** The URL of the user's profile picture, as provided by the external identity provider.
	 * This should be a string value.
	 *
	 */
	picture?: string
	accessToken: string
	refreshToken: string
	expiresAt: Date
	createdAt: Date
	updatedAt: Date
}


export interface IOAuthClientStore
	extends OnApplicationBootstrap
{
	getClientByIdP(idp: IdentityProvider): OAuthClientConfig

	deleteClientById(id: string): void

	storeClient(client: OAuthClientConfig): OAuthClientConfig

	// OAuthClientStore should read OAuthClients from provided configuration on application start,
	// these configurations will be unencrypted, so they need to be encrypted before saving them to some perishable
	// place.
	// At some point, they do not need to be stored in a database at all,
	// just to be provided to application by abstraction presented above.
}


export class OAuthClientStore
	implements IOAuthClientStore
{
	private clients: OAuthClientConfig[] = []

	public deleteClientById(id: string): void
	{
		return
	}

	public getClientByIdP(idp: IdentityProvider): OAuthClientConfig
	{
		const maybeClient = this.clients.find((x) => x?.IdP === idp)

		if (!maybeClient)
		{
			throw new NotFoundException('OAuth Client not found')
		}

		return maybeClient
	}

	public storeClient(client: OAuthClientConfig): OAuthClientConfig
	{
		const isExisting = this.clients.filter((x) => x.IdP === client.IdP)

		if (isExisting.length === 1)
		{
			// Edit client
			throw new Error('Client already exists')
		}

		this.clients.push(client)

		return client
	}

	public onApplicationBootstrap(): any
	{
		const clients = discoverSSOClients()
		clients.forEach(client => this.storeClient(client))
	}

}


export interface OAuthService
{
	client: OAuthClient

	initiateAuthenticationFlow(scope?: string, state?: string): URL

	completeAuthenticationFlow(authorizationCode: string, redirectUri: URL): OauthToken

	handleOAuthCallback(request: http.IncomingMessage): Promise<any>

	getUserInfo<T = unknown>(tokenSet: any): Promise<T>
}


//export class OAuthClientManagementService
//	implements OAuthClientService
//{
//	private clientStore: OAuthClient[] = []
//
//	public async deleteClientById(id: string): Promise<OAuthClient>
//	{
//		return undefined
//	}
//
//	public async getClientById(id: string): Promise<OAuthClient>
//	{
//		const clientData: OAuthClient = {} as any
//
//		const issuer = await Issuer.discover(clientData.authority)
//		const client = new issuer.Client({
//			                                 client_id    : clientData.clientId,
//			                                 client_secret: clientData.clientSecret,
//			                                 redirect_uris: [clientData.redirectUri],
//		                                 })
//	}
//
//	public getClientByIdP(idp: IdentityProvider): OAuthClient
//	{
//		return undefined
//	}
//
//	public storeClient(client: OAuthClient): OAuthClient
//	{
//		return undefined
//	}
//
//}
