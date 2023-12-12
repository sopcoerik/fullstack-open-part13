const usersRouter = require('express').Router()
const { Op } = require('sequelize')
const { User, Blog, ReadingList } = require('../models/index')

usersRouter.get('/', async (_request, response, next) => {
  try {
    const users = await User.findAll({
        include: [
          {
            model: Blog,
            attributes: {
              exclude: ['userId']
            }
          }
        ]
    })
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const where = {
      read: {
        [Op.in]: [true, false]
      }
    }

    if(request.query.read) {
      where.read = request.query.read
    }

    const user = await User.findByPk(request.params.id, {
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: {
            exclude: ['userId']
          },
          through: {
            attributes: ['id', 'read'],
            where
          },
        },
      ]
    })
    response.json(user)
  } catch(error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const user = await User.create(request.body)
    await user.addReadingList({}, { through: { read: false  } })
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