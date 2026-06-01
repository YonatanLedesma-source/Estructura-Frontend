export interface Operador {
    idOperador?: number;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    especialidad: string; // Ej: "Mantenimiento", "Lecturas", "Reparaciones"
    estado: string;       // Ej: "Activo", "En campo"
}