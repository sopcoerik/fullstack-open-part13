const blogsRouter = require('express').Router()
const { Blog } = require('../models/index')

blogsRouter.get('/', async (_request, response, next) => {
  try {
    const blogs = await Blog.findAll()
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const blog = await Blog.create(request.body)
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

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.destroy({
      where: {
        id: request.params.id
      }
    })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter