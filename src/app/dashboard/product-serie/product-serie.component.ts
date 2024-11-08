import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { ProductoSerieService } from '../../services/producto-serie.service';

@Component({
  selector: 'app-product-serie',
  standalone: true,
  imports: [],
  templateUrl: './product-serie.component.html',
  styles: ``
})
export class ProductSerieComponent implements OnInit{

  productService = inject(ProductoService);

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? ''; // Almacenar el ID del producto

      this.verSeries(id);
    });
  }

  // Series del producto
  productoSerieService = inject(ProductoSerieService);
  seriesProducto: any[] = [];

  verSeries(idProducto: string) {

    this.productoSerieService.getSeriesByProductoId(idProducto).subscribe({
      next: (series) => {
        this.seriesProducto = series; // Almacenar las series obtenidas
        console.log('Series del producto:', this.seriesProducto);
      },
      error: (err) => {
        console.error('Error al obtener las series del producto:', err);
      },
    });
  }
}
