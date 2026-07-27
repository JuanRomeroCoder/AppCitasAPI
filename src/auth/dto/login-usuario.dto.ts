import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUsuarioDto {
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
}