import { IsEnum, IsOptional } from "class-validator";
import { ValidEspecialidad } from "../interfaces/valid-especialidades"; //!ARCHIVO BARRIL



export class EspecialidadDto {
  @IsOptional()
  @IsEnum( ValidEspecialidad )
  especialidad?: ValidEspecialidad;
}