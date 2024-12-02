import {Account} from '../modules/account/entities/account'



declare module 'express'
{
	interface Request
	{
		account?: Account
		fingerprint?: string
	}
}
