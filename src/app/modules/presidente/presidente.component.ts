import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Presidente } from '../../core/Models/presidente.model';
import { PresidenteService } from '../../core/Services/Presidente.service';

@Component({
  selector: 'app-presidente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Presidente.component.html',
  styleUrls: ['./presidente.component.scss']
})
export class PresidenteComponent implements OnInit {
  
  miembrosJunta: Presidente[] = [];
  nuevoPresidente: Presidente = { nombre: '', apellido: '', cedula: '', periodoGestion: '', correo: '' };

  constructor(private _presidenteService: PresidenteService) { }

  ngOnInit(): void {
    this.listarJunta();
  }

  listarJunta() {
    this._presidenteService.listar().subscribe((data: Presidente[]) => {
      this.miembrosJunta = data;
    });
  }

  registrar() {
    this._presidenteService.crear(this.nuevoPresidente).subscribe((res: Presidente) => {
      alert('Registro de presidencia actualizado con éxito');
      this.listarJunta();
      this.limpiar();
    });
  }

  limpiar() {
    this.nuevoPresidente = { nombre: '', apellido: '', cedula: '', periodoGestion: '', correo: '' };
  }
}