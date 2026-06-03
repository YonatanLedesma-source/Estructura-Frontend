import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../Environments/environments';
import { HistorialConsumo } from '../Models/historialConsumo.model';

@Injectable({ providedIn: 'root' })
export class HistorialConsumoService {
    // La URL apunta a tu controlador de historial de consumos en Spring Boot (singular)
    private readonly url = `${environment.apiUrl}/historialConsumo`;

    constructor(private readonly http: HttpClient) {}

    // Lista todos los registros del historial de consumo (mapeados desde el backend)
    listar(): Observable<HistorialConsumo[]> {
        return this.http.get<any[]>(this.url).pipe(
            map(items => items.map(item => this.mapToModel(item)))
        );
    }

    // Busca un registro de historial específico por ID
    obtenerPorId(id: number): Observable<HistorialConsumo> {
        return this.http.get<any>(`${this.url}/${id}`).pipe(
            map(item => this.mapToModel(item))
        );
    }

    // Actualizar un registro de historial existente
    actualizar(id: number, historial: HistorialConsumo): Observable<any> {
        const payload = this.mapToBackend(historial);
        return this.http.put(`${this.url}/${id}`, payload);
    }

    // Crear un nuevo registro en el historial (persistente)
    crear(historial: HistorialConsumo): Observable<any> {
        const payload = this.mapToBackend(historial);
        return this.http.post(this.url, payload);
    }

    // Eliminar un registro del historial
    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.url}/${id}`);
    }

    // Helper para mapear del Backend (Java) al Frontend (Model)
    private mapToModel(item: any): HistorialConsumo {
        return {
            idConsumo: item.id_hiscon,
            idMedidor: item.cliente ? (item.cliente.numeroMedidor || item.cliente.id_cli) : 0,
            lecturaActual: item.consumoM3 || 0,
            periodo: item.periodo || '',
            metrosConsumidos: item.consumoM3 || 0,
            valorTotal: item.costo || 0,
            // Guardamos el objeto cliente completo para poder filtrar por ID de cliente en el admin dashboard
            cliente: item.cliente
        } as any;
    }

    // Helper para mapear del Frontend (Model) al Backend (Java)
    private mapToBackend(model: any): any {
        return {
            id_hiscon: model.idConsumo,
            periodo: model.periodo,
            consumoM3: model.metrosConsumidos || model.lecturaActual || 0,
            costo: model.valorTotal || 0,
            fechaLectura: new Date().toISOString().split('T')[0],
            cliente: model.cliente ? model.cliente : (model.id_cli ? { id_cli: model.id_cli } : null)
        };
    }
}
