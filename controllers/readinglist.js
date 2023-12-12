const readingListRouter = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

readingListRouter.post('/', tokenExtractor, async (request, response, next) => {
  try {
    if(!request.body.blogId) {
      response.status(404).send({ error: 'blogId required' })
    }

    const userId = request.decodedToken.id
    const blogId = request.body.blogId
    const readingList = await ReadingList.create({ userId, blogId })
    response.status(200).send(readingList)
  } catch(error) {
    next(error)
  }
})

readingListRouter.post('/:id', tokenExtractor, async (request, response, next) => {
  try {
    const readingList = await ReadingList.findByPk(request.params.id)
    readingList.read = request.body.read
    readingList.save()
    response.status(200).send(readingList)
  } catch(error) {
    next(error)
  }
})

module.exports = readingListRouter