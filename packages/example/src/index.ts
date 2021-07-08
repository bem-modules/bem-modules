import {bem} from './index.bem.css';

const b = bem('block');
const a = b('element', {});

console.log(a);
