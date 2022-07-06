import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch()
export class StackTraceErrorFilter implements ExceptionFilter {
    //logs stacktrace to console
    catch(error: Error, host: ArgumentsHost) {
        let response = host.switchToHttp().getResponse();
        let status = (error instanceof HttpException) ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            console.error(error.stack);
        }
    }
}