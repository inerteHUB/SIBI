# Frontend Biblioteca

Sistema de biblioteca - interfaz web desarrollada con Next.js 15 y TypeScript. Permite gestionar permisos, módulos, roles y usuarios.

## Características Principales

- Autenticación de usuarios con flujo de login protegido.
- Gestión de roles con asignación de permisos por módulo.
- Gestión de módulos y submódulos del sistema.
- Gestión de usuarios por facultad.
- Modo oscuro / claro.

## Requisitos Previos

- [Node.js](https://nodejs.org/) **node 22.14.0**
- Backend API REST corriendo.

## Tecnologías Utilizadas

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [Sonner](https://sonner.emilkowal.ski/) (notificaciones)
- [next-themes](https://github.com/pacocoursey/next-themes) (modo oscuro/claro)

## Instalación

Instalar las dependencias:
```bash
npm install
```

Iniciar el servidor de desarrollo:
```bash
npm run dev
```

Construir para producción:
```bash
npm run build
npm run start
```

## Estructura del Proyecto

- `app/`: Rutas y páginas (App Router de Next.js).
  - `login/`: Autenticación de usuarios.
  - `modules/`: Área principal protegida.
    - `module/`: Gestión de módulos y permisos.
    - `role/`: Gestión de roles.
    - `user/`: Gestión de usuarios.
- `components/`: Componentes compartidos (sidebar, header, formularios, etc.).
  - `ui/`: Componentes de interfaz base (shadcn/ui).
- `config/`: Constantes y configuración global.
- `hooks/`: Hooks globales (autenticación, logout, sidebar).
- `lib/`: Utilidades generales.
