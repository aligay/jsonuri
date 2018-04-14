"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sleep(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay * 1000);
    });
}
exports.sleep = sleep;
//# sourceMappingURL=util.js.map