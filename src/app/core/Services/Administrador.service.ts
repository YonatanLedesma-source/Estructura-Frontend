import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../Environments/environments';
import { Administrador } from '../Models/administrador.model';

@Injectable({ providedIn: 'root' })
export class AdministradorService {
    
    private url = `${environment.apiUrl}/administradores`;

    constructor(private http: HttpClient) {}

    getAdministradores() {
        return this.http.get<Administrador[]>(this.url);
    }

    postAdministrador(admin: Administrador) {
        return this.http.post<Administrador>(this.url, admin);
    }

    deleteAdministrador(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }
}