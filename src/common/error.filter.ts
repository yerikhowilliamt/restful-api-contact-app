/* eslint-disable prettier/prettier */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: ZodError | HttpException | any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseBody = exception.getResponse();
      response.status(status).json({
        errors: responseBody,
      });
    } else if (exception instanceof ZodError) {
      const errors = exception.errors.map((err) => ({
        message: err.message,
        path: err.path.join('.'),
      }));

      response.status(400).json({
        errors,
      });
    } else {
      response.status(500).json({
        errors: exception.message,
      });
    }
  }
}
