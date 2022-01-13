const redis = require('redis');
const Redis = require('ioredis')
const { configRedis } = require('../config/configRedis');
const logger = require('../config/logger');
const url = require("url");

let redisClient;
if(process.env.NODE_ENV !== "production")
{
  redisClient = redis.createClient({ host: configRedis.redisPort, port: configRedis.redisHost });
  redisClient.connect().then(() => logger.info('Connect to Redis Local'))
}

if(process.env.NODE_ENV === "production") {
  logger.info('Connect to Redis To go')
  let rtg = url.parse(process.env.REDISTOGO_URL);
  let pass = rtg.auth.split(":")[1];
  redisClient = new Redis({
    host: rtg.hostname,
    port: rtg.port,
    password: pass,//'327b42f444a57620625a31f9eb4df4b7'
  });
}

redisClient.on('ready', function () {
  logger.info('Redis is ready');
});
redisClient.on('connect', function () {
  logger.info('redis client connected');
});

redisClient.on('error', function (error) {
  logger.error('redis err: ', error);
});

module.exports = redisClient;
