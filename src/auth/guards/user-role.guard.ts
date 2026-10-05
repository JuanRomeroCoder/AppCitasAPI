import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { META_ROLES } from '../decorators/role-protected.decorator';
import { Usuario } from 'src/usuarios/entities/usuario.entity';


//Evalua el rol de el usuario y permite o no el acceso
@Injectable()
export class UserRoleGuard implements CanActivate {

  //Inyectamos la dependencia para obtener la metada de la peticion
  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    //usamos la dependencia de la metadata y los guardamos en una varibale de arrays
    const validRoles: string[] = this.reflector.get( META_ROLES, context.getHandler() );

    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as Usuario;
    
    if ( !user )
    throw new BadRequestException('Usuario no encontrado');
  
    if ( validRoles.includes( user.role ) )
      return true;

    throw new ForbiddenException(
      `El usuario ${ user.fullName } necesita un rol válido: ${ validRoles }`
    );
  }
}
