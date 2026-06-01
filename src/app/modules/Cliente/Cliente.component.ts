import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../core/Services/Cliente.service';
import { Cliente } from '../../core/Models/Cliente.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-cliente',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './Cliente.component.html',
    styleUrl: './Cliente.component.scss'
})

export class ClienteComponent
implements OnInit {
    cargando: boolean = false;
    error: string = ' ';
    mensaje: string = ' ';
    editandoId: number | null = null;
    clientes: Cliente[] = [];

    readonly form = this.fb.nonNullable.group({
        nombre: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefono: ['', Validators.required],
        direccion: ['', Validators.required],
        cedula: ['', Validators.required],
        estado: [true],
        lectura: [null as number | null],
        numeroMedidor: [null as number | null]
    });

    readonly filtroCedula = this.fb.nonNullable.control('');
    constructor(
        private readonly fb: FormBuilder,
        private readonly clienteService: ClienteService
    ) {}

    ngOnInit(): void {
        this.cargando = true;
        this.error = ' ';

        this.clienteService.listar().subscribe({
            next: (data) => {
                this.clientes = data;
                this.cargando = false;
            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'No se pudo listar clientes');
                this.cargando = false;
            }
        });
    }

    buscarPorCedula(): void {
        const cedula = this.filtroCedula.value.trim();
        if (!cedula) {
            this.cargarClientes();
            return;
        }
        this.cargando = true;
        this.error = ' ';
        this.mensaje = ' ';

        this.clienteService.buscarporIdCedula(cedula).subscribe({
            next: (cliente) => {
                this.clientes = [cliente];
                this.cargando = false;
            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'No se encontro cliente por cédula');
                this.clientes = [];
                this.cargando = false;
            }
        });
    }

    limpiarBusqueda(): void {
        this.filtroCedula.setValue('');
        this.cargarClientes();
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.error = '';
        this.mensaje = '';
        const payload: Cliente = this.form.getRawValue();

        if (this.editandoId !== null) {
            this.clienteService.actualizar(this.editandoId, payload).subscribe({
                next: () => {
                    this.mensaje = 'Cliente actualizado exitosamente';
                    this.cancelarEdicion();
                    this.cargarClientes();
                },
                error: (err: HttpErrorResponse) => {
                    this.error = this.obtenerMensajeError(err, 'No se pudo actualizar cliente');
                }
            });
            return;
        }

        this.clienteService.crear(payload).subscribe({
            next: () => {
                this.mensaje = 'cliente creado correctamente';
                this.form.reset({
                    nombre: '',
                    cedula: '',
                    email: '',
                    telefono: '',
                    direccion: '',
                    estado: true,
                    lectura: null,
                    numeroMedidor: null
                });
                this.cargarClientes();

            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'No se pudo crear cliente');
            }
        });
    }
    
    iniciarEdicion(cliente: Cliente): void {
        this.editandoId = cliente.id ?? null;
        this.form.patchValue({
            nombre: cliente.nombre,
            email: cliente.email,
            telefono: cliente.telefono,
            direccion: cliente.direccion,
            cedula: cliente.cedula,
            estado: cliente.estado,
            lectura: cliente.lectura,
            numeroMedidor: cliente.numeroMedidor
        });
    }

    cancelarEdicion(): void {
        this.editandoId = null;
        this.form.reset({
            nombre: '',
            email: '',
            telefono: '',
            direccion: '',
            cedula: '',
            estado: true,
            lectura: null,
            numeroMedidor: null
        });
    }

    eliminar(id: number | undefined): void {
        if (id === undefined) {
            return;
        }

        this.error = '';
        this.mensaje = '';

        this.clienteService.eliminar(id).subscribe({
            next: () => {
                this.mensaje = 'Cliente eliminado correctamente';
                this.cargarClientes();
            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'No se pudo eliminar cliente');
            }
        });
    }

    private obtenerMensajeError(err: HttpErrorResponse, mensajeDefault: string): string {
        return err.error?.message || mensajeDefault;
    }

    private cargarClientes(): void {
        this.cargando = true;
        this.error = ' ';
        this.clienteService.listar().subscribe({
            next: (data) => {
                this.clientes = data;
                this.cargando = false;
            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'No se pudo listar clientes');
                this.cargando = false;
            }
        });
    }
}




    
    
