import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'eventos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.text('descricao')
      table.text('rua')
      table.text('cidade')
      table.text('estado')
      table.text('cep')
      table.text('pais')
      table.boolean('visibilidade')
      table.integer('quantidade_maxima')
      table.integer('quantidade_atual')
      table.integer('id_categoria').unsigned()
      table.integer('id_usuario').unsigned().references('users.id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
