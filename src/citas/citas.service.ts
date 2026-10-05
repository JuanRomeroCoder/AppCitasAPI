import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { PacientesService } from '../pacientes/pacientes.service';

import { Usuario } from 'src/usuarios/entities/usuario.entity';

import { Cita } from './entities/cita.entity';
import { EstadoCitas } from './interfaces/estado-citas';
import { FiltrarCitasDto, UpdateCitaDto, CreateCitaDto } from './dto/index';
import { ManejarError } from 'src/common/manejarError';
import { DoctorService } from '../doctor/doctor.service';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';


@Injectable()
export class CitasService {

  constructor(
    @InjectRepository( Cita )
    private readonly citasRepository : Repository<Cita>,

    private readonly pacientesService: PacientesService,

    private readonly doctorService : DoctorService,

    private readonly manejarError: ManejarError
  ){}

  //Creacion de la cita

  async create( createCitaDto: CreateCitaDto , user: Usuario ) {

    //Buscar registros en tabla paciente por id de usuario obtenido por el jwt
    const paciente = await this.pacientesService.findByUserId( user.id )

    if ( !paciente )
      throw new NotFoundException('No existe registros de paciente para este usuario')

    // Validacion ventana de 7 días    new Date() [Crear, manipular fechas]
    const fechaCita = new Date(createCitaDto.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    //Indicamos la fecha maxima a partir del dia que se solicita
    const fechaMax = new Date( hoy );
    fechaMax.setDate(hoy.getDate() + 7);

    //Manejamos la posibilidad de que se ingrese una fecha fuera la ventana
    if ( fechaCita < hoy || fechaCita > fechaMax) {
      throw new BadRequestException(
        'La cita debe estar dentro de los próximos 7 días',
      );
    }

    // Comprobar que no hay reservas ya hechas en esa fecha (EVITAMOS LA DOBLE RESERVA)
    const citaOcupada = await this.citasRepository.findOne({
      where: {
        doctorId: createCitaDto.doctorId,
        fecha: createCitaDto.fecha,
        hora: createCitaDto.hora,
        estado: Not(EstadoCitas.CANCELADA),
      },
    });

    //si ya existe una cita en ese hueco, lanzamos error
    if ( citaOcupada ) {
      throw new ConflictException('Ese horario ya no está disponible');
    }

    // Creacion de la cita que el paciente solicita
    const cita = this.citasRepository.create({
      ...createCitaDto,
      pacienteId: paciente.id, // Inyeccion del ID de paciente
      estado: EstadoCitas.PENDIENTE,
    });

    return await this.citasRepository.save( cita );
  }

  //Obtener citas para USUARIO y DOCTORES con filtros dinamicos solo para USUARIO
  async findAll( filtrarCitasDto: FiltrarCitasDto, user: Usuario ) {

    if ( user.role === ValidRoles.ADMIN ) {
      const  query = this.citasRepository
      .createQueryBuilder('citas')
      .leftJoinAndSelect('citas.doctor', 'doctor')
      .leftJoinAndSelect('citas.paciente', 'paciente')
      return await query.getMany()
      
    } else if ( user.role === ValidRoles.PACIENTE) {

      const datosPaciente = await this.pacientesService.findByUserId( user.id );

      const query = this.citasRepository
      .createQueryBuilder('citas')
      .leftJoinAndSelect('citas.doctor', 'doctor')
      .leftJoinAndSelect('citas.paciente', 'paciente')
      .where( 'citas.pacienteId = :pacienteId', {
        pacienteId: datosPaciente.id //condicion para devolver citas de paciente
      })

      //Filtros dinámicos: solo se añaden si vienen
      if ( filtrarCitasDto.doctorId ) {
        query.andWhere('citas.doctorId = :doctorId', {
          doctorId: filtrarCitasDto.doctorId,
        });
      }

      if ( filtrarCitasDto.pacienteId ) {
        query.andWhere('citas.pacienteId = :pacienteId', {
          pacienteId: filtrarCitasDto.pacienteId,
        });
      }

      if ( filtrarCitasDto.fecha ) {
        query.andWhere('citas.fecha = :fecha', { fecha: filtrarCitasDto.fecha });
      }

      if ( filtrarCitasDto.estado ) {
        query.andWhere('citas.estado = :estado', { estado: filtrarCitasDto.estado });
      }

      // Orden lógico de agenda
      query.orderBy('citas.fecha', 'ASC')
          .addOrderBy('citas.hora', 'ASC');
      return await query.getMany();

    } else {

      const datosDoctor = await this.doctorService.findOne( user.id );

      const query = this.citasRepository
      .createQueryBuilder('citas')
      .leftJoinAndSelect('citas.doctor', 'doctor')
      .leftJoinAndSelect('citas.paciente', 'paciente')
      .where( 'citas.doctorId = :doctorId', {
        doctorId: datosDoctor.id //condicion para devolver citas de paciente
      })
      return await query.getMany()
    }

  }

  //modificar estado de citas
  async patchCitas( id: string, updatecitaDto: UpdateCitaDto ) {
    //precargamos la cita que vamos a modificar
    const citaModificada = await this.citasRepository.preload({
      id,
      ...updatecitaDto
    })

    //manejamos situacion de modificar una cita que no existe
    if ( !citaModificada ) throw new NotFoundException('La cita que deseas modificar no existe')

    //guardar la cita modificada en la BD, si hay error lo comunicamos
    try {
      
      await this.citasRepository.save( citaModificada );
      return citaModificada

    } catch (error) {
      this.manejarError.manejarDBError( error )

    }
  }

}
