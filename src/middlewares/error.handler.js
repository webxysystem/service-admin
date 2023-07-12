import log4js from "log4js";

const configLog = { 
  "appenders": {
    "console": {
      "type": "console"
    },
    "file": {
      "backups": 3,
      "compress": true,
      "filename": "logs/app.log",
      "maxLogSize": 10485760,
      "type": "file"
    }
  },
  "categories": {
    "default": {
      "appenders": [
        "console",
        "file"
      ],
      "level": "info"
    }
  }
}

log4js.configure(configLog);
const log = log4js.getLogger();
log.level = 'info';

export const registerError = (error, req, res) => {
  const { originalUrl, method } = req;
  
  if (error.code && error.message) {
    
    const { code, message } = error;
    const messageError = buildMessageError(code, message, originalUrl, method);
    log.warn(messageError);
    res.status(error.code).json(error.message);

  } else {
    const messageError = buildMessageError(500, error, originalUrl, method);
    log.error(messageError);
    //TODO: send notification support
    res.status(500).json(error);
  }
  
}

const buildMessageError = (code, message, url, method) => {
  return `Codigo: ${code}, message: ${message}, url: ${url}, metodo: ${method}`
}
