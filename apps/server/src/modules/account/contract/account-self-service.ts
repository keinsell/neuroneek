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

import type {RegisterAccountCommand} from '../commands/register-account/register-account-command.js'
import {Account}                     from '../entities/account.js'



export interface AccountSelfService
	{
		/** # register-account
		 *
		 * Register account is an operation dedicated to creating new accounts
		 * in codebase.
		 *
		 * - Will end up in an unverified account (account that his not recoverable as until account provided in
		 * registration will be confirmed), but an overall account can be used as well as verified account.
		 *
		 * @param {RegisterAccountCommand} registerAccount
		 * @returns {Promise<Account>}
		 */
		register(registerAccount: RegisterAccountCommand): Promise<Account>;

		closeAccount(accountId: string): Promise<void>;

		updateAccount(
			accountId: string,
			updateAccount: RegisterAccountCommand,
		): Promise<Account>;
	}
