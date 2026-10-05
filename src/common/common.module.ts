import { Global, Module } from "@nestjs/common";
import { ManejarError } from "./manejarError";
//La intencion de este archivo module es para poder usar metodos comunes para todos los modulos
@Global() // Hace que lo que exportemos esté disponible en todos los modulos sin necesidad de declararlo en cada .module 
@Module({
    providers:[ManejarError],
    exports:[ManejarError]
})

export class CommonModule{}