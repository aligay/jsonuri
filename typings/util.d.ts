export declare const IS_NOT_A_NATURAL_NUMBER = "is not a natural number";
export declare const MUST_BE_ARRAY = "must be a Array";
export declare const THE_PARAMETER_IS_ILLEGAL = "the parameter is illegal";
export declare const DIRECTION_REQUIRED = "direction must be 'before' | 'after' | 'append'";
export declare const THE_INDEX_OUT_OF_BOUNDS = "the Index Out of Bounds";
export declare const MUST_BE_A_NATURAL_NUMBER = "must be a natural number";
export declare function noop(): void;
export declare const isArray: (arg: any) => arg is any[];
export declare function isString(s: any): boolean;
export declare function isNatural(n: any): boolean;
export declare function isComplexPath(s: any): boolean;
export declare function isObject(o: any): boolean;
export declare function toString(s: any): string;
export declare function showError(s: any): void;
export declare function throwError(s: any): void;
/**
 * 让数组的变化可被监听
 * @param obj
 * @param key
 * @param value
 */
export declare function setValue(obj: any, key: string | number, value: any): void;
/**
 * 让数组的删除可被监听
 */
export declare function delValue(obj: any, key: string | number): void;
/**
 * insertValue
 */
export declare function insertValue(arr: any[], key: number, value: any, direction?: 'before' | 'after' | 'append'): void;
/**
 * Combing path keys
 * @author @linkjun
 * @param  {Array} keys  ['','menu','id','','.']
 * @return {Array}       ['menu','id']
 */
export interface CombingOptions {
    keys?: (string | null)[];
    path?: string;
}
export declare function combingPathKey(param: CombingOptions): {
    keys: string[];
    path: string;
};
