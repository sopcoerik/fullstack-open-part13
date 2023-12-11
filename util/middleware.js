const errorWare = (error, _request, response, next) => {
  if(error.errors[0].type === 'Validation error') {
    response.status(404).send({
      error: 'Invalid data provided',
      message: error.errors[0].message
    })
  }

  next(error)
}

module.exports = {
  errorWare
}