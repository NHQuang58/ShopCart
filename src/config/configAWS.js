const config = require('./config');
const logger = require('./logger');

const configAWS = {
  AWS_ACCESS_KEY_ID: config.aws.accessKey,
  AWS_SECRET_ACCESS_KEY: config.aws.secretKey,
  REGION: config.aws.region,
  BUCKET: config.aws.bucket,
};
/* istanbul ignore next */
if (config.env !== 'test') {
  logger.info('AWS configured');
}
module.exports = {
  configAWS,
};
