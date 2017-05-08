"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
var util_1 = require("../util");
var SinglyLoadedMemoryDataSource = (function () {
    function SinglyLoadedMemoryDataSource(storedData, store) {
        this.storedData = storedData;
        this.store = store;
        this.id = -1;
    }
    SinglyLoadedMemoryDataSource.prototype.defaultFieldSelection = function (selectNumber) {
        if (selectNumber === void 0) { selectNumber = 2; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var row, keys, fields, addAction;
            return __generator(this, function (_a) {
                if (this.storedData.length < 1)
                    throw new Error("Cannot select fields with a data source that has 0 tables");
                if (selectNumber === undefined)
                    throw new Error("Field selection number cannot be null or undefined");
                row = this.storedData[0];
                keys = Object.keys(row);
                if (selectNumber >= keys.length)
                    throw new Error("Default columns cannot exceed the number of columns in the data source.");
                keys = keys.slice(0, selectNumber);
                fields = keys.map(function (k) {
                    return { name: k, dataSource: _this.id };
                });
                addAction = actions_1.createAddFieldsAction(fields);
                this.store.dispatch(addAction);
                return [2 /*return*/];
            });
        });
    };
    SinglyLoadedMemoryDataSource.prototype.updateCache = function () {
        var action = actions_1.createUpdateDataCacheAction(this.id, this.storedData);
        this.store.dispatch(action);
        return Promise.resolve();
    };
    SinglyLoadedMemoryDataSource.prototype.remove = function () {
        var action = actions_1.createRemoveDataSourceAction(this.id);
        this.store.dispatch(action);
        this.updateCache = util_1.poisonPill("data source removed");
        this.defaultFieldSelection = util_1.poisonPill("data source removed");
        this.remove = util_1.poisonPill("data source removed");
        return Promise.resolve();
    };
    return SinglyLoadedMemoryDataSource;
}());
exports.SinglyLoadedMemoryDataSource = SinglyLoadedMemoryDataSource;
