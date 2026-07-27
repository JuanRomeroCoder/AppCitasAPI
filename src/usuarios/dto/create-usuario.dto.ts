import { RegisterUsuarioDto } from "src/auth/dto/register-usuario.dto";

export class CreateUsuarioDto extends RegisterUsuarioDto {
    // Aqui se puede añadir campos extras para el panel usuarios

    //EJEMPLOS:

    // @MinLength(9)
    // @IsString()
    // dni?: string

    // @IsString()
    // @MinLength(1)
    // calle?: string

}
