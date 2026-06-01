Capa Frontend (cliente-front):

Framework principal: Angular v17.3.0 (Estructura SPA reactiva).
Lenguaje: TypeScript v5.4.2 (Tipado seguro y autocompletado).
Estilos y Maquetación: Bootstrap v5.3.8 y Bootstrap Icons v1.13.1 (Diseño adaptativo, móvil primero).
Manejo de Red: HttpClient enrutado localmente mediante un Proxy Angular para peticiones seguras.



Módulos y Enrutamiento del Frontend (cliente-front)
El frontend de Angular 17 se organiza en módulos lógicos definidos en sus rutas dinámicas (src/app/app.routes.ts):

Home / Dashboard (home/): Vista de bienvenida y estadísticas clave del estado del acueducto comunitario.

Gestión de Clientes (Cliente/): Control del padrón de usuarios del acueducto, asociando datos de contacto y números de medidores de agua.

Gestión de Medidores (medidor/): Administración del inventario de medidores físicos instalados, sus estados y seriales únicos.

Lecturas de Agua (lectura/): Registro mensual del consumo de metros cúbicos de agua de cada suscriptor.

Historial de Consumo (historialconsumo/): Módulo para que los usuarios y operadores consulten gráficos e históricos de consumos anteriores.

Financiación y Pagos (financiacion/ y pagos/): Módulos que manejan convenios de pago para clientes con saldos vencidos y emisión de facturación mensual.

Autenticación (auth/): Gestiona los flujos de inicio de sesión (login), registro y restablecimiento de contraseña para administradores, operadores, presidentes y clientes comunes.

//OBJETIVO DEL PROYECTO//

Proporcionar a las cooperativas y juntas administradoras de acueductos comunitarios una herramienta web moderna, intuitiva y modular. La plataforma permite la administración eficiente del padrón de usuarios (Clientes), inventariado de medidores, captura mensual de lecturas de consumo, historial y convenios de financiación de pagos. Todo operado bajo un esquema de roles técnicos definidos (ADMINISTRADOR, OPERADOR, PRESIDENTE, CLIENTE).

//CONFIGURACIÓN E INICIO DEL FRONTEND (Angular 17)//
Instalación de paquetes de Angular: En la raíz de la carpeta cliente-front, abrimos una terminal y descargamos las dependencias node:

npm install

//PROXY DE DESARROLLO LOCAL// 
El proyecto utiliza un archivo de configuración de proxy (proxy.conf.json) para reenviar las peticiones al puerto 8081 del backend de forma automática:

{
  "/api": {
    "target": "http://localhost:8081",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}

//EJECUTAR EL FRONTEND//
Desplegamos el servidor web de desarrollo de Angular ejecutando el script configurado en el package.json:


ng serve o npm start

*Este comando inicia el servidor*


//ACCESO AL SISTEMA//
Abrimos nuestro navegador de preferencia en la siguiente dirección:
'http://localhost:4200'


//REQUISITOS DEL DISPOSITIVO E INFRAESTRUCTURA//
Para poder compilar y desplegar la aplicación completa a nivel local, el dispositivo debe cumplir con los siguientes requisitos del sistema:

*Requisitos de Hardware:*

Procesador: Intel Core i3 o AMD Ryzen 3 (o superior).
Memoria RAM: Mínimo 8 GB de RAM (12 GB o más altamente recomendados para correr base de datos, backend Java y compilación de Angular en simultáneo).
Espacio libre en disco: 4 GB de espacio disponible (SSD preferible).

*Requisitos de Software:*

Java Development Kit (JDK): Versión 17 instalada y configurada en las variables de entorno (JAVA_HOME).
Node.js: Versión LTS actual (mínimo v18 o v20).
Angular CLI: Instalación global mediante npm install -g @angular/cli@17.
Base de datos relacional: Servidor MySQL activo (puerto predeterminado 3306).
IDE recomendado: Visual Studio Code o IntelliJ IDEA