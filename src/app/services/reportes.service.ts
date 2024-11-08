import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
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
  getVentasReporte(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/inventory/reportes', {
      headers: this.getHeaders(),
    });
  }
  getproductosMasVendidos(): Observable<any> {
    return this.http.get<any>(
      this.apiUrl + '/inventory/reportes/productos-mas-vendidos',
      {
        headers: this.getHeaders(),
      }
    );
  }
}
