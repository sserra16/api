import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async create({ request }: HttpContextContract) {
    const data = request.body()

    let user: User

    try {
      user = await User.create(data)
      return user
    } catch (err) {
      console.error(err)
      if (err.errno === 1062) {
        return { msg: 'email já cadastrado' }
      }

      return { msg: 'error' }
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
