const redis = require('redis');

const config = process.env;

const redisOpts = {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    auth_pass: config.REDIS_PASS,
    password: config.REDIS_PASS,
};

const redisClient = redis.createClient(redisOpts);
redisClient.on('error', function(err) {
     console.log('Redis error: ' + err);
})
redisClient.on("connect", () => {
   console.log('connected to redis')
  })

module.exports = redisClient;