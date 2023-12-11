const { Blog } = require('../models')
const { sequelize } = require('../util/db')

const authorsRouter = require('express').Router()

authorsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      'likes',
      [sequelize.fn('COUNT', sequelize.col('title')), 'articles']
    ],
    group: 'author',
    order: [
      ['likes', 'DESC']
    ]
  })
  response.json(blogs)
})

module.exports = authorsRouter