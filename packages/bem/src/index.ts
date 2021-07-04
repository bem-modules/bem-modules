type Modifiers = Record<string, string | boolean>;

type ArgOptions = [] | [Modifiers] | [string] | [string, Modifiers];

export const bem = (block: string) => {
    return (...args: ArgOptions): string => {
        const element = args[0];
        let mods = args[1],
            classes = block;
        if (typeof element === 'string') {
            classes += '__' + element;
        } else {
            mods = element;
        }
        if (!mods) {
            return classes;
        }
        for (const key in mods) {
            const value = mods[key];
            if (!value) {
                continue;
            }
            classes += ' _';
            for (let i = 0, ilen = key.length; i < ilen; ++i) {
                const c = key[i];
                classes += 'A' <= c && c <= 'Z' ? '-' + c.toLowerCase() : c;
            }
            if (typeof value === 'string') {
                classes += '_' + value;
            }
        }
        return classes;
    };
};
