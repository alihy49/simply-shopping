import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

const snakeCaseToTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
export class Exception {
  static BadRequest(message?: string) {
    return new BadRequestException(message);
  }

  static Unauthorized(message?: string) {
    return new UnauthorizedException(message);
  }

  static Forbidden(message?: string) {
    return new ForbiddenException(message);
  }

  static NotFound(message?: string) {
    return new NotFoundException(message);
  }

  static TooManyRequests(message?: string) {
    const errorString = snakeCaseToTitleCase(
      HttpStatus[HttpStatus.TOO_MANY_REQUESTS],
    );
    return new HttpException(
      {
        message,
        error: errorString,
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
