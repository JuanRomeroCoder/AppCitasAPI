import { IsDateString, IsEnum, IsOptional, IsUUID } from "class-validator";
import { EstadoCitas } from "../interfaces/estado-citas";


export class FiltrarCitasDto {
    @IsUUID()
    @IsOptional()
    doctorId?: string;

    @IsUUID()
    @IsOptional()
    pacienteId?: string;

    @IsDateString()
    @IsOptional()
    fecha?: string;

    @IsEnum( EstadoCitas )
    @IsOptional()
    estado?: EstadoCitas;
}