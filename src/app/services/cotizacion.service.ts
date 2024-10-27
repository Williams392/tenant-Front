import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {

  private readonly Url = environment.API_URL + '/inventory/cotizacion';
  tenantId: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.usuario$.subscribe((usuario) => {
        this.tenantId = usuario.tenantId; 
        console.log('Tenant ID:', this.tenantId);
      });
  }
  
  getHeaders(): HttpHeaders {
    return new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    tenantId: this.tenantId || '', // Utilizar el valor del tenantId capturado
    });
  }

  registrar(ventaRequest: any): Observable<any> {
    ventaRequest.usuario_id = JSON.parse(localStorage.getItem('User')!).id;
    return this.http.post<any>(this.Url, ventaRequest, {
      headers: this.getHeaders(),
    });
  }
  getPagedCotizaciones(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.Url}?page=${page}&size=${pageSize}`, {
      headers: this.getHeaders(),
    });
  }
  getCotizacionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.Url}/${id}`, { headers: this.getHeaders() });
  }
}
