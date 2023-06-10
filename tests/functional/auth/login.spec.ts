import { test } from '@japa/runner'

test('it should be able login the user', async ({ client }) => {
  const email = 'serra2@gmail.com'
  const password = 'testesenha'

  const result = await client.post('/login').json({ email, password })

  console.log(result.text())

  result.assertStatus(200)
})
