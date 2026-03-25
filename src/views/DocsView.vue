<template>
  <AppLayout title="Documentación Científica">
    <div class="w-full space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <!-- Hero Header -->
      <div class="text-center space-y-4 py-8">
        <h1 class="text-4xl md:text-5xl font-black text-app-text tracking-tight uppercase">
          Laboratorio de <span class="text-violet-500">Biomecánica</span>
        </h1>
        <p class="text-app-text-muted font-medium tracking-widest uppercase text-xs">Desarrollado por Psicología y Sinergia</p>
        <div class="w-24 h-1 bg-violet-500 mx-auto rounded-full opacity-50"></div>
      </div>

      <!-- 1. JUSTIFICACIÓN -->
      <section class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold">1</div>
          <h2 class="text-2xl font-bold text-app-text">Justificación Pedagógica e Interdisciplinariedad</h2>
        </div>
        <div class="bg-app-surface border border-app-border p-8 rounded-3xl shadow-sm space-y-6 text-app-text/90 leading-relaxed">
          <p>
            El <strong>"Laboratorio de Biomecánica"</strong> transforma la pista deportiva en un ecosistema de aprendizaje basado en datos (Data Science) y metodología STEAM (Ciencia, Tecnología, Ingeniería, Arte y Matemáticas). Su diseño modular permite adaptar su uso a diferentes etapas educativas:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <h4 class="font-bold text-violet-500 text-sm uppercase tracking-wider">Educación Física y CAFYD</h4>
              <p class="text-sm">Introduce al alumnado en la evaluación tecnológica del rendimiento. Elimina el error del cronometraje manual y permite aplicar protocolos científicos para medir la potencia, la fatiga del Sistema Nervioso Central (SNC) y los tiempos de reacción puros.</p>
            </div>
            <div class="space-y-3">
              <h4 class="font-bold text-violet-500 text-sm uppercase tracking-wider">Física y Matemáticas (ESO y Bachillerato)</h4>
              <p class="text-sm">El alumnado experimenta la cinemática de Newton en su propio cuerpo. A través del "Pre-Análisis Biomecánico", comprueban en tiempo real cómo su peso y su tiempo se traducen en ecuaciones de movimiento uniformemente acelerado, fuerza y potencia.</p>
            </div>
            <div class="space-y-3">
              <h4 class="font-bold text-violet-500 text-sm uppercase tracking-wider">Tecnología y Robótica</h4>
              <p class="text-sm">El hardware es una demostración viva de Internet de las Cosas (IoT), Edge Computing, interrupciones de hardware de alta velocidad (ISRs) y comunicaciones inalámbricas (Wi-Fi + Bluetooth BLE).</p>
            </div>
            <div class="space-y-3">
              <h4 class="font-bold text-violet-500 text-sm uppercase tracking-wider">Ciencia de Datos (Data Science)</h4>
              <p class="text-sm">El sistema genera un archivo listo para Ciencia de Datos con las siguientes columnas: Fecha, Hora, Atleta, Peso_kg, Categoria, Prueba, Marca, Unidad, Distancia_m, T_Reaccion_s, T_Vuelo_s, T_Contacto_s, Tramos.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. ARQUITECTURA -->
      <section class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold">2</div>
          <h2 class="text-2xl font-bold text-app-text">Arquitectura del Sistema (Hardware y Software)</h2>
        </div>
        <div class="bg-app-surface border border-app-border p-8 rounded-3xl shadow-sm space-y-8">
          <div class="space-y-4">
            <h3 class="font-bold text-app-text flex items-center gap-2">
              <CpuIcon :size="18" class="text-violet-500" />
              2.1. Hardware de Alta Precisión
            </h3>
            <ul class="space-y-4 text-sm text-app-text/80 ml-6">
              <li><span class="text-violet-500 font-bold">Microcontrolador ESP32 WROVER:</span> Procesador de doble núcleo operando a 240 MHz, garantizando lecturas con precisión de milisegundos.</li>
              <li><span class="text-violet-500 font-bold">Plataforma de Contacto (Pin 25):</span> Circuito de cierre por presión para registrar tiempos de vuelo y contacto.</li>
              <li><span class="text-violet-500 font-bold">Fotocélulas Industriales Dark-ON:</span>
                <ul class="ml-6 mt-2 space-y-1 opacity-80">
                  <li>• Célula A (Pin 13): Control de Salida y detección de pie en el taco.</li>
                  <li>• Célula B (Pin 14): Control de Meta y retornos de agilidad.</li>
                </ul>
              </li>
              <li><span class="text-violet-500 font-bold">Módulo de Estímulos y Control:</span> Foco LED de alta potencia (Pin 21) y Zumbador piezoeléctrico (Pin 26). Pulsador de mando del entrenador (Pin 27) con filtro anti-rebote.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 3. PROTOCOLOS -->
      <section class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold">3</div>
          <h2 class="text-2xl font-bold text-app-text">Protocolos de Evaluación</h2>
        </div>
        
        <!-- A: PLATAFORMA -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-violet-500 uppercase tracking-tighter flex items-center gap-2">
            <ZapIcon :size="20" /> MÓDULO A: PLATAFORMA DE SALTOS
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-app-surface border border-app-border p-6 rounded-2xl space-y-3 hover:border-violet-500/30 transition-colors">
              <h4 class="font-bold text-app-text text-sm">1. Salto Bosco (Abalakov / CMJ / SJ)</h4>
              <p class="text-[11px] text-app-text/70 leading-relaxed">
                <span class="font-bold text-app-text">Protocolo:</span> Atleta sobre la plataforma. Tras la estabilización (luz verde), realiza un salto vertical máximo.<br>
                <span class="font-bold text-app-text text-violet-500">Registro:</span> Tiempo de vuelo y altura estimada.
              </p>
            </div>
            <div class="bg-app-surface border border-app-border p-6 rounded-2xl space-y-3 hover:border-violet-500/30 transition-colors">
              <h4 class="font-bold text-app-text text-sm">2. Drop Jump o Salto Reactivo (RSI)</h4>
              <p class="text-[11px] text-app-text/70 leading-relaxed">
                <span class="font-bold text-app-text">Protocolo:</span> Caída desde un cajón hacia la plataforma, seguida de un rebote explosivo inmediato.<br>
                <span class="font-bold text-app-text text-violet-500">Registro:</span> Tiempo de Contacto ($T_c$), Tiempo de Vuelo e Índice de Fuerza Reactiva (RSI).
              </p>
            </div>
            <div class="bg-app-surface border border-app-border p-6 rounded-2xl space-y-3 hover:border-violet-500/30 transition-colors">
              <h4 class="font-bold text-app-text text-sm">3. Tapping Test (10 segundos)</h4>
              <p class="text-[11px] text-app-text/70 leading-relaxed">
                <span class="font-bold text-app-text">Protocolo:</span> Prueba de fatiga neuromuscular. El atleta "zapatea" a máxima velocidad durante 10s exactos.<br>
                <span class="font-bold text-app-text text-violet-500">Registro:</span> Número de impactos y frecuencia de disparo del SNC en Hz.
              </p>
            </div>
          </div>
        </div>

        <!-- B: PISTA -->
        <div class="space-y-4 pt-4">
          <h3 class="text-lg font-bold text-red-500 uppercase tracking-tighter flex items-center gap-2">
            <TimerIcon :size="20" /> MÓDULO B: PISTA (Sprints y Agilidad)
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-app-surface border border-app-border p-6 rounded-2xl space-y-3 hover:border-red-500/30 transition-colors">
              <h4 class="font-bold text-app-text text-sm">1. Velocidad Pura</h4>
              <p class="text-[11px] text-app-text/70 leading-relaxed">El atleta arranca libremente. El crono inicia al cortar la Célula A y frena en la B. (Requiere distancia en metros).</p>
            </div>
            <div class="bg-app-surface border border-app-border p-6 rounded-2xl space-y-3 hover:border-red-500/30 transition-colors">
              <h4 class="font-bold text-app-text text-sm">2. Velocidad Clásica</h4>
              <p class="text-[11px] text-app-text/70 leading-relaxed">
                El atleta espera en A. El entrenador pulsa el mando. Suena el pitido y arranca el crono. <br>
                <span class="text-red-500 font-bold uppercase text-[9px]">Aviso Nula:</span> Si el atleta sale antes, el sistema pita NULA.
              </p>
            </div>
            <div class="bg-app-surface border border-app-border p-6 rounded-2xl space-y-3 hover:border-red-500/30 transition-colors">
              <h4 class="font-bold text-app-text text-sm">3. Agilidad Configurable</h4>
              <p class="text-[11px] text-app-text/70 leading-relaxed">Se introducen los "Tramos". El atleta esprinta entre A y B. Pitidos de confirmación en cada giro.</p>
            </div>
          </div>
        </div>

        <!-- C: REACCIÓN -->
        <div class="space-y-4 pt-4">
          <h3 class="text-lg font-bold text-blue-500 uppercase tracking-tighter flex items-center gap-2">
            <TargetIcon :size="20" /> MÓDULO C: REACCIÓN DESDE TACOS
          </h3>
          <div class="bg-app-surface border border-app-border p-8 rounded-3xl space-y-4">
            <p class="text-sm text-app-text/80 leading-relaxed">
              <span class="font-bold text-app-text">Protocolo:</span> No se utiliza la Célula B. El atleta introduce la puntera cortando el láser de la Célula A (semáforo verde). El entrenador dispara el estímulo (Acústico, Visual o Mixto). El crono se detiene en el milisegundo exacto en el que el pie abandona el láser A.<br>
              <span class="font-bold text-blue-500">Registro:</span> Tiempo de Reacción Puro.
            </p>
          </div>
        </div>
      </section>

      <!-- 4. FUNDAMENTOS -->
      <section class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold">4</div>
          <h2 class="text-2xl font-bold text-app-text">Fundamentos Físicos y Algoritmos</h2>
        </div>
        <div class="bg-slate-900 border border-white/5 rounded-[3rem] p-10 space-y-8 font-mono shadow-2xl overflow-hidden relative">
          <div class="absolute top-0 right-0 p-8 opacity-10">
            <FlaskConicalIcon :size="120" class="text-violet-500" />
          </div>
          <div class="space-y-6 relative z-10">
            <h3 class="text-violet-400 font-bold border-b border-violet-500/20 pb-2 text-sm">A. Cinemática del Salto Vertical</h3>
            <div class="bg-black/40 p-6 rounded-2xl border border-white/10 text-center space-y-4">
              <code class="text-2xl text-white font-black">h = (g · t²) / 8 · 100</code>
              <p class="text-[10px] text-slate-400 italic">Altura en cm, donde g = 9.81 y t = tiempo de vuelo.</p>
              <div class="pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div class="space-y-1">
                  <p class="text-[10px] text-violet-400 uppercase font-bold">Potencia Pico de Sayers (1999)</p>
                  <p class="text-xs text-slate-200">P (W) = (60.7 · h) + (45.3 · masa) - 2055</p>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] text-violet-400 uppercase font-bold">Trabajo Mecánico</p>
                  <p class="text-xs text-slate-200">W (Joules) = masa · g · h_metros</p>
                </div>
              </div>
            </div>

            <h3 class="text-violet-400 font-bold border-b border-violet-500/20 pb-2 pt-4 text-sm">B. Cinemática del Sprint (v0 = 0)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2">
                <p class="text-[10px] text-slate-400 tracking-widest">VELOCIDAD MEDIA</p>
                <code class="text-slate-100">v = d / t</code>
              </div>
              <div class="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2">
                <p class="text-[10px] text-slate-400 tracking-widest">ACELERACIÓN MEDIA</p>
                <code class="text-slate-100">a = 2 · d / t²</code>
              </div>
              <div class="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2">
                <p class="text-[10px] text-slate-400 tracking-widest">FUERZA APLICADA</p>
                <code class="text-slate-100">F = masa · a</code>
              </div>
              <div class="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2">
                <p class="text-[10px] text-slate-400 tracking-widest">POTENCIA MEDIA</p>
                <code class="text-slate-100">P = F · v</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. GUÍA DIDÁCTICA -->
      <section class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold">5</div>
          <h2 class="text-2xl font-bold text-app-text">Guía Didáctica: Prácticas de Campo</h2>
        </div>

        <!-- NIVEL 1 -->
        <div class="bg-app-surface border border-app-border rounded-[2.5rem] overflow-hidden">
          <div class="bg-violet-500 p-6 text-white">
            <h3 class="font-black italic uppercase tracking-tighter text-xl">NIVEL 1: ESO y Bachillerato (Física Aplicada)</h3>
          </div>
          <div class="p-8 space-y-8">
            <div class="space-y-4">
              <h4 class="font-bold text-app-text border-b border-app-border pb-2">Práctica 1: "Desafiando a Newton"</h4>
              <p class="text-sm italic text-app-text-muted">Desarrollo: Un alumno introduce su peso y hace un sprint de 15m Velocidad Pura.</p>
              <div class="bg-app-bg p-6 rounded-2xl space-y-4 border border-app-border">
                <p class="text-xs font-bold text-violet-500 uppercase tracking-widest">Cuestiones:</p>
                <ul class="text-sm space-y-3 list-decimal ml-4 text-app-text/80">
                  <li>Al terminar, abre el "Pre-Análisis Biomecánico". Anota tu tiempo, tu Fuerza (N) y tu Aceleración ($m/s^2$).</li>
                  <li>Aplica la fórmula $F = m · a$ con tu peso en kg. ¿Coincide con el laboratorio?</li>
                  <li>Si un coche pesa 1000kg, ¿cuántos Newtons harían falta para moverlo? Compara con tu fuerza.</li>
                </ul>
              </div>
            </div>
            <div class="space-y-4">
              <h4 class="font-bold text-app-text border-b border-app-border pb-2">Práctica 2: "¿Quién tiene la chispa?" (Biología)</h4>
              <p class="text-sm italic text-app-text-muted">Desarrollo: Ejecutar 3 pruebas de REACCIÓN (acústica, visual y mixta).</p>
              <div class="bg-app-bg p-6 rounded-2xl space-y-4 border border-app-border">
                <p class="text-xs font-bold text-violet-500 uppercase tracking-widest">Cuestiones:</p>
                <ul class="text-sm space-y-3 list-decimal ml-4 text-app-text/80">
                  <li>¿Ante qué estímulo has sido más rápido?</li>
                  <li>Sabiendo que un parpadeo dura 0.3s, ¿has sido más rápido?</li>
                  <li>Justifica el recorrido del impulso nervioso desde tu oreja/ojo hasta el gemelo.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- NIVEL 2 -->
        <div class="bg-app-surface border border-app-border rounded-[2.5rem] overflow-hidden">
          <div class="bg-blue-600 p-6 text-white">
            <h3 class="font-black italic uppercase tracking-tighter text-xl">NIVEL 2: Universidad / CAFYD (Alto Rendimiento)</h3>
          </div>
          <div class="p-8 space-y-8">
            <div class="space-y-4">
              <h4 class="font-bold text-app-text border-b border-app-border pb-2">Práctica 3: Perfil Pliométrico</h4>
              <p class="text-sm italic text-app-text-muted">Desarrollo: Realizar un Drop Jump (RSI) desde 30 cm y un Tapping Test.</p>
              <div class="bg-app-bg p-6 rounded-2xl space-y-4 border border-app-border">
                <p class="text-xs font-bold text-blue-500 uppercase tracking-widest">Análisis de Datos:</p>
                <ul class="text-sm space-y-3 list-decimal ml-4 text-app-text/80">
                  <li>Filtra sujetos con RSI < 1.5. ¿Quién tiene mayor "amnesia de impacto" (absorbe demasiada energía excéntrica)?</li>
                  <li>Si la frecuencia baja de 5.5Hz a 4.1Hz semanal... ¿qué diagnóstico fisiológico harías sobre su SNC?</li>
                </ul>
              </div>
            </div>
            <div class="space-y-4">
              <h4 class="font-bold text-app-text border-b border-app-border pb-2">Práctica 4: El Déficit COD</h4>
              <p class="text-sm italic text-app-text-muted">Desarrollo: Sprint recto 10m vs Agilidad 2 tramos (5+5m).</p>
              <div class="bg-app-bg p-6 rounded-2xl space-y-4 border border-app-border">
                <p class="text-xs font-bold text-blue-500 uppercase tracking-widest">Análisis de Datos:</p>
                <ul class="text-sm space-y-3 list-decimal ml-4 text-app-text/80">
                  <li>Resta el tiempo del sprint recto al de agilidad para aislar el "Tiempo perdido en girar".</li>
                  <li>Justifica por qué atletas con mayor masa muscular presentan a veces mayor déficit COD debido a la inercia.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. SINERGIA TEACHER SYNC -->
      <section class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold">6</div>
          <h2 class="text-2xl font-bold text-app-text">Sincronización con Sinergia Teacher</h2>
        </div>
        <div class="bg-app-surface border border-app-border p-8 rounded-3xl shadow-sm space-y-6">
          <p class="text-app-text/90 leading-relaxed">
            Biolab Pro se integra de forma nativa con el ecosistema <strong>Sinergia Teacher</strong> para permitir una gestión de datos centralizada y segura. Esta funcionalidad está diseñada bajo el principio de <em>Privacy by Design</em>.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-app-bg/50 p-6 rounded-2xl border border-app-border space-y-3">
              <h4 class="font-bold text-violet-500 flex items-center gap-2 text-sm uppercase">
                <ShieldCheckIcon :size="16" /> Importación Privada
              </h4>
              <p class="text-[11px] text-app-text/70">
                Al importar un alumno mediante su código personal, los nombres reales nunca se persisten en el almacenamiento local de Biolab Pro para proteger la identidad de los menores. Si el servidor no contiene un nombre, se asignará el alias "Atleta (Código)".
              </p>
            </div>
            <div class="bg-app-bg/50 p-6 rounded-2xl border border-app-border space-y-3">
              <h4 class="font-bold text-violet-500 flex items-center gap-2 text-sm uppercase">
                <CloudSyncIcon :size="16" /> Sincronización Automática
              </h4>
              <p class="text-[11px] text-app-text/70">
                Los resultados de las pruebas de <strong>Abalakov (Salto Vertical)</strong> y <strong>30 metros Velocidad</strong> se exportan automáticamente a la nube de Sinergia. Si no hay conexión a internet, los datos se encolan y se envían al detectar conectividad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. PRIVACIDAD Y PROTECCIÓN DE DATOS -->
      <section class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold">7</div>
          <h2 class="text-2xl font-bold text-app-text flex items-center gap-2">
            <ShieldCheckIcon :size="24" />
            Tratamiento de Datos y Privacidad
          </h2>
        </div>
        <div class="bg-blue-500/5 border border-blue-500/20 p-8 rounded-3xl shadow-sm space-y-6">
          <p class="text-sm text-app-text/90 leading-relaxed">
            Biolab Pro ha sido desarrollado bajo el principio de <strong>"Privacidad desde el Diseño" (Privacy by Design)</strong>, garantizando que el tratamiento de la información cumpla con los estándares más exigentes de protección de datos, especialmente en entornos educativos con menores de edad.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <h4 class="font-bold text-blue-500 text-xs uppercase tracking-wider">Protección de Menores</h4>
              <p class="text-[11px] text-app-text/80 leading-relaxed">
                El sistema evita proactivamente el almacenamiento de datos identificativos (nombres reales) en la base de datos local. La vinculación entre el rendimiento físico y el alumno se realiza únicamente mediante códigos alfanuméricos anónimos generados por Sinergia Teacher.
              </p>
            </div>
            <div class="space-y-3">
              <h4 class="font-bold text-blue-500 text-xs uppercase tracking-wider">Seguridad en la Nube</h4>
              <p class="text-[11px] text-app-text/80 leading-relaxed">
                La sincronización utiliza comunicación cifrada de extremo a extremo (SSL/TLS). El acceso a los datos en Firebase se rige por reglas de seguridad de nivel de documento, asegurando que solo el usuario autorizado pueda consultar o registrar información.
              </p>
            </div>
            <div class="space-y-3">
              <h4 class="font-bold text-blue-500 text-xs uppercase tracking-wider">Soberanía de Datos</h4>
                <p class="text-[11px] text-app-text/80 leading-relaxed">
                  Biolab Pro actúa solo como un procesador de datos en tiempo real. La persistencia local es mínima y orientada al uso inmediato en sesión. El docente mantiene en todo momento el control sobre qué datos se sincronizan y cuándo se eliminan de la memoria local.
                </p>
            </div>
            <div class="space-y-3">
              <h4 class="font-bold text-blue-500 text-xs uppercase tracking-wider">Cumplimiento RGPD</h4>
              <p class="text-[11px] text-app-text/80 leading-relaxed">
                Al no utilizar cookies de seguimiento ni almacenar metadatos de comportamiento, la aplicación minimiza el riesgo de exposición. El sistema está diseñado para ser una herramienta transparente y segura para el departamento de Educación Física.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 8. ACERCA DE -->
      <section class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold">8</div>
          <h2 class="text-2xl font-bold text-app-text flex items-center gap-2">
            <InfoIcon :size="24" />
            Acerca de Biolab Pro
          </h2>
        </div>
        <div class="bg-gradient-to-br from-violet-600 to-indigo-700 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
          <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div class="relative z-10 space-y-6">
            <div class="flex items-center gap-4">
              <img src="/logo_sinergia.png" alt="Sinergia" class="w-16 h-16 brightness-0 invert" />
              <div>
                <h3 class="text-2xl font-black uppercase italic tracking-tighter text-white">Psicología y Sinergia</h3>
                <p class="text-white/80 text-sm font-medium">Innovación en Ciencias del Deporte</p>
              </div>
            </div>
            <p class="text-white/90 text-sm leading-relaxed max-w-2xl">
              Este ecosistema tecnológico es propiedad de <strong>Ángel Cabrera Ochoa</strong>, Licenciado en Ciencias de la Actividad Física y el Deporte y Graduado en Psicología. Biolab Pro representa la convergencia entre la fisiología del ejercicio, el análisis de datos y la tecnología aplicada a la educación y el alto rendimiento.
            </p>
            <div class="pt-6 border-t border-white/20 flex flex-wrap gap-6 text-white">
              <div class="space-y-1">
                <p class="text-[10px] uppercase font-bold text-white/60">Sitio Web</p>
                <a href="https://www.psicologiaysinergia.es/" target="_blank" class="text-sm font-bold hover:underline">www.psicologiaysinergia.es</a>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] uppercase font-bold text-white/60">Contacto</p>
                <a href="mailto:info@psicologiaysinergia.es" class="text-sm font-bold hover:underline">info@psicologiaysinergia.es</a>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] uppercase font-bold text-white/60">Instagram</p>
                <a href="https://www.instagram.com/psicologiaysinergia/" target="_blank" class="text-sm font-bold hover:underline">@psicologiaysinergia</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer Info -->
      <div class="text-center pt-10">
        <p class="text-[10px] text-app-text-muted uppercase tracking-[0.5em] font-medium">Biolab Pro v1.0.6 • Build 2024</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue';
import { 
  CpuIcon, 
  ZapIcon, 
  TimerIcon, 
  TargetIcon,
  FlaskConicalIcon,
  CloudSyncIcon,
  InfoIcon,
  ShieldCheckIcon
} from 'lucide-vue-next';
</script>
