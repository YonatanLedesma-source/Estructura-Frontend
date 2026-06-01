export interface Presidente {
    idPresidente?: number;
    nombre: string;
    apellido: string;
    cedula: string;
    periodoGestion: string; // Ej: "2024-2026"
    correo: string;
    firmaDigital?: string; // Para aprobación de documentos
}