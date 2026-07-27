import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtStrategy } from './strategies/jwt.strategy';



@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,

    UsuariosModule,  //Importamos el modulo completo para tener acceso completo a el

    //Integrar Passport y declarar que estrategia usar por defecto
    PassportModule.register({ defaultStrategy: 'jwt' }),

    //Configuar modulo de JWT de forma async para que arranque correctamente
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService], //lo inyectamos para acceder a la variable de entorno de JWT_PASSWORD

      useFactory: ( configService: ConfigService ) => {
        //Configuracion de los tokens que se van a generar
        return {
          secret: configService.get('JWT_PASSWORD'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [ JwtStrategy, PassportModule, JwtModule ] //lo exportamos con la intencion de poder evaluar / revisar el token MANUALMENTE
})
export class AuthModule {}
