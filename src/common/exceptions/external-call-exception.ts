import { BadGatewayException } from '@nestjs/common';

export class ExternalCallException extends BadGatewayException {
  constructor(message: string) {
    super(message);
  }
}
