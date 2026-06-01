import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lectura } from '../../core/Models/lectura.model';
import { LecturaService } from '../../core/Services/Lectura.service';

@Component({
  selector: 'app-lectura',
  templateUrl: './Lectura.component.html',
  styleUrls: ['./lectura.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LecturaComponent implements OnInit {
  
  lecturas: Lectura[] = [];
  nuevaLectura: Lectura = {
    valorLectura: 0,
    fechaToma: new Date(),
    observaciones: '',
    idMedidor: 0,
    idOperador: 0
  };

  constructor(private _lecturaService: LecturaService) { }

  ngOnInit(): void {
    this.cargarLecturas();
  }

  cargarLecturas() {
    this._lecturaService.listar().subscribe(data => this.lecturas = data);
  }

  registrarLectura() {
    this._lecturaService.crear(this.nuevaLectura).subscribe(() => {
      alert('Lectura registrada correctamente');
      this.cargarLecturas();
      this.nuevaLectura.valorLectura = 0; // Limpiar campo
    });
  }
}