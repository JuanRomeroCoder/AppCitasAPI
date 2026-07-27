import { Injectable, NotFoundException } from '@nestjs/common';
import { Doctor } from './entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidEspecialidad } from './interfaces/valid-especialidades';
import { EspecialidadDto } from './dto/filtros-doctor';

@Injectable()
export class DoctorService {
  
  constructor(
    @InjectRepository(Doctor) 
    private readonly doctorRepository : Repository<Doctor>
  ){}
  

   //Listar todos los doctores (JOINS A TABLA USUARIOS)
  async findAll( especialidadDto: EspecialidadDto ) {

    const doctores =  await this.doctorRepository
    .createQueryBuilder( 'doctor' )
    .leftJoinAndSelect( 'doctor.usuario', 'usuario' );
    
    //Condicion la cual si viene declarado el dto de la especialidad busque por dicho parametro
    if ( especialidadDto.especialidad ) {

      doctores.andWhere( 'doctor.especialidad = :especialidad',
      { especialidad: especialidadDto.especialidad } )
    }
    return doctores.getMany();  
    
  }
  
  //Listar un solo doctor BUSCA POR ID DE DOCTOR
  async findOne( id: string ) {
  
    const datosDoctor = await this.doctorRepository
    .createQueryBuilder('doctor')
    .leftJoinAndSelect('doctor.usuario', 'usuario')
    .where('doctor.id = :id', {id}) //Declaramos que el id del doctor es el id por el que vamos a buscar
    .getOne()
  
    if ( !datosDoctor )
      throw new NotFoundException(`El paciente con el ID: ${ id } no ha sido encontrado`);
  
    return datosDoctor;

  }

    
}
