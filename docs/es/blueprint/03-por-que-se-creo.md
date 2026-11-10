## 3. Por Qué se Creó Este Proyecto

### ❓ Problemas a Resolver

Debemos enfrentar la realidad: durante un período considerable, cómo interactuar con los usuarios está determinado por desarrolladores del lado del cliente (o empresas). Bajo la mayoría de los modelos de negocio existentes, la participación del usuario en la interacción es la base del valor del producto y la rentabilidad, como el número de usuarios activos y los ingresos publicitarios. Nadie puede obligar a los lados del cliente a abrir permisos suficientes, permitiendo que la IA ejecute operaciones completamente sin intervención humana.

Si la IA es lo suficientemente inteligente, los humanos realmente no necesitan comenzar desde la página de inicio cada vez. Por lo tanto, podemos ver que el diálogo humano-máquina se convierta en la interfaz de interacción principal de la próxima generación casi se ha convertido en un consenso.

Sin embargo, los defectos naturales de la expresividad del lenguaje natural, originalmente esperados para ser compensados por interacciones bien diseñadas, ahora son reemplazados por cuadros de diálogo. Las limitaciones de los cuadros de diálogo se exponen inmediatamente:

#### (1) Pérdida de la Función Indicativa del Cursor

Las formas de interacción están cambiando del modo "pantalla + operación de enfoque" al modo de lenguaje natural. Las operaciones de enfoque tradicionales se logran a través de teclados, ratones y pantallas táctiles, proporcionando indicación precisa. La interacción en lenguaje natural trae los siguientes impactos:

- **Pérdida de Precisión Indicativa**: La dificultad de expresión y comprensión aumenta, y la ambigüedad crece, lo que llamamos el "efecto de pérdida de cursor".
  > Por ejemplo, cuando un usuario dice "elimina esto", el sistema tiene dificultades para determinar a qué objeto específico se refiere "esto", mientras que las interfaces tradicionales pueden localizar con precisión mediante clics del ratón.

- **Eficiencia Limitada de Expresión de Información**: La expresión de información puramente por voz es ineficiente, y la ventaja de la entrada por voz se refleja principalmente en escenarios de expresión palabra por palabra.
  > Por ejemplo, cuando quieres ampliar una miniatura, es posible que necesites decir "ampliar" o escribir "ampliar", mientras que la interacción tradicional solo requiere un clic.

- **Altos Requisitos para la Expresión Lingüística**: La interacción en lenguaje natural impone altas demandas en las habilidades de expresión lingüística de los usuarios, creando dificultades en la interacción humano-máquina.
  > Por ejemplo, los usuarios que no son buenos en expresión lingüística pueden ser incapaces de describir con precisión sus necesidades, lo que lleva a desviaciones en la comprensión del sistema, mientras que las interfaces tradicionales reducen el umbral de expresión a través de elementos visuales como botones y menús.

- **Baja Eficiencia de Lectura de Información**: La lectura de flujo de texto y la lectura por voz son menos eficientes que la lectura de información estructurada.
  > Por ejemplo, cuando el sistema usa voz para transmitir una larga lista de datos, los usuarios necesitan escuchar toda la lista para encontrar información objetivo, mientras que las interfaces tradicionales permiten a los usuarios escanear y localizar rápidamente a través de formas estructuradas como tablas y tarjetas.

- **Limitado por Turnos de Diálogo**: Las interacciones limitadas por turnos de diálogo no son amigables para operaciones continuas rápidas.
  > Por ejemplo, cuando los usuarios necesitan realizar múltiples operaciones continuamente, deben esperar a que cada turno de diálogo se complete antes de proceder al siguiente paso, mientras que las interfaces tradicionales pueden hacer clic rápidamente en múltiples botones en sucesión para completar operaciones por lotes.

#### (2) Desbordamiento de Fragmentación de Información

La estructura de información de transmisión de conversaciones carece de organización, a diferencia del software tradicional que organiza la arquitectura de información en unidades de página, construyendo jerarquías de presentación de información visualmente amigables a través de interfaces gráficas visuales. Esto lleva a los siguientes problemas derivados:

