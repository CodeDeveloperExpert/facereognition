# Reconocimiento Facial Frontend

Este repositorio contiene el código del frontend para una aplicación de reconocimiento facial desarrollada con Ionic y Angular. La aplicación se conecta a un backend desarrollado en Flask para manejar la autenticación y el reconocimiento facial.

## Descripción

El frontend de la aplicación de reconocimiento facial permite a los usuarios:

1. Registrarse en la aplicación.
2. Iniciar sesión mediante el reconocimiento facial.
3. Ver y actualizar su perfil.
4. Subir imágenes para su perfil.
5. Ver una lista de usuarios registrados.

## Requisitos

Para ejecutar este proyecto, necesitarás:

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)
- Ionic CLI
- Capacitor CLI
- Un backend compatible (vea la sección de Conexión con el Backend)

## Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/reconocimiento-facial-frontend.git
cd reconocimiento-facial-frontend
```

2. Instala las dependencias del proyecto:

```bash
npm install
```

3. Instala Ionic CLI y Capacitor CLI globalmente (si no los tienes instalados):

```bash
npm install -g @ionic/cli @capacitor/cli
```

4. Instala las plataformas necesarias para Capacitor (opcional, solo si deseas ejecutar en dispositivos móviles):

```bash
npm install @capacitor/android @capacitor/ios
```

## Configuración

1. Crea un archivo `src/environments/environment.ts` con la siguiente configuración:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000' // URL de tu backend
};
```

2. Configura las plataformas de Capacitor (si es necesario):

```bash
ionic build
npx cap add android
npx cap add ios
```

## Ejecución

Para ejecutar la aplicación en un navegador web:

```bash
ionic serve
```

Para ejecutar la aplicación en un dispositivo Android:

```bash
ionic build
npx cap sync
npx cap run android
```

Para ejecutar la aplicación en un dispositivo iOS:

```bash
ionic build
npx cap sync
npx cap run ios
```

## Conexión con el Backend

Este frontend está diseñado para conectarse con un backend desarrollado en Flask. Asegúrate de que el backend esté ejecutándose y que la URL configurada en `environment.ts` apunte a la dirección correcta del backend.

### Configuración del Backend

El backend debe estar configurado para:

1. Aceptar solicitudes CORS desde el frontend.
2. Tener los siguientes endpoints disponibles:
   - `POST /usuarios/validate-photo`: Para autenticar usuarios mediante reconocimiento facial.
   - `POST /usuarios`: Para registrar nuevos usuarios.
   - `PUT /usuarios/actualizar-perfil/{userId}`: Para actualizar el perfil de un usuario.
   - `POST /usuarios/photoupload/{userId}`: Para subir imágenes de perfil.
   - `GET /usuarios/listar`: Para obtener una lista de usuarios registrados.

### Configuración de CORS en el Backend

Para permitir la comunicación entre el frontend y el backend, asegúrate de que el backend tenga configurado CORS. Aquí hay un ejemplo de cómo hacerlo en Flask:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Resto de tu código Flask...
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── home/        # Página home de la aplicación
│   ├── services/     # Servicios para la lógica de negocio
│   ├── auth/         # Módulo de autenticación
│   ├── environments/ # Configuración de entornos
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app-routing.module.ts
├── assets/           # Recursos estáticos
├── environments/     # Configuración de entornos
└── theme/            # Temas y estilos globales
```

## Dependencias Principales

- `@angular/core`: Framework principal para la aplicación.
- `@ionic/angular`: Componentes y utilidades de Ionic.
- `@capacitor/core`: Integración con Capacitor para características nativas.
- `@ionic-native/camera`: Plugin para acceder a la cámara del dispositivo.
- `rxjs`: Biblioteca para programación reactiva.
- `uuid`: Para generar identificadores únicos.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
