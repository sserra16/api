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

    try {
      await auth.use('web').attempt(email, password)
    } catch (error) {
      if (error.responseText === 'E_INVALID_AUTH_PASSWORD: Password mis-match') {
        return response.status(500).send({ msg: 'Senha errada!' })
      }

      if (error.responseText === 'E_INVALID_AUTH_UID: User not found') {
        return response.status(500).send({ msg: 'Usuário não encontrado!' })
      }

      response.status(500).send({ error })
    }

    const user = await User.findByOrFail('email', email)

    return { msg: 'logado com sucesso', user: user }
  }

  public async googleLogin({ ally, auth, response }: HttpContextContract) {
    if (await auth.check()) {
      return response.notAcceptable()
    }

    const google = ally.use('google').stateless()

    if (google.accessDenied()) {
      return response.status(403).send('Access Denied')
    }

    if (google.hasError()) {
      return google.getError()
    }

    const { token } = await google.accessToken()
    const googleUser = await google.userFromToken(token)

    const user = await User.firstOrCreate(
      {
        email: googleUser.email!,
      },
      {
        username: googleUser.nickName,
      }
    )

    const oat = await auth.use('api').login(user, {
      expiresIn: '7days',
    })

    response.cookie('api_token', oat.token, {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    })

    response.ok(user)

    // response.redirect().toPath('http://localhost:5173/loginsuccess')
  }
}
