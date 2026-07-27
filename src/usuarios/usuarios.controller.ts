import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { RoleProtected } from 'src/auth/decorators/role-protected.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Usuario } from './entities/usuario.entity';




@Controller('usuarios')
//!DESACTIVADO PARA DEBUG
//@UseGuards( AuthGuard('jwt'), UserRoleGuard ) //Aplicamos la verificacion de token a todos los endpoints INDICAMOS JWT(minuscula) 

export class UsuariosController {
  
  constructor(
    private readonly usuariosService: UsuariosService
  ) {}


  //Obtener todos los usuarios 
  @Get()
  //@RoleProtected( ValidRoles.ADMIN ) //Usamos nuestro decorador personalizado e indicamos el rol que queremos que tenga acceso al endpoint //! DESACTIVADO PARA DEBUG
  findAll( @Query() paginationDto: PaginationDto, //Aplicamos paginacion 
          //@GetUser() user: Usuario, //Extraccion de user de la Request (NO USADO TODAVIA)
  ){
    return this.usuariosService.findAll( paginationDto )
  }



  //Obtener usuario por id
  @Get(':id')
  //@RoleProtected( ValidRoles.ADMIN ) //! DESACTIVADO PARA DEBUG
  findOne( @Param('id', ParseUUIDPipe) id : string ){
    return this.usuariosService.findOne( id );
  }


  //Modificar usuario 
  @Patch(':id')
  //@RoleProtected( ValidRoles.ADMIN ) //! DESACTIVADO PARA DEBUG
  patch( @Param('id', ParseUUIDPipe) id : string,
         @Body() updateUsuarioDto: UpdateUsuarioDto
  ){
    return this.usuariosService.patchUser( id, updateUsuarioDto );
  }
  

  //Eliminar usuario
  @Delete(':id')
  //@RoleProtected( ValidRoles.ADMIN ) //! DESACTIVADO PARA DEBUG
  remove( @Param('id', ParseUUIDPipe) id : string ){
    return this.usuariosService.remove( id );
  }


  
}

