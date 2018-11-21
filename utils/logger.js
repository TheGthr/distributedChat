const { createLogger, format, transports } = require("winston");

var logger = createLogger({
    transports: [
        new transports.File({
            level: 'info',
            filename: './logs/all.log',
            format: format.combine(
                format.timestamp({
                  format: "YYYY-MM-DD HH:mm:ss"
                }),
                /* format.json() */
                format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
              ),
            handleExceptions: true,
            maxsize: 80000000 , // 10MB
            maxFiles: 1,
        }),
        new transports.Console({
            level: 'debug',
            handleExceptions: true,
            format: format.combine(
                format.colorize(),
                format.timestamp({
                  format: "DD-MM-YYYY HH:mm:ss"
                }),
                /* format.json() */
                format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
              ),
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};