import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AirInformationService } from './air-information/air-information-service';

@Controller("")
export class AppController {
  constructor(private readonly airInformationService:AirInformationService) {}
  
  // usually adding this endpoint to check if the service is alive.
  @Get("status")
  getStatus(): string {
    return "OK";
  }
}
