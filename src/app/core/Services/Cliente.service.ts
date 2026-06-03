import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
            this.http.get<any[]>(this.baseUrlPlural),
            this.http.get<any[]>(this.baseUrlSingular)
        ).pipe(
            map(items => items.map(c => this.mapToModel(c)))
        );
    }

    obtenerPorId(id: number): Observable<Cliente> {
        return this.tryBoth(
            this.http.get<any>(`${this.baseUrlPlural}/${id}`),
            this.http.get<any>(`${this.baseUrlSingular}/${id}`)
        ).pipe(
            map(item => this.mapToModel(item))
        );
    }

    buscarporIdCedula(cedula: string): Observable<Cliente> {
        return this.tryBoth(
            this.http.get<any>(`${this.baseUrlPlural}/cedula`, { params: { cedula } }),
            this.http.get<any>(`${this.baseUrlSingular}/cedula`, { params: { cedula } })
        ).pipe(
            map(item => this.mapToModel(item))
        );
    }

    crear(cliente: Cliente): Observable<Cliente> {
        const payload = this.mapToBackend(cliente);
        return this.tryBoth(
            this.http.post<any>(this.baseUrlPlural, payload),
            this.http.post<any>(this.baseUrlSingular, payload)
        ).pipe(
            map(item => this.mapToModel(item))
        );
    }

    actualizar(id: number, cliente: Cliente): Observable<Cliente> {
        const payload = this.mapToBackend(cliente);
        return this.tryBoth(
            this.http.put<any>(`${this.baseUrlPlural}/${id}`, payload),
            this.http.put<any>(`${this.baseUrlSingular}/${id}`, payload)
        ).pipe(
            map(item => this.mapToModel(item))
        );
    }

    eliminar(id: number): Observable<void> {
        return this.tryBoth(
            this.http.delete<void>(`${this.baseUrlPlural}/${id}`),
            this.http.delete<void>(`${this.baseUrlSingular}/${id}`)
        );
    }

    private mapToModel(item: any): Cliente {
        if (!item) return {} as Cliente;
        return {
            id: item.id_cli || item.id,
            id_cli: item.id_cli || item.id,
            nombre: item.nombre || '',
            email: item.email || '',
            telefono: item.tel || item.telefono || '',
            direccion: item.direccion || '',
            cedula: item.cedula ? item.cedula.toString() : '',
            estado: item.estado === 1 || item.estado === true,
            lectura: item.lectura !== undefined ? item.lectura : null,
            numeroMedidor: item.numeroMedidor !== undefined ? item.numeroMedidor : null
        };
    }

    private mapToBackend(model: Cliente): any {
        return {
            id_cli: model.id_cli || model.id,
            nombre: model.nombre,
            tel: model.telefono || (model as any).tel || '',
            cedula: model.cedula ? Number(model.cedula) : null,
            email: model.email,
            lectura: model.lectura || 0,
            direccion: model.direccion,
            estado: model.estado ? 1 : 0,
            password: (model as any).password || (model.cedula ? model.cedula.toString() : 'Pureza123'),
            numeroMedidor: model.numeroMedidor || null,
            rol: (model as any).rol || 'CLIENTE'
        };
    }
}


