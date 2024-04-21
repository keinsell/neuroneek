// File responsible for handling whole JWT-Token related functionality in application
// This will include monitoring of JWT-Tokens, refreshing them and managing them for
// this like blacklisting and whitelisting which happen in the cache.

import {Injectable, Module} from "@nestjs/common"
import {SignJWT}            from "jose"
import {randomUUID}                from "node:crypto"
import {Opaque}             from "type-fest"
import {DomainEvent}        from "../../../common/libraries/domain/domain-event.js"
import {Event}              from "../../../common/libraries/message/event.js"
import {Message}            from "../../../common/libraries/message/message.js"
import {EventBusModule}     from "../../../common/modules/messaging/event-bus-module.js"
import {EventBus}           from "../../../common/modules/messaging/event-bus.js"
import {CacheManagerModule} from "../../../common/modules/storage/cache-manager/cache-manager-module.js"
import {__authConfig}       from "../../../configs/global/__config.js"
import {Identity}           from "./identity.js"

export interface TokenPayload {
	/**  The "iss" (issuer) claim identifies the principal that issued the
   JWT.  The processing of this claim is generally application specific.
   The "iss" value is a case-sensitive string containing a StringOrURI
   value.  Use of this claim is OPTIONAL.
	 @example "https://issuer.example.com"
	 */
	iss? : string;

	/** The "sub" (subject) claim identifies the principal that is the
   subject of the JWT.  The claims in a JWT are normally statements
   about the subject.  The subject value MUST either be scoped to be
   locally unique in the context of the issuer or be globally unique.
   The processing of this claim is generally application specific.  The
   "sub" value is a case-sensitive string containing a StringOrURI
   value.  Use of this claim is OPTIONAL. */
	sub? : string;

	/** The "aud" (audience) claim identifies the recipients that the JWT is. */
	aud : string;

	metadata? : {
		[key : string | "firstName" | "lastName" | "email" | "phoneNumber"] : string | undefined
	}

	/** The "exp" (expiration time) claim identifies the expiration time on
   or after which the JWT MUST NOT be accepted for processing.  The
   processing of the "exp" claim requires that the current date/time
   MUST be before the expiration date/time listed in the "exp" claim.
   Implementers MAY provide for some small leeway, usually no more than
   a few minutes, to domain for clock skew.  Its value MUST be a number
   containing a NumericDate value.  Use of this claim is OPTIONAL. */
	exp? : number;

	/** The "nbf" (not before) claim identifies the time before which the JWT
   MUST NOT be accepted for processing.  The processing of the "nbf"
   claim requires that the current date/time MUST be after or equal to
   the not-before date/time listed in the "nbf" claim.  Implementers MAY
   provide for some small leeway, usually no more than a few minutes, to
   domain for clock skew.  Its value MUST be a number containing a
   NumericDate value.  Use of this claim is OPTIONAL. */
	nbf? : number;

	/** The "iat" (issued at) claim identifies the time at which the JWT was
   issued.  This claim can be used to determine the age of the JWT.  Its
   value MUST be a number containing a NumericDate value.  Use of this
   claim is OPTIONAL. */
	iat? : number;

	/** The "jti" (JWT ID) claim provides a unique identifier for the JWT.
   The identifier value MUST be assigned in a manner that ensures that
   there is a negligible probability that the same value will be
   accidentally assigned to a different data object; if the application
   uses multiple issuers, collisions MUST be prevented among values
   produced by different issuers as well.  The "jti" claim can be used
   to prevent the JWT from being replayed.  The "jti" value is a case-
   sensitive string.  Use of this claim is OPTIONAL. */
	jti : string;
}

export type RefreshToken = Opaque<string>
export type AccessToken = Opaque<string>

export class TokenIssued
	extends Event<TokenPayload>
{}

export class TokenExpired
	extends Event<TokenPayload>
{}

export class TokenRevoked
	extends Event<TokenPayload>
{}

@Injectable()
export class JwtService {

	constructor(private eventBus: EventBus) {}

	async issueToken(identity: Identity): Promise<[AccessToken, RefreshToken]> {
		const key = new TextEncoder().encode(__authConfig.JWT_SECRET)

		const payload: TokenPayload = {
			jti: randomUUID(),
			sub: identity.id,
			aud: "access",
		}

		const refreshTokenConstructor = new SignJWT({...payload})
		refreshTokenConstructor.setExpirationTime("30d")
		refreshTokenConstructor.setProtectedHeader({
			b64: true,
			alg: 'HS256',
		})

		const refreshTokenIssuedEvent = new TokenIssued({body: payload})
		const signedRefreshToken = await refreshTokenConstructor.sign(key) as RefreshToken

		this.eventBus.publish(refreshTokenIssuedEvent)

		// Create the access token
		const accessTokenConstructor = new SignJWT({...payload})
		accessTokenConstructor.setExpirationTime("1h")
		accessTokenConstructor.setProtectedHeader({
			b64: true,
			alg: 'HS256',
		})

		const signedAccessToken = await accessTokenConstructor.sign(key) as AccessToken

		return [signedAccessToken, signedRefreshToken]
	}

	verifyAndExtract(token: string): TokenPayload {
		throw new Error("Not implemented")
	}

	refresh(token: RefreshToken): AccessToken {
		throw new Error("Not implemented")
	}

	blacklist(token: string): void {
		throw new Error("Not implemented")
	}

	isBlacklisted(token: string): boolean {
		throw new Error("Not implemented")
	}
}

@Module({
	imports: [CacheManagerModule, EventBusModule],
	providers: [JwtService],
	exports: [JwtService],
})
export class JwtModule {}