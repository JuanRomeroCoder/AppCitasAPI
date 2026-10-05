import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterUsuarioDto, LoginUsuarioDto } from './dto/index';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsuariosService } from '../usuarios/usuarios.service';
import { ValidRoles } from './interfaces/valid-roles';

import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { ManejarError } from 'src/common/manejarError';



@Injectable()
export class AuthService {

  constructor(
    private  UsuariosService: UsuariosService, // modulo de UsuariosService para usar su logica

    private readonly jwtService: JwtService, //Servicio proporcionado por @nestjs/jwt y a su vez proporcionado por JwtModule

    private readonly dataSource: DataSource, //Servicio para el queryRunner

    private readonly manejarError: ManejarError

  ){}


  //Registrar un usuario
  async register( registerUsuarioDto: RegisterUsuarioDto ) {

    const queryRunner = this.dataSource.createQueryRunner(); //Declaramos uso de queryRunner
    await queryRunner.connect();
    await queryRunner.startTransaction();

    //Empezamos la transaccion con la BD
    try {
      
      //Destructuring al dto para trabajar con su contraseña
      const { password, ...userData } = registerUsuarioDto;

      const role = registerUsuarioDto.role ?? ValidRoles.PACIENTE //Declaramos que role es o el rol recibido en el dto (HECHO POR UN ADMIN) o PACIENTE por defecto

      //Hash de la contraseña
      const hashPasswd = bcrypt.hashSync( password, 10 );

      //Instanciar usuario con passwd hasheada
      const usuario = queryRunner.manager.create(Usuario, {
        ...userData,
        role: role,
        password: hashPasswd
      });
      await queryRunner.manager.save(usuario);


      //Guardar los datos del usuario segun el rol impacta en Doctor o Paciente
      if (role === ValidRoles.DOCTOR ) {

        const doctor = queryRunner.manager.create(Doctor, {
          ...registerUsuarioDto,
          usuario,
        });
        await queryRunner.manager.save( doctor );

      } else if (role === ValidRoles.PACIENTE || undefined) { //guarda los datos del DTO que tiene declarado el rol (Hecho por un admin) o sin rol declarado (REGISTRO)

        const paciente = queryRunner.manager.create(Paciente, {
          telefono: registerUsuarioDto.telefono,
          usuario,

        });
        await queryRunner.manager.save(paciente);

        //Si el rol declarado no es ni DOCTOR ni PACIENTE, entonces es ADMIN y se crea en la tabla usuarios
      }

      //Terminar transaccion
      await queryRunner.commitTransaction();

      //respuesta que devuelve la funcion 
      return { message: 'Usuario creado',
               userId: usuario.id,
               token: this.getJwtToken({ id: usuario.id })
       }; //Si todo sale bien, mostramos mensaje
      
    } catch (error) {

      await queryRunner.rollbackTransaction(); //Si sale mal NADA IMPACTA EN LA BD
      this.manejarError.manejarDBError( error )

    } finally {
      await queryRunner.release(); //desconectamos conexion con la pool de la BD
    }
  }


  //Inciar sesion
  async login ( loginUsuarioDto:  LoginUsuarioDto ){

    //Sacamos el passwd del que nos envian para compararlo con el passwd de la BD
    const { password } = loginUsuarioDto
  
    const login = await this.UsuariosService.findLoginId( loginUsuarioDto );


    if ( !login )
      throw new UnauthorizedException( 'credenciales no validos' )

    if ( !bcrypt.compareSync( password, login.password ) )
      throw new UnauthorizedException( 'credenciales no validos ( passwd )' )

    const { password:_ ,...dataUser } = login //Destructuramos y modificamos valor de contraseña para no mostrar contraseña

    //Retornamos usuario sin mostrar constraseña
    return {
      ...dataUser,
      role: login.role,
      token: this.getJwtToken({ id: login.id })  //Generamos el token añadiendo los datos que necesita el payload
    };
    
  }


  //Generar un jwt
  private getJwtToken( payload: JwtPayload ){

    const token = this.jwtService.sign( payload );
    return token;

  }

}
