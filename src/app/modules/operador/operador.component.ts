import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Operador } from '../../core/Models/operador.model';
import { OperadorService } from '../../core/Services/Operador.service';

@Component({
  selector: 'app-operador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Operador.component.html',
  styleUrls: ['./operador.component.scss']
})
export class OperadorComponent implements OnInit {
  
  operadores: Operador[] = [];
  nuevoOperador: Operador = { nombre: '', apellido: '', cedula: '', telefono: '', especialidad: '', estado: 'Activo' };

  constructor(private _operadorService: OperadorService) { }

  ngOnInit(): void {
    this.obtenerOperadores();
  }

  obtenerOperadores() {
    this._operadorService.listar().subscribe(data => {
      this.operadores = data;
    });
  }

  registrar() {
    this._operadorService.crear(this.nuevoOperador).subscribe(() => {
      alert('Operador registrado exitosamente');
      this.obtenerOperadores();
      this.limpiar();
    });
  }

  borrar(id: number) {
    if(confirm('¿Eliminar operador del sistema?')) {
      this._operadorService.eliminar(id).subscribe(() => this.obtenerOperadores());
    }
  }

  limpiar() {
    this.nuevoOperador = { nombre: '', apellido: '', cedula: '', telefono: '', especialidad: '', estado: 'Activo' };
  }
}