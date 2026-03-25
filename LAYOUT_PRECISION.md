# Guía de Precisión de Layout (Biolab Pro v1.0.6)

Este documento sirve como referencia técnica para mantener la integridad del diseño "Gold Standard" validado en la versión 1.0.6. Cualquier cambio futuro en la estructura debe respetar estos principios para evitar regresiones en la adaptabilidad a pantalla completa.

## 1. Estructura Core (AppLayout.vue)

La estructura fundamental se basa en un contenedor Flex horizontal que debe ocupar todo el viewport:

```html
<div class="flex h-screen overflow-hidden">
  <!-- Sidebar -->
  <aside class="w-64 flex-shrink-0">...</aside>
  
  <!-- Main Content Area -->
  <main class="flex-1 min-w-0 h-screen flex flex-col">
    <header>...</header>
    <div class="flex-1 overflow-y-auto w-full">
      <slot />
    </div>
  </main>
</div>
```

### Reglas de Oro:
1.  **flex-shrink-0** en el Sidebar: Evita que el menú se estreche cuando el contenido derecho es ancho (ej. gráficas).
2.  **flex-1 min-w-0** en el Main: Permite que el área de contenido se expanda para llenar todo el espacio restante y previene desbordamientos inesperados.
3.  **w-full** en el contenedor del Slot: Asegura que el contenido interno de las vistas aproveche todo el ancho asignado.

## 2. Estándares de Espaciado Vertical

Para mantener una separación profesional y consistente:
*   **Vistas Estándar**: `space-y-8` en el contenedor raíz de la vista.
*   **Dashboard / Hero Views**: `space-y-12` para dar más "aire" a las secciones principales.

## 3. Adaptabilidad a Pantalla Completa

*   **SIN max-w**: No se deben usar contenedores restrictivos como `max-w-4xl` o `max-w-[1600px]` en las vistas principales.
*   **Tables**: Las tablas deben usar `w-full` y estar envueltas en un `div` con `overflow-x-auto` para asegurar que sean legibles en tablets y pantallas pequeñas sin romper el layout.

## 4. Referencia de Versión
El diseño actual en **v1.0.6** es el modelo a seguir para cualquier nuevo módulo (ej. nuevas evaluaciones o perfiles).
