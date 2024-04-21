import {
	$Enums,
	Account as PrismaAccount,
	PaymentMethod as PrismaPaymentMethod,
	Prisma,
	Session as PrismaSession,
	TokenAudit as _TokenAudit,
} from 'db'



/** DbContextModel is a namespace that contains all the models from database that can be used in the
 *  application, to not be confused with domain models - these models are only
 * responsible for providing type-safe interaction with database inputs and
 * reads. */
export namespace DbContextModel
{
	export namespace Enums
	{
		export type PaymentProcessor = $Enums.PaymentProcessor
	}

	export namespace Account
	{
		export type Entity = PrismaAccount;
		export type CreatePayload = Prisma.AccountCreateInput;
		export type UpdatePayload = Prisma.AccountUpdateInput;
		export type WhereUnique = Prisma.AccountWhereUniqueInput;
		export type Where = Prisma.AccountWhereInput;
	}

	export namespace Session
	{
		export type Entity = PrismaSession;
		export type CreatePayload = Prisma.SessionCreateInput;
		export type UpdatePayload = Prisma.SessionUpdateInput;
		export type WhereUnique = Prisma.SessionWhereUniqueInput;
		export type Where = Prisma.SessionWhereInput;
	}

	export namespace TokenAudit
	{
		export type Entity = _TokenAudit
		export type CreatePayload = Prisma.TokenAuditCreateInput;
		export type UpdatePayload = Prisma.TokenAuditUpdateInput;
		export type WhereUnique = Prisma.TokenAuditWhereUniqueInput;
		export type Where = Prisma.TokenAuditWhereInput;
	}


	export namespace PaymentMethod
	{
		export type Entity = PrismaPaymentMethod
		export type CreatePayload = Prisma.PaymentMethodCreateInput
		export type UpdatePayload = Prisma.PaymentMethodUpdateInput;
		export type WhereUnique = Prisma.PaymentMethodWhereUniqueInput;
		export type Where = Prisma.PaymentMethodWhereInput;
	}
}
