import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { RoleProtected } from 'src/auth/decorators/role-protected.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

import { DoctorService } from './doctor.service';
import { EspecialidadDto } from './dto/filtros-doctor';

@Controller('doctor')
@UseGuards( AuthGuard('jwt'), UserRoleGuard )
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService) {}

 //Obtener todos los doctores, filtra si viene especificando especialidad en Dto
  @Get()
  @RoleProtected( ValidRoles.PACIENTE, ValidRoles.ADMIN )
  findAll( @Query() especialidadDto: EspecialidadDto ) {
    return this.doctorService.findAll( especialidadDto ); 
  }

  //Obtener solo un doctor (para fines administrativos)
  @Get(':id')
  @RoleProtected( ValidRoles.ADMIN )
  findOne( @Param('id', ParseUUIDPipe) id: string ){
    return this.doctorService.findOne( id );
  }
}