- **Dificultad para Aislar Diferentes Informaciones**: Los flujos continuos de información dentro de una sola conversación dificultan distinguir los límites entre diferentes temas, e incluso múltiples temas completamente no relacionados pueden mezclarse.
  > Por ejemplo, un usuario primero pregunta "ayúdame a verificar el clima de mañana" en una conversación, luego pregunta "cómo va el progreso de ese proyecto", y luego pregunta "recomienda algunos buenos libros". Estos temas completamente no relacionados se mezclan, lo que dificulta localizar y revisar rápidamente.

- **Explosión de Sesiones Zombie**: Cuando la información se aísla artificialmente a través de sesiones, la información dentro de las sesiones se pliega en cajas negras con sesiones como unidades, eventualmente convirtiéndose en sesiones zombie debido a la baja visibilidad.
  > Por ejemplo, los usuarios crean múltiples sesiones como "relacionado con el trabajo", "notas de estudio", "lista de compras", pero cada sesión solo tiene mensajes dispersos. Con el tiempo, estas sesiones se olvidan y se convierten en sesiones zombie que no pueden ser utilizadas efectivamente.

- **Incapaz de Gestionar Multi-dimensionalmente**: Información similar dispersa en innumerables sesiones no puede organizarse porque la información no puede gestionarse a lo largo de una dimensión específica.
  > Por ejemplo, los usuarios han preguntado sobre "tutorial de Python", "tutorial de JavaScript", "tutorial de React" y otros recursos de aprendizaje en diferentes sesiones, pero no pueden verlos y gestionarlos uniformemente a lo largo de la dimensión "recursos de aprendizaje", y solo pueden buscar sesión por sesión.

- **Falta de Objetos Indicables**: La información se disuelve en información de texto, y cuando necesitamos referirnos a algo, no hay un objeto específico al que referirse.
  > Por ejemplo, cuando un usuario dice "optimiza esa propuesta nuevamente", "esa propuesta" es solo un párrafo en el flujo de texto sin identificación y estructura independientes, lo que dificulta que el sistema localice y opere con precisión.

#### (3) Diferencias Significativas en Interfaces Humano-Máquina Entre Diferentes Terminales

Más dispositivos terminales en el futuro serán impulsados por Agentes, correspondiendo a la percepción humana a través de pantallas, cámaras, micrófonos, altavoces y otros dispositivos para completar la interacción humano-máquina. Sin embargo, diferentes terminales tienen diferencias inherentes en sus características físicas, y es imposible usar forzosamente el mismo modo de interacción. Esto crea dificultades en la integración de IA:

- **Desconexión de Medios**: Cuando la estructura de información retroalimentada por la IA es hostil para los terminales, inevitablemente causará pérdida o confusión en la expresión de información. Por el contrario, la estructura de información proporcionada por los terminales no es necesariamente amigable para la IA.
  > Por ejemplo, una visualización de datos compleja originalmente diseñada para un panel de gran pantalla se "lee" directamente por voz en un altavoz inteligente, lo que hace casi imposible que los usuarios establezcan una cognición general; por el contrario, una sola línea de información de aviso en un reloj inteligente difícilmente puede llevar completamente las semánticas complejas que la IA espera expresar.

- **La IA Carece de Dominio de las Características del Terminal**: Para mejorar la expresividad, los humanos a menudo usan múltiples software y terminales para demostrar en contextos complejos o al expresar lógica compleja. La IA parece solo saber cómo "hablar".
  > Por ejemplo, cuando un gerente de producto presenta una propuesta, mostrará diapositivas, dibujará diagramas de estructura en una pizarra y hará clic en operaciones en páginas de demostración; mientras que la IA actual a menudo solo puede explicar con un texto largo o una cadena de voz, lo que dificulta usar capacidades del terminal como proyección, anotación y animación para mejorar la expresión.

