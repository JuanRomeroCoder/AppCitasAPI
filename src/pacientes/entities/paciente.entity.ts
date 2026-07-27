import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('paciente')
export class Paciente {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20 })
  telefono!: string;

  @Column({ type: 'date', nullable: true }) //nullable: true campo opcional, por defecto null
  fechaNacimiento?: Date;

  @OneToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  usuario!: Usuario;

}
