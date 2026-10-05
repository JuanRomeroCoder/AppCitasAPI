import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class ManejarError {
    manejarDBError( error: any ): never {
      if ( error.code === `23505` )
        throw new BadRequestException( error.detail );
      console.log(error)
    
      throw new InternalServerErrorException('Por favor revisa los logs del server')
    }
}