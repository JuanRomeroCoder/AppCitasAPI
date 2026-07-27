import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import { ValidRoles } from "../interfaces/valid-roles";
import { ValidEspecialidad } from "src/doctor/interfaces/valid-especialidades";



export class RegisterUsuarioDto {
    @IsEmail()
    @IsString()
    email!: string;


    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña tiene que tener una mayuscula, una minuscula y numero'
    })
    password!: string;

    @IsString()
    @MinLength(1)
    fullName!: string;

    @IsString()
    @MinLength(9)
    @MaxLength(15)
    @IsNotEmpty()
    dni!: string;

    //Campo Rol (DECLARAR SOLO ROLES QUE HAYA DENTRO DE UserRole) ADMIN SOLO DECLARA ROLES
    @IsEnum( ValidRoles, { message: 'role debe ser DOCTOR, PACIENTE o ADMIN' })
    @IsOptional()
    role?: ValidRoles;

    //  Específico si se declara el Rol DOCTOR
    @ValidateIf((dto) => dto.role === ValidRoles.DOCTOR) //El campo se vuelve obligatorio cuando se declara el Rol indicado 
    @IsNotEmpty({ message: 'especialidad es obligatoria para doctores' }) //Hacemos que el valor de la propiedad tenga "contenido" obligatorio
    @IsEnum( ValidEspecialidad, { message: `Por favor ingrese una especialidad permitida: PEDIATRIA, TRAUMATOLOGIA, FAMILIA, ONCOLOGIA` }) //Validacion de especialidad de doctores
    @IsString()
    especialidad?: ValidEspecialidad;

    @ValidateIf((dto) => dto.role === ValidRoles.DOCTOR)
    @IsNotEmpty({ message: 'horarioInicio es obligatorio para doctores' })
    @IsString()
    horarioInicio?: string; // formato "HH:mm"

    @ValidateIf((dto) => dto.role === ValidRoles.DOCTOR)
    @IsNotEmpty({ message: 'horarioFin es obligatorio para doctores' })
    @IsString()
    horarioFin?: string;

    // Específico si se declara el Rol Paciente o usuario quiere crear cuenta (NO TIENE OPCION DE ELEGIR ROL)
    @ValidateIf((dto) => dto.role === ValidRoles.PACIENTE || dto.role === undefined) 
    @IsNotEmpty({ message: 'telefono es obligatorio para pacientes' })
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsDateString()
    fechaNacimiento?: string; // opcional siempre, aplica solo a PATIENT

}
