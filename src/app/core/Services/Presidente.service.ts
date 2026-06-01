import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../Environments/environments';
import { Presidente } from '../Models/presidente.model';

@Injectable({ providedIn: 'root' })
export class PresidenteService {
    private url = `${environment.apiUrl}/presidentes`;

    constructor(private http: HttpClient) {}

    listar() {
        return this.http.get<Presidente[]>(this.url);
    }

    crear(presidente: Presidente) {
        return this.http.post<Presidente>(this.url, presidente);
    }

    // Método especial para reportes que solo ve el presidente
    obtenerReporteMensual() {
        return this.http.get(`${this.url}/reportes-financieros`);
    }
}