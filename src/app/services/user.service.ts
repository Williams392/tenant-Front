import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { UserInfo } from "../models/user";
import { Observable } from "rxjs";
import { RolResponse } from "../models/rol";
import { Logica } from "../models/logica";


import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = environment.API_URL;

  tenantId: string | null = null;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.usuario$.subscribe((usuario) => {
      this.tenantId = usuario.tenantId; // Guardar el tenantId en una propiedad
      console.log('Tenant ID:', this.tenantId);
    });
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      tenantId: this.tenantId || '', // Utilizar el valor del tenantId capturado
    });
  }

  getUsuariosTenant(): Observable<UserInfo[]> {
    console.log(
      'ejecuta getusuario username: ' + localStorage.getItem('username'),
    );
    return this.http.get<UserInfo[]>(this.apiUrl + '/inventory/entidad', {
      headers: this.getHeaders(),
    });
  }

  postUser(user: UserInfo): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/inventory/entidad`, user, {
      headers: this.getHeaders(),
    });
  }

  getRoles(): Observable<RolResponse[]> {
    return this.http.get<RolResponse[]>(this.apiUrl + '/roles', 
      { headers: this.getHeaders() });
  }

}

// @Injectable({
//     providedIn: 'root',
//   })
//   export class UserService {
//     apiUrl: string = environment.API_URL + '/user';
  
//     constructor(private http: HttpClient) {}

//     user: UserInfo = {
//         id: '',
//         sub: '',
//         name: '',
//         given_name: '',
//         family_name: '',
//         picture: '',
//         email: '',
//         email_verified: false,
//         locale: '',
//         password: '',
//         tenantId: '',
//         tenantName: '',
//         regist: false,
//         tiponegocio: '',
//         rol: null,
//     };

//     headers = new HttpHeaders({
//       Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//     });

//     getUsuario(): Observable<UserInfo> {
//       console.log(
//         'ejecuta getusuario username: ' + localStorage.getItem('username'),
//       );
//       return this.http.get<UserInfo>(
//         `${this.apiUrl}/byusername/${localStorage.getItem('username')}`,
//         { headers: this.headers },
//       );
//     }
  
//     getUsuariosTenant(): Observable<UserInfo[]> {
//       return this.http.get<UserInfo[]>(
//         this.apiUrl + '/tenant/' + this.headers,
//       );
//     }
//     getRoles(): Observable<RolResponse[]> {

//       return this.http.get<RolResponse[]>(this.apiUrl + '/roles', { headers: this.headers });
//     }
//     getLogica(): Observable<Logica> {

//       const userString = this.headers.get('user');
//       if (userString) {
//         try {
//           this.user = JSON.parse(userString);
//         } catch (e) {
//           console.error('Error parsing user cookie:', e);
//         }
//       }

//       return this.http.get<Logica>(this.apiUrl + '/logica/' + this.user.id, { headers: this.headers, });
//     }

//     putUsuario(req: any): Observable<any> {
//       return this.http.put(
//         `${environment.API_URL}/inventory/entidad/asignarrol`, req, { headers: this.headers },
//       );
//     }

//     getUsuariosDeshboard(): Observable<any> {
//       return this.http.get(`${environment.API_URL}/inventory/entidad/dashboard`, { headers: this.headers });
//     }

//     deleteUser(usuario: UserInfo): Observable<any> {
//       return this.http.delete(`${this.apiUrl}/${usuario.id}`, { headers: this.headers });
//     }

//     postNuevoProducto(productoNuevo: FormData): Observable<any> {
//       return this.http.post<any>(`${this.apiUrl}`, productoNuevo, { headers: this.headers });
//     }
  
//     deleteProducto(id: string): Observable<void> {
//       return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers });
//     }
// }