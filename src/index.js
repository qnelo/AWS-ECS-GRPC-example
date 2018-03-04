const calculator = ({operator, num1, num2}) => {
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