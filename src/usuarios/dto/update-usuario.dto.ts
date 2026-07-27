import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsBoolean } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    
    @IsBoolean()
    isActive?: boolean
    
}
