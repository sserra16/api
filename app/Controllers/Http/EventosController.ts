import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Categoria from 'App/Models/Categoria'
import Evento from 'App/Models/Evento'
import User from 'App/Models/User'

export default class EventosController {
  public async index({}: HttpContextContract) {
    let retorno: any = []
    const eventos = await Evento.all()

    for (let i = 0; i < eventos.length; i++) {
      const categoria = await Categoria.findByOrFail('id', eventos[i].id_categoria)
      const usuario = await User.findByOrFail('id', eventos[i].id_usuario)

      retorno.push({
        ...eventos[i].$attributes,
        categoria: categoria.nome,
        usuario: usuario.username,
      })
    }

    return retorno
  }

  public async MeuEventos({ params }: HttpContextContract) {
    const eventos = await Evento.query().select('*').where('id_usuario', params.id)

    return eventos
  }

  public async BuscarEndereco({}: HttpContextContract) {
    const enderecos = await Evento.query().select('rua', 'cidade', 'estado', 'pais', 'cep')

    return enderecos
  }

  public async create({ request }: HttpContextContract) {
    const data = request.body()

    const evento = await Evento.create({
      descricao: data.descricao,
      quantidade_maxima: data.quantidade,
      visibilidade: data.visibilidade,
      id_categoria: data.id_categoria,
      id_usuario: data.id_usuario,
      cep: data.cep,
      cidade: data.cidade,
      estado: data.estado,
      pais: data.pais,
      rua: data.rua,
      quantidade_atual: data.quantidade_atual,
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
    evento.quantidade_maxima = data.quantidade
    evento.visibilidade = data.visibilidade
    evento.cep = data.cep
    evento.cidade = data.cidade
    evento.estado = data.estado
    evento.pais = data.pais
    evento.rua = data.rua
    evento.quantidade_atual = data.quantidade_atual
    evento.id_categoria = data.id_categoria

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

  public async participar({ request }: HttpContextContract) {
    const data = request.all()

    const evento = await Evento.findByOrFail('id', data.id)

    if (evento.quantidade_atual < evento.quantidade_maxima) {
      evento.quantidade_atual++
    }

    return await evento.save()
  }
}
