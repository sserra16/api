import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Evento extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public descricao: string

  @column()
  public rua: string

  @column()
  public cidade: string

  @column()
  public estado: string

  @column()
  public cep: string

  @column()
  public pais: string

  @column()
  public visibilidade: boolean

  @column()
  public quantidade_maxima: number

  @column()
  public quantidade_atual: number

  @column()
  public id_categoria: number

  @column()
  public id_usuario: number
}
