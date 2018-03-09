const grpc = require('grpc');
const nodeCalculator = require('./index');
const grpcProto = grpc.load(`${__dirname}/calculator.proto`).grpccalculator;

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

const server = grpcServer();
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();