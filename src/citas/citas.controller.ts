import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { RoleProtected } from 'src/auth/decorators/role-protected.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { CreateCitaDto, UpdateCitaDto, FiltrarCitasDto } from './dto/index';
import { CitasService } from './citas.service';

import { Usuario } from 'src/usuarios/entities/usuario.entity';


@Controller('citas')
@UseGuards( AuthGuard('jwt'), UserRoleGuard )
export class CitasController {

  constructor(
    private readonly citasService: CitasService
  ) {}

  //Crear una cita
  @Post()
  @RoleProtected( ValidRoles.PACIENTE)
  create( @Body() createCitaDto: CreateCitaDto,
          @GetUser() user: Usuario ) { //GetUser para extraer objeto user de cabecera
    return this.citasService.create(createCitaDto, user);
  }

  //Obtener citas
  @Get()
  @RoleProtected( ValidRoles.PACIENTE, ValidRoles.ADMIN, ValidRoles.DOCTOR )
  findAll( @Query() filtrarCitasDto: FiltrarCitasDto,
           @GetUser() user: Usuario ) {
    return this.citasService.findAll( filtrarCitasDto, user)          
  }
 
  //Modificar estado de las citas
  @Patch(':id') //ID de la cita
  @RoleProtected( ValidRoles.DOCTOR, ValidRoles.ADMIN )
  patch( @Param('id', ParseUUIDPipe) id: string,
         @Body() updatecitaDto : UpdateCitaDto ){
    return this.citasService.patchCitas( id, updatecitaDto )
  }

}
