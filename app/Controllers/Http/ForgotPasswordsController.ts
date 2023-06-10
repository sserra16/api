import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Token from 'App/Models/Token'
import User from 'App/Models/User'
import crypto from 'crypto'
import moment from 'moment'

export default class ForgotPasswordsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { email } = request.only(['email'])

    const user = await User.findBy('email', email)

    if (!user) {
      return response.status(500).send({ msg: 'Email não encontrado' })
    }

    // Gerar o token
    const token = crypto.randomBytes(10).toString('hex')

    Token.create({ name: 'ForgotPasswordToken', token, type: 'api' })

    const userMail = user.email.split('@')[0]

    const username = user.username

    await Mail.send((message) => {
      message
        .from('sserradev@gmail.com')
        .to(email)
        .subject('Recuperar a Senha')
        .htmlView('emails/forgot_password', { userMail, token, username })
    })

    return user
  }

  public async update({ params, response, request }: HttpContextContract) {
    const tokenProvided = params.token
    const emailRequesting = params.email

    const { newPassword, confirmPassword } = request.only(['newPassword', 'confirmPassword'])

    const user = await User.findByOrFail('email', emailRequesting + '@gmail.com')

    const token = await Token.findByOrFail('token', tokenProvided)

    if (!token) {
      return response.status(301).send({
        message: {
          error: 'Token velho ou já usado',
        },
      })
    }

    const tokenExpired = moment().subtract(2, 'days').isAfter(token.createdAt)

    if (tokenExpired) {
      return response.status(401).send({ message: { error: 'Token Expirado' } })
    }

    if (newPassword !== confirmPassword) {
      return response.send('Senhas diferentes')
    }

    user.password = await newPassword

    await user.save()

    return { msg: 'Senha alterada' }
  }
}
