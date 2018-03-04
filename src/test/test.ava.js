import test from 'ava';
import calculator from '../';

test('sum test', t => {
    const response = calculator(
        {
            operator: 'sum',
            num1: 9,
            num2: 2
        }
    );
    t.is(response, 11);
});

test('res test', t => {
    const response = calculator(
        {
            operator: 'res',
            num1: 9,
            num2: 2
        }
    );
    t.is(response, 7);
});

test('mul test', t => {
    const response = calculator(
        {
            operator: 'mul',
            num1: 9,
            num2: 2
        }
    );
    t.is(response, 18);
});

test('div test', t => {
    const response = calculator(
        {
            operator: 'div',
            num1: 9,
            num2: 2
        }
    );
    t.is(response, 4.5);
});

test('other test', t => {
    const response = calculator(
        {
            operator: ':)',
            num1: 2,
            num2: 4
        });
    t.is(response, null);
});