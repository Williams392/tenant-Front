import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CotizacionService } from '../../../services/cotizacion.service';

@Component({
  selector: 'app-list-quotation',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './list-quotation.component.html',
  styles: ``,
})
export class ListQuotationComponent implements OnInit {
  router = inject(Router);
  cotizaciones: any[] = [];
  cotizacionService = inject(CotizacionService);

  totalCotizaciones: number = 0;
  page: number = 1;
  pageSize: number = 15;
  totalPages: number = 0;
  searchId: string = ''; // Campo de búsqueda por ID

  ngOnInit(): void {
    this.getCotizaciones(this.page, this.pageSize);
  }
  getCotizaciones(page: number, pageSize: number): void {
    this.cotizacionService
      .getPagedCotizaciones(page, pageSize)
      .subscribe((res: any) => {
        this.cotizaciones = res.cotizaciones;
        this.totalCotizaciones = res.total;
        this.totalPages = res.totalPages;
      });
  }
  searchCotizacionById(): void {
    if (this.searchId) {
      this.cotizacionService.getCotizacionById(this.searchId).subscribe(
        (res: any) => {
          this.cotizaciones = [res]; // Mostrar solo la cotización encontrada
          this.totalPages = 1; // Solo una página de resultados
        },
        (error: any) => {
          // Manejo de error
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error?.message ||
              'Ocurrió un error al buscar la cotización.',
          });
        }
      );
    } else {
      // Si no hay búsqueda, cargar todas las cotizaciones con paginación
      this.getCotizaciones(this.page, this.pageSize);
    }
  }
  refresh(): void {
    this.getCotizaciones(this.page, this.pageSize);
  }
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.getCotizaciones(this.page, this.pageSize);
  }
  CrearNuevaCotizacion() {
    this.router.navigate(['/dashboard/quotation']);
  }
}