- **Brecha Entre Virtual y Realidad**: El contexto (o contexto) actualmente usado por la IA se basa en conocimiento preestablecido y memorizado, mientras que el contexto en escenarios reales a menudo es dinámico y relacionado con el entorno real.
  > Por ejemplo, la IA puede "recordar" perfiles personales y conversaciones históricas de los usuarios, pero es difícil percibir en tiempo real que el usuario está sentado en una sala de conferencias, hojeando qué página de un documento en papel, o señalando qué tablero de visualización física, por lo tanto, incapaz de hacer instrucciones y suplementos naturales basados en situaciones en el lugar como un asistente real.

### 💡 Ideas de Mejora y Objetivos

Anteriormente, el trabajo principal de los gerentes de producto era diseñar interfaces y flujos de operación fáciles de aprender y usar. Con el apoyo de la IA, los usuarios ya no necesitan aprender interfaces de interacción de software y lógica de operación. La IA tiene la capacidad de proporcionar a los usuarios solo la información necesaria basada en preguntas e instrucciones del usuario, y los usuarios solo necesitan operaciones de intervención mínimas.

Sin embargo, siempre que los usuarios mismos intervengan, hay problemas con la amigabilidad de la interacción, la precisión y la eficiencia. Interactive Conversation Protocol juega un papel precisamente en el punto de contacto humano-máquina:

#### Mejora del Poder Expresivo del Lenguaje Natural (Humano → IA)

Mejorar el poder expresivo aquí se refiere a mejorar el lenguaje natural. Para compensar los problemas mencionados anteriormente (pérdida de indicación del cursor, desbordamiento de fragmentación de información y diferencias en interfaces humano-máquina entre diferentes terminales). Al menos se puede hacer el siguiente procesamiento en el lenguaje natural original:

- **Marcado de Información Expresada**: Marque la información que necesita procesamiento especial. El procesamiento especial mencionado aquí incluye usar información estructurada, ensamblar interfaces, ejecutar programas auxiliares, etc. Puede imaginarlo como hacer notas rodeando puntos en un pedazo de texto. En términos de forma de marcado, nos referimos a Markdown, usando caracteres especiales para representar significados específicos, mientras que la explicación y activación de funciones auxiliares se refiere al principio de anotación en el desarrollo de Java. A través de este método, podemos complementar el tono del habla, señalar qué es importante, qué necesita formas de presentación especiales y qué necesita pre-operaciones (como autenticación visible solo para uno mismo) en el contenido expositivo original.
  > Por ejemplo, cuando un usuario dice "ayúdame a organizar las tareas pendientes de esta semana", marcando fechas, prioridades y personas responsables ligeramente en la oración, la IA puede generar directamente una lista de tareas pendientes verificable en lugar de solo devolver un texto descriptivo.

- **Agregar Información de Contexto**: Complemente la información virtual necesaria y el entorno del mundo real en la información narrativa para reproducir la situación real del hablante. Las interfaces de interacción tradicionales a menudo preestablecen información de contexto opcional en la interfaz para capturar las intenciones precisas de los usuarios desde clics simples, mientras que el lenguaje natural requiere organizar texto extenso para describir completamente el contexto. Al complementar información de contexto como tiempo, ubicación, estado del dispositivo e identidad del participante en el protocolo, la IA puede entender más precisamente la semántica real de "aquí y ahora".
  > Por ejemplo, cuando un usuario solo dice "reserva un restaurante que le guste a Marry cerca", complemente la ubicación, preferencias de presupuesto y pedidos históricos como información de contexto. La aplicación de información de contexto es muy amplia, y discutiremos escenarios específicamente más adelante.

