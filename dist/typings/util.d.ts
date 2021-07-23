export declare const IS_NOT_A_NATURAL_NUMBER = "is not a natural number";
export declare const MUST_BE_ARRAY = "must be a Array";
export declare const THE_PARAMETER_IS_ILLEGAL = "the parameter is illegal";
export declare const DIRECTION_REQUIRED = "direction must be 'before' | 'after' | 'append'";
export declare const THE_INDEX_OUT_OF_BOUNDS = "the Index Out of Bounds";
export declare const noop: () => void;
export declare const isArray: (arg: any) => arg is any[];
export declare const isString: (s: any) => boolean;
export declare const isInteger: (n: any) => boolean;
export declare const isNatural: (n: any) => boolean;
export declare const isComplexPath: (s: any) => boolean;
export declare const isObject: (o: any) => boolean;
export declare const toString: (s: any) => string;
export declare const showError: (s: any) => void;
export declare const throwError: (s: any) => never;
/**
 * 让数组的变化可被监听
 * @param obj
 * @param key
 * @param value
 */
export declare const setValue: (obj: any, key: string | number, value: any) => void;
/**
 * 让数组的删除可被监听
 */
export declare const delValue: (obj: any, key: string | number) => void;
/**
 * insertValue
 */
export declare const insertValue: (arr: any[], key: number, value: any, direction?: 'before' | 'after' | 'append') => void;
/**
 * Combing path keys
 * @author @linkjun
 * @param  {Array} keys  ['','menu','id','','.']
 * @return {Array}       ['menu','id']
 */
export interface CombingOptions {
    keys?: Array<string | null>;
    path?: string;
}
export declare const combingPathKey: (param: CombingOptions) => {
    keys: string[];
    path: string;
};
