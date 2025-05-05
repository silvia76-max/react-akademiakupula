import React, { useEffect } from "react";
import "../styles/TextosLegales.css";

const AvisoLegal = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la página al inicio
  }, []);
  return (
    <div className="legal-container">
    
        <title>Aviso Legal - Akademia La Kúpula</title>
        <meta name="description" content="Aviso legal y condiciones generales de uso de AkademiaLaKupula.com" />

      <div className="legal-container">
      {/* Botón de Cierre */}
      <button className="close-button" onClick={() => window.history.back()}>
        X
      </button>

      <article className="legal-content">
        <h1>AVISO LEGAL Y CONDICIONES GENERALES DE USO</h1>
        <p className="website">AkademiaLaKupula.com</p>

        <section>
          <h2>I. INFORMACIÓN GENERAL</h2>
          <p>
            En cumplimiento con el deber de información dispuesto en la Ley 34/2002 de Servicios de la Sociedad de
            la Información y el Comercio Electrónico (LSSI-CE) de 11 de julio, se facilitan a continuación los siguientes
            datos de información general de este sitio web:
          </p>
          <p>
            La titularidad de este sitio web, AkademiaLaKupula.com, (en adelante, Sitio Web) la ostenta: Tania Calvo,
            con NIF: 45662096N, y cuyos datos de contacto son:
          </p>
          <address>
            Dirección: Monte Mandoia n1<br />
            Teléfono de contacto: 620576646<br />
            Email de contacto: institutodebellezataniacalvo@gmail.com
          </address>
        </section>

        <section>
          <h2>II. TÉRMINOS Y CONDICIONES GENERALES DE USO</h2>
          
          <h3>El objeto de las condiciones: El Sitio Web</h3>
          <p>
            El objeto de las presentes Condiciones Generales de Uso (en adelante, Condiciones) es regular el acceso y
            la utilización del Sitio Web. A los efectos de las presentes Condiciones se entenderá como Sitio Web: la
            apariencia externa de los interfaces de pantalla, tanto de forma estática como de forma dinámica, es
            decir, el árbol de navegación; y todos los elementos integrados tanto en los interfaces de pantalla como en
            el árbol de navegación (en adelante, Contenidos) y todos aquellos servicios o recursos en línea que en su
            caso ofrezca a los Usuarios (en adelante, Servicios).
          </p>
          <p>
            Se reserva la facultad de modificar, en cualquier momento, y sin aviso previo, la presentación y
            configuración del Sitio Web y de los Contenidos y Servicios que en él pudieran estar incorporados. El
            Usuario reconoce y acepta que en cualquier momento pueda interrumpir, desactivar y/o cancelar
            cualquiera de estos elementos que se integran en el Sitio Web o el acceso a los mismos.
          </p>
          <p>
            Aparte del coste de conexión a través de la red de telecomunicaciones suministrada por el proveedor de
            acceso, y que hubiere contratado el Usuario, algunos de los Contenidos o Servicios ofrecidos por o, en su
            caso, terceros a través del Sitio Web pueden encontrarse sujetos a la contratación previa del Contenido o
            Servicio, en cuyo caso se especificará de forma clara y/o se pondrá a disposición del Usuario las
            correspondientes Condiciones Generales o Particulares por las que esto se rija.
          </p>
          <p>
            La utilización de alguno de los Contenidos o Servicios del Sitio Web podrá hacerse mediante la suscripción
            o registro previo del Usuario.
          </p>

          <h3>El Usuario</h3>
          <p>
            El acceso, la navegación y uso del Sitio Web, así como por los espacios habilitados para interactuar entre
            los Usuarios, y el Usuario y , como los comentarios y/o espacios de blogging, confiere la condición de
            Usuario, por lo que se aceptan, desde que se inicia la navegación por el Sitio Web, todas las Condiciones
            aquí establecidas, así como sus ulteriores modificaciones, sin perjuicio de la aplicación de la
            correspondiente normativa legal de obligado cumplimiento según el caso. Dada la relevancia de lo
            anterior, se recomienda al Usuario leerlas cada vez que visite el Sitio Web.
          </p>
          <p>
            El Sitio Web de proporciona gran diversidad de información, servicios y datos. El Usuario asume su
            responsabilidad para realizar un uso correcto del Sitio Web. Esta responsabilidad se extenderá a:
          </p>
          <ul>
            <li>
              Un uso de la información, Contenidos y/o Servicios y datos ofrecidos por sin que sea contrario a lo
              dispuesto por las presentes Condiciones, la Ley, la moral o el orden público, o que de cualquier otro
              modo puedan suponer lesión de los derechos de terceros o del mismo funcionamiento del Sitio Web.
            </li>
            <li>
              La veracidad y licitud de las informaciones aportadas por el Usuario en los formularios extendidos
              por para el acceso a ciertos Contenidos o Servicios ofrecidos por el Sitio Web. En todo caso, el
              Usuario notificará de forma inmediata a acerca de cualquier hecho que permita el uso indebido de la
              información registrada en dichos formularios, tales como, pero no solo, el robo, extravío, o el acceso
              no autorizado a identificadores y/o contraseñas, con el fin de proceder a su inmediata cancelación.
            </li>
          </ul>
          <p>
            Se reserva el derecho de retirar todos aquellos comentarios y aportaciones que vulneren la ley, el respeto
            a la dignidad de la persona, que sean discriminatorios, xenófobos, racistas, pornográficos, spamming, que
            atenten contra la juventud o la infancia, el orden o la seguridad pública o que, a su juicio, no resultaran
            adecuados para su publicación.
          </p>
          <p>
            En cualquier caso, no será responsable de las opiniones vertidas por los Usuarios a través de comentarios
            u otras herramientas de blogging o de participación que pueda haber.
          </p>
          <p>
            El mero acceso a este Sitio Web no supone entablar ningún tipo de relación de carácter comercial entre y
            el Usuario.
          </p>
          <p>
            El Usuario declara ser mayor de edad y disponer de la capacidad jurídica suficiente para vincularse por las
            presentes Condiciones. Por lo tanto, este Sitio Web de no se dirige a menores de edad. declina cualquier
            responsabilidad por el incumplimiento de este requisito.
          </p>
        </section>

        <section>
          <h2>III. ACCESO Y NAVEGACIÓN EN EL SITIO WEB: EXCLUSIÓN DE GARANTÍAS Y RESPONSABILIDAD</h2>
          <p>
            No garantiza la continuidad, disponibilidad y utilidad del Sitio Web, ni de los Contenidos o Servicios. hará
            todo lo posible por el buen funcionamiento del Sitio Web, sin embargo, no se responsabiliza ni garantiza
            que el acceso a este Sitio Web no vaya a ser ininterrumpido o que esté libre de error.
          </p>
          <p>
            Tampoco se responsabiliza o garantiza que el contenido o software al que pueda accederse a través de
            este Sitio Web, esté libre de error o cause un daño al sistema informático (software y hardware) del
            Usuario. En ningún caso será responsable por las pérdidas, daños o perjuicios de cualquier tipo que surjan
            por el acceso, navegación y el uso del Sitio Web, incluyéndose, pero no limitándose, a los ocasionados a
            los sistemas informáticos o los provocados por la introducción de virus.
          </p>
          <p>
            Tampoco se hace responsable de los daños que pudiesen ocasionarse a los usuarios por un uso inadecuado
            de este Sitio Web. En particular, no se hace responsable en modo alguno de las caídas, interrupciones,
            falta o defecto de las telecomunicaciones que pudieran ocurrir.
          </p>
        </section>

        <section>
          <h2>IV. POLÍTICA DE ENLACES</h2>
          <p>
            Se informa que el Sitio Web de pone o puede poner a disposición de los Usuarios medios de enlace (como,
            entre otros, links, banners, botones), directorios y motores de búsqueda que permiten a los Usuarios
            acceder a sitios web pertenecientes y/o gestionados por terceros.
          </p>
          <p>
            La instalación de estos enlaces, directorios y motores de búsqueda en el Sitio Web tiene por objeto facilitar
            a los Usuarios la búsqueda de y acceso a la información disponible en Internet, sin que pueda considerarse
            una sugerencia, recomendación o invitación para la visita de los mismos.
          </p>
          <p>
            No ofrece ni comercializa por sí ni por medio de terceros los productos y/o servicios disponibles en dichos
            sitios enlazados.
          </p>
          <p>
            Asimismo, tampoco garantizará la disponibilidad técnica, exactitud, veracidad, validez o legalidad de sitios
            ajenos a su propiedad a los que se pueda acceder por medio de los enlaces.
          </p>
          <p>
            En ningún caso revisará o controlará el contenido de otros sitios web, así como tampoco aprueba, examina
            ni hace propios los productos y servicios, contenidos, archivos y cualquier otro material existente en los
            referidos sitios enlazados.
          </p>
          <p>
            No asume ninguna responsabilidad por los daños y perjuicios que pudieran producirse por el acceso, uso,
            calidad o licitud de los contenidos, comunicaciones, opiniones, productos y servicios de los sitios web no
            gestionados por y que sean enlazados en este Sitio Web.
          </p>
          <p>
            El Usuario o tercero que realice un hipervínculo desde una página web de otro, distinto, sitio web al Sitio
            Web de deberá saber que:
          </p>
          <ul>
            <li>
              No se permite la reproducción —total o parcialmente— de ninguno de los Contenidos y/o Servicios del Sitio
              Web sin autorización expresa de .
            </li>
            <li>
              No se permite tampoco ninguna manifestación falsa, inexacta o incorrecta sobre el Sitio Web de , ni sobre
              los Contenidos y/o Servicios del mismo.
            </li>
            <li>
              A excepción del hipervínculo, el sitio web en el que se establezca dicho hiperenlace no contendrá ningún
              elemento, de este Sitio Web, protegido como propiedad intelectual por el ordenamiento jurídico español,
              salvo autorización expresa de .
            </li>
            <li>
              El establecimiento del hipervínculo no implicará la existencia de relaciones entre y el titular del sitio web
              desde el cual se realice, ni el conocimiento y aceptación de de los contenidos, servicios y/o actividades
              ofrecidos en dicho sitio web, y viceversa.
            </li>
          </ul>
        </section>

        <section>
          <h2>V. PROPIEDAD INTELECTUAL E INDUSTRIAL</h2>
          <p>
            Por sí o como parte cesionaria, es titular de todos los derechos de propiedad intelectual e industrial del
            Sitio Web, así como de los elementos contenidos en el mismo (a título enunciativo y no exhaustivo,
            imágenes, sonido, audio, vídeo, software o textos, marcas o logotipos, combinaciones de colores,
            estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su
            funcionamiento, acceso y uso, etc.). Serán, por consiguiente, obras protegidas como propiedad intelectual
            por el ordenamiento jurídico español, siéndoles aplicables tanto la normativa española y comunitaria en
            este campo, como los tratados internacionales relativos a la materia y suscritos por España.
          </p>
          <p>
            Todos los derechos reservados. En virtud de lo dispuesto en la Ley de Propiedad Intelectual, quedan
            expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad
            de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines
            comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de .
          </p>
          <p>
            El Usuario se compromete a respetar los derechos de propiedad intelectual e industrial de . Podrá
            visualizar los elementos del Sitio Web o incluso imprimirlos, copiarlos y almacenarlos en el disco duro de
            su ordenador o en cualquier otro soporte físico siempre y cuando sea, exclusivamente, para su uso
            personal. El Usuario, sin embargo, no podrá suprimir, alterar, o manipular cualquier dispositivo de
            protección o sistema de seguridad que estuviera instalado en el Sitio Web.
          </p>
          <p>
            En caso de que el Usuario o tercero considere que cualquiera de los Contenidos del Sitio Web suponga una
            violación de los derechos de protección de la propiedad intelectual, deberá comunicarlo inmediatamente a
            a través de los datos de contacto del apartado de INFORMACIÓN GENERAL de este Aviso Legal y
            Condiciones Generales de Uso.
          </p>
        </section>

        <section>
          <h2>VI. ACCIONES LEGALES, LEGISLACIÓN APLICABLE Y JURISDICCIÓN</h2>
          <p>
            Se reserva la facultad de presentar las acciones civiles o penales que considere necesarias por la
            utilización indebida del Sitio Web y Contenidos, o por el incumplimiento de las presentes Condiciones.
          </p>
          <p>
            La relación entre el Usuario y se regirá por la normativa vigente y de aplicación en el territorio español. De
            surgir cualquier controversia en relación con la interpretación y/o a la aplicación de estas Condiciones las
            partes someterán sus conflictos a la jurisdicción ordinaria sometiéndose a los jueces y tribunales que
            correspondan conforme a derecho.
          </p>
          <p className="generator-info">
            Este documento de Aviso Legal y Condiciones Generales de uso del sitio web ha sido creado mediante el
            generador de plantilla de aviso legal y condiciones de uso online el día 26/04/2025
          </p>
        </section>
      </article>
    </div>
    </div>
  );
};

export default AvisoLegal;