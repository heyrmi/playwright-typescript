import * as winston from 'winston';

// Console log configuration
const console = new winston.transports.Console();
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        console
    ]
});