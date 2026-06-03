import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../core/Services/Token.service';
import { ClienteService } from '../../core/Services/Cliente.service';
import { Cliente } from '../../core/Models/Cliente.model';

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

  constructor(
    private tokenService: TokenService,
    private clienteService: ClienteService
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
      },
      error: (err) => {
        // Fallback: Si no lo encuentra por cédula directamente (por ejemplo si el token devolvió el email)
        this.clienteService.listar().subscribe({
          next: (lista) => {
            const encontrado = lista.find(c => c.email === identificador || c.cedula === identificador);
            if (encontrado) {
              this.cliente = encontrado;
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

  cerrarSesion(): void {
    this.tokenService.clearToken();
    window.location.reload(); // Fuerza la recarga para activar las guardas y redirigir
  }
}
