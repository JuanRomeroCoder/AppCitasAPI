import { PassportStrategy } from "@nestjs/passport";
import {  ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsuariosService } from '../../usuarios/usuarios.service';
import { Usuario } from "src/usuarios/entities/usuario.entity";


//Forma de expandir la validacion de JWT, una vez que el token sea valido, y no haya expirado se ejecuta esta funcion extra
@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        //Usamos la inyeccion del modulo para consultar la BD
        private readonly UsuariosService: UsuariosService,
        //Declaramos el ConfigService para llamar a la variable de entorno de nuestra contraseña JWT
        configService: ConfigService
    ){
        const secret = configService.get<string>('JWT_PASSWORD');
        if (!secret)
            throw new Error ('JWT_PASSWORD no está definido')
        //Pasamos los parametros necesarios para que funcione Passport
        super({
            secretOrKey: secret,
            //Le decimos que busque el token en la cabecera del JSON
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

   
    //Validar payload del usuario, ej; ver si ese usuario está baneado, etc || AQUI DISPONEMOS DE LA INFO DEL USUARIO
    async validate( payload: JwtPayload ): Promise<Usuario> {
        const { id } = payload;
        
        const usuario = await this.UsuariosService.findOne( id );

        if ( !usuario )
            throw new UnauthorizedException(`Token no valido`);

        if ( !usuario.isActive )
            throw new UnauthorizedException('El usuario no está activo, hable con el admin');

        return usuario;
    }

}