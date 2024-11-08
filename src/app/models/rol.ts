import { PrivilegioResponse } from "./privilegio";

export interface RolResponse {
    id: number;
    nombre: string;
    descripcion: string;
    privilegios: PrivilegioResponse[];
}

// export interface RolResponse {
//     id: string;
//     nombre: string;
//     descripcion: string;
//     privilegios: PrivilegioResponse[];
// }