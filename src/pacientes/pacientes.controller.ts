import { Controller, Get, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { RoleProtected } from 'src/auth/decorators/role-protected.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

import { PacientesService } from './pacientes.service';

@Controller('pacientes')
@UseGuards( AuthGuard('jwt'), UserRoleGuard ) //implementacion de validacion de roles y tokens
export class PacientesController {

  constructor(
    private readonly pacientesService: PacientesService
  ){}

  //Obtener todos los pacientes
  @Get()
  @RoleProtected( ValidRoles.ADMIN )
  findAll() {
    return this.pacientesService.findAll();
    
  }

  //Obtener solo un paciente 
  @Get(':id')
  @RoleProtected( ValidRoles.ADMIN )
  findOne(@Param('id', ParseUUIDPipe) id: string ){
    return this.pacientesService.findOne( id );
  }

}
