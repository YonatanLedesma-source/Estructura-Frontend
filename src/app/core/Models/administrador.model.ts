export interface Administrador {
    idAdministrador?: number; // O idUsuario, según tu base de datos
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    correo: string;
    tel?: string;
    email?: string;
    rol: string; // Aquí siempre será 'ADMINISTRADOR'
    estado?: string; // Por ejemplo: 'Activo' o 'Inactivo'
    fecha_creacion?: Date; // Fecha de creación del administrador
}