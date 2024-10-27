import { Component, inject, OnInit } from '@angular/core';
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
import { Entidad } from '../../models/entidad';

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
  ],
  templateUrl: './admin-user.component.html',
  styles: ``
})
export class AdminUserComponent implements OnInit {
  entidadesService = inject(EntidadService);
  authService = inject(AuthService);

  EntidadDueno: Entidad | null = null;
  entidades: any[] = [];

  Filtro: any[] = [];
  FiltroRol = 0;
  buscado = '';
  FlagModal = false;

  //entidad: Entidad = new Entidad();

  Roles = [
    { id: 1, nombre: 'administrador' },
    { id: 2, nombre: 'vendedor' },
    { id: 3, nombre: 'almacenero' },
    { id: 4, nombre: 'cliente' },
  ];

  NewEntidad = {
    nombre: '',
    apellido:  '',
    documento: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    RolId: 0,
    id_tipoEntidad: 1,
  };
  Buscador = '';

  ngOnInit(): void {
    this.cargarEntidades();
  }

  cargarEntidades() {
    this.entidadesService.getEntidades().subscribe((res) => {
      console.log('Respuesta del servicio:', res);
      this.entidades = res.map(entidad => {
        console.log('Entidad:', entidad);
        return {
          ...entidad,
          RolNombre: entidad.RolId ? entidad.RolId.nombre : 'Sin rol',
        };
      });
      this.Filtro = [...this.entidades];
      console.log('Entidades procesadas:', this.entidades);
    });
  }  
  

  editarEntidad(id: string) {

  }

  // Método para capturar el cambio de rol y aplicar filtro
  BuscarRol(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.FiltroRol = Number(selectElement.value);
    this.aplicarFiltro(); // Llamar al método de filtro
  }

  ToggleModal() {
    this.FlagModal = !this.FlagModal;
  }

  AbrirModal() {
    if (this.entidades.length == 0) this.cargarEntidades();
    this.ToggleModal();
  }

  Crear() {
    const nuevaEntidad = {
      id: '',
      nombre: this.NewEntidad.nombre,
      apellido: this.NewEntidad.apellido,
      documento: this.NewEntidad.documento,
      direccion: this.NewEntidad.direccion,
      telefono: this.NewEntidad.telefono,
      email: this.NewEntidad.email,
      password: this.NewEntidad.password,
      RolId: this.NewEntidad.RolId,
      id_tipoEntidad: this.NewEntidad.id_tipoEntidad,
    };
  
    this.authService.create(nuevaEntidad).subscribe({
      next: (response) => {
        this.ToggleModal();
        Swal.fire({
          icon: 'success',
          title: 'Entidad Registrada',
          text: response.message,
        });
        this.cargarEntidades(); // Recargar la lista de entidades
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message,
        });
      }
    });
  }  

  aplicarFiltro() {
    this.Filtro = this.entidades.filter((entidad) => {
      const matchesNombre = entidad.nombre.toLowerCase().includes(this.buscado);
      const matchesRol =
        this.FiltroRol === 0 || entidad.RolId === this.FiltroRol;
      return matchesNombre && matchesRol;
    });
  }
  search(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.buscado = inputElement.value.toLowerCase();
    this.aplicarFiltro(); // Llamar al método de filtro
  }
  
}