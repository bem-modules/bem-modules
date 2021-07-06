export type Modifiers = Record<string, string[] | true>;
interface BlockNode {
    modifiers: Modifiers;
    elements: Record<string, Modifiers>;
}
export type BemTree = Record<string, BlockNode>;
