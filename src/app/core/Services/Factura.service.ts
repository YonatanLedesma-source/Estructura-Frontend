import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../Environments/environments';
import { Factura } from '../Models/Factura.model';
export { Factura };

@Injectable({ providedIn: 'root' })
export class FacturaService {
    private readonly url = `${environment.apiUrl}/facturas`;

    constructor(private readonly http: HttpClient) {}

    listar(): Observable<Factura[]> {
        return this.http.get<any[]>(this.url).pipe(
            map(items => items.map(item => this.mapToModel(item)))
        );
    }

    obtenerPorId(id: number): Observable<Factura> {
        return this.http.get<any>(`${this.url}/${id}`).pipe(
            map(item => this.mapToModel(item))
        );
    }

    crear(factura: Factura): Observable<Factura> {
        const payload = this.mapToBackend(factura);
        return this.http.post<any>(this.url, payload).pipe(
            map(item => this.mapToModel(item))
        );
    }

    actualizar(id: number, factura: Factura): Observable<Factura> {
        const payload = this.mapToBackend(factura);
        return this.http.put<any>(`${this.url}/${id}`, payload).pipe(
            map(item => this.mapToModel(item))
        );
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    private mapToModel(item: any): Factura {
        return {
            id_fac: item.id_fac,
            numero: item.numero || '',
            periodo: item.periodo || '',
            fechaEmision: item.fechaEmision || null,
            estado: item.estado || 0,
            zona: item.zona || '',
            totalCuotas: item.totalCuotas || 0,
            totalPagar: item.totalPagar || 0,
            cliente: item.cliente,
            id_cli: item.cliente ? item.cliente.id_cli : null,
            historialConsumo: item.historialConsumo,
            lectura: item.lectura
        };
    }

    private mapToBackend(model: Factura): any {
        return {
            id_fac: model.id_fac,
            numero: model.numero,
            periodo: model.periodo,
            fechaEmision: model.fechaEmision,
            estado: model.estado,
            zona: model.zona,
            totalCuotas: model.totalCuotas,
            totalPagar: model.totalPagar,
            cliente: model.cliente ? model.cliente : (model.id_cli ? { id_cli: model.id_cli } : null),
            historialConsumo: model.historialConsumo,
            lectura: model.lectura
        };
    }
}
