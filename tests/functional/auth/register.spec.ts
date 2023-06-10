import { test } from '@japa/runner'

test('it should be able register a user', async ({ client }) => {
  const username = 'serra2'
  const email = 'serra2@gmail.com'
  const password = 'testesenha'

  const response = await client.post('/cadastro').json({ username, email, password })

  response.assertStatus(200)
})
