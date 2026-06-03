import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../Environments/environments';

export interface Pago {
  id_pago?: number;
  fechaMonto?: string;
  metodoPago: string;
  monto: number;
  estado: number; // 0 = Pendiente, 1 = Pagado
  fechaPago?: string;
  fechaVencimiento?: string;
  id_cli?: number;
  cliente?: any;
}

@Injectable({ providedIn: 'root' })
export class PagosService {
    private readonly url = `${environment.apiUrl}/pagos`;

    constructor(private readonly http: HttpClient) {}

    listar(): Observable<Pago[]> {
        return this.http.get<any[]>(this.url).pipe(
            map(items => items.map(item => this.mapToModel(item)))
        );
    }

    obtenerPorId(id: number): Observable<Pago> {
        return this.http.get<any>(`${this.url}/${id}`).pipe(
            map(item => this.mapToModel(item))
        );
    }

    crear(pago: Pago): Observable<Pago> {
        const payload = this.mapToBackend(pago);
        return this.http.post<any>(this.url, payload).pipe(
            map(item => this.mapToModel(item))
        );
    }

    actualizar(id: number, pago: Pago): Observable<Pago> {
        const payload = this.mapToBackend(pago);
        return this.http.put<any>(`${this.url}/${id}`, payload).pipe(
            map(item => this.mapToModel(item))
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    private mapToModel(item: any): Pago {
        return {
            id_pago: item.id_pago,
            fechaMonto: item.fechaMonto || null,
            metodoPago: item.metodoPago || '',
            monto: item.monto || 0,
            estado: item.estado || 0,
            fechaPago: item.fechaPago || null,
            fechaVencimiento: item.fechaVencimiento || null,
            cliente: item.cliente,
            id_cli: item.cliente ? item.cliente.id_cli : null
        };
    }

    private mapToBackend(model: Pago): any {
        return {
            id_pago: model.id_pago,
            fechaMonto: model.fechaMonto || new Date().toISOString().split('T')[0],
            metodoPago: model.metodoPago,
            monto: model.monto,
            estado: model.estado,
            fechaPago: model.fechaPago || new Date().toISOString().split('T')[0],
            fechaVencimiento: model.fechaVencimiento || new Date().toISOString().split('T')[0],
            cliente: model.cliente ? model.cliente : (model.id_cli ? { id_cli: model.id_cli } : null),
            // Default relations to prevent Java nullable=false DB errors
            administrador: { id_adm: 1 },
            presidente: { id_presi: 1 },
            operador: { id_oper: 1 }
        };
    }
}
