/** Just an ID */
export interface Identity {
	id: string
	firstName?: string
	lastName?: string
	email?: string
	emailVerified?: boolean
	phoneNumber?: string
	phoneNumberVerified?: boolean
	username?: string
	createdAt?: Date
	updatedAt?: Date
}