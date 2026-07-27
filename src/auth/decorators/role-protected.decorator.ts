import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';
//Crearmos un decorador para añadir que roles son los que son permitidos

export const META_ROLES = 'roles'

export const RoleProtected = (...args: ValidRoles[]) => { //Solo permitimos que se escriban los roles que hemos declarado en nuestra interfaz de valid-roles
    return SetMetadata( META_ROLES, args );
}
