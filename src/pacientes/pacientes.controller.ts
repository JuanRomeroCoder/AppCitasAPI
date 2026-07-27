import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { RoleProtected } from 'src/auth/decorators/role-protected.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Controller('pacientes')
//@UseGuards( AuthGuard('jwt'), UserRoleGuard ) //implementacion de validacion de roles y tokens //!DESACTIVADO PARA TESTING
export class PacientesController {
  constructor(
    private readonly pacientesService: PacientesService
  ){}

  //Obtener todos los pacientes
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  //Obtener solo un paciente 
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string ){
    return this.pacientesService.findOne( id );
  }


  //!DEBUG PARA METODO FINBY ID USER
  // @Get( ':id' )
  // findByUserId( @Param ('id') id:string) {
  //   return this.pacientesService.findByUserId( id )
  // }

}
