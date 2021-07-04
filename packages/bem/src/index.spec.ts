import {describe, it, expect} from '@jest/globals';
import {bem} from './';

describe('bem helper correctly transforms', () => {
    it('block', () => {
        const b = bem('block');
        expect(b()).toBe('block');
    });
    it('element', () => {
        const b = bem('block');
        expect(b('element')).toBe('block__element');
    });
    it('block with boolean modifier true', () => {
        const b = bem('block');
        expect(b({bool: true})).toBe('block _bool');
    });
    it('block with boolean modifier false', () => {
        const b = bem('block');
        expect(b({bool: false})).toBe('block');
    });
    it('block with camelcased modifier', () => {
        const b = bem('block');
        expect(b({camelCase: true})).toBe('block _camel-case');
    });
    it('block with string modifier', () => {
        const b = bem('block');
        expect(b({foo: 'bar'})).toBe('block _foo_bar');
    });
    it('element with boolean modifier true', () => {
        const b = bem('block');
        expect(b('element', {bool: true})).toBe('block__element _bool');
    });
    it('element with boolean modifier false', () => {
        const b = bem('block');
        expect(b('element', {bool: false})).toBe('block__element');
    });
    it('element with camelcased modifier', () => {
        const b = bem('block');
        expect(b('element', {camelCase: true})).toBe(
            'block__element _camel-case',
        );
    });
    it('element with string modifier', () => {
        const b = bem('block');
        expect(b('element', {foo: 'bar'})).toBe('block__element _foo_bar');
    });
});
