import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { allCityData } from 'src/data/allCityData';
import { cityDto, responseCity } from 'src/dto/city.dto';
import { QueryDaysDto, QueryParamsDto } from 'src/dto/queryParams.dto';

@Injectable()
export class CitiesService {
    constructor(private readonly httpService: HttpService) { }
    async getAllCities(params: QueryParamsDto) {
        let response = {
            data: [],
            limit: params.limit ? Number(params.limit) : 10,
            offset: params.offset ? Number(params.offset) : 0,
            count: 0,
            error: null
        };
        // return params;
        try {
            var foundCities = await allCityData.data.filter((city:cityDto) => {
                if (params.country && params.country !== '' && params.name && params.name !== '') {
                    return city.country.toLowerCase().includes(params.country.toString().toLowerCase()) && city.name.toLowerCase().includes(params.name.toString().toLowerCase());
                } else if (params.name && params.name !== '') {
                    return city.name.toLowerCase().includes(params.name.toString().toLowerCase())
                } else if (params.country && params.country !== '') {
                    return city.country.toLowerCase().includes(params.country.toString().toLowerCase())
                }
                return city;
            });

            response.count = foundCities.length;
            
            await foundCities.map((city:cityDto, index:number) => {
                if (response.offset === 0 || (response.offset > 0 && response.offset < (index + 1))) {
                    if (response.limit > response.data.length) {
                        let responseCity : responseCity = {
                            id: city.id,
                            name: city.name,
                            country: city.country
                        }
                        response.data.push(responseCity);
                    }
                }
            })

        } catch (error) {
            response.error = error;
        }
        return response;
    }

    async getCity(id: number, params: QueryDaysDto) {

        let response = {
            data: [],
            days: params.days ? Number(params.days) : 1,
            error: null
        };

        try {
            const city = await allCityData.data.find((city:cityDto) => {
                return city.id === id
            });

            if (typeof city === 'undefined') {
                response.error = "City not found";
            } else {

                let cityWeather = await this.httpService.get(process.env.WEATHER_APP_URL , {
                    params:{
                        lat : city.coord.lat,
                        lon : city.coord.lon,
                        appid: process.env.API_KEY
                    }
                }).pipe(
                    map((response) => {
                        return response?.data
                    })
                ).toPromise();
                
                const today = new Date().getTime();
                let foundWeather = {};
                cityWeather.list.filter((weather) => {

                    let wearherDate = new Date(weather.dt_txt);
                    let time = wearherDate.getTime() - today;
                    const diffDays = Math.ceil(time / (1000 * 60 * 60 * 24));

                    if(diffDays < response.days){

                        let obj = {
                            date: wearherDate.toISOString().split('T')[0],
                            min: Math.round(weather.main.temp_min - 273.15),
                            max: Math.round(weather.main.temp_max - 273.15),
                            condition: weather.weather[0].main
                        };

                        if(typeof foundWeather[obj.date] !== 'undefined' ){
                            if(foundWeather[obj.date].min > obj.min){
                                foundWeather[obj.date].min = obj.min;
                            }
                            if(foundWeather[obj.date].max < obj.max){
                                foundWeather[obj.date].max = obj.max;
                            }
                        }else{
                            foundWeather[obj.date] = obj;
                        }
                    }
                })
                response.data = Object.values(foundWeather);
            }
        } catch (error) {
            response.error = error.message;
        }

        return response;
    }
}