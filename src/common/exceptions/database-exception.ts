import { BadRequestException } from '@nestjs/common';

export class DatabaseException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
