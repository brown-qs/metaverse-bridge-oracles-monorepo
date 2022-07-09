import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';


@Catch()
export class StackTraceErrorFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        //log all stack traces of exceptions that are not HttpException, such as throw new Error("hello"), super() will convert them to InternalServerErrorException which is an HttpException, but at this point they are not yet
        //try/catch because we never ever want to throw here
        try {
            if (!(exception instanceof HttpException)) {
                if (exception instanceof Error) {
                    console.log(exception.stack)
                }
            }
        } catch (e) {
        }

        super.catch(exception, host);
    }
}