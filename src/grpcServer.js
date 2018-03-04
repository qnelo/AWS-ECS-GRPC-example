const grpc = require('grpc');
const nodeCalculator = require('./index');
const grpcProto = grpc.load(`${__dirname}/calculator.proto`).grpccalculator;

/**
 * Calculator wrapper
 * @param {Object} input Parameters
 * @param {callback} callback callback
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
server.bind('localhost:50051', grpc.ServerCredentials.createInsecure());
server.start();