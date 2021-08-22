const config = {
    dev: 'development',
    test: 'testing',
    prod: 'production',
    port: 8080,
    
}

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

var envConfig;

try {
    envConfig = require('./' + config.env)
} catch (e) {
    envConfig = {}
}

module.exports = Object.assign(config, envConfig);