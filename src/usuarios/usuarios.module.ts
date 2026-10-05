import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';


@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [
    TypeOrmModule.forFeature([ Usuario ]), //Importamos la entidad 
  ],
  exports:[ UsuariosService ] // usuarios service para usar su logica en el modulo Auth
})
export class UsuariosModule {}
