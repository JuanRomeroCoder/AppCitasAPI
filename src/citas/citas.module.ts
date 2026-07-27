import { Module } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { Cita } from './entities/cita.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PacientesModule } from 'src/pacientes/pacientes.module';

@Module({
  controllers: [CitasController],
  providers: [CitasService],
  imports:[
    PacientesModule, // importamos para tener acceso

    TypeOrmModule.forFeature([ Cita ]),//importacion de la entidad]
    AuthModule, //para los guards JWT
  ]
})
export class CitasModule {}
