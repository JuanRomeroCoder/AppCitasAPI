import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "class-validator";


export class CreateCitaDto {
    @IsDateString()
    @IsNotEmpty()
    fecha!: string; // formato: 'YYYY-MM-DD'

    @IsString()
    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {message: 'time debe tener formato HH:mm',})
    hora!: string;

    @IsUUID()
    @IsNotEmpty()
    doctorId!: string;
}
