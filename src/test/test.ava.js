import test from 'ava';
import calculator from '../index';

test('sum test', t => {
    const response = calculator('sum', 9, 2);
    t.is(response, 11);
});

test('res test', t => {
    const response = calculator('res', 9, 2);
    t.is(response, 7);
});

test('mul test', t => {
    const response = calculator('mul', 9, 2);
    t.is(response, 18);
});

test('div test', t => {
    const response = calculator('div', 9, 2);
    t.is(response, 4.5);
});