"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
var single_memory_load_base_1 = require("./single-memory-load-base");
var InternalMemoryDataSource = (function (_super) {
    __extends(InternalMemoryDataSource, _super);
    function InternalMemoryDataSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InternalMemoryDataSource.prototype.setData = function (data) {
        this.storedData = data;
    };
    return InternalMemoryDataSource;
}(single_memory_load_base_1.SinglyLoadedMemoryDataSource));
function createMemoryDataSource(store) {
    var base = new InternalMemoryDataSource([], store);
    var func = (function (data) {
        base.setData(data);
    });
    var createAction = actions_1.createAddDataSourceAction("memory", {}, {}, func);
    base.id = createAction.payload.id;
    // You can probably replace the below with `func.id = base.id` unless some sort of
    //   data source id swapping is going on to get ES3 compatibility
    Object.defineProperties(func, {
        id: {
            configurable: true,
            enumerable: true,
            get: function () {
                return base.id;
            },
            set: function (x) {
                return base.id = x;
            }
        }
    });
    func.defaultFieldSelection = function (x) { return base.defaultFieldSelection(x); };
    func.updateCache = function () { return base.updateCache(); };
    func.remove = function () { return base.remove(); };
    store.dispatch(createAction);
    return func;
}
exports.createMemoryDataSource = createMemoryDataSource;
