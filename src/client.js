const grpc = require('grpc');
const grpcProto = grpc.load(`${__dirname}/calculator.proto`).grpccalculator;

const grpcClient = new grpcProto.calculator('localhost:50051', grpc.credentials.createInsecure());

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