// code generation from templates is ugly and unsafe,

import {BemTree, Modifiers} from './common';

const isEmpty = <T>(obj: Record<string, T>): boolean => {
    return Object.keys(obj).length === 0;
};

// but loading babel to generate code at runtime in IDE is an overkill
const generateUnion = (values: string[]): string => {
    return values.map((value) => JSON.stringify(value)).join(' | ');
};

const generateModifiers = (modifiers: Modifiers): string => {
    const fields = Object.entries(modifiers)
        .map(([name, values]) => {
            return `${name}?: ${
                values === true ? 'boolean' : generateUnion(values)
            }`;
        })
        .join(', ');
    return `{${fields}}`;
};

const generateElement = (
    element: string,
    modifiers: Modifiers,
) => `        (element: ${JSON.stringify(element)}): string;
        (
            element: ${JSON.stringify(element)},
            ${
                isEmpty(modifiers)
                    ? ''
                    : `modifiers: ${generateModifiers(modifiers)}`
            }
        ): string;`;

const generateBlock = (
    name: string,
    modifiers: Modifiers,
    elements: Record<string, Modifiers>,
) => `
    (block: ${JSON.stringify(name)}): {
        (): string;
        ${
            isEmpty(modifiers)
                ? ''
                : `(modifiers: ${generateModifiers(modifiers)}): string;`
        }
${Object.entries(elements)
    .map(([element, modifiers]) => generateElement(element, modifiers))
    .join('\n')}
    }
`;

export const generateTypings = (blocks: BemTree): string => `
interface Bem {${Object.entries(blocks)
    .map(([block, {modifiers, elements}]) =>
        generateBlock(block, modifiers, elements),
    )
    .join('\n')}
}
export declare const bem: Bem;
`;

export const generateError = (errors: string[]): string => {
    const rows = errors.map((error) => `        ${JSON.stringify(error)}: 1;`);
    return `
declare const error: unique symbol;
export declare const bem: {
    [error]: {
${rows.join('\n')}
    };
};
    `;
};
