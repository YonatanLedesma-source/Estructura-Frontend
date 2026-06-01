import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Environments/environments';
import { HistorialConsumo } from '../Models/historialConsumo.model';

@Injectable({ providedIn: 'root' })
export class HistorialConsumoService {
    // La URL apunta a tu controlador de historial de consumos en Spring Boot
    private readonly url = `${environment.apiUrl}/historial-consumos`;

    constructor(private readonly http: HttpClient) {}

    // Lista todos los registros del historial de consumo
    listar(): Observable<HistorialConsumo[]> {
        return this.http.get<HistorialConsumo[]>(this.url);
    }

    // Busca un registro de historial específico por ID
    obtenerPorId(id: number): Observable<HistorialConsumo> {
        return this.http.get<HistorialConsumo>(`${this.url}/${id}`);
    }

    // Actualizar un registro de historial existente
    actualizar(id: number, historial: HistorialConsumo): Observable<any> {
        return this.http.put(`${this.url}/${id}`, historial);
    }

    // Crear un nuevo registro en el historial (persistente)
    crear(historial: HistorialConsumo): Observable<any> {
        return this.http.post(this.url, historial);
    }

    // Eliminar un registro del historial
    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.url}/${id}`);
    }
}
