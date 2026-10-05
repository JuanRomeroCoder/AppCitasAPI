import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { PacientesModule } from 'src/pacientes/pacientes.module';

import { Cita } from './entities/cita.entity';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { DoctorModule } from 'src/doctor/doctor.module';

@Module({
  controllers: [CitasController],
  providers: [CitasService],
  imports:[
    PacientesModule, DoctorModule, // importamos para tener acceso

    TypeOrmModule.forFeature([ Cita ]),//importacion de la entidad]
    AuthModule, //para los guards JWT
  ]
})
export class CitasModule {}
