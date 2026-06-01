export interface Lectura {
    idLectura?: number;
    valorLectura: number;
    fechaToma: Date;
    observaciones: string;
    idMedidor: number; // Para saber de qué casa es la lectura
    idOperador: number; // Para saber qué fontanero la tomó
}
