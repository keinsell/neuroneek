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

import { OnEvent }         from '@nestjs/event-emitter'
import { ServiceAbstract } from '../../../common/libraries/services/service-abstract.js'
import type { User }       from '../entity/user.js'
import { UserCreated }     from '../event/user-created.js'



export class UserService
  extends ServiceAbstract<User>
  {
	 async create(user : any) : Promise<User>
		{
		  throw Error( 'Not implemented' )
		}

	 async getById(id : User['id']) : Promise<User>
		{
		  throw Error( 'Not implemented' )
		}

	 async update(user : User) : Promise<User>
		{
		  throw Error( 'Not implemented' )
		}

	 async delete(user : User) : Promise<User>
		{
		  throw Error( 'Not implemented' )
		}

	 @OnEvent( UserCreated.namespace ) onUserCreatedCreateStripeCustomer(event : UserCreated) : void
		{
		  // TODO: Create customer in Stripe.
		}
  }