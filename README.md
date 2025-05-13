# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Módulo de Gestión de Contenido

Este módulo permite a los administradores gestionar el contenido multimedia (imágenes, videos, historias, testimonios) de la aplicación Akademia Kupula.

## Características

- Gestión de diferentes tipos de contenido:
  - Imágenes
  - Videos
  - Historias
  - Testimonios
  - Banners
  - Hero (imágenes principales)

- Organización por secciones:
  - Inicio
  - Sobre Nosotros
  - Cursos
  - Contacto
  - Testimonios
  - Perfil
  - Detalle de Curso

- Funcionalidades:
  - Subida de archivos con vista previa
  - Activación/desactivación de contenido
  - Ordenamiento personalizado
  - Metadatos específicos según el tipo de contenido

## Instalación

### Opción 1: Instalación automática (recomendada)

1. Copia todos los archivos de este directorio al directorio raíz del proyecto Flask.

2. Ejecuta el script maestro:
   ```
   python setup_content_module_master.py
   ```

3. Reinicia el servidor Flask:
   ```
   python run.py
   ```

### Opción 2: Instalación manual

1. Copia los archivos de modelos y rutas:
   - `backend_content_models.py` → `app/models/content_models.py`
   - `backend_content_routes.py` → `app/routes/content_routes.py`

2. Crea el directorio de uploads:
   ```
   mkdir -p app/static/uploads
   ```

3. Edita el archivo `app/__init__.py` para registrar el blueprint:
   ```python
   # Registrar blueprint de contenido
   from app.routes.content_routes import content_bp
   app.register_blueprint(content_bp, url_prefix='/api/content')
   ```

4. Crea la tabla de contenido:
   ```
   python create_content_table.py
   ```

5. (Opcional) Añade contenido de ejemplo:
   ```
   python add_sample_content.py
   ```

6. Reinicia el servidor Flask:
   ```
   python run.py
   ```

## Uso

Una vez instalado, puedes acceder a la gestión de contenido desde el panel de administración:

1. Inicia sesión como administrador
2. Navega a `/admin/content`
3. Desde allí podrás:
   - Ver todo el contenido existente
   - Filtrar por tipo y sección
   - Añadir nuevo contenido
   - Editar contenido existente
   - Eliminar contenido

## Estructura de archivos

- `setup_content_module_master.py`: Script maestro para la instalación
- `setup_content_module.py`: Copia archivos y crea directorio de uploads
- `update_init.py`: Actualiza el archivo __init__.py
- `create_content_table.py`: Crea la tabla de contenido
- `add_sample_content.py`: Añade contenido de ejemplo
- `backend_content_models.py`: Modelos para la base de datos
- `backend_content_routes.py`: Endpoints de la API

## Endpoints de la API

- `GET /api/content`: Obtiene contenido filtrado por sección y/o tipo
- `GET /api/content/:id`: Obtiene un contenido específico
- `POST /api/content`: Crea nuevo contenido (requiere autenticación de administrador)
- `PUT /api/content/:id`: Actualiza contenido existente (requiere autenticación de administrador)
- `DELETE /api/content/:id`: Elimina contenido (requiere autenticación de administrador)

## Solución de problemas

Si encuentras algún problema durante la instalación o uso del módulo:

1. Verifica que el servidor Flask esté detenido antes de ejecutar los scripts de instalación
2. Asegúrate de que los directorios `app/models` y `app/routes` existen
3. Verifica que tienes permisos de escritura en el directorio del proyecto
4. Revisa los logs del servidor Flask para identificar errores específicos

Si el problema persiste, puedes instalar el módulo manualmente siguiendo los pasos de la Opción 2.

# Módulo de Pasarela de Pago con Stripe

Este módulo implementa una pasarela de pago completa utilizando Stripe para procesar pagos de cursos en Akademia Kupula.

## Características

- Integración completa con Stripe Checkout
- Procesamiento seguro de pagos con tarjeta
- Gestión de pedidos y elementos de pedido
- Historial de pagos para usuarios
- Verificación de estado de pagos
- Webhooks para actualización automática de pedidos

## Requisitos previos

