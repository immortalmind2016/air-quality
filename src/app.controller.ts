import { Controller, Get } from '@nestjs/common';

@Controller("")
export class AppController {
  constructor() {}
  
  // usually adding this endpoint to check if the service is alive.
  @Get("status")
  getStatus(): string {
    return "OK";
  }
}
