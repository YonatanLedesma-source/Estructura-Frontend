export interface HistorialConsumo {
    idConsumo?: number;
    idMedidor: number;
    lecturaActual: number;
    periodo: string;
    metrosConsumidos?: number;
    valorTotal?: number;
    cliente?: any;
    id_cli?: number;
    fechaLectura?: string;
}