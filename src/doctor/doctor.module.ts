import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService],
  imports:[
    TypeOrmModule.forFeature([ Doctor ]) //importacion de la entidad
  ],
  exports:[DoctorService] // usar su logica en el modulo Citas
})
export class DoctorModule {}
