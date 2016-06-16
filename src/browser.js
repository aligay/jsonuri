import {get, set, swap, mv, up, down, rm, insert, walk} from './jsonuri';

(function () {
  window['JsonUri'] = {
    get : get,
    set : set,
    swap : swap,
    mv : mv,
    up : up,
    down : down,
    rm : rm,
    insert : insert,
    walk : walk
  }
})()