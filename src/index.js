"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = require("./util");
class Init {
    constructor() {
        this.foo = 'world';
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('hello');
            yield util_1.sleep(1);
            console.log(this.foo);
        });
    }
}
exports.default = Init;
//# sourceMappingURL=index.js.map