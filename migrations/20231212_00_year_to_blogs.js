const { DataTypes, Op } = require('sequelize')
module.exports = {
  up: async ({ context: queryInterface }) => {
    queryInterface.addColumn('blogs', 'year_written', {
      type: DataTypes.INTEGER
    })
  }
}