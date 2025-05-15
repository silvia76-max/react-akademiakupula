# Integración de Stripe en Akademia Kupula

Este documento describe la integración de Stripe como pasarela de pago para los cursos de Akademia Kupula.

## Arquitectura

La integración de Stripe consta de dos partes principales:

1. **Frontend (React)**:
   - Botón de pago que inicia el proceso de checkout
   - Redirección a la página de checkout de Stripe
   - Páginas de éxito y cancelación de pago

2. **Backend (Flask)**:
   - API para crear sesiones de checkout
   - Webhook para recibir eventos de Stripe
   - Modelos para órdenes y elementos de órdenes

## Flujo de pago

1. El usuario hace clic en "Inscribirme ahora" en la página de detalle del curso
2. El frontend llama a la API para crear una sesión de checkout
3. El usuario es redirigido a la página de checkout de Stripe
4. El usuario introduce sus datos de pago
5. Stripe procesa el pago y redirige al usuario según el resultado
6. El webhook recibe la notificación de pago completado y actualiza la orden

## Configuración

### Frontend

El frontend ya está configurado con:

- Servicio de Stripe (`stripeService.jsx`)
- Componente de botón de pago (`PaymentButton.jsx`)
- Página de éxito de pago (`PaymentSuccess.jsx`)

La clave pública de Stripe está configurada en `stripeService.jsx`:

```javascript
const stripePromise = loadStripe('pk_test_51RM5IkCDxUStkLAzsN4ebNdDXs2mmUvhTsXJIclBm8hUqNehUX9w8JnmbESlEvtXCmNyertrSgfwYEwMramrzCAI00USsREDNn');
```

### Backend

Para configurar el backend:

1. Instala la biblioteca de Stripe:
   ```
   pip install stripe
   ```

2. Copia los archivos de modelos y rutas:
   - `order_models.py` → `app/models/order_models.py`
   - `payment_routes.py` → `app/routes/payment_routes.py`

3. Registra el blueprint en `app/__init__.py`:
   ```python
   # Registrar blueprint de pagos
   from app.routes.payment_routes import payment_bp
   app.register_blueprint(payment_bp, url_prefix='/api/payments')
   ```

4. Configura las variables de entorno:
   ```
   export STRIPE_SECRET_KEY='sk_test_TU_CLAVE_SECRETA_DE_STRIPE'
   export STRIPE_WEBHOOK_SECRET='whsec_TU_CLAVE_DE_WEBHOOK_DE_STRIPE'
   ```

5. Crea las tablas en la base de datos:
   ```python
   from app import app, db
   from app.models.order_models import Order, OrderItem
   with app.app_context():
       db.create_all()
   ```

6. Configura el webhook en el dashboard de Stripe:
   - URL: `https://tu-dominio.com/api/payments/webhook`
   - Eventos: `checkout.session.completed`

## Pruebas

Para probar la integración, puedes usar las tarjetas de prueba de Stripe:

- **Pago exitoso**: 4242 4242 4242 4242
- **Pago fallido**: 4000 0000 0000 0002

Para probar webhooks localmente, puedes usar Stripe CLI:
```
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## Endpoints de la API

- `POST /api/payments/create-checkout-session`: Crea una sesión de checkout
- `GET /api/payments/check-payment-status/:sessionId`: Verifica el estado de un pago
- `GET /api/payments/history`: Obtiene el historial de pagos del usuario
- `POST /api/payments/webhook`: Recibe eventos de Stripe

## Modelos de datos

### Order

- `id`: ID de la orden
- `user_id`: ID del usuario
- `status`: Estado de la orden (pending, completed, failed, refunded)
- `total_amount`: Monto total de la orden
- `payment_intent_id`: ID del payment intent de Stripe
- `checkout_session_id`: ID de la sesión de checkout de Stripe
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

### OrderItem

- `id`: ID del item
- `order_id`: ID de la orden
- `course_id`: ID del curso
- `price`: Precio del curso
- `created_at`: Fecha de creación

## Recursos

- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks de Stripe](https://stripe.com/docs/webhooks)
- [API de Stripe para Python](https://stripe.com/docs/api?lang=python)
- [Tarjetas de prueba de Stripe](https://stripe.com/docs/testing#cards)
