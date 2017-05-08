"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var alasql = require("alasql");
function lookupName(f, fields) {
    if (!fields[f])
        throw new Error("Field with ID " + f + " does not exist!");
    return fields[f].name;
}
function remapFieldsToNames(channels, fields) {
    var newState = {};
    for (var _i = 0, _a = Object.keys(channels); _i < _a.length; _i++) {
        var k = _a[_i];
        var key = k;
        var ch = channels[key];
        var replacement = undefined;
        if (ch) {
            if (ch.field) {
                var f = ch.field;
                if (typeof f === "number") {
                    replacement = __assign({}, ch, { field: lookupName(f, fields) });
                }
            }
        }
        newState[key] = (replacement || channels[key]);
    }
    return newState;
}
function remapFieldsToJoinNames(channels, fields) {
    var newState = {};
    for (var _i = 0, _a = Object.keys(channels); _i < _a.length; _i++) {
        var k = _a[_i];
        var key = k;
        var ch = channels[key];
        var replacement = undefined;
        if (ch) {
            if (ch.field) {
                var f = ch.field;
                if (typeof f === "number") {
                    replacement = __assign({}, ch, { field: lookupName(f, fields) + "_" + f });
                    // Patch axis titles, too
                    if (replacement.axis && !replacement.axis.title) {
                        replacement.axis.title = lookupName(f, fields);
                    }
                    if (!replacement.axis) {
                        replacement.axis = { title: lookupName(f, fields) };
                    }
                    // And patch legend titles
                    if (replacement.legend && !replacement.legend.title) {
                        replacement.legend.title = lookupName(f, fields);
                    }
                    if (!replacement.legend) {
                        replacement.legend = { title: lookupName(f, fields) };
                    }
                }
            }
        }
        newState[key] = (replacement || channels[key]);
    }
    return newState;
}
// Adding defaults allows us to always generate a spec vega will accept
var defaults = {
    mark: "bar"
};
function compileState(_a) {
    var sources = _a.sources, marks = _a.marks, fieldTable = _a.fields, transforms = _a.transforms, channels = _a.channels;
    var fields = Object.keys(fieldTable).map(function (f) { return fieldTable[+f]; });
    // Simple case: all selected fields from same data source
    var dataSources = Object.keys(fields.reduce(function (state, f) { return (state[f.dataSource] = true, state); }, {}));
    if (fields.length === 0 || dataSources.length === 0 || (dataSources.length === 1 && !transforms.post_filter)) {
        return __assign({}, defaults, { data: {
                values: fields.map(function (f) { return sources[f.dataSource].cache; })[0] || []
            }, encoding: remapFieldsToNames(channels, fieldTable) }, marks);
    }
    else {
        var query = generateQuery();
        var tables = dataSources.map(function (d) { return sources[+d].cache; });
        tables.unshift(tables.pop()); // Move last element to the front, since we likewise use the last data source first in our query
        return __assign({}, defaults, { data: {
                values: alasql(query, tables) || []
            }, encoding: remapFieldsToJoinNames(channels, fieldTable) }, marks);
    }
    // join across all utilized data sources using the field information provided
    // SELECT _data1.field1 AS _field1, ... _dataN.fieldM AS _fieldM
    // FROM ? _data1
    //   [JOIN ? _data2 ON _data1.field1=_data2.field2]
    //   ...
    //   [JOIN ? _dataN ON _dataN-1.fieldN=_dataN.fieldM]
    // [WHERE <query>]
    // [GROUP BY _field1 [ASC|DESC]]
    //
    // TODO: Implement actions/state for GROUP BY - should be very straightforward.
    function generateQuery() {
        var query = "\n        SELECT " + fields.map(function (f) { return "_data" + f.dataSource + "." + f.name + " AS " + f.name + "_" + f.id; }).join(", ") + "\n        " + (transforms.joins && transforms.joins.length ? createJoinList() : createDataInsert()) + "\n        " + transformFiltersToQuery(transforms.post_filter);
        return query;
    }
    function createJoinList() {
        var fromSource = fieldTable[transforms.joins[transforms.joins.length - 1].right].dataSource;
        var joinedSet = (_a = {}, _a[fromSource] = 0, _a);
        var query = "FROM ? _data" + fromSource + "\n            " + transforms.joins.map(function (d) {
            var l = fieldTable[d.left];
            var lsource = l.dataSource;
            joinedSet[lsource] = joinedSet[lsource] || 0;
            joinedSet[lsource]++;
            var r = fieldTable[d.right];
            var rsource = r.dataSource;
            joinedSet[rsource] = joinedSet[rsource] || 0;
            joinedSet[rsource]++;
            return "JOIN ? _data" + lsource + " ON\n                    _data" + lsource + "." + l.name + "=_data" + rsource + "." + r.name + " ";
        }).join("\n");
        // All data sources repersented by the given fields should appear in the joined set.
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var f = fields_1[_i];
            if (!joinedSet[f.dataSource])
                throw new Error("Field " + f.id + " references data source " + f.dataSource + " which does not have any accompanying joins.");
        }
        return query;
        var _a;
    }
    function createDataInsert() {
        return "FROM ? _data" + fields[0].dataSource;
    }
    function transformDescriptorToQuery(descr) {
        switch (descr.type) {
            case "fieldref": {
                var t = descr;
                var field = fieldTable[t.field];
                return "_data" + field.dataSource + "." + field.name;
            }
            case "constant": {
                var c = descr;
                if (c.kind === "string") {
                    return "'" + c.value.replace("'", "\\'") + "'"; // Escape strings
                }
                else {
                    return "" + c.value; // Numbers can be used verbatim. Probably.
                }
            }
            default: {
                var f = descr;
                return transformFilterToQuery(f);
            }
        }
    }
    // TODO: Support non-binary operatons IS NULL / IS NOT NULL / BETWEEN / IN
    // TODO: Support calling transforms on fields, ie, YEAR(d) or MONTH(d)
    function transformFilterToQuery(filter) {
        switch (filter.type) {
            case "AND": return "(" + transformDescriptorToQuery(filter.left) + " AND " + transformDescriptorToQuery(filter.right) + ")";
            case "OR": return "(" + transformDescriptorToQuery(filter.left) + " OR " + transformDescriptorToQuery(filter.right) + ")";
            case "GT": return "(" + transformDescriptorToQuery(filter.left) + " > " + transformDescriptorToQuery(filter.right) + ")";
            case "GTE": return "(" + transformDescriptorToQuery(filter.left) + " >= " + transformDescriptorToQuery(filter.right) + ")";
            case "LT": return "(" + transformDescriptorToQuery(filter.left) + " < " + transformDescriptorToQuery(filter.right) + ")";
            case "LTE": return "(" + transformDescriptorToQuery(filter.left) + " <= " + transformDescriptorToQuery(filter.right) + ")";
            case "EQ": return "(" + transformDescriptorToQuery(filter.left) + " = " + transformDescriptorToQuery(filter.right) + ")";
            case "NE": return "(" + transformDescriptorToQuery(filter.left) + " <> " + transformDescriptorToQuery(filter.right) + ")"; // != may also work, depending.
            case "LIKE": return "(" + transformDescriptorToQuery(filter.left) + " LIKE " + transformDescriptorToQuery(filter.right) + ")";
            default: throw new Error("Unexpected filter type " + filter.type);
        }
    }
    function transformFiltersToQuery(filter) {
        if (filter === undefined)
            return "";
        return "WHERE " + transformFilterToQuery(filter);
    }
}
exports.compileState = compileState;
