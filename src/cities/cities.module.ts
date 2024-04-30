import { Module } from '@nestjs/common';
import { CitiesController } from './controllers/cities/cities.controller';
import { CitiesService } from './services/cities/cities.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CitiesController],
  providers: [CitiesService]
})
export class CitiesModule {}
