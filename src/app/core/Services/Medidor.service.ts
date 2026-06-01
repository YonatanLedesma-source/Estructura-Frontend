import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../Environments/environments';
import { medidor } from '../Models/medidor.model';

@Injectable({ providedIn: 'root' })
export class MedidorService {
    private url = `${environment.apiUrl}/medidor`;

    constructor(private http: HttpClient) {}

    listar() {
        return this.http.get<medidor[] | any>(this.url).pipe(
            map((data) => {
                if (Array.isArray(data)) {
                    return data;
                }
                return data?.content ?? data?.medidores ?? data ?? [];
            })
        );
    }

    buscarPorSerial(serial: string) {
        return this.http.get<medidor>(`${this.url}/serial/${serial}`);
    }

    actualizar(id: number, medidor: medidor) {
        return this.http.put(`${this.url}/${id}`, medidor);
    }

    crear(medidor: medidor) {
        return this.http.post(this.url, medidor);
    }

    eliminar(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }
}
