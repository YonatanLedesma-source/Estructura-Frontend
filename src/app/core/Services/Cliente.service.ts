import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cliente} from '../Models/Cliente.model';
import { environment } from '../../../Environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
    private readonly baseUrlPlural = `${environment.apiUrl}/clientes`;
    private readonly baseUrlSingular = `${environment.apiUrl}/cliente`;

    constructor(private http: HttpClient) { }

    private tryBoth<T>(pluralRequest: Observable<T>, singularRequest: Observable<T>): Observable<T> {
        return pluralRequest.pipe(
            catchError((error) => {
                if (error.status === 404) {
                    return singularRequest;
                }
                return throwError(() => error);
            })
        );
    }

    listar(): Observable<Cliente[]> {
        return this.tryBoth(
            this.http.get<Cliente[]>(this.baseUrlPlural),
            this.http.get<Cliente[]>(this.baseUrlSingular)
        );
    }

    obtenerPorId(id: number): Observable<Cliente> {
        return this.tryBoth(
            this.http.get<Cliente>(`${this.baseUrlPlural}/${id}`),
            this.http.get<Cliente>(`${this.baseUrlSingular}/${id}`)
        );
    }

    buscarporIdCedula(cedula: string): Observable<Cliente> {
        return this.tryBoth(
            this.http.get<Cliente>(`${this.baseUrlPlural}/cedula`, { params: { cedula } }),
            this.http.get<Cliente>(`${this.baseUrlSingular}/cedula`, { params: { cedula } })
        );
    }

    crear(cliente: Cliente): Observable<Cliente> {
        return this.tryBoth(
            this.http.post<Cliente>(this.baseUrlPlural, cliente),
            this.http.post<Cliente>(this.baseUrlSingular, cliente)
        );
    }

    actualizar(id: number, cliente: Cliente): Observable<Cliente> {
        return this.tryBoth(
            this.http.put<Cliente>(`${this.baseUrlPlural}/${id}`, cliente),
            this.http.put<Cliente>(`${this.baseUrlSingular}/${id}`, cliente)
        );
    }

    eliminar(id: number): Observable<void> {
        return this.tryBoth(
            this.http.delete<void>(`${this.baseUrlPlural}/${id}`),
            this.http.delete<void>(`${this.baseUrlSingular}/${id}`)
        );
    }
}


