export interface Financiacion {
    id_finan?: number; // Coincide exactamente con tu entidad de Spring Boot
    concepto: string;
    numero_cuotas: number; // Coincide con tu controlador de Java
}