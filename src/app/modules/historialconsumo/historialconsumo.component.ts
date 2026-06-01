import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialConsumoService } from '../../core/Services/HistorialConsumo.service';
import { HistorialConsumo } from '../../core/Models/historialConsumo.model';

@Component({
    selector: 'app-historial-consumo',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './historialconsumo.component.html',
    styleUrls: ['./historialconsumo.component.scss']
})
export class HistorialConsumoComponent implements OnInit {
    cargando: boolean = false;
    error: string = '';
    mensaje: string = '';
    editandoId: number | null = null;
    consumos: HistorialConsumo[] = [];
    nuevoConsumo: Partial<HistorialConsumo> = {
        idMedidor: 0,
        lecturaActual: 0,
        periodo: ''
    };

    constructor(private readonly historialConsumoService: HistorialConsumoService) {}

    ngOnInit(): void { this.cargarHistoriales(); }

    cargarHistoriales(): void {
        this.cargando = true;
        this.historialConsumoService.listar().subscribe({
            next: (data) => { this.consumos = data; this.cargando = false; },
            error: () => { this.error = 'No se pudo cargar el historial de consumos'; this.cargando = false; }
        });
    }

    guardar(): void {
        this.error = '';

        if (!this.nuevoConsumo.idMedidor || !this.nuevoConsumo.periodo) {
            this.error = 'Complete los campos obligatorios';
            return;
        }

        const payload: HistorialConsumo = {
            idMedidor: this.nuevoConsumo.idMedidor,
            lecturaActual: this.nuevoConsumo.lecturaActual ?? 0,
            periodo: this.nuevoConsumo.periodo
        } as HistorialConsumo;

        this.historialConsumoService.crear(payload).subscribe({
            next: () => {
                this.mensaje = 'Historial registrado correctamente';
                this.nuevoConsumo = { idMedidor: 0, lecturaActual: 0, periodo: '' };
                this.cargarHistoriales();
            },
            error: () => {
                this.error = 'Error al registrar en el historial';
            }
        });
    }

    eliminar(id: number | undefined): void {
        if (!id || !confirm('¿Eliminar este registro del historial?')) return;
        this.historialConsumoService.eliminar(id).subscribe({
            next: () => { this.mensaje = 'Registro de historial eliminado'; this.cargarHistoriales(); }
        });
    }
}