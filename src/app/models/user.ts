import { RolResponse } from "./rol";

export interface UserInfo {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
    direccion: string;
    telefono: string;
    email: string;
    password: string;
    
    id_tipoEntidad: number;
    picture?: string;
    verifiedWebsite?: boolean;
    TipoEntidadId?: number;
    // Otras propiedades opcionales

    RolId: number;
    rol: RolResponse | null;
  }
  

// export interface UserInfo {
//     id: string;
//     sub: string;
//     name: string;
//     given_name: string;
//     family_name: string;
//     picture: string;
//     email: string;
//     email_verified: boolean;
//     locale: string;
//     password: string;
//     tenantId: string;
//     tenantName: string;
//     regist: boolean;
//     tiponegocio: string;
//     rol: RolResponse | null;
// }