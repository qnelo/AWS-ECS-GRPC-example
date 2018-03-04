const grpc = require('grpc');
const nodeCalculator = require('./index');
const grpcProto = grpc.load(`${__dirname}/calculator.proto`).grpccalculator;

const calculator = async (call, callback) => {
    const result = await nodeCalculator(call.request);
    return callback(null, result);
};

const grpcServer = () => {
    const server = new grpc.Server();
    server.addService(grpcProto.calculator.service, {
        calculator
    });
    return server;
};

const routeServer = grpcServer();
routeServer.bind('localhost:50051', grpc.ServerCredentials.createInsecure());
routeServer.start();