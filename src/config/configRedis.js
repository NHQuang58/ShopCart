const config = require('./config');
const logger = require('./logger');

const configRedis = {
  redisPort: config.redis.redisPort,
  redisHost: config.redis.redisHost,
};
/* istanbul ignore next */
if (config.env !== 'test') {
  logger.info('Redis configured');
}
module.exports = {
  configRedis,
};
