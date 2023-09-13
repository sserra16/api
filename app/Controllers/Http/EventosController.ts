import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Evento from 'App/Models/Evento'

export default class EventosController {
  public async index({}: HttpContextContract) {
    return await Evento.all()
  }

  public async create({ request }: HttpContextContract) {
    const data = request.body()

    const evento = await Evento.create({
      descricao: data.descricao,
      quantidade: data.quantidade,
      visibilidade: data.visibilidade,
    })

    return evento
  }

  public async store({ auth }: HttpContextContract) {
    const user = await auth.use('api').authenticate()

    return { user }
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.only(['id'])

    return Evento.findByOrFail('id', id)
  }

  public async update({ request }: HttpContextContract) {
    const data = request.body()

    const evento = await Evento.findByOrFail('id', data.id)

    evento.descricao = data.descricao
    evento.quantidade = data.quantidade
    evento.visibilidade = data.visibilidade

    try {
      await evento.save()

      return { msg: 'Evento atualizado' }
    } catch (e) {
      return { error: e }
    }
  }

  public async destroy({ request }: HttpContextContract) {
    const { id } = request.only(['id'])

    const evento = await Evento.findByOrFail('id', id)

    try {
      await evento.delete()

      return { msg: 'Evento atualizado' }
    } catch (e) {
      return { error: e }
    }
  }
}
