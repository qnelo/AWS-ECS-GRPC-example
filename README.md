# Ejemplo de aplicación sobre AWS ECS comunicandose sobre GRPC con NodeJS

El objetivo del repositorio es servir como guia para el desarrollo de un microservicio desarrollado con NodeJS que se comunica con GRPC y se despliegue en [Amazon Elastic Container Service](https://aws.amazon.com/ecs/).

Para ello se detallarán una lista de pasos a seguir.

## 1.- Crear un proyecto simple.
Se crea una calculadora simple a la cual se le pasa el operador y dos operandos como parametros.

```js
/**
 * Calculator function
 * @param {Object} params Object with params
 * @returns {Integer} result
 */
const calculator = ({ operator, num1, num2 }) => {
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

# Dependencias necesarias para instalación de GRPC
RUN apk add --no-cache make gcc g++ python

# Se crea y define la carpeta de la aplicación dentro del contenedor
WORKDIR /src/app

# Copia el o los archivos json que necesita npm para instalar las dependecias
COPY package*.json ./

# Se instalan las dependencias
RUN npm install

# Se copian los archivos fuentes del proyecto en el contenedor
ADD . /src/app
```

Más información en la [pagina de referencia de docker](https://docs.docker.com/engine/reference/builder/).

## 3.- Utilizar `docker-compose` para manejar el contenedor

`docker-compose` es una herramienta que permite manejar el ciclo de vida de una aplicacion dockerizada, para mayor información visitar la [referencia de `docker-compose` en línea](https://docs.docker.com/compose/overview/).

```yml
# Se definen 3 servicios en este caso, pero pueden definirse mas servicios y ejecutarse todos a la vez, por separado y definir dependencias entre servicios.

version: '3'
services:

  test:
    tty: true
    build:
      context: .
      dockerfile: DockerfileTest
    command: npm run t

  test_watch:
    tty: true
    build:
      context: .
      dockerfile: DockerfileTest
    volumes:
      - .:/src/app
    command: npm run t:w

  start:
    tty: true
    build:
      context: .
      dockerfile: Dockerfile
    command: node ./src/grpcServer.js
    ports:
      - "50051:50051"
```

Se ocupa la version 3 de `docker-compose` y se definen 3 servicios (`start`, `test`, `test_watch`) los cuales levantarán contenedores segun la definición del archivo `Dockerfile` para luego ejecutar los comandos correspondientes.

## 4.- Utilizar GRPC en el proyecto.

[GRPC](https://grpc.io/) es un framework [rpc](https://es.wikipedia.org/wiki/Llamada_a_procedimiento_remoto) que permite comunicar servicios escritos en diferentes lenguajes de forma simple, bi-direccional, segura y escalable. Esta implementado sobre [http/2](https://http2.github.io/) y ocupa [protocol buffers](https://developers.google.com/protocol-buffers/docs/overview), el cual es un protocolo que serializa datos estructurados con una gran performance.

Para empezar a ocupar GRPC, se crea el archivo de definición de protocol buffer.

```protobuf
syntax = "proto3";

package grpccalculator;

service calculator {
    rpc calculator (Params) returns (Result) {}
}

message Params {
    required string operator = 1;
    required int32 num1 = 2;
    required int32 num2 = 3;
}

message Result {
    optional int32 result = 1; 
}
```

Luego se configura el servidor GRPC

```js
const grpc = require('grpc');
// Importar el archivo de calculadora
const nodeCalculator = require('./index');
// Cargar el archivo con definicion protocol buffer.
const grpcProto = grpc.load(`${__dirname}/calculator.proto`).grpccalculator;

// Funcion que invoca la calculadora
/**
 * Calculator wrapper
 * @param {Object} input Parameters
 * @param {callback} callback The callback to call to respond to the request
 * @returns {callback} result
 */
const calculator = async (input, callback) => {
    const result = await nodeCalculator(input.request);
    return callback(null, result);
};

// Funcion que define el servidor GRPC agregando el servicio de calculadora
/**
 * GRPC Server
 * @returns {GRPC} Server
*/
const grpcServer = () => {
    const newServer = new grpc.Server();
    newServer.addService(grpcProto.calculator.service, {
        calculator
    });
    return newServer;
};

// Configurar socket e iniciar el servidor.
const server = grpcServer();
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
```

Para probar el servidor, se puede crear un cliente que consuma el servidor.

```js
const grpc = require('grpc');
// Se carga la definición de protocol buffer
const grpcProto = grpc.load(`${__dirname}/calculator.proto`).grpccalculator;

// Se configura el cliente
const grpcClient = new grpcProto.calculator('localhost:50051', grpc.credentials.createInsecure());

// Se invoca el servicio
grpcClient.calculator(
    {
        operator: 'res',
        num1: 9,
        num2: 2
    }, (err, response) => {
        if (err) {
            console.info('ERROR EN LLAMADO -> ', err);
        }
        console.info('Response:', response.result);

    });
```