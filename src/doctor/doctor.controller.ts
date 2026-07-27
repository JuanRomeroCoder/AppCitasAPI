import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { EspecialidadDto } from './dto/filtros-doctor';


@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

 //Obtener todos los doctores, filtra si viene especificando especialidad en Dto
  @Get()
  findAll( @Query() especialidadDto: EspecialidadDto ) {

    return this.doctorService.findAll( especialidadDto );
  }

  //Obtener solo un doctor 
  @Get(':id')
  findOne( @Param('id', ParseUUIDPipe) id: string ){
    return this.doctorService.findOne( id );
  }
}
