# Ejemplo de aplicación sobre AWS ECS comunicandose sobre GRPC con NodeJS

El objetivo del repositorio es servir como guia para el desarrollo de un microservicio desarrollado con NodeJS que se comunica con GRPC y se despliegue en [Amazon Elastic Container Service](https://aws.amazon.com/ecs/).

Para ello se detallarán una lista de pasos a seguir.

## 1.- Crear un proyecto simple.
Se crea una calculadora simple a la cual se le pasa el operador y dos operandos como parametros.

```js
const calculator = (operator, num1, num2) => {
    switch (operator) {
    case 'sum':
        return num1 + num2;
    case 'res':
        return num1 - num2;
    case 'mul':
        return num1 * num2;
    case 'div':
        return num1 / num2;
    default:
        return null;
    }
};

module.exports = calculator;
```

## 2.- Dockerizar la aplicación.

El segundo paso será dockerizar la aplicacion, para ello se ocupará la imagen de docker `carbon-alpine`, la cual es una imagen liviana de node version 8,9.4 dockerizada. Mas información en el [repositorio oficial de Node en el hub de Docker](https://hub.docker.com/_/node/).

El primer paso es crear el archivo `Dockerfile` en la raiz del proyecto con el siguiente contenido.

```Dockerfile
# Imagen base que se ocupará, esta version viene con NPM instalado
FROM node:carbon-alpine

# Se crea y define la carpeta de la aplicación dentro del contenedor
WORKDIR /src/app

# Copia el o los archivos json que necesita npm para instalar las dependecias
COPY package*.json ./

# Se instalan las dependencias
RUN npm install

# Se copian los archivos fuentes del proyecto en el contenedor
ADD . /src/app
```

Más información en ls [pagina de referencia de docker](https://docs.docker.com/engine/reference/builder/).

## 3.- Utilizar `docker-compose` para manejar el contenedor

`docker-compose` es una herramienta que permite manejar el ciclo de vida de una aplicacion dockerizada, para mayor información visitar la [referencia de `docker-compose` en línea](https://docs.docker.com/compose/overview/).

```yml
version: '3'
services:

  app:
    tty: true
    build:
      context: .
      dockerfile: Dockerfile
    command: npm run test
```

Se ocupa la version 3 de `docker-compose` y se define un servicio `app` que se levantará un contenedor segun la definición del archivo `Dockerfile` y luego ejecutará el comando `npm run test`.