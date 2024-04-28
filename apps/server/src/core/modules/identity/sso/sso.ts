// InitiateSingleSignOn
import {
	Body,
	Controller,
	Get,
	Logger,
	NotFoundException,
	Param,
	Post,
	Query,
	Req,
}                          from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiProperty,
}                          from '@nestjs/swagger'
import {FederatedIdentity} from 'db'
import * as http           from 'http'
import {nanoid}            from 'nanoid'
import {Issuer}            from 'openid-client'
import {OAuthClientStore}  from '../oauth.js'



interface GitHubOAuthUserInfo
{
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
	name: string;
	company: string;
	blog: string;
	location: string;
	email: string;
	hireable: boolean;
	bio: string;
	twitter_username: string;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
}


// IdP
// Do IdPs should be stored in database? They are kinda known from OAuthClient entity.
type IdentityProvider = 'google'


export class InitiateSingleSignOn
{
	@ApiProperty({
		             enum   : ['github'],
		             example: 'github',
	             }) provider: IdentityProvider
	@ApiProperty({
		             example: 'http://localhost:1337/sso/github',
	             }) redirectUrl?: string
}


export interface SingleSignOnInitiationResponse
{
	url: string
}


export interface CompleteSsoRequest
{
	token: string
}


export interface CompletedSingleSignOnResponse
{
	accessToken: string
	refreshToken: string
}


export interface SingleSignOnService
{
	initiate(payload: InitiateSingleSignOn): Promise<SingleSignOnInitiationResponse>

	complete(payload: CompleteSsoRequest): Promise<CompletedSingleSignOnResponse>
}


/**
 * SSO (Single Sign-On): Allow users to sign in with a single ID to access multiple related applications.
 */
@Controller('/sso')
export class SingleSignOnController
{
	private oauthClientStore = new OAuthClientStore()
	private logger: Logger   = new Logger()

	constructor()
	{
		this.oauthClientStore.onApplicationBootstrap()
	}

	@ApiBody({type: InitiateSingleSignOn}) @ApiParam({
		                                                 example: 'github',
		                                                 name   : 'idp', //		                                                 description:
	                                                                     // 'Parameter defined Identity Provider (IdP)
	                                                                     // to which you want to authenticate.',
	                                                 }) @ApiOperation({
		                                                                  operationId: 'initiate-sso',
	                                                                  }) @Post(':idp')
	async initiateSingleSignOn(@Param('idp') identityProvider: string, @Body() body: InitiateSingleSignOn): Promise<SingleSignOnInitiationResponse>
	{
		// Get OAuthClientService
		// Query requested identity provider
		// Throw or use oauth2 client

		this.logger.debug('Fetching OAuth 2.0 Client...')

		const oauthClientInformation = this.oauthClientStore.getClientByIdP(identityProvider as IdentityProvider)

		this.logger.debug('Got OAuth 2.0 Client', oauthClientInformation)

		let issuer: Issuer

		if (oauthClientInformation.discoverEndpoints)
		{
			issuer = await Issuer.discover(oauthClientInformation.authority!)
		}
		else
		{
			issuer = new Issuer({
				                    authorization_endpoint: oauthClientInformation.authorizationEndpoint!,
				                    userinfo_endpoint     : oauthClientInformation.userinfoEndpoint!,
				                    token_endpoint        : oauthClientInformation.tokenEndpoint!,
				                    issuer                : oauthClientInformation.issuer!,
			                    })
		}

		const redirectUrl = body?.redirectUrl ? body.redirectUrl : oauthClientInformation.redirectUri

		const client = new issuer.Client({
			                                 client_id    : oauthClientInformation.clientId,
			                                 client_secret: oauthClientInformation.clientSecret,
			                                 redirect_uris: [
				                                 oauthClientInformation.redirectUri,
			                                 ],
		                                 })

		const authorizationUrl = client.authorizationUrl({
			                                                 redirect_uri: redirectUrl,
			                                                 scope       : 'openid email profile',
		                                                 })

		return {
			url: authorizationUrl,
		}
	}

	@ApiOperation({
		              operationId: 'complete-sso',
	              }) @Get(':idp')
	async completeSingleSignOn(@Param('idp') identityProvider: IdentityProvider, @Body() body: CompleteSsoRequest, @Req() request: http.IncomingMessage, @Query('code') authenticationCode?: string): Promise<CompletedSingleSignOnResponse>
	{
		const oauthClientInformation = this.oauthClientStore.getClientByIdP(identityProvider)

		if (!oauthClientInformation)
		{
			throw new NotFoundException('OAuth client information not found.')
		}

		let issuer: Issuer

		if (oauthClientInformation.discoverEndpoints)
		{
			issuer = await Issuer.discover(oauthClientInformation.authority!)
		}
		else
		{
			issuer = new Issuer({
				                    authorization_endpoint: oauthClientInformation.authorizationEndpoint!,
				                    userinfo_endpoint     : oauthClientInformation.userinfoEndpoint!,
				                    token_endpoint        : oauthClientInformation.tokenEndpoint!,
				                    issuer                : oauthClientInformation.issuer!,
			                    })
		}

		const client = new issuer.Client({
			                                 client_id    : oauthClientInformation.clientId,
			                                 client_secret: oauthClientInformation.clientSecret,
			                                 redirect_uris: [
				                                 oauthClientInformation.redirectUri,
			                                 ],
		                                 })



		const callbackParams = client.callbackParams(request)
		// TODO: Unhandled promise rejection
		const tokenSet       = await client.oauthCallback(oauthClientInformation.redirectUri, callbackParams)

		console.log(tokenSet)

		// TODO: Unhandled promise rejection
		const user = await client.userinfo<GitHubOAuthUserInfo>(tokenSet)

		// In case there was no federated entity for such authentication, we assume two cases:
		// 1. User isn't registered at all, and we must create an account with FI
		// 2. User is registered but haven't used social authentication, yet.
		// Both cases will be handled gracefully.
		// The Second case has few edge cases which cannot sadly be resolved automatically ex.
		// mismatch of account email and email used for SSO, however, I believe this can be done
		// with additional parameter during SSO authentication.

		const idpAccountId = String(user.id)

		const federatedIdentity: FederatedIdentity = {
			id       : nanoid(128),
			accountId: '',
			expiresAt: new Date(),
			name     : user.name,
			createdAt: new Date(),
			updatedAt: new Date(),
			version  : 1,
			picture  : user.avatar_url,
			IdP      : identityProvider,
			sub      : String(user.id),
		}

		console.log(federatedIdentity)

		// After federated entity is created and an account exists for user,
		// we can proceed with generating authentication tokens authorized by our server.
		// By some cases server could also handle tokens from OAuth
		// but this is too much mess for our current implementation of authorization (not that there's no mess yet)

		console.log(user.picture)
		console.log(user.nickname)

		// Use OAuth2 Client to validate token provided by user
		// Validate if account exists, create if not
		// Generate mine own JWTs?
		return {
			accessToken : '',
			refreshToken: '',
		}
	}
}
