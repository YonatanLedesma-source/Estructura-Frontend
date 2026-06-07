import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../core/Services/Cliente.service';
import { HistorialConsumoService } from '../../core/Services/HistorialConsumo.service';
import { PagosService, Pago } from '../../core/Services/Pagos.service';
import { FinanciacionService } from '../../core/Services/Finanaciacion.service';
import { FacturaService, Factura } from '../../core/Services/Factura.service';
import { Cliente } from '../../core/Models/Cliente.model';
import { HistorialConsumo } from '../../core/Models/historialConsumo.model';
import { Financiacion } from '../../core/Models/financiacion.model';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './Administrador.component.html',
  styleUrls: ['./administrador.component.scss']
})
export class AdministradorComponent implements OnInit {
  // Control de la vista activa en el espacio de trabajo principal:
  // 'dashboard' (resumen), 'clientes' (tabla), 'formulario' (crear/editar), 'detalles' (perfil 360)
  currentView: string = 'dashboard';

  // Datos globales
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  filtroBusqueda: string = '';
  cargando: boolean = false;
  mensaje: string = '';
  error: string = '';

  // Historiales globales para métricas del dashboard
  consumosGlobales: HistorialConsumo[] = [];
  pagosGlobales: Pago[] = [];
  financiacionesGlobales: Financiacion[] = [];

  // Formulario de Clientes (Crear / Editar)
  clienteForm: FormGroup;
  editandoClienteId: number | null = null;

  // Detalles de Cliente Seleccionado
  clienteSeleccionado: Cliente | null = null;
  pestanaDetalleActiva: string = 'consumos'; 
  
  // Listados filtrados para el cliente seleccionado
  consumosCliente: HistorialConsumo[] = [];
  pagosCliente: Pago[] = [];
  financiacionesCliente: Financiacion[] = [];

  // Formularios de registro rápido para el cliente seleccionado
  lecturaForm: FormGroup;
  pagoForm: FormGroup;
  finanForm: FormGroup;

