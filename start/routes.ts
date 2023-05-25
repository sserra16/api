/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/cadastro', 'UsersController.create')

Route.post('/login', async (ctx) => {
  const email = ctx.request.input('email')
  const password = ctx.request.input('password')

  await ctx.auth.use('web').attempt(email, password)

  return { msg: 'logado com sucesso!' }
})

Route.get('/logout', async ({ auth }) => {
  await auth.use('web').logout()

  return { msg: 'Deslogado com sucesso!' }
})
