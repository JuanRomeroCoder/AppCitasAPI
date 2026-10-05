import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from './entities/doctor.entity';
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
    
    //Condicion  si viene declarado el dto de la especialidad busque por dicho parametro
    if ( especialidadDto.especialidad ) {

      doctores.andWhere( 'doctor.especialidad = :especialidad',
      { especialidad: especialidadDto.especialidad } )
    }
    return doctores.getMany();  
    
  }
  
  //Listar un solo doctor BUSCA POR ID DE DOCTOR o ID DE USUARIO
  async findOne( id: string ) {
  
    const datosDoctor = await this.doctorRepository
    .createQueryBuilder('doctor')
    .leftJoinAndSelect('doctor.usuario', 'usuario')
    .where( 'doctor.userId = :id', {id} ) //Declaramos que vamos a buscar por el id del usuario
    .orWhere('doctor.id = :id', {id}) //Añadimos que también busque por el id de doctor
    .getOne()
  
    if ( !datosDoctor )
      throw new NotFoundException(`El doctor con el ID: ${ id } no ha sido encontrado`);
  
    return datosDoctor;

  }

    
}
