import express, { Request, Response, json, urlencoded } from 'express'
import { RegisterRoutes } from '../dist/routes'
import openapi from '../dist/swagger.json'
import swaggerUI from 'swagger-ui-express'
import { container } from './infrastructure/ioc/container.js'
import { UserRepository } from './modules/user/user.repository.js'

export const app = express()

app.use(
	urlencoded({
		extended: true
	})
)
app.use(json())

app.use('/docs', swaggerUI.serve, (_req: Request, res: Response) => {
	return res.send(swaggerUI.generateHTML(openapi))
})

const us = container.get(UserRepository)

console.log(await us.findUserById('adsadfsdf'))

RegisterRoutes(app)

export { app as HttpApplication }
