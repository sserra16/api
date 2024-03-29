import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const data = request.body()

    let user: User

    try {
      user = await User.create(data)
      return user
    } catch (err) {
      console.error(err)

      if (err.errno === 1062) {
        response.status(500).send({ msg: 'Email já cadastrado' })
      }

      if (err.errno === -4078) {
        response.status(500).send({ msg: 'Não conseguimos conectar ao banco de dados' })
      }

      return { msg: err }
    }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    let token

    try {
      token = await auth.use('api').attempt(email, password)
    } catch (error) {
      if (error.responseText === 'E_INVALID_AUTH_PASSWORD: Password mis-match') {
        return response.status(500).send({ msg: 'Senha errada!' })
      }

      if (error.responseText === 'E_INVALID_AUTH_UID: User not found') {
        return response.status(500).send({ msg: 'Usuário não encontrado!' })
      }

      response.status(500).send({ error })
    }

    return { msg: 'logado com sucesso', token, id: token.user.id }
  }

  public async loginGoogle({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const username = request.input('username')
    let token

    try {
      const usuarioExistente = await User.findBy('email', email)

      if (!usuarioExistente) {
        const user = await User.create({ email, password: '', username })
        token = await auth.use('api').generate(user)
      } else {
        token = await auth.use('api').generate(usuarioExistente)
      }
    } catch (err) {
      console.error(err)

      if (err.errno === -4078) {
        response.status(500).send({ msg: 'Não conseguimos conectar ao banco de dados' })
      }

      return { msg: err }
    }

    return { msg: 'logado com sucesso', token, id: token.user.id }
  }

  public async editUser({ request }: HttpContextContract) {
    const username = request.input('username')
    const id = request.input('id')

    const userExists = await User.findByOrFail('id', id)

    if (!userExists) {
      return { msg: 'Houve um erro ao editar o usuário' }
    }

    userExists.username = username

    await userExists.save()

    return { msg: 'Usuário editado' }
  }
}
