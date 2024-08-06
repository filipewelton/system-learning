import { env } from '__configs/environment'
import { database } from '__providers/database'
import { app } from '__web/http/app'

async function bootstrap() {
  await database.migrate
    .latest()
    .then(() => console.log('The migration was performed'))
    .catch(console.error)

  await app
    .listen({
      host: env.HTTP_SERVER_HOST,
      port: env.HTTP_SERVER_PORT,
    })
    .then(() => console.log('Server is running'))
    .catch(console.error)
}

bootstrap()
