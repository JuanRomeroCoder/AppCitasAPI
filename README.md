<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">CitAppAPI</h1>

<p align="center">
  Backend de una aplicación de gestión de citas, desarrollado para consolidar mi aprendizaje y replicar un proyecto real.
</p>

---

## Tecnologías

- [NestJS](https://nestjs.com/): framework de backend
- [TypeORM](https://typeorm.io/): ORM
- [PostgreSQL](https://www.postgresql.org/): base de datos
- [Docker](https://www.docker.com/): contenedor para la base de datos
- [Yarn](https://yarnpkg.com/): gestor de paquetes

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión LTS)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) y Docker Compose

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/JuanRomeroCoder/AppCitasAPI.git
   cd AppCitasAPI
   ```

2. Instalar las dependencias:

   ```bash
   yarn install
   ```

3. Copiar el archivo de variables de entorno:

   ```bash
   cp .env.template .env
   ```

4. Editar el archivo `.env` y completar las variables con tus propios valores (usuario y contraseña de la base de datos, claves secretas, puerto, etc.).

5. Levantar la base de datos:

   ```bash
   docker compose up -d
   ```

6. Iniciar la API en modo desarrollo:

   ```bash
   yarn start:dev
   ```

La API quedará disponible en `http://localhost:PUERTO`, donde `PUERTO` es el valor definido en tu `.env`.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `yarn start:dev` | Inicia la API en modo desarrollo con recarga automática |
| `yarn build` | Compila el proyecto |
| `yarn start:prod` | Inicia la versión compilada (requiere `yarn build` antes) |
| `yarn test` | Ejecuta los tests unitarios |

## Detener la base de datos

```bash
docker compose down
```

Los datos se conservan en el volumen de Docker. Para borrarlos también, usa `docker compose down -v`.

## Autor

Proyecto personal de aprendizaje. Hecho con NestJS.
