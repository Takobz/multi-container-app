const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

//For listening to redis changes
const subscription = redisClient.duplicate();

//function to be used for calculating Fibonacci for given index
function fibonacci(index){
    if (index < 2) return 1;
    return fibonacci(index - 1) + fibonacci(index - 2);
}

//On new value in the redis cache
subscription.on('message', (channel, message) => {
    redisClient.hset('values', message, fibonacci(parseInt(message)));
});

//subscribe to insert events into our cache
subscription.subscribe('insert');
