import {parse} from 'postcss';
import parser from 'postcss-selector-parser';
import {BemTree} from './common';

// this regex is intentionally restrictive to alphanumeric kebab-case
// catchall regex is described in `ident` rule in https://www.w3.org/TR/CSS21/grammar.html#scanner
const VALID_ID = '-?[a-z][a-z0-9]*(?:-[a-z0-9]+)*';
const CLASS_RE = new RegExp(
    `^(?:(${VALID_ID})(?:__(${VALID_ID}))?|_(${VALID_ID})(?:_([^_ ]+))?)$`,
);

// get description of BEM structure from CSS source
export const parseBemCss = (css: string): [BemTree, string[]] => {
    // encountered errors in CSS
    const errors: string[] = [];
    // BEM description
    const bemTree: BemTree = {};

    // for every selector
    const res = parse(css);
    res.walkRules((rule) => {
        const {selector} = rule;

        // gather all classes in selector
        const classes: string[] = [];
        try {
            parser((root) => {
                root.walkClasses((className) => {
                    classes.push(className.value);
                });
            }).processSync(selector);
        } catch (e) {
            // logger.error(e);
            errors.push(`Couldn't parse selector "${selector}"`);
        }

        // split classes into buckets: block/element classes and modifiers classes
        const targets: [string, string | null][] = [];
        const modifiers: [string, string | true][] = [];
        for (const className of classes) {
            const matchBlock = className.match(CLASS_RE);
            if (!matchBlock) {
                errors.push(`Invalid class name "${className}"`);
                continue;
            }
            const [block, element, modifier, value] = matchBlock.slice(1);
            if (block && element) {
                targets.push([block, element]);
            } else if (block) {
                targets.push([block, null]);
            } else {
                modifiers.push([modifier, value === undefined ? true : value]);
            }
        }

        // selector must mention exactly one block or element
        if (targets.length !== 1) {
            errors.push(`Invalid selector "${selector}"`);
        }

        // get its associative array of modifiers
        const [block, element] = targets[0];
        const {modifiers: blockModifiers, elements} =
            bemTree[block] || (bemTree[block] = {elements: {}, modifiers: {}});
        const targetModifiers =
            element === null
                ? blockModifiers
                : elements[element] || (elements[element] = {});

        // add modifiers to block/element description
        for (const [modifier, value] of modifiers) {
            const prevValue = targetModifiers[modifier];
            // checking for `=== true`, because arrays are truthy
            if (value === true && !Array.isArray(prevValue)) {
                targetModifiers[modifier] = true;
            } else if (value !== true && prevValue !== true) {
                const options = prevValue || (targetModifiers[modifier] = []);
                options.push(value);
            } else {
                errors.push(
                    `Values of mixed types for modifier "${modifier}" in selector "${selector}"`,
                );
            }
        }
    });

    return [bemTree, errors];
};
