import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('use');

    const correlationId = uuidv4();
    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);

    this.logger.log(`${req.method} ${req.originalUrl}`, {
      headers: req.headers,
    });

    this.logger.log('Request Body', JSON.stringify(req.body));

    const start = Date.now();
    const logger = this.logger;
    const originalJson = res.json;

    res.json = function (body) {
      logger.log('Response Body', JSON.stringify(body));
      return originalJson.call(this, body);
    };

    res.on('finish', () => {
      const duration = Date.now() - start + ' ms';
      if (res.statusCode >= 400) {
        this.logger.error(
          `${res.statusCode} ${res.statusMessage}`,
          JSON.stringify({ duration }),
        );
      } else {
        this.logger.log(
          `${res.statusCode} ${res.statusMessage}`,
          JSON.stringify({ duration }),
        );
      }
    });

    next();
  }
}
