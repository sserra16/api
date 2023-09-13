import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Image from 'App/Models/Image'

export default class ImageController {
  public async get({ params, response }: HttpContextContract) {
    try {
      const image = await Image.findBy('user_id', params.id)

      if (!image) {
        return { msg: 'Avatar não encontrado!' }
      }

      const imagePath = Application.tmpPath('uploads')

      const fullImagePath = `${imagePath}/${image.file_name}`

      return response.download(fullImagePath)
    } catch (error) {
      console.error(error)
      return { msg: 'Erro ao buscar imagem' }
    }
  }

  public async save({ request }: HttpContextContract) {
    const image = request.file('imagem')
    const id = request.input('id')

    if (image && image.type) {
      await image.move(Application.tmpPath('uploads'))

      const avatar = new Image()
      avatar.file_name = image.clientName
      avatar.file_type = image.type
      avatar.file_size = image.size.toString()
      avatar.user_id = id

      await avatar.save()
    }

    return { msg: 'Imagem inserida!' }
  }
}
