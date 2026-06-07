import { Cliente } from './Cliente.model';
import { HistorialConsumo } from './historialConsumo.model';

export interface Factura {
  id_fac?: number;
  numero: string;
  periodo: string;
  fechaEmision?: string;
  estado: number; // 0 = Pendiente, 1 = Pagado
  zona?: string;
  totalCuotas?: number;
  totalPagar?: number;
  id_cli?: number;
  cliente?: Cliente;
  historialConsumo?: HistorialConsumo;
  lectura?: any;
}
