import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedidorService } from '../../core/Services/Medidor.service'; // Asegurate de crear este servicio
import { medidor } from '../../core/Models/medidor.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-medidor',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './Medidor.component.html',
    styleUrl: './medidor.component.scss'
})
export class MedidorComponent implements OnInit {
    cargando: boolean = false;
    error: string = ' ';
    mensaje: string = ' ';
    editandoId: number | null = null;
    medidores: medidor[] = [];
 
// Formulario reactivo igual al cliente
    readonly form = this.fb.nonNullable.group({
        serial: ['', Validators.required],
        marca: ['', Validators.required],
        estado: ['Activo', Validators.required],
        fechaInstalacion: ['', Validators.required],
        observaciones: ['']
    });

    readonly filtroSerial = this.fb.nonNullable.control('');
    constructor(
        private readonly fb: FormBuilder,
        private readonly medidorService: MedidorService
    ) {}

    ngOnInit(): void {
        this.cargarMedidores();
    }

    cargarMedidores(): void {
        this.cargando = true;
        this.error = ' ';
        this.medidorService.listar().subscribe({
            next: (data) => {
                this.medidores = data;
                this.cargando = false;
            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'No se pudo listar medidores');
                this.cargando = false;
            }
        });
    }

    buscarPorSerial(): void {
        const serial = this.filtroSerial.value.trim();
        if (!serial) {
            this.cargarMedidores();
            return;
        }
        this.cargando = true;
        this.medidorService.buscarPorSerial(serial).subscribe({
            next: (medidor) => {
                this.medidores = [medidor];
                this.cargando = false;
            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'No se encontró el medidor');
                this.medidores = [];
                this.cargando = false;
            }
        });
    }

    limpiarBusqueda(): void {
        this.filtroSerial.setValue('');
        this.cargarMedidores();
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const payload: medidor = this.form.getRawValue();

        if (this.editandoId !== null) {
            this.medidorService.actualizar(this.editandoId, payload).subscribe({
                next: () => {
                    this.mensaje = 'Medidor actualizado correctamente';
                    this.cancelarEdicion();
                    this.cargarMedidores();
                },
                error: (err: HttpErrorResponse) => {
                    this.error = this.obtenerMensajeError(err, 'error al actualizar ');
                }
            });
        } else {
            this.medidorService.crear(payload).subscribe({
                next: () => {
                    this.mensaje = 'Medidor creado correctamente';
                    this.form.reset();
                    this.cargarMedidores();
                },
                error: (err: HttpErrorResponse) => {
                    this.error = this.obtenerMensajeError(err, 'Error al crear');
                }
            });
        }
    }

    iniciarEdicion(medidor: medidor): void {
        this.editandoId = medidor.id ?? null;
        this.form.patchValue(medidor);
    }

    cancelarEdicion(): void {
        this.editandoId = null;
        this.form.reset();
    }

    eliminar(id: number | undefined): void {
        if (!id || !confirm('¿Estás seguro de eliminar este medidor?')) return;
        
        this.medidorService.eliminar(id).subscribe({
            next: () => {
                this.mensaje = 'Medidor eliminado';
                this.cargarMedidores();
            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'No se pudo eliminar');
            }
        });
    }

    private obtenerMensajeError(err: HttpErrorResponse, mensajeDefault: string): string {
        return err.error?.message || mensajeDefault;
    }

}
