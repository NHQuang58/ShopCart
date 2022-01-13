const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('./logger');
let sequelize;

if (process.env.NODE_ENV === "production") {
  logger.info('NODE_ENV = production');
  // logger.info('DATABASE_URL: ' + process.env.DATABASE_URL);
  sequelize = new Sequelize(config.poolPostGre.database, config.poolPostGre.user, config.poolPostGre.password, {
    host: config.poolPostGre.host,
    dialect: 'postgres',
    port: config.poolPostGre.port,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

}
else {
  logger.info('NODE_ENV = dev');
  sequelize = new Sequelize(config.sql.url);
}


module.exports = sequelize;
