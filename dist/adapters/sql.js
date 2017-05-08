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
var knex = require("knex");
var actions_1 = require("../actions");
var dummy = true || knex({}); // Makes the return type of the function available for reference without calling it
var SqlDataSourceAdapter = (function () {
    function SqlDataSourceAdapter(store, filename, _selector) {
        if (_selector === void 0) { _selector = (function (s) { return s; }); }
        this.store = store;
        this._selector = _selector;
        var action = actions_1.createAddDataSourceAction("sqlite-file", { path: filename }, {}, this);
        this.id = action.payload.id;
        var connection = knex({
            client: "sqlite3",
            connection: { filename: filename },
            useNullAsDefault: true
        });
        this._conn = connection;
        store.dispatch(action);
        this.updateCache();
    }
    ;
    SqlDataSourceAdapter.prototype.defaultFieldSelection = function (selectNumber) {
        if (selectNumber === void 0) { selectNumber = 2; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var tables, defaultTable, columns, fields, addAction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.assertConnection();
                        return [4 /*yield*/, this.describeTables()];
                    case 1:
                        tables = _a.sent();
                        if (tables.length < 1)
                            throw new Error("Data source must have at least 1 table to select from.");
                        defaultTable = tables[0];
                        return [4 /*yield*/, this.describeColumns(defaultTable)];
                    case 2:
                        columns = _a.sent();
                        if (selectNumber >= columns.length)
                            throw new Error("Default columns cannot exceed the number of columns in the data source.");
                        columns = columns.slice(0, selectNumber);
                        fields = columns.map(function (column) {
                            return { name: column, table: defaultTable, dataSource: _this.id };
                        });
                        addAction = actions_1.createAddFieldsAction(fields);
                        this.store.dispatch(addAction);
                        return [2 /*return*/];
                }
            });
        });
    };
    SqlDataSourceAdapter.prototype.assertConnection = function () {
        if (!this._conn)
            throw new Error("There is no connection - has the connection been closed?");
    };
    SqlDataSourceAdapter.prototype.describeTables = function () {
        this.assertConnection();
        return this._conn
            .select("name")
            .from("sqlite_master")
            .where("type", "table")
            .returning("name")
            .then(function (results) {
            return results.map(function (table) {
                return table.name;
            });
        });
    };
    SqlDataSourceAdapter.prototype.describeColumns = function (table) {
        this.assertConnection();
        return this._conn
            .raw("Pragma table_info(" + table + ")")
            .then(function (data) {
            var columns = data.map(function (column) {
                return column.name;
            })
                .filter(function (name) {
                return name != "rowguid";
            });
            return columns;
        });
    };
    SqlDataSourceAdapter.prototype.updateCache = function () {
        var _this = this;
        this.assertConnection();
        var state = this._selector(this.store.getState());
        var fields = Object.keys(state.fields).map(function (k) { return state.fields[+k]; }).filter(function (item) {
            return item.dataSource === _this.id;
        })
            .reduce(function (prev, curr, index) {
            if (!curr.table)
                return prev;
            prev[curr.table] = prev[curr.table] || [];
            prev[curr.table].push(curr.name);
            return prev;
        }, {});
        return Promise.all(Object.keys(fields).map(function (key) {
            _this.assertConnection();
            return (_a = _this._conn).select.apply(_a, fields[key]).from(key).then(function (data) {
                var action = actions_1.createUpdateDataCacheAction(_this.id, data);
                _this.store.dispatch(action);
            }, function (err) {
                _this.store.dispatch({ type: "UPDATE_DATA_CACHE", error: err });
            });
            var _a;
        }));
    };
    SqlDataSourceAdapter.prototype.remove = function () {
        var action = actions_1.createRemoveDataSourceAction(this.id);
        this.store.dispatch(action);
        var conn = this._conn;
        delete this._conn;
        return conn.destroy();
    };
    return SqlDataSourceAdapter;
}());
exports.SqlDataSourceAdapter = SqlDataSourceAdapter;
function createSqlFileDataSource(store, filename) {
    return new SqlDataSourceAdapter(store, filename);
}
exports.createSqlFileDataSource = createSqlFileDataSource;
