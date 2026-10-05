import { PartialType } from '@nestjs/mapped-types';
import { CreateCitaDto } from './create-cita.dto';
import { IsAlpha, IsEnum } from 'class-validator';
import { EstadoCitas } from '../interfaces/estado-citas';

//SOLO actualiza el ESTADO DE LA CITA
export class UpdateCitaDto {
    @IsEnum( EstadoCitas )
    estado?: EstadoCitas
}
