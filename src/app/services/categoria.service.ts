import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoriaRequest, CategoriaResponse } from '../models/categoria';
import { Observable } from 'rxjs';
import {
  SubCategoriaRequest,
  SubCategoriaResponse,
} from '../models/subcategoria';
import { CategoriaMarcaRequest } from '../models/categoria-marca';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  apiUrl: string = environment.API_URL + '/inventory/categoria';
  Url: string = environment.API_URL + '/inventory/subcategoria';
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
  getAll(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  postCategoria(categoria: CategoriaRequest): Observable<any> {
    return this.http.post<CategoriaRequest>(`${this.apiUrl}`, categoria, {
      headers: this.getHeaders(),
    });
  }

  postSubCategoria(subCategoria: SubCategoriaRequest): Observable<any> {
    return this.http.post<any>(`${this.Url}`, subCategoria, {
      headers: this.getHeaders(),
    });
  }

  getSubs(id: number): Observable<SubCategoriaResponse[]> {
    return this.http.get<SubCategoriaResponse[]>(`${this.apiUrl}/subs/${id}`, {
      headers: this.getHeaders(),
    });
  }

  actualizarCategoria(
    id: number,
    categoria: CategoriaMarcaRequest
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria, {
      headers: this.getHeaders(),
    });
  }
}
