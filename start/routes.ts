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

Route.post('/cadastro', 'AuthController.register')

Route.post('/login', 'AuthController.login')

Route.post('/forgotpassword', 'ForgotPasswordsController.store')

Route.post('/resetpassword/:token/:email', 'ForgotPasswordsController.update')

Route.get('/logout', async ({ auth }) => {
  await auth.use('web').logout()

  return { msg: 'Deslogado com sucesso!' }
})

Route.get('/google/redirect', async ({ ally }) => {
  return await ally.use('google').redirect()
})

Route.get('/google/callback', 'AuthController.googleLogin')

Route.get('/facebook/redirect', async ({ ally }) => {
  return ally.use('facebook')
})
