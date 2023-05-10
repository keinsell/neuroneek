import { Command } from '../../../shared/core/cqrs/command/command'
import { CommandBinding } from '../../../shared/core/cqrs/command/command-binding'
import { CommandBus } from '../../../shared/core/cqrs/command/command-bus'
import { CreateAccount } from '../application/commands/create-account/create-account'
import { CreateAccountHandler } from '../application/commands/create-account/create-account-handler'

export class AccountCommandBus extends CommandBus {
	public bindings: CommandBinding[] = [
		{
			command: CreateAccount,
			handler: new CreateAccountHandler()
		}
	]

	public async send(command: Command): Promise<void> {
		const binding = this.bindings.find(b => b.command === command.constructor)
		if (binding) {
			await binding.handler.handle(command)
		} else {
			throw new Error(`No handler registered for command type: ${command.constructor.name}`)
		}
	}
}
