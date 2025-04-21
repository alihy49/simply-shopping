import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class Exception {
  static BadRequest(message = 'Bad request') {
    return new BadRequestException(message);
  }

  static Unauthorized(message = 'Unauthorized') {
    return new UnauthorizedException(message);
  }

  static Forbidden(message = 'Forbidden') {
    return new ForbiddenException(message);
  }

  static NotFound(message = 'Not found') {
    return new NotFoundException(message);
  }

  static TooManyRequests(message = 'Too many requests') {
    return new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
