import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Environments/environments';
import { Financiacion } from '../Models/financiacion.model';

@Injectable({ providedIn: 'root' })
export class FinanciacionService {
    // Apunta a tu @RequestMapping("/api/financiaciones")
    private readonly url = `${environment.apiUrl}/financiaciones`;

    constructor(private readonly http: HttpClient) {}

    // GET para obtener todas las financiaciones
    listar(): Observable<Financiacion[]> {
        return this.http.get<Financiacion[]>(this.url);
    }

    // GET para obtener una financiación por Id
    obtenerPorId(id: number): Observable<Financiacion> {
        return this.http.get<Financiacion>(`${this.url}/${id}`);
    }

    // GET para obtener financiacion por concepto
    obtenerPorConcepto(concepto: string): Observable<Financiacion> {
        return this.http.get<Financiacion>(`${this.url}/concepto/${concepto}`);
    }

    // GET para obtener una financiacion por número de cuotas
    obtenerPorNumeroCuotas(numeroCuotas: number): Observable<Financiacion> {
        return this.http.get<Financiacion>(`${this.url}/numero/${numeroCuotas}`);
    }

    // POST para crear una nueva financiacion
    crear(financiacion: Financiacion): Observable<Financiacion> {
        return this.http.post<Financiacion>(this.url, financiacion);
    }

    // PUT para actualizar una financiacion existente
    actualizar(id: number, financiacion: Financiacion): Observable<Financiacion> {
        return this.http.put<Financiacion>(`${this.url}/${id}`, financiacion);
    }

    // DELETE para eliminar una financiación
    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}