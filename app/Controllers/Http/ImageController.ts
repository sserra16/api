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

  public async saveOrUpdate({ request }: HttpContextContract) {
    let message = 'Imagem inserida!'

    const image = request.file('imagem')
    const id = request.input('id')

    if (image && image.type) {
      await image.move(Application.tmpPath('uploads'))

      const imageExistente = await Image.findBy('user_id', id)

      if (!imageExistente) {
        const avatar = new Image()
        avatar.file_name = image.clientName
        avatar.file_type = image.type
        avatar.file_size = image.size.toString()
        avatar.user_id = id

        await avatar.save()
      } else {
        imageExistente.file_name = image.clientName
        imageExistente.file_type = image.type
        imageExistente.file_size = image.size.toString()
        imageExistente.user_id = id

        await imageExistente.save()
        message = 'Imagem Editada'
      }
    }

    return { msg: message }
  }
}
