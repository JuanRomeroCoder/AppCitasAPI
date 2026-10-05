import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Paciente } from './entities/paciente.entity';

@Injectable()
export class PacientesService {

  constructor(
    @InjectRepository(Paciente) 
    private readonly pacienteRepository : Repository<Paciente>
  ){}

  //Listar todos los pacientes (JOINS A TABLA USUARIOS)
  async findAll() {

    const pacientes = await this.pacienteRepository
    .createQueryBuilder('paciente')
    .leftJoinAndSelect('paciente.usuario', 'usuario') //Indicamos la propiedad que relacionemos en la entidad
    .getMany();

    return pacientes;
  }

  //Listar usuario BUSCA POR ID DE PACIENTE
  async findOne( id: string ) {

    const datosPaciente = await this.pacienteRepository
    .createQueryBuilder('paciente')
    .leftJoinAndSelect('paciente.usuario', 'usuario')
    .where('paciente.id = :id', {id}) //Declaramos que el id del paciente es el id por el que vamos a buscarlo en la query
    .getOne()

    if ( !datosPaciente )
      throw new NotFoundException(`El paciente con el ID: ${ id } no ha sido encontrado`);

    return datosPaciente;
  }

  //Buscar usuario por ID DE USUARIO //! VER SI HAY FORMA DE UNIR ESTE METODO CON FIND ONE
  async findByUserId( userId: string ) {

    const paciente = await this.pacienteRepository
    .createQueryBuilder('paciente')
    .where('paciente.userId = :userId', {userId})
    .getOne()

    if (!paciente) {
      console.log(paciente)
      throw new NotFoundException('No existe un paciente para este usuario');
      
    }
    return paciente;
  }


}
