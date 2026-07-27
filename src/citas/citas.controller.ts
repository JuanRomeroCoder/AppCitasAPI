import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { FiltrarCitasDto } from './dto/filtrar-citas';

@Controller('citas')
@UseGuards( AuthGuard('jwt'), UserRoleGuard ) //! USO DE GUARDS PARA JWT Y ROLES ( IMPORTANTE PARA DEGUB EN PRE )
export class CitasController {

  constructor(
    private readonly citasService: CitasService
  ) {}

  //Crear una cita
  @Post()
  create( @Body() createCitaDto: CreateCitaDto,
          @GetUser() user: Usuario ) { //GetUser para extraer objeto user de cabecera
    return this.citasService.create(createCitaDto, user);
  }

  //Obtener citas
  @Get()
  findAll( @Query() filtrarCitasDto: FiltrarCitasDto,
           @GetUser() user: Usuario ) {
    return this.citasService.findAll( filtrarCitasDto, user )          
  }
 
  //Modificar citas
  @Patch(':id') //ID de la cita
  patch( @Param('id', ParseUUIDPipe) id: string,
         @Body() updatecitaDto : UpdateCitaDto ){
    return this.citasService.patchCitas( id, updatecitaDto )
  }

}
