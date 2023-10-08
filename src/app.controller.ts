import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('')
export class AppController {
  constructor() {}

  @Get('status')
  @ApiOperation({ summary: 'Get the status of the service' })
  @ApiResponse({ status: 200, description: 'Ok' })
  // usually adding this endpoint to check if the service is alive.
  @Get('status')
  getStatus(): string {
    return 'OK';
  }
}
