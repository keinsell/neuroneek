/*
 * MIT License
 *
 * Copyright (c) 2024 Jakub Olan <keinsell@protonmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {
	ForbiddenException,
	NotFoundException,
}                                       from '@nestjs/common'
import {Result}                    from 'neverthrow'
import {AccessToken, RefreshToken} from "../../../kernel/modules/identity/jwt.js"


export abstract class AuthenticationService
	{
		/**
		 * Authenticates a user with their username and password.
		 *
		 * @param {string} username - The username of the user.
		 * @param {string} password - The password of the user.
		 * @param {Object} [metadata] - Additional metadata for the
		 *     authentication.
		 * @param {string} [metadata.userAgent] - The user agent of the client.
		 * @param {string} [metadata.ipAddress] - The IP address of the client.
		 * @returns {Promise<Result<{accountId: string, accessToken: string,
		 *     refreshToken: string}, any>>} - The result of the
		 *     authentication. If successful, it contains the domain ID, access
		 *     token, and refresh token. If unsuccessful, it contains the
		 *     error.
		 */
		public abstract authenticate(
			username: string,
			password: string,
		): Promise<Result<{
			accessToken: AccessToken,
			refreshToken: RefreshToken,
			accountId: string
		}, NotFoundException | ForbiddenException>>;

		public abstract logout(): Promise<void>;

		public abstract refreshToken(refreshToken: RefreshToken): Promise<{
			refreshToken: RefreshToken,
			accessToken: AccessToken
		}>;
	}