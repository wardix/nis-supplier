import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { basicAuth } from 'hono/basic-auth'
import foOperator from './fo-operator'

const port = process.env.PORT || 3000
const validUsers = JSON.parse(process.env.BASIC_USERS || '[]')

const app = new Hono()

app.use(logger())
app.use(
  '/fo-operator/*',
  basicAuth({
    verifyUser: (username, password, _c) => {
      return validUsers.includes(`${username}:${password}`)
    },
  }),
)

app.route('/fo-operator', foOperator)

export default {
  port: +port,
  fetch: app.fetch,
}
