# 🥐 Panadería Digital — App móvil y catálogo web

App de gestión para un emprendimiento de panadería, **en producción y en uso por un cliente real**.
Con una sola base de código en **React Native + Expo** se generan dos productos:

- **App del dueño (Android / APK):** maneja pedidos, agenda, productos, recetas, insumos, promos y métricas del negocio.
- **Catálogo web para clientes:** el dueño lo comparte por WhatsApp y los clientes arman su pedido, eligen el día de entrega y ven los datos de pago.

🔗 **Web:** https://panaderia-front-psi.vercel.app
🔗 **Backend (API):** [PANADERIA-BACK](https://github.com/SHRicard/PANADERIA-BACK)

<!-- Capturas (agregar en docs/ con datos de prueba y descomentar):
| Inicio del dueño | Agenda | Catálogo web | Métricas |
|---|---|---|---|
| ![Inicio](docs/inicio.png) | ![Agenda](docs/agenda.png) | ![Catálogo](docs/catalogo.png) | ![Métricas](docs/metricas.png) |
-->

📘 **Manual de usuario:** [manual en PDF](./manual)

---

## ✨ Funcionalidades

### Para el cliente (web)
- Catálogo con estilos visuales elegibles por el dueño (vidriera, carta y temáticos de Navidad) y modo claro/oscuro.
- Filtros por tipo de producto y gusto, búsqueda, detalle con galería de fotos y recomendaciones con puntaje.
- Carrito con precios cotizados por el servidor y aviso de productos que dejaron de estar disponibles.
- Elección del **día de entrega** según la anticipación de cada producto y la agenda del negocio (días llenos y "casi llenos").
- Envío o retiro, y datos de transferencia al confirmar el pedido.
- Aviso de "local cerrado" con mensaje personalizado.

### Para el dueño (app)
- **Resumen del día:** pedidos y ventas de hoy y pedidos abiertos.
- **Pedidos:** web y manuales (los que entran por WhatsApp o en persona), con seña, entrega, cancelación, cambio de fecha y edición de productos.
- **Agenda mensual:** tope de productos por día, días llenos, "qué hay que hacer" por día y avance de producción.
- **Productos:** alta y edición con hasta 10 fotos (subida en segundo plano y marca de agua), tipos, gustos y anticipación.
- **Recetas e insumos:** costo por unidad calculado con el último precio de cada insumo, cantidades para producir N unidades y precio de venta sugerido.
- **Promos:** biblioteca de fotos y videos listos para compartir en el estado de WhatsApp.
- **Métricas:** productos y gustos más vendidos, pedidos por estado y día, clientes nuevos y recurrentes, gasto en insumos y balance.
- **Seguridad y mantenimiento:** login con JWT, recuperación de contraseña por email, visor de logs con IPs sospechosas y uso del almacenamiento de Cloudinary.

---

## 🛠️ Tecnologías

| Área | Tecnologías |
|---|---|
| Base | React Native, Expo, Expo Router (rutas por archivos), TypeScript |
| Web | React Native Web, deploy en Vercel |
| Estado | Redux Toolkit |
| Formularios | React Hook Form + Zod |
| Almacenamiento local | MMKV |
| UI y animaciones | Reanimated, Gesture Handler, SVG, Lucide Icons |
| Imágenes y archivos | Expo Image, Image Picker, Image Manipulator, File System |
| Compartir | React Native Share (WhatsApp) |
| Backend | Node.js, Express, MongoDB, Cloudinary ([ver repo](https://github.com/SHRicard/PANADERIA-BACK)) |

---

## 📁 Estructura

```
src/
├── app/        # Pantallas y navegación (Expo Router)
├── features/   # Módulos por funcionalidad (pedidos, agenda, productos…)
├── services/   # Llamadas a la API
├── store/      # Estado global (Redux Toolkit)
├── shared/     # Componentes y utilidades compartidas
├── theme/      # Colores, tipografías y modo claro/oscuro
├── config/     # Configuración de la app
└── types/      # Tipos de TypeScript
manual/         # Manual de usuario (PDF)
```

---

## 🚀 Cómo correrlo

```bash
npm install
cp .env.example .env   # URL de la API, WhatsApp del dueño y URL de la web
npx expo start         # app en Expo Go o emulador
npm run web            # versión web
npm run android        # build nativo de Android
```

Para probar con datos de ejemplo, en el backend se pueden cargar productos y pedidos de prueba con `npm run sembrar` y `npm run sembrar-pedidos`.

---

## 👤 Autor

**Ricardo Ramírez** — Desarrollador Full Stack (React · React Native · TypeScript · Node.js)
[LinkedIn](https://www.linkedin.com/in/ramirez-ricardo-dev) · [GitHub](https://github.com/SHRicard)
