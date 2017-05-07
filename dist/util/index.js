"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function satisfies(arr, predicate) {
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var item = arr_1[_i];
        if (predicate(item))
            return item;
    }
    return undefined;
}
exports.satisfies = satisfies;
function Enum() {
    var x = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        x[_i] = arguments[_i];
    }
    var o = {};
    for (var k in x) {
        o[x[k]] = x[k];
    }
    return o;
}
exports.Enum = Enum;
function poisonPill(reason) {
    return function () {
        throw new Error("Function has been poisoned. Reason: " + reason);
    };
}
exports.poisonPill = poisonPill;
