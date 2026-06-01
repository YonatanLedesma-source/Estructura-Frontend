import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Administrador } from '../../core/Models/administrador.model';
import { AdministradorService } from '../../core/Services/Administrador.service';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Administrador.component.html',
  styleUrls: ['./administrador.component.scss']
})
export class AdministradorComponent implements OnInit {
  
  // Usamos la clase Administrador para la lista y el objeto del formulario
  listaAdmins: Administrador[] = [];
  adminForm: Administrador = { 
    nombre: '', apellido: '', cedula: '', telefono: '', correo: '', rol: 'ADMINISTRADOR' 
  };

  constructor(private _adminService: AdministradorService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this._adminService.getAdministradores().subscribe(data => {
      this.listaAdmins = data;
    });
  }

  registrar() {
    this._adminService.postAdministrador(this.adminForm).subscribe(res => {
      alert('Administrador guardado en el sistema Pureza Rural');
      this.listar();
      this.limpiar();
    });
  }

  eliminar(id: number) {
    if(confirm('¿Desea eliminar este perfil administrativo?')) {
      this._adminService.deleteAdministrador(id).subscribe(() => this.listar());
    }
  }

  limpiar() {
    this.adminForm = { nombre: '', apellido: '', cedula: '', telefono: '', correo: '', rol: 'ADMINISTRADOR' };
  }
}