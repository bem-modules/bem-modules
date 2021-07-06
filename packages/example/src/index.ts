import {bem} from './index.css';

const b = bem('block');
const a = b('element', {});

console.log(a);
