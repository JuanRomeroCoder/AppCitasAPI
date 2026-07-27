import { Usuario } from "src/usuarios/entities/usuario.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ValidEspecialidad } from "../interfaces/valid-especialidades";

@Entity('doctor')
export class Doctor {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  especialidad!: ValidEspecialidad; 

  @Column({ type: 'time' })
  horarioInicio!: string;

  @Column({ type: 'time' })
  horarioFin!: string;

  @OneToOne(() => Usuario, { onDelete: 'CASCADE' }) //Declaramos relacion 1:1 y evitamos registros huerfanos a la hora de borrar usuarios
  @JoinColumn({ name: 'userId' }) //Declaramos que la FK se crea Aquí
  usuario!: Usuario; //Acceso a la tabla Usuarios


}
    
