import { RolResponse } from "./rol";

export interface Entidad {
    id:string;
    nombre: string;
    apellido: string;
    documento: string;
    direccion: string;
    telefono: string;
    email: string;
    tipoEntidad: TipoEntidad;
    RolId: RolResponse | null;
}

export interface TipoEntidad{
    id:number;
    descripcion:string;
    cantdigitos:number;
}