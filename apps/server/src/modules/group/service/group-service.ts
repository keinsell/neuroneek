/*
 * MIT License
 *
 * Copyright (c) 2023 Jakub Olan <keinsell@protonmail.com>
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

import {GroupMember}       from "../value-object/group-member.js";
import {Group}             from "../entities/group.js";
import {GroupRepository}   from "../repository/group-repository.js";
import {Injectable}        from "@nestjs/common";
import {ServiceAbstract}   from "../../../common/libraries/services/service-abstract.js";
import {AccountRegistered} from "../../account/events/account-registered.js";
import {OnEvent}           from "@nestjs/event-emitter";



@Injectable()
export class GroupService
	extends ServiceAbstract<Group> {
	constructor(
		private groupRepository : GroupRepository,
	)
	{
		super(groupRepository)
	}

	async addGroupMember(member : GroupMember, group : Group) : Promise<Group> {
		throw new Error("Not implemented");
	}

	removeGroupMember(member : GroupMember, group : Group) {
		throw new Error("Not implemented");
	}

	createGroup(group : any) {
		throw new Error("Not implemented");
	}

	updateGroup(group : any) {
		throw new Error("Not implemented");
	}

	deleteGroup(group : any) {
		throw new Error("Not implemented");
	}

	@OnEvent("account.registered")
	private onAccountRegistred(accountRegistred : AccountRegistered) {
		// Add Account to "users" group
	}
}