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

/* Rotas de autenticação */
Route.post('/cadastro', 'AuthController.register')

Route.post('/insereimagem', 'ImageController.save')

Route.get('/getimage/:id', 'ImageController.get')

Route.post('/edituser', 'AuthController.editUser')

Route.post('/login', 'AuthController.login')

Route.post('/logingoogle', 'AuthController.loginGoogle')

Route.post('/forgotpassword', 'ForgotPasswordsController.store')

Route.post('/resetpassword/:token/:email', 'ForgotPasswordsController.update')

Route.get('/logout', async ({ auth }) => {
  await auth.use('web').logout()

  return { msg: 'Deslogado com sucesso!' }
})

/* Rotas Eventos */
Route.get('/authenticate', 'EventosController.store')

Route.get('/eventos', 'EventosController.index')

Route.post('/createevento', 'EventosController.create')

Route.post('/destroyevent', 'EventosController.destroy')

Route.post('/editevento', 'EventosController.update')
