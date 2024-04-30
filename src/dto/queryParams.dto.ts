import { Transform } from "class-transformer";
import { IsInt, IsString, IsOptional, IsPositive, Max, Min } from "class-validator";
export class QueryParamsDto{

    @IsOptional()
    @Transform(({ value }) => { return Number(value) })
    @IsInt()
    @IsPositive()
    limit:Number;

    @IsOptional()
    @Transform(({ value }) => { return Number(value) })
    @IsInt()
    @IsPositive()
    offset:Number;

    @IsOptional()
    @IsString()
    name:String;

    @IsOptional()
    @IsString()
    country:String;

}

export class QueryDaysDto{
    @IsOptional()
    @Transform(({ value }) => { return Number(value) })
    @IsInt()
    @IsPositive()
    @Max(5)
    days:Number = 1;
}