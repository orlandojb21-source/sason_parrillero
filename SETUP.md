# Guía de instalación — Sazón Parrillero

Esta app usa un Google Sheet como base de datos y un Google Apps Script como
API. Como esos recursos viven en tu cuenta de Google, tienes que crearlos tú
mismo siguiendo estos pasos (no se pueden crear automáticamente desde aquí).

## 1. Crear el Google Sheet y las pestañas

1. Entra a [sheets.google.com](https://sheets.google.com) y crea una hoja de
   cálculo nueva en blanco.
2. Renómbrala, por ejemplo, `SazonParrillero-DB`.
3. No hace falta crear las pestañas a mano: el paso 3 de abajo las crea por ti
   con el script `crearHojas()`.

## 2. Crear el proyecto de Apps Script

1. En el Sheet, ve a **Extensiones → Apps Script**. Se abre el editor con un
   `Code.gs` vacío.
2. En este repo, la carpeta `apps-script/` tiene estos archivos:
   `appsscript.json`, `Code.gs`, `Utils.gs`, `Setup.gs`, `Usuarios.gs`,
   `Inventario.gs`, `Ventas.gs`, `Proveedores.gs`, `Solicitudes.gs`,
   `Gastos.gs`, `Reportes.gs`.
3. En el editor de Apps Script, crea un archivo de script (**+ → Script**) por
   cada `.gs` de la lista (con el mismo nombre) y pega el contenido
   correspondiente. Borra el `Code.gs` de ejemplo que trae por defecto y
   reemplázalo por el de este repo.
4. Para el manifest: en el editor, ⚙️ **Configuración del proyecto** → activa
   "Mostrar el archivo de manifiesto `appsscript.json` en el editor". Luego
   abre `appsscript.json` en el editor y reemplaza su contenido por el de
   `apps-script/appsscript.json` de este repo. Ajusta `timeZone` a la zona
   horaria real del restaurante.

## 3. Crear las pestañas y el primer usuario admin

1. En el editor de Apps Script, en el desplegable de funciones (arriba, junto
   a "Depurar"), selecciona `crearHojas` y pulsa **▶ Ejecutar**. La primera
   vez pedirá autorización: acepta con tu cuenta de Google (verás una
   advertencia de "app no verificada" — es normal porque es un script propio;
   dale a "Avanzado" → "Ir a (nombre del proyecto), no seguro").
2. Verifica en el Sheet que aparecieron las 9 pestañas con sus encabezados.
3. Abre `Setup.gs` en el editor, cambia `EMAIL_ADMIN` por tu correo de Google
   real (el que usarás para entrar a la app) y `NOMBRE_ADMIN` por tu nombre.
4. Selecciona la función `sembrarAdmin` en el desplegable y pulsa **▶
   Ejecutar**. Esto agrega tu primera fila en la pestaña `Usuarios` con rol
   `admin`.

## 4. Configurar el token secreto

1. En el editor, ⚙️ **Configuración del proyecto** → **Propiedades del
   script** → **Agregar propiedad del script**.
2. Nombre: `TOKEN`. Valor: un texto aleatorio y largo (por ejemplo, generado
   con `openssl rand -hex 32` o cualquier generador de contraseñas). Guárdalo,
   lo necesitas en el paso 8.

## 5. Publicar el Web App

1. Botón **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. "Ejecutar como": **Yo (tu cuenta)**. "Quién tiene acceso": **Cualquier
   usuario**.
4. Implementar. Copia la URL que termina en `/exec`: es tu `APPS_SCRIPT_URL`.
5. **Importante:** si más adelante editas cualquier `.gs`, esos cambios NO se
   reflejan en la URL `/exec` hasta que hagas **Implementar → Gestionar
   implementaciones → ✏️ (editar) → Versión: Nueva → Implementar**.

## 6. Crear las credenciales de Google OAuth (para el login)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/) y crea un
   proyecto nuevo (o usa uno existente).
2. **APIs y servicios → Pantalla de consentimiento de OAuth**: tipo Externo,
   completa nombre de la app y correo de soporte. Puedes dejarla en modo
   "Prueba" (Testing) y agregar como "usuarios de prueba" los correos del
   personal — para un panel interno pequeño no hace falta verificarla ante
   Google.
3. **Credenciales → Crear credenciales → ID de cliente de OAuth** → tipo
   "Aplicación web".
4. En "URI de redirección autorizados" agrega:
   `http://localhost:3000/api/auth/callback/google`
   (agregarás la URL real de Vercel en el paso 9, después del primer deploy).
5. Copia el **ID de cliente** y el **secreto del cliente**: son
   `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.

## 7. Configurar el proyecto localmente

1. Copia `.env.local.example` a `.env.local`.
2. Rellena `AUTH_SECRET` (genera uno con `openssl rand -base64 32`),
   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `APPS_SCRIPT_URL` (paso 5) y
   `APPS_SCRIPT_TOKEN` (el mismo valor del paso 4).
3. `npm install` y `npm run dev`, abre `http://localhost:3000` y entra con la
   cuenta de Google que sembraste como admin.

## 8. Subir a GitHub

```bash
git init
git add .
git commit -m "Proyecto inicial"
gh repo create sazon-parrillero --private --source=. --push
```

(o crea el repo desde github.com y sigue las instrucciones de "push an
existing repository").

## 9. Desplegar en Vercel

1. En [vercel.com](https://vercel.com), **Add New → Project** e importa el
   repo de GitHub.
2. En "Environment Variables" agrega las mismas variables del paso 7
   (`AUTH_SECRET`, `AUTH_URL` con tu dominio real de Vercel, `GOOGLE_CLIENT_ID`,
   `GOOGLE_CLIENT_SECRET`, `APPS_SCRIPT_URL`, `APPS_SCRIPT_TOKEN`).
3. Deploy.
4. Vuelve a Google Cloud Console → tu credencial OAuth → agrega
   `https://tu-dominio.vercel.app/api/auth/callback/google` a los URI de
   redirección autorizados.

## 10. Prueba de extremo a extremo

1. Entra a la URL de producción (o a `localhost:3000`) con la cuenta admin
   sembrada.
2. Confirma que ves todas las secciones del menú.
3. Agrega al resto del personal desde **Usuarios** (nombre, email de Google,
   rol) — solo necesitan iniciar sesión con esa cuenta de Google para entrar;
   no hay contraseñas que gestionar.
4. Prueba crear un producto en Inventario, una venta, un gasto y una
   solicitud a proveedor, y revisa que los datos aparezcan en el Google
   Sheet.

## Roles

| Rol | Acceso |
|---|---|
| `admin` | Todo, incluida la gestión de Usuarios |
| `gerente` | Todo excepto Usuarios |
| `cajero` | Ventas y solo lectura de Inventario |

Puedes cambiar el rol de cualquiera desde la sección Usuarios en cualquier
momento (requiere ser admin).
