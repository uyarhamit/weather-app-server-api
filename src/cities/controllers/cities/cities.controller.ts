import { Controller, Get, Param, ParseIntPipe, Query, ValidationPipe } from '@nestjs/common';
import { CitiesService } from 'src/cities/services/cities/cities.service';
import { QueryDaysDto, QueryParamsDto } from 'src/dto/queryParams.dto';

@Controller('cities')
export class CitiesController {
    constructor(private citiesService: CitiesService){}

    @Get()
    fetchCities(@Query(ValidationPipe) reqParam: QueryParamsDto){
        return this.citiesService.getAllCities(reqParam);
    }

    @Get(':id')
    fetchCity(@Param('id', ParseIntPipe) id: number, @Query(ValidationPipe) reqParam: QueryDaysDto){
        return this.citiesService.getCity(id, reqParam);
    }
}
