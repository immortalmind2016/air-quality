import { BadGatewayException, HttpException, HttpStatus } from '@nestjs/common';

export class ExternalCallException extends BadGatewayException {
    constructor(message:string) {
        super(message);
  }
}