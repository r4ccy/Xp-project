# XP Project

## Descripción

Este proyecto implementa dos historias de usuario orientadas al apoyo del análisis y diseño de software:

1. **Gestión de Tarjetas CRC**
2. **Análisis de Complejidad Algorítmica**

La aplicación permite registrar y administrar tarjetas CRC para el modelado orientado a objetos, así como analizar funciones individuales para estimar su complejidad temporal mediante notación Big O.

---

# Gestión de Tarjetas CRC

## Objetivo

Permitir la creación y administración de tarjetas CRC (Class, Responsibility, Collaborator) utilizadas durante el diseño de sistemas orientados a objetos.

## Funcionalidades

* Crear tarjetas CRC.
* Consultar tarjetas existentes.
* Listar todas las tarjetas registradas.
* Actualizar información de una tarjeta.
* Eliminar tarjetas.
* Agregar y eliminar responsabilidades.
* Agregar y eliminar colaboradores.
* Evitar nombres de tarjetas duplicados.
* Evitar responsabilidades y colaboradores duplicados.

## Estructura de una tarjeta CRC

Cada tarjeta contiene:

* Nombre de la clase.
* Responsabilidades.
* Colaboradores.

Ejemplo:

| Clase       | Responsabilidades     | Colaboradores |
| ----------- | --------------------- | ------------- |
| Colaborador | Registrar información | Sistema       |

---

# Análisis de Complejidad Algorítmica

## Objetivo

Permitir que un desarrollador registre funciones individuales y obtenga una estimación de su complejidad temporal utilizando notación Big O.

## Alcance

El análisis se realiza sobre funciones registradas de manera individual.

No se analiza un proyecto completo ni múltiples archivos simultáneamente.

## Funcionalidades

* Registrar funciones para análisis.
* Consultar funciones registradas.
* Actualizar funciones existentes.
* Eliminar funciones y sus resultados asociados.
* Evitar nombres de función duplicados.
* Recalcular automáticamente la complejidad cuando una función es modificada.

## Complejidades soportadas

| Patrón detectado                      | Resultado |
| ------------------------------------- | --------- |
| Sin ciclos ni recursividad            | O(1)      |
| Recursividad simple                   | O(n)      |
| Dos ciclos anidados dependientes de n | O(n²)     |

Si la complejidad no puede determinarse mediante las reglas definidas, el sistema genera un mensaje de error y no almacena resultados inválidos.

---

# Tecnologías Utilizadas

## Backend

* Node.js
* Express
* PostgreSQL / Supabase
* Jest

## Frontend

* HTML
* CSS
* JavaScript

---

# Pruebas

El proyecto incluye pruebas automatizadas para validar:

* Registro de tarjetas CRC.
* Validación de duplicados.
* Gestión de responsabilidades y colaboradores.
* Registro y actualización de funciones.
* Análisis de complejidad.
* Casos de error definidos por las historias de usuario.

---

# Ejecución

## Instalar dependencias

```bash
npm install
```

## Ejecutar el servidor

```bash
node backend/app.js
```

## Ejecutar pruebas

```bash
npm test
```
Abrir en el navegador:

http://localhost:3000