- **Traducción a Lenguaje Intermedio Estándar**: Después de procesar la información original (agregando anotaciones e información de contexto), para permitir una interpretación completa y precisa, es necesario un sistema de identificación de datos acordado. Para adaptarse a la expresividad de todos los terminales, este sistema de identificación puede construirse sobre especificaciones JSON, proporcionando tablas de parámetros y estructuras acordadas. De esta manera, las IAs en varios extremos receptores pueden movilizar todos los terminales disponibles para mostrar máxima expresividad y reproducir el significado completo del expresador.
  > Por ejemplo, una oración "envía este pasaje al grupo del proyecto y haz que todos confirmen antes del final del trabajo hoy" se traduce finalmente en una estructura JSON estándar que contiene el cuerpo del mensaje, la lista de destinatarios, la fecha límite y la configuración del botón de confirmación. Las herramientas de chat, los backends web o las aplicaciones móviles pueden renderizar sus respectivas interfaces adaptadas en consecuencia.

#### Interfaz Personalizada Bajo Demanda (IA → Humano)

Nuestra premisa es que las personas preferirán interactuar con la IA a través de "hablar", que es la forma más cercana a la comunicación humana. Por lo tanto, las personas encontrarán cada vez más molesto encontrar las interfaces funcionales que necesitan a través de clics. La información e interfaces que las personas necesitan deben ser empujadas directamente a los "ojos" de los usuarios. Para lograr este efecto, los extremos receptores deben tener ciertas capacidades de interpretación:

- **Interpretación del Lenguaje Intermedio**: Dado que el lenguaje intermedio está en formato JSON, todos los extremos receptores pueden leer semántica completa, al menos evitando desconexión en la recepción de información.
  > Por ejemplo, los mismos datos de lenguaje intermedio de "solicitud de revisión de informe de gastos" pueden renderizarse como una interfaz de gran pantalla con tablas y vistas previas de archivos adjuntos en el escritorio, solo mostrar información clave y dos botones (aprobar/rechazar) en el móvil, mientras que los altavoces inteligentes pueden leer resúmenes y esperar confirmación por voz.

- **Construcción Dinámica de Interfaces de Mensajes**: Basándose en contexto completo y anotaciones, elija la solución más amigable para la interacción y ensamble dinámicamente una interfaz interactiva con jerarquía de información (por supuesto, las anotaciones incompatibles con los terminales también pueden ignorarse). Esta interfaz no es necesariamente información multimodal de solo lectura, sino que también puede ser un cuerpo de mini-programa interactivo.
  > Por ejemplo, cuando la IA entiende "esto es una recopilación de información", puede insertar automáticamente una pequeña tarjeta de formulario rellenable en la interfaz de chat en lugar de hacer que los usuarios respondan preguntas una por una en texto plano.

- **Reproducción del Contexto**: Tener la capacidad de indicar o controlar algunos elementos en el contexto. Esto generalmente requiere movilizar múltiples aplicaciones o dispositivos terminales. Hemos visto que la perspectiva en primera persona puede reproducirse a través de cámaras en gafas, la perspectiva en tercera persona puede ser servida por drones compañeros, y la proyección o iconos de VR pueden apuntar a una cierta posición en objetos físicos... y así sucesivamente.
  > Por ejemplo, en un escenario de mantenimiento remoto de dispositivos, la IA puede resaltar la posición de los tornillos que necesitan ser desmontados en el campo de visión AR del ingeniero mientras simultáneamente muestra diagramas de circuito e instrucciones de paso en una pantalla grande, permitiendo que el "contexto" sea reproducido conjuntamente a través de múltiples terminales.

#### ❗️❗️ Nota Especial: ¿Es Realmente Necesario el Lenguaje Intermedio?

Muchas personas piensan que el lenguaje intermedio en realidad no es necesario, generalmente por dos razones:

(1) A largo plazo, AGI tiene la capacidad de "leer entre líneas" y entender las intenciones implícitas de los usuarios. No hay necesidad de procesar artificialmente el lenguaje natural innecesariamente solo para ayudar a la IA a entender mejor.

(2) Diseñar interfaces de interacción amigables para humanos también es el deber de AGI en el futuro, y la IA incluso puede diseñar una interfaz de interacción ejecutable específicamente para cada interacción. Por lo tanto, es aún más innecesario traducir las palabras de la IA a algún lenguaje intermedio.

Aún así, finalmente diseñamos el protocolo ICP en el sistema iFay. Tenemos las siguientes 3 preocupaciones y creemos que son difíciles de resolver a corto plazo, por lo que elegimos diseñar un lenguaje intermedio de estilo de anotación:

