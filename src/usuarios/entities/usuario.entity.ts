
import { ValidRoles } from "src/auth/interfaces/valid-roles";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuarios') //Transformamos la clase en una entidad que sera una tabla en la BD
export class Usuario {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    
    @Column({type: 'text',
            unique: true
    })
    email!: string;


    @Column({type: 'text',
            select: false //indicamos que cuando se haga una query no muestre la contraseña
    })
    password!: string;


    @Column({type: 'text'})
    fullName!: string;


    @Column({type: 'text',
            unique: true
    })
    dni!: string;

    //Su objetivo es para no eliminar de usuario si no para dar de baja/alta
    @Column({type: 'bool',
            default: true
    })
    isActive!: boolean;


    @Column({type: 'text',
            default: ValidRoles.PACIENTE //Declaramos rol por defecto
    })
    role!: ValidRoles;


    //pasar datos a minuscula antes de insert en la BD
    @BeforeInsert() 
    checkFieldBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }
    
    @BeforeUpdate() 
    checkFieldBeforeUpdate() {
        this.checkFieldBeforeInsert();
    }
    
}

