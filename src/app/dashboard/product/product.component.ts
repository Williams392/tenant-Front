import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { SelectSerachComponent } from '../../components/select-serach/select-serach.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { TablesComponent } from '../../components/tables/tables.component';
import { EntidadService } from '../../services/entidad.service';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { ProductoResponse } from '../../models/producto';
import { MarcaService } from '../../services/marca.service';
import { PedidoRequest } from '../../models/pedido';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoSerieService } from '../../services/producto-serie.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    InputComponent,
    SelectSerachComponent,
    ModalComponent,
    TablesComponent,
    RouterLink,
  ],
  templateUrl: './product.component.html',
  styles: ``,
})
export class ProductComponent {
  productos: any[] = [];
  categorias: any[] = []; // Lista de categorías
  marcas: any[] = []; // Lista de marcas
  productoEliminar: ProductoResponse[] = [];
  //categoriaservice = inject(CategoriaService);
  //marcaservice = inject(MarcaService);
  ProductoNombrePedidoSelect: string = '';
  ProductoIdPedidoSelect: string = '';
  ProductoCantidadPedidoSelect: number = 0;
  ProductoNotaPedidoSelect: string = '';

  Pedido: PedidoRequest | null = null;

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private pedidoService: PedidoService,
    private categoriaservice: CategoriaService,
    private marcaservice: MarcaService
  ) {}

  EditOpen = false;
  CreateOpen = false;
  SerieOpen = false;

  name_modal = 'CREAR';
  openEModal() {
    this.name_modal = 'EDITAR';
    this.EditOpen = true;
  }

  openCModal() {
    //this.CreateOpen = true;
    this.name_modal = 'CREAR';
    this.EditOpen = true;
  }

  openSModal() {
    //this.CreateOpen = true;
    this.name_modal = 'SERIES';
    this.SerieOpen = true;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //Flowbite se inicia después de que se haya cargado la pagina
        setTimeout(() => initFlowbite(), 0);
      }
    });
    this.cargarProductosActualizado();
    if (this.categorias.length == 0) {
      this.categoriaservice.getAll().subscribe((categorias) => {
        this.categorias = categorias;
      });
    }

    if (this.marcas.length == 0) {
      this.marcaservice.getAll().subscribe((marcas) => {
        this.marcas = marcas;
      });
    }
  }

  ListaCategoriaMarcaSeleccionada: any;
  ListasSubcategoriaSeleccionada: any;
  buscarSubM(marcaId: number) {
    this.ListaCategoriaMarcaSeleccionada = this.marcas.find(
      (m) => m.id == marcaId
    )?.CategoriaMarcas;
  }

  buscarSubC(categoria: number) {
    this.ListasSubcategoriaSeleccionada = this.categorias.find(
      (c) => c.id == categoria
    )?.subcategorias;
    console.log(categoria);
  }

  cargarProductosActualizado() {
    this.productoService.getListaProductos().subscribe(
      (response) => {
        this.productos = response;
        console.log(response);
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  buscarProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toUpperCase();

    if (searchText) {
      this.productos = this.productos.filter((pro) =>
        //cambiar la categoria (id/nombre/marca) para buscar
        pro.nombre.toUpperCase().includes(searchText)
      );
    } else {
      this.cargarProductosActualizado();
    }
  }

  eliminarProducto(id: string): void {
    this.productoService.deleteProducto(id).subscribe(
      () => {
        this.productoEliminar = this.productoEliminar.filter(
          (p) => p.id !== id
        );
        console.log('producto eliminado.');
        this.cargarProductosActualizado();
      },
      (_error) => {
        console.log('producto no eliminado.');
      }
    );
  }

  RegistrarPedido() {
    this.Pedido = {
      id: '',
      id_producto: this.ProductoIdPedidoSelect,
      fecha: new Date().toISOString(),
      id_usuario: '',
      cantidad: this.ProductoCantidadPedidoSelect,
      estado: 'pendiente',
      nota: this.ProductoNotaPedidoSelect,
      tenantId: '',
    };
    this.pedidoService.registrar(this.Pedido).subscribe({
      next: () => {
        console.log('El pedido ha sido registrado.');
      },
      error: (_error) => {
        console.log('El pedido no registrado');
      },
    });
  }

  nuevoActua: any = {
    id: '',
    nombre: '',
    pn: '',
    descripcion: '',
    stock: 1,
    precio: 1,
    MarcaId: 1,
    CategoriaMarcaId: 1,
    CategoriaId: 1,
    SubCategoriaId: 1,
    garantia_cliente: 0,
    garantia_total: 0,
    cantidad: 0,
    imagen_principal: '',
    imageurl: [],
  };

  imagencargadaPrincipal: string = '';
  imagencarga: string[] = [];
  editarProducto(id: string) {
    console.log(this.nuevoActua);
    this.nuevoActua = this.productos.find((producto) => {
      return producto.id == id;
    });
    console.log(this.nuevoActua);
    this.buscarSubC(this.nuevoActua.CategoriaId);
    this.buscarSubM(this.nuevoActua.MarcaId);
    this.openEModal();
    //this.imagencarga = [];
    //this.imagencargadaPrincipal = '';
  }

  guardarCambios() {
    const formData = new FormData();

    formData.append('producto', JSON.stringify(this.nuevoActua));
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
    } else {
      formData.append('files', new Blob(), '');
    }

    if (this.selectedFilePrincipal) {
      formData.append('fileprincipal', this.selectedFilePrincipal);
    } else {
      formData.append('fileprincipal', new Blob(), '');
    }
    if (this.name_modal == 'CREAR') {
      this.productoService.postNuevoProducto(formData).subscribe({
        next: () => {
          //actualizar productos
          this.cargarProductosActualizado();
          this.nuevoActua = {
            id: '',
            nombre: '',
            pn: '',
            descripcion: '',
            stock: 1,
            precio: 1,
            MarcaId: 1,
            CategoriaMarcaId: 1,
            CategoriaId: 1,
            SubCategoriaId: 1,
            garantia_cliente: 0,
            garantia_total: 0,
            cantidad: 0,
            imagen_principal: '',
            imageurl: [],
          };
          this.imagencargadaPrincipal = '';
          this.imagencarga = [];
          this.selectedFilePrincipal = null;
          this.selectedFiles = [];
          this.EditOpen = false;
        },
      });
    } else {
      this.productoService.putProducto(formData).subscribe({
        next: () => {
          //actualizar productos
          this.cargarProductosActualizado();
          this.nuevoActua = {
            id: '',
            nombre: '',
            pn: '',
            descripcion: '',
            stock: 1,
            precio: 1,
            MarcaId: 1,
            CategoriaMarcaId: 1,
            CategoriaId: 1,
            SubCategoriaId: 1,
            garantia_cliente: 0,
            garantia_total: 0,
            cantidad: 0,
            imagen_principal: '',
            imageurl: [],
          };
          this.imagencargadaPrincipal = '';
          this.imagencarga = [];
          this.selectedFilePrincipal = null;
          this.selectedFiles = [];
          this.EditOpen = false;
        },
      });
    }
  }
  selectedFiles: File[] = [];
  selectedFilePrincipal: File | null = null;
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);

      //cargar imagencarga []
      this.selectedFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagencarga.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }
  onFileChangePrincipal(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFilePrincipal = event.target.files[0];
      //cargar imagencarga []
      if (this.selectedFilePrincipal) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagencarga.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFilePrincipal);
      }
    }
  }
  eliminarImagen(index: number) {
    this.nuevoActua.imageurl.splice(index, 1);
    console.log('Lista imagenes: ', this.nuevoActua.imageurl);
  }

  abrirModalPedido(content: any, id: string, nombre: string) {
    this.ProductoIdPedidoSelect = id;
    this.ProductoNombrePedidoSelect = nombre;
    //this.abrirModal(content);
  }

  getCurrentDateTime(): string {
    return new Date().toISOString();
  }

  // Series del producto
  productoSerieService = inject(ProductoSerieService);
  seriesProducto: any[] = [];
  nombreProductoSerie: string = '';

  verSeries(idProducto: string) {
    this.nombreProductoSerie = this.obtenerNombreProducto(idProducto); // Implementa este método
    console.log(idProducto);
    this.openSModal();
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

  obtenerNombreProducto(id: string): string {
    const producto = this.productos.find(p => p.id === id);
    return producto ? producto.nombre : 'Producto no encontrado';
  }

}