(1) El Control de la IA Sobre el Entorno No Es Tan Grande

Generalmente, las personas comparan la interacción humano-IA con la comunicación entre una persona y un asistente. Piensan que un asistente inteligente ajustará activamente las condiciones ambientales para lograr buenos efectos de comunicación, como encender las luces cuando hay luz insuficiente; hacer marcas en partes importantes de los documentos. Pero los permisos y habilidades de los asistentes no siempre les permiten hacer todo, como cuando un edificio pierde repentinamente energía y no puede reproducir diapositivas de presentación.

Por lo tanto, un enfoque más prudente es preparar todos los materiales necesarios y adaptar la presentación (o dejarlo al administrador de la propiedad). Esto es como traer todos los materiales para conocer a un cliente. Si el cliente tiene una sala de conferencias, si se pueden reproducir diapositivas de presentación, o si los informes en papel necesitan ser vistos, lo decide la otra parte.

(2) La IA y los Humanos Pueden No Estar Tan Cerca

Debido a que el control de la IA sobre el entorno es limitado, la IA en realidad no entiende realmente el significado humano en muchos casos. Es como señalar un conjunto de datos en una diapositiva y preguntar a la IA: "¿Qué significa esta información?" En realidad, la IA no sabe dónde estás señalando. Idealmente, se necesitaría equipo de captura de movimiento para decirle a la IA esta información. También puedes imaginar otro escenario: un jefe celebra una reunión a puerta cerrada, y después de que termina, le dice al asistente: "Haz seguimiento de las resoluciones de la reunión." En este momento, el asistente en realidad no obtuvo información de primera mano, sino más bien actas de reunión organizadas por un registrador de reuniones. Las actas de reunión son similares a la información procesada por lenguaje intermedio.

Por lo tanto, en muchos casos, la información explícitamente proporcionada por los humanos no es suficiente para el juicio. En este momento, se necesita complementar información de contexto, pero esto no es la autoridad de una IA específica.

(3) Puede Que No Haya un AGI Universal en Absoluto

La IA futura definitivamente encontrará los mismos problemas de división del trabajo que la sociedad humana. Habrá IAs individuales (similares a iFay) e IAs con funciones públicas sociales (similares a coFay). Habrá inevitablemente límites de permisos entre ellos.

Es difícil para nosotros predecir si en el ecosistema de IA futuro, la responsabilidad de la IA es solo procesar información proporcionada (entrada del sistema), o si la IA también debe ser responsable de recopilar activamente más "implicaciones".

Por lo tanto, elegimos un enfoque prudente. Asumimos que la IA solo procesa información conocida. Es solo que esta información pasa por un flujo de procesamiento cada vez, y esta acción de procesamiento puede ser completada por algún software, dispositivo terminal o IA. Esta es también una práctica muy madura en soluciones técnicas de ingeniería actuales, como usar un navegador para acceder a un sitio web, donde el servidor puede aprender parte de la información de contexto del usuario.

### 🌟 Visión

ICP (Interactive Conversation Protocol) tiene como objetivo construir una forma de lenguaje intermedio entre humanos y máquinas, logrando una comunicación bidireccional eficiente, precisa y rica entre humanos y máquinas:

#### Humano → Máquina: Replicación Integral del Significado y Contexto Expresados

- Capturar el significado y el contexto expresados por humanos de la manera más integral posible
- Transformar el lenguaje natural y las intenciones de interacción en elementos estructurados que las máquinas puedan entender con precisión
- Preservar la precisión de la interacción y la información contextual

#### Máquina → Humano: Ensamblaje Dinámico de Métodos Interactivos

- Integrar anotaciones de conceptos con el contexto actual
- Ensamblar dinámicamente los métodos de interacción más adecuados basándose en las capacidades del dispositivo y las preferencias del usuario
- Apoyar la presentación de información multi-perceptual (texto, voz, visión, tacto, olfato, etc.)

