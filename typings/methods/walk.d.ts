/**
 * [walk description] 遍历一个对象, 提供入栈和出栈两个回调, 操作原对象
 * @author haozi
 * @param  {object} obj          [description]
 * @param  {[type]} descentionFn [description]
 * @param  {[type]} ascentionFn  [description]
 * @return {[type]}              [description]
 */
export interface WalkCallback {
    (val: any, key: string, parent: any, {_break, path}: {
        _break: any;
        path: any;
    }): void;
}
export default function walk(obj?: {}, descentionFn?: WalkCallback, ascentionFn?: WalkCallback): void;
