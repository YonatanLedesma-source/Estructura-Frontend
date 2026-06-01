export interface Cliente {
  id?: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  cedula: string;
  estado: boolean;
  lectura: number | null;
  numeroMedidor: number | null;
}