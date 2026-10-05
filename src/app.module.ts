import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DoctorModule } from './doctor/doctor.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { CitasModule } from './citas/citas.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    //Configurar las varibales de entorno
    ConfigModule.forRoot({ isGlobal: true }),

    //Configurar la conexion de TypeORM para Postgres
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, //Solo en produccion , se usa para ver cambios en vivo
    }),

    AuthModule,

    UsuariosModule,

    DoctorModule,

    PacientesModule,

    CitasModule,

    CommonModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
