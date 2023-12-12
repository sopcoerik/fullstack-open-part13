const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { errorWare } = require('./util/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/readinglist')

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglist', readingListRouter)

app.use(errorWare)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log('Application online on port ', PORT)
  })
}

start()