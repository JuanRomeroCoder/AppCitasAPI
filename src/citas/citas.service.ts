import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Not, Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoCitas } from './interfaces/estado-citas';
import { PacientesService } from '../pacientes/pacientes.service';
import { FiltrarCitasDto } from './dto/filtrar-citas';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Injectable()
export class CitasService {

  constructor(
    @InjectRepository( Cita ) 
    private readonly citasRepository : Repository<Cita>,

    private readonly pacientesService: PacientesService, 
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
      patientId: paciente.id, // Inyeccion del ID de paciente
      estado: EstadoCitas.PENDIENTE,
    });

    return await this.citasRepository.save( cita );
  }



  //Obtener citas con filtros dinamicos
  async findAll( filtrarCitasDto: FiltrarCitasDto, user: Usuario ) {
    const query = this.citasRepository
      .createQueryBuilder('citas')
      .leftJoinAndSelect('citas.doctor', 'doctor')
      .leftJoinAndSelect('citas.patient', 'patient');

    //Filtros dinámicos: solo se añaden si vienen 
    if ( filtrarCitasDto.doctorId ) {
      query.andWhere('citas.doctorId = :doctorId', {
        doctorId: filtrarCitasDto.doctorId,
      });
    }

    if ( filtrarCitasDto.patientId ) {
      query.andWhere('citas.patientId = :patientId', {
        patientId: filtrarCitasDto.patientId,
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
  }

  //modificar estado de citas
  patchCitas( id: string, updatecitaDto: UpdateCitaDto ) {
    //preparacion 
    const cita = 
  }//! completar logica

}
