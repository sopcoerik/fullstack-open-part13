const blogsRouter = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models/index')
const { tokenExtractor } = require('../util/middleware')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const where = {}

    if(request.query.search) {
      where[Op.or] = [
          {
            title: {
              [Op.iLike]: `%${request.query.search}%`
            }
          },
          {
            author: {
              [Op.iLike]: `%${request.query.search}%`
            }
          }
        ]
      }
    

    const blogs = await Blog.findAll({
      attributes: {
        exclude: ['userId']
      },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
      order: [
        ['likes', 'DESC']
      ]
    })

    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', tokenExtractor, async (request, response, next) => {
  try {
    const date = new Date().toString().substring(16, 34).replace(' GMT', '')
    const user = await User.findByPk(request.decodedToken.id)

    if(request.body.yearWritten < 1991 || request.body.yearWritten > 2022) {
      response.status(404).send({ error: 'we do not accept blogs older than 1991 or younger than the current year' })
    }

    const blog = await Blog.create({...request.body, userId: user.id, date})
    response.json(blog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findOne(request.params.id)
    blog.likes += 1
    blog.save()
    response.json(blog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', tokenExtractor,  async (request, response, next) => {
  try {
    const user = await User.findByPk(request.decodedToken.id, {
      include: {
        model: Blog,
        attributes: ['userId']
      }
    })

    if(user.blogs.some(blog => blog.userId === user.id)) {
      await Blog.destroy({
        where: {
          id: request.params.id
        }
      })
      response.status(204).end()
    } else {
      response.status(404).send({ error: 'Unauthorized token' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter