import { Component, inject, OnInit, ChangeDetectorRef,signal } from '@angular/core';
import { EntidadService } from '../../services/entidad.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { InputComponent } from '../../components/input/input.component';
import { SelectSerachComponent } from '../../components/select-serach/select-serach.component';
import { TablesComponent } from '../../components/tables/tables.component';
import { SelectComponent } from '../../components/select/select.component';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { RolResponse } from '../../models/rol';
import { PrivilegioResponse } from '../../models/privilegio';
import { UserService } from '../../services/user.service';
import { UserInfo } from '../../models/user';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [
    ModalComponent,
    InputComponent,
    SelectSerachComponent,
    TablesComponent,
    SelectComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './admin-user.component.html',
  styles: ``
})
export class AdminUserComponent implements OnInit {
  constructor( 
    private usuarioService: UserService,
    //private authService : AuthService,
    private cdr: ChangeDetectorRef,
  ) { }

  Filtro: any[] = [];
  FiltroRol = 0;
  buscado = '';
  FlagModal = false;
  entidades: any[] = []; // Añadido

  UsuarioDueno: UserInfo | null = null; // Ajustado
  usuarioSelect: UserInfo | null = null;
  usuarios: UserInfo[] = [];
  closeResult = '';

  Roles = [
    { id: 1, nombre: 'administrador'},
    { id: 2, nombre: 'vendedor'},
    { id: 3, nombre: 'almacenero'},
    { id: 4, nombre: 'CARNET EXTRANJERIA'},
  ];

  TipoEntidad = [
    { id: 1, nombre: 'DNI', cantdigitos: 8 },
    { id: 6, nombre: 'RUC', cantdigitos: 11 },
    { id: 7, nombre: 'PASAPORTE', cantdigitos: 12 },
    { id: 8, nombre: 'cliente', cantdigitos: 12 },
  ];

  // Inicialización de roles con la nueva sintaxis
  readonly roles = signal<RolResponse[]>([
    {
      id: 1,
      nombre: 'administrador',
      descripcion: 'Acceso total a funciones del tenant',
      //completed: false,
      privilegios: [
        { id: 1, nombre: 'facturas', descripcion: 'Acceso total a funciones de facturacion' },
        { id: 2, nombre: 'boletas', descripcion: 'Acceso total a funciones de boletas' },
        { id: 3, nombre: 'usuarios', descripcion: 'Acceso total a funciones de administracion de usuarios'},
        { id: 4, nombre: 'reportes', descripcion: 'Acceso reportes' },
        { id: 5, nombre: 'almacenes', descripcion: 'Acceso almacenes' },
        { id: 6, nombre: 'eccomerce', descripcion: 'Acceso ecomerce' },
      ],
    },
    {
      id: 2,
      nombre: 'vendedor',
      descripcion: 'Acceso total a funciones del facturacion',
      //completed: false,
      privilegios: [
        { id: 1, nombre: 'facturas', descripcion: 'Acceso total a funciones de facturacion' },
        { id: 2, nombre: 'boletas', descripcion: 'Acceso total a funciones de boletas' },
        { id: 4, nombre: 'reportes', descripcion: 'Acceso reportes' },
      ],
    },
    {
      id: 3,
      nombre: 'almacenero',
      descripcion: 'Acceso total a funciones del almacen',
      //completed: false,
      privilegios: [
        { id: 4, nombre: 'reportes', descripcion: 'Acceso reportes' },
        { id: 5, nombre: 'almacenes', descripcion: 'Acceso almacenes' },
      ],
    },
    {
      id: 4,
      nombre: 'cliente',
      descripcion: 'Acceso total a funciones del ecommerce',
      //completed: false,
      privilegios: [
        { id: 6, nombre: 'eccomerce', descripcion: 'Acceso ecomerce' },
      ],
    },
  ]);

  newUser: UserInfo = {
    id: '', // Inicializa con un valor adecuado
    nombre: '',
    apellido: '',
    documento: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    RolId: 0,
    id_tipoEntidad: 1,
    picture: '', // Inicializa con un valor adecuado
    verifiedWebsite: false, // Inicializa con un valor adecuado
    TipoEntidadId: 0, // Inicializa con un valor adecuado
    rol: null,
  };
  
  Buscador = '';

  ngOnInit(): void {
    this.cargarEntidades();
  }

  cargarEntidades() {
    this.usuarioService.getUsuariosTenant().subscribe((res) => {
      this.usuarios = res;
      this.Filtro = [...this.usuarios];
    });
  }

  guardarUser() {
    this.usuarioService.postUser(this.newUser).subscribe({
      next: () => {
        this.onSuccess('El usuario ha sido registrado exitosamente.');
      },
      error: (_error) => {
        this.onError('El usuario no fue registrado.');
      },
    });
  }
  onSuccess(message: string) {
    Swal.fire('Éxito', message, 'success');
    this.cargarEntidades();
    this.ToggleModal();  // Cerrar el modal después del éxito
  }
  onError(message: string) {
    Swal.fire('Error', message, 'error');
  }

  ToggleModal() {
    this.FlagModal = false;
  }
  AbrirModal() {
    if (!this.UsuarioDueno) this.cargarEntidades(); // Ajustado
    this.ToggleModal();
  }

  aplicarFiltro() {
    this.Filtro = this.usuarios.filter((entidad) => {
      const matchesNombre = entidad.nombre.toLowerCase().includes(this.buscado);
      const matchesRol = this.FiltroRol === 0 || Number(entidad.RolId) === this.FiltroRol;
      return matchesNombre && matchesRol;
    });
  }

  editarUser(id: string) {

  }

  buscarUser(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.buscado = inputElement.value.toLowerCase();
    this.aplicarFiltro(); // Llamar al método de filtro
  }

  // Método para capturar el cambio de rol y aplicar filtro
  BuscarRol(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.FiltroRol = Number(selectElement.value);
    this.aplicarFiltro(); // Llamar al método de filtro
  }

  CCOpen = false;

  name_modal = 'CREAR';
  openCCModal() {
    this.name_modal = 'CREAR';
    this.CCOpen = true;
  }

  
}