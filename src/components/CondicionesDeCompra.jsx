
import React, { useEffect } from "react";
import "../styles/TextosLegales.css";


const CondicionesDeCompra = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la página al inicio
  }, []);
  return (
    <div className="legal-container">
  
      <title>ACondiciones de- Akademia La Kúpula</title>
      <meta name="description" content="Condiciones generales de compra de AkademiaLaKupula.com" />
        <div className="legal-container">
      {/* Botón de Cierre */}
      <button className="close-button" onClick={() => window.history.back()}>
        X
      </button>
        {/* Sección 1: Información General */}
        
      <article className="legal-content">
        <section>
          <h2>1. INFORMACIÓN GENERAL</h2>
          <p>
            La titularidad de este sitio web AkademiaLaKupula.com (en adelante Sitio Web) la ostenta: Tania Calvo, con NIF: 45662096N, y cuyos datos de contacto son:
          </p>
          <ul>
            <li>Dirección: Monte Mandoia n1</li>
            <li>Teléfono de contacto: 620576646</li>
            <li>Email de contacto: institutodebellezataniacalvo@gmail.com</li>
          </ul>
          <p>
            Este documento regula las condiciones por las que se rige el uso de este Sitio Web y la compra o adquisición de productos y/o servicios en el mismo.
          </p>
        </section>

        {/* Sección 2: El Usuario */}
        <section>
          <h2>2. EL USUARIO</h2>
          <p>
            El acceso, la navegación y uso del Sitio Web confiere la condición de usuario. El Usuario asume su responsabilidad de un uso correcto del Sitio Web, incluyendo:
          </p>
          <ul>
            <li>Hacer uso del Sitio Web únicamente para realizar consultas y compras legalmente válidas.</li>
            <li>No realizar ninguna compra falsa o fraudulenta.</li>
            <li>Facilitar datos de contacto veraces y lícitos.</li>
          </ul>
          <p>
            El Usuario declara ser mayor de 18 años y tener capacidad legal para celebrar contratos a través de este Sitio Web.
          </p>
        </section>

        {/* Sección 3: Proceso de Compra */}
        <section>
          <h2>3. PROCESO DE COMPRA O ADQUISICIÓN</h2>
          <p>
            Los Usuarios debidamente registrados pueden comprar en el Sitio Web siguiendo el procedimiento establecido. Durante el proceso, los productos y/o servicios pueden ser seleccionados y añadidos al carrito, finalizando con el botón "Comprar".
          </p>
          <p>
            Una vez completada la compra, el Usuario recibirá un correo electrónico confirmando el pedido.
          </p>
        </section>

        {/* Sección 4: Disponibilidad */}
        <section>
          <h2>4. DISPONIBILIDAD</h2>
          <p>
            Todos los pedidos están sujetos a la disponibilidad de los productos y/o servicios. Si no hay stock o hay problemas, Akademia La Kupula contactará al Usuario y reembolsará cualquier cantidad abonada.
          </p>
        </section>

        {/* Sección 5: Precios y Pago */}
        <section>
          <h2>5. PRECIOS Y PAGO</h2>
          <p>
            Los precios exhibidos en el Sitio Web son finales, en Euros (€) e incluyen impuestos. Los medios de pago aceptados son: tarjeta de crédito/débito, PayPal y transferencia bancaria.
          </p>
        </section>

        {/* Sección 6: Entrega */}
        <section>
          <h2>6. ENTREGA</h2>
          <p>
            Las entregas se efectuarán en el ámbito señalado durante el proceso de compra. En caso de imposibilidad de entrega por ausencia del Usuario, el pedido podrá ser devuelto al almacén.
          </p>
        </section>

        {/* Sección 7: Medios Técnicos para Corregir Errores */}
        <section>
          <h2>7. MEDIOS TÉCNICOS PARA CORREGIR ERRORES</h2>
          <p>
            En caso de detectar errores al introducir datos necesarios para procesar la solicitud de compra, el Usuario puede modificarlos poniéndose en contacto con Akademia La Kupula.
          </p>
        </section>

        {/* Sección 8: Devoluciones */}
        <section>
          <h2>8. DEVOLUCIONES</h2>
          <p>
            El Usuario tiene derecho a desistir de la compra en un plazo de 14 días naturales sin necesidad de justificación. Para ejercer este derecho, debe notificar su decisión a Akademia La Kupula.
          </p>
        </section>

        {/* Sección 9: Exoneración de Responsabilidad */}
        <section>
          <h2>9. EXONERACIÓN DE RESPONSABILIDAD</h2>
          <p>
            Akademia La Kupula no aceptará responsabilidad por pérdidas que no sean atribuibles a su incumplimiento, ni por eventos fuera de su control razonable (caso fortuito o fuerza mayor).
          </p>
        </section>

        {/* Sección 10: Comunicaciones por Escrito */}
        <section>
          <h2>10. COMUNICACIONES POR ESCRITO Y NOTIFICACIONES</h2>
          <p>
            El Usuario acepta que la mayoría de las comunicaciones con Akademia La Kupula sean electrónicas (correo electrónico o avisos publicados en el Sitio Web).
          </p>
        </section>

        {/* Sección 11: Renuncia */}
        <section>
          <h2>11. RENUNCIA</h2>
          <p>
            Ninguna renuncia de Akademia La Kupula a un derecho o acción legal supondrá una renuncia a otros derechos o acciones derivados del contrato.
          </p>
        </section>

        {/* Sección 12: Nulidad */}
        <section>
          <h2>12. NULIDAD</h2>
          <p>
            Si alguna de las presentes Condiciones fuese declarada nula, el resto de las cláusulas permanecerán en vigor.
          </p>
        </section>

        {/* Sección 13: Acuerdo Completo */}
        <section>
          <h2>13. ACUERDO COMPLETO</h2>
          <p>
            Las presentes Condiciones constituyen el acuerdo íntegro entre el Usuario y Akademia La Kupula.
          </p>
        </section>

        {/* Sección 14: Protección de Datos */}
        <section>
          <h2>14. PROTECCIÓN DE DATOS</h2>
          <p>
            La información personal facilitada por el Usuario será tratada de acuerdo con la Política de Privacidad.
          </p>
        </section>

        {/* Sección 15: Legislación Aplicable */}
        <section>
          <h2>15. LEGISLACIÓN APLICABLE Y JURISDICCIÓN</h2>
          <p>
            El acceso y uso del Sitio Web se regirán por la legislación española.
          </p>
        </section>

        {/* Sección 16: Quejas y Reclamaciones */}
        <section>
          <h2>16. QUEJAS Y RECLAMACIONES</h2>
          <p>
            El Usuario puede enviar quejas o reclamaciones a través de los datos de contacto proporcionados.
          </p>
        </section>
        </article>

        <p className="generator-info">
          Este documento de Condiciones Generales de Venta ha sido creado mediante el generador de plantilla de condiciones generales de venta online el día 26/04/2025.
        </p>
      </div>
    </div>
  );
};

export default CondicionesDeCompra;