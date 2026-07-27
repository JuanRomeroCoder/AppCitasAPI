import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EstadoCitas} from "../interfaces/estado-citas";
import { Doctor } from "src/doctor/entities/doctor.entity";
import { Paciente } from "src/pacientes/entities/paciente.entity";



@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  fecha!: string;

  @Column({ type: 'time' })
  hora!: string;

  @Column({
    type: 'enum',
    enum: EstadoCitas,
    default: EstadoCitas.PENDIENTE,
  })
  estado!: EstadoCitas;

  @Column({ nullable: true })
  sala!: string;

  // --- Relación con Doctor (siempre obligatoria) ---
  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'doctorId' })
  doctor!: Doctor;

  @Column()
  doctorId!: string;

  // --- Relación con Paciente (nullable → BLOQUEADO no tiene paciente) ---
  @ManyToOne(() => Paciente, { eager: true, nullable: true })
  @JoinColumn({ name: 'patientId' })
  patient!: Paciente;

  @Column({ nullable: true })
  patientId!: string;
}