  // Facturas y formulario de creación
  facturasGlobales: Factura[] = [];
  facturaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private historialService: HistorialConsumoService,
    private pagosService: PagosService,
    private finanService: FinanciacionService,
    private facturaService: FacturaService
  ) {
    // Inicializar Formulario de Clientes
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      estado: [true],
      numeroMedidor: [null],
      lectura: [0]
    });

    // Inicializar Formularios de Detalle
    this.lecturaForm = this.fb.group({
      periodo: ['', Validators.required],
      metrosConsumidos: [0, [Validators.required, Validators.min(0)]],
      valorTotal: [0, [Validators.required, Validators.min(0)]]
    });

    this.pagoForm = this.fb.group({
      monto: [0, [Validators.required, Validators.min(1)]],
      metodoPago: ['PSE', Validators.required],
      estado: [1, Validators.required]
    });

    this.finanForm = this.fb.group({
      concepto: ['', Validators.required],
      montoTotal: [0, [Validators.required, Validators.min(1)]],
      numeroCuotas: [6, [Validators.required, Validators.min(1)]],
      cuotaMensual: [0, [Validators.required, Validators.min(1)]],
      saldoPendiente: [0, [Validators.required, Validators.min(0)]]
    });

    // Inicializar Formulario de Facturación
    this.facturaForm = this.fb.group({
      id_cli: [null, Validators.required],
      periodo: ['', Validators.required],
      lecturaAnterior: [{ value: 0, disabled: true }],
      lecturaNueva: [0, [Validators.required, Validators.min(0)]],
      precioMetro: [2000, [Validators.required, Validators.min(1)]],
      consumo: [{ value: 0, disabled: true }],
      totalPagar: [{ value: 0, disabled: true }]
    });

    this.setupFacturaCalculations();
  }

  setupFacturaCalculations() {
    this.facturaForm.get('id_cli')?.valueChanges.subscribe(idCli => {
      if (idCli) {
        const client = this.clientes.find(c => (c.id_cli || c.id) === Number(idCli));
        if (client) {
          const lecAnt = client.lectura || 0;
          this.facturaForm.patchValue({
            lecturaAnterior: lecAnt,
            lecturaNueva: lecAnt
          }, { emitEvent: true });
        }
      }
    });

    const calculate = () => {
      const lecAnt = this.facturaForm.get('lecturaAnterior')?.value || 0;
      const lecNue = this.facturaForm.get('lecturaNueva')?.value || 0;
      const precio = this.facturaForm.get('precioMetro')?.value || 2000;

      const consumo = Math.max(0, lecNue - lecAnt);
      const total = consumo * precio;

      this.facturaForm.patchValue({
        consumo: consumo,
        totalPagar: total
      }, { emitEvent: false });
    };

    this.facturaForm.get('lecturaNueva')?.valueChanges.subscribe(() => calculate());
    this.facturaForm.get('precioMetro')?.valueChanges.subscribe(() => calculate());
    this.facturaForm.get('id_cli')?.valueChanges.subscribe(() => calculate());
  }

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  // Carga inicial y actualización de todas las colecciones del sistema
  cargarDatosDashboard() {
    this.cargarClientes();
    this.cargarConsumosGlobales();
    this.cargarPagosGlobales();
    this.cargarFinanciacionesGlobales();
    this.cargarFacturas();
  }

  // --- MÉTODOS DE DATOS ---

  cargarClientes() {
    this.cargando = true;
    this.clienteService.listar().subscribe({
      next: (data) => {
        this.clientes = data.map(c => ({
          ...c,
          id: c.id_cli || c.id
        }));
        this.filtrarClientes();
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar los clientes del acueducto.';
        this.cargando = false;
      }
    });
  }

  cargarConsumosGlobales() {
    this.historialService.listar().subscribe({
      next: (data) => {
        this.consumosGlobales = data;
      }
    });
  }

  cargarPagosGlobales() {
    this.pagosService.listar().subscribe({
      next: (data) => {
        this.pagosGlobales = data;
      }
    });
  }

  cargarFinanciacionesGlobales() {
    this.finanService.listar().subscribe({
      next: (data) => {
        this.financiacionesGlobales = data;
      }
    });
  }

  cargarFacturas() {
    this.facturaService.listar().subscribe({
      next: (data) => {
        this.facturasGlobales = data;
      }
    });
  }

  filtrarClientes() {
    const query = this.filtroBusqueda.toLowerCase().trim();
    if (!query) {
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clientesFiltrados = this.clientes.filter(c =>
        c.nombre.toLowerCase().includes(query) || 
        c.cedula.toString().includes(query)
      );
    }
  }

  // --- CONTROL DE NAVEGACIÓN ---

  setView(view: string) {
    this.currentView = view;
    this.cerrarMensajes();
    if (view === 'clientes') {
      this.clienteSeleccionado = null;
      this.cargarClientes();
    } else if (view === 'dashboard') {
      this.clienteSeleccionado = null;
      this.cargarDatosDashboard();
    } else if (view === 'facturas') {
      this.clienteSeleccionado = null;
      this.cargarFacturas();
    }
  }

  // --- CRUD CLIENTES ---

  abrirCrearCliente() {
    this.editandoClienteId = null;
    this.clienteForm.reset({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      cedula: '',
      estado: true,
      numeroMedidor: null,
      lectura: 0
    });
    this.currentView = 'formulario';
    this.clienteSeleccionado = null;
  }

  abrirEditarCliente(cliente: Cliente, event?: Event) {
    if (event) event.stopPropagation(); // Evita seleccionar la fila al hacer click en editar
    
    const id = cliente.id_cli || cliente.id;
    if (!id) return;
    
    this.editandoClienteId = id;
    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      cedula: cliente.cedula,
      estado: cliente.estado,
      numeroMedidor: cliente.numeroMedidor,
      lectura: cliente.lectura || 0
    });
    this.currentView = 'formulario';
    this.clienteSeleccionado = null;
  }

  guardarCliente() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const formValue = this.clienteForm.value;
    const clientPayload: Cliente = {
      ...formValue,
      cedula: formValue.cedula.toString()
    };

    if (this.editandoClienteId !== null) {
      this.clienteService.actualizar(this.editandoClienteId, clientPayload).subscribe({
        next: () => {
          this.mensaje = 'Cliente actualizado exitosamente.';
          this.setView('clientes');
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al actualizar el cliente.';
        }
      });
    } else {
      const clientWithPwd = {
        ...clientPayload,
        password: formValue.cedula.toString()
      };
      this.clienteService.crear(clientWithPwd).subscribe({
        next: () => {
          this.mensaje = 'Cliente registrado correctamente en Pureza Rural.';
          this.setView('clientes');
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al registrar al cliente.';
        }
      });
    }
  }

  eliminarCliente(cliente: Cliente, event?: Event) {
    if (event) event.stopPropagation();
    
    const id = cliente.id_cli || cliente.id;
    if (!id) return;

    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${cliente.nombre}?`)) {
      this.clienteService.eliminar(id).subscribe({
        next: () => {
          this.mensaje = 'Cliente eliminado de la base de datos.';
          this.cargarClientes();
        },
        error: () => {
          this.error = 'No se pudo eliminar al cliente.';
        }
      });
    }
  }

  // --- EXPEDIENTE EXPUESTO 360° ---

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.pestanaDetalleActiva = 'consumos';
    this.cargarDetallesCliente();
    this.currentView = 'detalles';
  }

  cargarDetallesCliente() {
    const idCli = this.clienteSeleccionado?.id_cli || this.clienteSeleccionado?.id;
    if (!idCli) return;

    this.cargando = true;
    
    // Cargar consumos
    this.historialService.listar().subscribe({
      next: (consumos) => {
        this.consumosCliente = consumos.filter(item => {
          const cId = item.cliente?.id_cli || item.cliente?.id;
          return cId === idCli;
        });
      }
    });

    // Cargar pagos
    this.pagosService.listar().subscribe({
      next: (pagos) => {
        this.pagosCliente = pagos.filter(item => {
          const cId = item.cliente?.id_cli || item.cliente?.id;
          return cId === idCli;
        });
      }
    });

    // Cargar financiaciones
    this.finanService.listar().subscribe({
      next: (finans) => {
        this.financiacionesCliente = finans.filter(item => {
          const cId = (item as any).cliente?.id_cli || (item as any).cliente?.id || (item as any).id_cli;
          return cId === idCli;
        });
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  // --- SUB-FORMULARIOS (Lecturas, Pagos, Financiaciones) ---

  agregarLectura() {
    if (this.lecturaForm.invalid || !this.clienteSeleccionado) return;
    
    const val = this.lecturaForm.value;
    const payload: HistorialConsumo = {
      periodo: val.periodo,
      metrosConsumidos: val.metrosConsumidos,
      valorTotal: val.valorTotal,
      lecturaActual: val.metrosConsumidos,
      idMedidor: this.clienteSeleccionado.numeroMedidor || 0,
      cliente: { id_cli: this.clienteSeleccionado.id_cli || this.clienteSeleccionado.id }
    } as any;

    this.historialService.crear(payload).subscribe({
      next: () => {
        this.mensaje = 'Lectura de consumo registrada y guardada.';
        this.lecturaForm.reset({ periodo: '', metrosConsumidos: 0, valorTotal: 0 });
        this.cargarDetallesCliente();
      },
      error: () => {
        this.error = 'Error al registrar la lectura.';
      }
    });
  }

  agregarPago() {
    if (this.pagoForm.invalid || !this.clienteSeleccionado) return;

    const val = this.pagoForm.value;
    const payload: Pago = {
      monto: val.monto,
      metodoPago: val.metodoPago,
      estado: val.estado,
      id_cli: this.clienteSeleccionado.id_cli || this.clienteSeleccionado.id,
      cliente: { id_cli: this.clienteSeleccionado.id_cli || this.clienteSeleccionado.id }
    };

    this.pagosService.crear(payload).subscribe({
      next: () => {
        this.mensaje = 'Pago cobrado y registrado en caja.';
        this.pagoForm.reset({ monto: 0, metodoPago: 'PSE', estado: 1 });
        this.cargarDetallesCliente();
      },
      error: () => {
        this.error = 'Error al registrar el pago.';
      }
    });
  }

  agregarFinanciacion() {
    if (this.finanForm.invalid || !this.clienteSeleccionado) return;

    const val = this.finanForm.value;
    const payload: Financiacion = {
      concepto: val.concepto,
      numero_cuotas: val.numeroCuotas,
      montoTotal: val.montoTotal,
      cuotaMensual: val.cuotaMensual,
      saldoPendiente: val.saldoPendiente,
      cliente: { id_cli: this.clienteSeleccionado.id_cli || this.clienteSeleccionado.id },
      administrador: { id_adm: 1 },
      presidente: { id_presi: 1 }
    } as any;

    this.finanService.crear(payload).subscribe({
      next: () => {
        this.mensaje = 'Acuerdo de financiación registrado exitosamente.';
        this.finanForm.reset({ concepto: '', montoTotal: 0, numeroCuotas: 6, cuotaMensual: 0, saldoPendiente: 0 });
        this.cargarDetallesCliente();
      },
      error: () => {
        this.error = 'Error al registrar la financiación.';
      }
    });
  }

  // --- HELPERS MAPPING PARA EVITAR EXPRESIONES COMPLEJAS EN LA PLANTILLA ---

  getNumeroCuotas(item: any): number {
    return item.numero_cuotas || item.numeroCuotas || 0;
  }

  getCuotaMensual(item: any): number {
    return item.cuotaMensual || item.cuota_mensual || 0;
  }

  getSaldoPendiente(item: any): number {
    if (item.saldoPendiente !== undefined) return item.saldoPendiente;
    if (item.saldo_pendiente !== undefined) return item.saldo_pendiente;
    return item.montoTotal || 0;
  }

  // --- CÁLCULO DE MÉTRICAS GLOBALES DEL DASHBOARD ---

  getConsumoGlobal(): number {
    return this.consumosGlobales.reduce((acc, c) => acc + (c.metrosConsumidos || 0), 0);
  }

  getRecaudacionGlobal(): number {
    return this.pagosGlobales.filter(p => p.estado === 1).reduce((acc, p) => acc + (p.monto || 0), 0);
  }

  getFinanciacionesPendientes(): number {
    return this.financiacionesGlobales.reduce((acc, f) => acc + this.getSaldoPendiente(f), 0);
  }

  abrirCrearFactura() {
    this.facturaForm.reset({
      id_cli: null,
      periodo: new Date().toISOString().substring(0, 7), // "YYYY-MM"
      lecturaAnterior: 0,
      lecturaNueva: 0,
      precioMetro: 2000,
      consumo: 0,
      totalPagar: 0
    });
    this.currentView = 'crear-factura';
    this.clienteSeleccionado = null;
    this.cerrarMensajes();
  }

  guardarFactura() {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      return;
    }

    const val = this.facturaForm.getRawValue();
    const idCli = Number(val.id_cli);
    const client = this.clientes.find(c => (c.id_cli || c.id) === idCli);
    if (!client) {
      this.error = 'Cliente no encontrado.';
      return;
    }

    const lecAnt = val.lecturaAnterior || 0;
    const lecNue = val.lecturaNueva || 0;
    if (lecNue < lecAnt) {
      this.error = 'La nueva lectura no puede ser inferior a la lectura anterior (' + lecAnt + ' m³).';
      return;
    }

    this.cargando = true;
    this.cerrarMensajes();

    const consumo = lecNue - lecAnt;
    const total = val.totalPagar;

    // 1. Crear HistorialConsumo
    const consumoPayload: HistorialConsumo = {
      periodo: val.periodo,
      metrosConsumidos: consumo,
      valorTotal: total,
      lecturaActual: lecNue,
      idMedidor: client.numeroMedidor || 0,
      cliente: { id_cli: idCli }
    } as any;

    this.historialService.crear(consumoPayload).subscribe({
      next: (hcSaved: any) => {
        // 2. Crear Factura
        const numFactura = 'FAC-' + val.periodo.replace('-', '') + '-' + Math.floor(1000 + Math.random() * 9000);
        
        const facturaPayload: Factura = {
          numero: numFactura,
          periodo: val.periodo,
          fechaEmision: new Date().toISOString().split('T')[0],
          estado: 0, // 0 = Pendiente
          zona: client.direccion || 'Veredal',
          totalCuotas: 0,
          totalPagar: total,
          id_cli: idCli,
          cliente: { id_cli: idCli },
          historialConsumo: hcSaved
        } as any;

        this.facturaService.crear(facturaPayload).subscribe({
          next: () => {
            // 3. Actualizar Cliente (Lectura acumulada actual)
            const updatedClient: Cliente = {
              ...client,
              lectura: lecNue
            };
            this.clienteService.actualizar(idCli, updatedClient).subscribe({
              next: () => {
                this.mensaje = 'Factura creada exitosamente y lectura de cliente actualizada.';
                this.cargando = false;
                this.setView('facturas');
              },
              error: () => {
                this.error = 'Factura creada, pero no se pudo actualizar la lectura actual del cliente.';
                this.cargando = false;
                this.setView('facturas');
              }
            });
          },
          error: () => {
            this.error = 'Error al registrar la factura en la base de datos.';
            this.cargando = false;
          }
        });
      },
      error: () => {
        this.error = 'Error al registrar el historial de consumo.';
        this.cargando = false;
      }
    });
  }

  eliminarFactura(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Estás seguro de que deseas eliminar permanentemente esta factura?')) {
      this.facturaService.eliminar(id).subscribe({
        next: () => {
          this.mensaje = 'Factura eliminada de la base de datos.';
          this.cargarFacturas();
        },
        error: () => {
          this.error = 'No se pudo eliminar la factura.';
        }
      });
    }
  }

  cerrarMensajes() {
    this.mensaje = '';
    this.error = '';
  }
}