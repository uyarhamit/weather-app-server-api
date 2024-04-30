import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitiesModule } from './cities/cities.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CitiesModule,
    ConfigModule.forRoot({
      envFilePath: '.env'
    }), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
