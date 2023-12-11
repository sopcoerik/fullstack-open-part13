const usersRouter = require('express').Router()
const { User } = require('../models/index')

usersRouter.get('/', async (_request, response, next) => {
  try {
    const users = await User.findAll()
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  console.log("request body", request.body)
  try {
    const user = await User.create(request.body)
    response.json(user)
  } catch (error) {
    next(error)
  }
})

usersRouter.put('/:username', async (request, response, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: request.params.username
      }
    })
    user.username = request.body.username
    user.save()
    response.json(user)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete('/:id', async (request, response, next) => {
  try {
    await User.destroy({
      where: {
        id: request.params.id
      }
    })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter