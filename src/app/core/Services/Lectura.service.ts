import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../Environments/environments';
import { Lectura } from '../Models/lectura.model';

@Injectable({ providedIn: 'root' })
export class LecturaService {
    private url = `${environment.apiUrl}/lecturas`;

    constructor(private http: HttpClient) {}

    listar() {
        return this.http.get<Lectura[]>(this.url);
    }

    crear(lectura: Lectura) {
        return this.http.post<Lectura>(this.url, lectura);
    }
    
    // Filtro útil para el Presidente
    buscarPorMedidor(idMedidor: number) {
        return this.http.get<Lectura[]>(`${this.url}/medidor/${idMedidor}`);
    }
}