import { ManejarError } from '../common/manejarError';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { LoginUsuarioDto } from '../auth/dto/login-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';


@Injectable()
export class UsuariosService {
  
  //Inyectamos el repositorio con el que vamos a guardar los datos
  constructor(
    @InjectRepository(Usuario) 
    private readonly usuariosRepository : Repository<Usuario>,

    private readonly manejarError : ManejarError
  ){}


  //Registrar/crear usuario
  async create( createUsuarioDto: CreateUsuarioDto ) {

    const usuario = this.usuariosRepository.create( createUsuarioDto );
    await this.usuariosRepository.save( usuario );
    return usuario;

  }


  //Logica para Login del módulo Auth 
  async findLoginId( loginUsuarioDto: LoginUsuarioDto ){

    //Sacamos email de el Dto para obtener el usuario en la BD
    const { email } = loginUsuarioDto

    const usuario = await this.usuariosRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, role: true } //! role:true para debug de comprobacion de roles QUITAR CUANDO SE SOLUCIONE 
    });
    
    return usuario
  }


  //Obtener todos los usuarios
  async findAll( paginationDto: PaginationDto) { 

    const { limit= 10, offset= 0 } = paginationDto;

    const usuarios = await this.usuariosRepository.find({
      take: limit,
      skip: offset
    });
    return usuarios;
  }


  //Obtener por ID
  async findOne( id: string ) {
    const usuario = await this.usuariosRepository.findOneBy({ id });
    if ( !usuario )
      throw new NotFoundException(`El usuario con el ID: ${ id } no ha sido encontrado`);

    return usuario;
  }


  //modificar usuario
  async patchUser( id: string, updateUsuarioDto: UpdateUsuarioDto ) {

    //Preparamos el usuario que vamos a actualizar
    const usuario = await this.usuariosRepository.preload({
      id: id,
      ...updateUsuarioDto //Datos que recibimos que vamos a modificar
    });

    if ( !usuario ) throw new NotFoundException(`El usuario con el ${id} no se ha encontrado`);

    //Probamos a guardar usuario, si hay problema manejamos error
    try {

      await this.usuariosRepository.save( usuario );
      return usuario;

    } catch (error) {
      this.manejarError.manejarDBError( error );
      
    }
    
  }


  //Eliminar usuario
  async remove( id: string ){
    const usuario = await this.findOne( id );  //usamos la logica de Obtener usuario por ID para no repetir codigo
    
    await this.usuariosRepository.remove( usuario );
    return `El usuario con el ID: ${usuario.id} ha sido eliminado correctamente`;
  }


}
