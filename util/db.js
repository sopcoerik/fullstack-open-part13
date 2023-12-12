const Sequelize = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL)

const migrationConfig = {
  migrations: {
    glob: 'migrations/*.js'
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConfig)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map(mig => mig.name)
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('Connected to database!')
  } catch (error) {
    console.log('Error connecting to database! ', error)
  }

  return null
}

const revertMigrations = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConfig)
  await migrator.down()
}

module.exports = {
  connectToDatabase,
  sequelize,
  revertMigrations
}