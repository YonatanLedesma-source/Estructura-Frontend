import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../core/Services/Token.service';
import { ClienteService } from '../../core/Services/Cliente.service';
import { FacturaService, Factura } from '../../core/Services/Factura.service';
import { Cliente } from '../../core/Models/Cliente.model';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-panel-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './panel-cliente.component.html',
  styleUrls: ['./panel-cliente.component.scss']
})
export class PanelClienteComponent implements OnInit {
  cliente: Cliente | null = null;
  cargando = true;
  error = '';
  facturas: Factura[] = [];

  constructor(
    private tokenService: TokenService,
    private clienteService: ClienteService,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    this.cargarDatosCliente();
  }

  cargarDatosCliente(): void {
    const identificador = this.tokenService.getUserEmail(); // Extrae la cédula o correo del JWT
    if (!identificador) {
      this.error = 'No se encontró la identidad del usuario logueado.';
      this.cargando = false;
      return;
    }

    this.cargando = true;
    this.clienteService.buscarporIdCedula(identificador).subscribe({
      next: (data) => {
        this.cliente = data;
        this.cargando = false;
        if (this.cliente && (this.cliente.id_cli || this.cliente.id)) {
          this.cargarFacturasCliente(Number(this.cliente.id_cli || this.cliente.id || 0));
        }
      },
      error: (err) => {
        // Fallback: Si no lo encuentra por cédula directamente (por ejemplo si el token devolvió el email)
        this.clienteService.listar().subscribe({
          next: (lista) => {
            const encontrado = lista.find(c => c.email === identificador || c.cedula === identificador);
            if (encontrado) {
              this.cliente = encontrado;
              if (this.cliente && (this.cliente.id_cli || this.cliente.id)) {
                this.cargarFacturasCliente(Number(this.cliente.id_cli || this.cliente.id || 0));
              }
            } else {
              this.error = 'No se encontró un cliente asociado a tu cuenta en la base de datos.';
            }
            this.cargando = false;
          },
          error: () => {
            this.error = 'Error de conexión al cargar tus datos de cliente.';
            this.cargando = false;
          }
        });
      }
    });
  }

  cargarFacturasCliente(idCli: number): void {
    this.facturaService.listar().subscribe({
      next: (data) => {
        this.facturas = data.filter(f => {
          const fId = f.cliente?.id_cli || f.id_cli || (f.cliente as any)?.id;
          return fId === idCli;
        });
      }
    });
  }

  descargarPDF(factura: Factura): void {
    if (!this.cliente) return;
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Colores institucionales
    const navy = [0, 26, 51]; // #001a33
    const blue = [0, 168, 232]; // #00a8e8
    const gray = [100, 116, 139]; // Slate 500

    // Encabezado principal (Navy Background)
    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(0, 0, 210, 45, 'F');

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('PUREZA RURAL', 15, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Acueducto Veredal - Suministro Hídrico', 15, 27);
    doc.text('Contacto: contacto@purezarural.com | Nit: 800.123.456-9', 15, 33);

    // Información de Factura (White on navy header)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('FACTURA DE VENTA', 150, 18);
    doc.setFontSize(16);
    doc.text(factura.numero, 150, 27);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Periodo: ${factura.periodo}`, 150, 34);
    doc.text(`Emisión: ${factura.fechaEmision}`, 150, 39);

    // Detalles del Suscriptor (Sección 1)
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.rect(15, 55, 180, 35, 'F');
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.rect(15, 55, 180, 35, 'D');

    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('INFORMACIÓN DEL SUSCRIPTOR', 20, 62);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text(`Nombre: ${this.cliente.nombre}`, 20, 70);
    doc.text(`Cédula: ${this.cliente.cedula}`, 20, 76);
    doc.text(`Dirección: ${this.cliente.direccion || 'Veredal'}`, 20, 82);

    doc.text(`Número de Medidor: ${this.cliente.numeroMedidor || 'Sin Asignar'}`, 110, 70);
    doc.text(`Zona de Servicio: ${factura.zona || 'Principal'}`, 110, 76);
    doc.text(`Estado del Servicio: ${this.cliente.estado ? 'Activo' : 'Suspendido'}`, 110, 82);

    // Consumo y Medición (Sección 2)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text('CONSUMO Y MEDICIÓN DEL PERIODO', 15, 105);

    // Tabla de Mediciones
    // Encabezado Tabla
    doc.setFillColor(0, 51, 102); // Medium Blue
    doc.rect(15, 110, 180, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Lectura Anterior', 20, 115);
    doc.text('Lectura Nueva', 70, 115);
    doc.text('Consumo (m³)', 120, 115);
    doc.text('Costo por m³', 160, 115);

    // Valores Tabla
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    const hc = factura.historialConsumo;
    const lecAct = hc?.lecturaActual || this.cliente.lectura || 0;
    const m3Consumidos = hc?.metrosConsumidos || 0;
    const lecAnt = Math.max(0, lecAct - m3Consumidos);
    
    // Buscar tarifa
    const total = factura.totalPagar || 0;
    const precioMetro = m3Consumidos > 0 ? Math.round(total / m3Consumidos) : 2000;

    doc.text(`${lecAnt.toFixed(1)} m³`, 20, 124);
    doc.text(`${lecAct.toFixed(1)} m³`, 70, 124);
    doc.text(`${m3Consumidos} m³`, 120, 124);
    doc.text(`$${precioMetro.toLocaleString('es-CO')}`, 160, 124);
    doc.line(15, 128, 195, 128); // Línea divisoria

    // Liquidación (Sección 3)
    doc.setFont('helvetica', 'bold');
    doc.text('Liquidación de Pago:', 120, 140);
    doc.setFont('helvetica', 'normal');
    doc.text('Cargo por Consumo:', 120, 146);
    doc.text(`$${total.toLocaleString('es-CO')}`, 170, 146);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text('Total a Pagar:', 120, 155);
    doc.setTextColor(0, 102, 0); // Green
    doc.text(`$${total.toLocaleString('es-CO')} COP`, 170, 155);

    // Estado de la Factura (Sello)
    const pagada = factura.estado === 1;
    doc.setFillColor(pagada ? 220 : 254, pagada ? 245 : 242, pagada ? 229 : 242); // Light Green or Light Red
    doc.rect(15, 138, 50, 18, 'F');
    doc.setDrawColor(pagada ? 34 : 220, pagada ? 197 : 38, pagada ? 94 : 38);
    doc.rect(15, 138, 50, 18, 'D');

    doc.setTextColor(pagada ? 21 : 185, pagada ? 128 : 28, pagada ? 61 : 28);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(pagada ? 'PAGADA' : 'PENDIENTE', 19, 149);

    // Nota al pie
    doc.setFontSize(8);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.setFont('helvetica', 'italic');
    doc.text('Conserve esta factura para sus registros. Para reclamos sobre el consumo, contactar en un plazo máximo de 5 días hábiles.', 15, 185);
    doc.text('Pureza Rural S.A. - Cuidando cada gota de nuestra vereda.', 15, 190);

    // Guardar PDF
    doc.save(`${factura.numero}_${factura.periodo}.pdf`);
  }

  cerrarSesion(): void {
    this.tokenService.clearToken();
    window.location.reload(); // Fuerza la recarga para activar las guardas y redirigir
  }
}
