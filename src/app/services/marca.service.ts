import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MarcaRequest, MarcaResponse } from '../models/marca';
import { Observable } from 'rxjs';
import {
  CategoriaMarcaRequest,
  CategoriaMarcaResponse,
} from '../models/categoria-marca';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  apiUrl: string = environment.API_URL + '/inventory/marca';
  Url: string = environment.API_URL + '/inventory/categoriamarca';
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
  getAll(): Observable<MarcaResponse[]> {
    return this.http.get<MarcaResponse[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  postMarca(categoria: MarcaRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, categoria, {
      headers: this.getHeaders(),
    });
  }

  postCategoriaMarca(categoriaMarca: CategoriaMarcaRequest): Observable<any> {
    return this.http.post<any>(`${this.Url}`, categoriaMarca, {
      headers: this.getHeaders(),
    });
  }

  getSubs(id: number): Observable<CategoriaMarcaResponse[]> {
    return this.http.get<CategoriaMarcaResponse[]>(
      `${this.apiUrl}/subs/${id}`,
      { headers: this.getHeaders() }
    );
  }
}