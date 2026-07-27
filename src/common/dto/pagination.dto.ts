import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

//poner limite en los resultados de las respuesta del endpoint
export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @Type( () => Number ) //Igual que añadir enableImplicitConversions: true 
    limit?: number;

    @IsOptional()
    @Type( () => Number ) //Igual que añadir enableImplicitConversions: true 
    offset?: number;
}