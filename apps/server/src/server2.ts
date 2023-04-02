import { App } from '@tinyhttp/app'
import { json } from 'milliparsec'
import { PrismaClient } from '@prisma/client'
import { createAccount } from './features/create-account/create-account.controller.js'
import { defineNewAuthChallenge } from './features/create-authorization-challenge/createAuthChallenge.js'
import { solveAuthChallenge } from './features/solve-authorization-challenge/solve-auth-challange.js'

const prisma = new PrismaClient()
const app = new App()

app.use(json())

// Get HEllo world
app.get('/', (req, res) => res.send('Hello World'))

app.post('/account', async (req, res) => {
	return await createAccount(req, res)
})

app.get('/challange/:username', async (req, res) => {
	return await defineNewAuthChallenge(req, res)
})

app.post('/challange', async (req, res) => {
	return await solveAuthChallenge(req, res)
})

app.listen(666, () => {
	console.log('Server listening on port 666')
})

export { app as HttpApplication }