1. **Cuenta de Stripe**: Necesitarás crear una cuenta en [Stripe](https://stripe.com) y obtener las claves API.
2. **Claves API de Stripe**:
   - Clave pública (para el frontend)
   - Clave secreta (para el backend)
   - Clave de webhook (para verificar eventos)

## Instalación

### Frontend

1. Instala las dependencias de Stripe:
   ```
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

2. Actualiza la clave pública de Stripe en `src/services/stripeService.js`:
   ```javascript
   const stripePromise = loadStripe('tu_clave_publica_de_stripe');
   ```

### Backend

1. Instala la biblioteca de Stripe para Python:
   ```
   pip install stripe
   ```

2. Ejecuta el script de configuración:
   ```
   python setup_payment_module.py
   ```

3. Sigue las instrucciones que aparecen al final del script para:
   - Registrar el blueprint en `__init__.py`
   - Configurar las variables de entorno
   - Crear las tablas en la base de datos
   - Configurar el webhook en el dashboard de Stripe

## Configuración de Stripe

### 1. Configurar el webhook

1. Ve al [Dashboard de Stripe](https://dashboard.stripe.com/webhooks)
2. Haz clic en "Añadir endpoint"
3. Introduce la URL de tu webhook: `https://tu-dominio.com/api/payments/webhook`
4. Selecciona los eventos a escuchar:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Guarda y copia la clave de firma del webhook

### 2. Configurar las variables de entorno

Añade estas variables a tu archivo de entorno o configúralas directamente en el servidor:

```
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta
STRIPE_WEBHOOK_SECRET=whsec_tu_clave_de_webhook
```

## Uso

### Flujo de pago

1. **Inicio del pago**:
   - El usuario hace clic en "Inscribirme ahora" en la página de detalle del curso
   - Se crea una sesión de checkout en Stripe
   - El usuario es redirigido a la página de checkout de Stripe

2. **Proceso de pago**:
   - El usuario introduce sus datos de tarjeta en la página segura de Stripe
   - Stripe procesa el pago y redirige al usuario según el resultado

3. **Finalización del pago**:
   - Si el pago es exitoso, el usuario es redirigido a `/payment/success`
   - Si el pago es cancelado, el usuario es redirigido a `/payment/cancel`
   - El webhook de Stripe recibe la notificación y actualiza el estado del pedido

### Componentes principales

- **PaymentButton**: Botón que inicia el proceso de pago
- **PaymentSuccess**: Página que muestra el resultado exitoso del pago
- **PaymentCancel**: Página que muestra cuando el usuario cancela el pago

## Estructura de archivos

### Frontend

- `src/services/stripeService.js`: Servicio para comunicarse con la API de pagos
- `src/components/PaymentButton.jsx`: Componente de botón de pago
- `src/components/PaymentButton.css`: Estilos para el botón de pago
- `src/pages/PaymentSuccess.jsx`: Página de éxito de pago
- `src/pages/PaymentSuccess.css`: Estilos para la página de éxito
- `src/pages/PaymentCancel.jsx`: Página de cancelación de pago
- `src/pages/PaymentCancel.css`: Estilos para la página de cancelación

### Backend

- `app/models/order_models.py`: Modelos para órdenes y elementos de órdenes
- `app/routes/payment_routes.py`: Endpoints de la API de pagos

## Endpoints de la API

- `POST /api/payments/create-checkout-session`: Crea una sesión de checkout de Stripe
- `GET /api/payments/check-payment-status/:sessionId`: Verifica el estado de un pago
- `GET /api/payments/history`: Obtiene el historial de pagos del usuario
- `POST /api/payments/webhook`: Recibe eventos de Stripe

## Solución de problemas

### Problemas comunes

1. **Error al crear la sesión de checkout**:
   - Verifica que la clave secreta de Stripe sea correcta
   - Asegúrate de que el curso exista en la base de datos

2. **El webhook no recibe eventos**:
   - Verifica que la URL del webhook sea accesible desde Internet
   - Comprueba que la clave de firma del webhook sea correcta

3. **Error al redirigir al checkout**:
   - Verifica que la clave pública de Stripe sea correcta
   - Asegúrate de que el ID de la sesión sea válido

### Logs y depuración

Para depurar problemas con Stripe, puedes:

1. Revisar los logs del servidor Flask
2. Revisar los eventos en el [Dashboard de Stripe](https://dashboard.stripe.com/events)
3. Usar el [CLI de Stripe](https://stripe.com/docs/stripe-cli) para probar webhooks localmente

## Recursos adicionales

- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks de Stripe](https://stripe.com/docs/webhooks)
- [API de Stripe para Python](https://stripe.com/docs/api?lang=python)
