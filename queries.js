const {pool} = require('./config')

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY alias ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = request.params.id

  pool.query('SELECT * FROM users WHERE alias = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { alias, address, balance } = request.body
  console.log("alias", alias)
  pool.query('INSERT INTO users (alias, address, balance) VALUES ($1, $2, $3) returning ID', [alias, address, balance], (error, result) => {
    if (error) {
      console.log(error)
      throw error
    }
    console.log('good', result.rows[0].id)
    response.status(201).json(result.rows[0].id)
  })
}

const updateUser = (request, response) => {
  const id = request.params.id
  const { address, balance } = request.body

  pool.query(
    'UPDATE users SET address = $1, balance = $2 WHERE alias = $3',
    [address, balance, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const earnReward = (request, response) => {
  const id = request.params.id
  const { amount, currencyCode } = request.body

  pool.query(
    'UPDATE users SET balance = balance + $1 WHERE alias = $2',
    [amount, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const redeemReward = (request, response) => {
  const id = request.params.id
  const { amount, currencyCode } = request.body

  pool.query(
    'UPDATE users SET balance = balance - $1 WHERE alias = $2',
    [amount, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = request.params.id

  pool.query('DELETE FROM users WHERE alias = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  earnReward,
  redeemReward
}