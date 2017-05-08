import alasql = require("alasql");
import {
    ModelState,
    Encoding,
    ChannelState,
    FieldId,
    FieldState,
    ChannelDef,
    FilterDescriptor,
    NestedDescriptor,
    FieldSelector,
    ConstantSelector
} from "../";

function lookupName(f: FieldId, fields: FieldState): string {
    if (!fields[f]) throw new Error(`Field with ID ${f} does not exist!`);
    return fields[f].name;
}

function remapFieldsToNames(channels: ChannelState, fields: FieldState): ChannelState {
    const newState: Encoding = {};
    for (const k of Object.keys(channels)) {
        const key = k as keyof ChannelState;
        const ch = channels[key];
        let replacement: ChannelDef | undefined = undefined;
        if (ch) {
            if (typeof ch.field !== "undefined") {
                const f = ch.field;
                if (typeof f === "number") {
                    replacement = { ...ch, field: lookupName(f, fields) } as ChannelDef;
                }
            }
        }
        newState[key] = (replacement || channels[key]) as ChannelDef;
    }
    return newState;
}

function remapFieldsToJoinNames(channels: ChannelState, fields: FieldState): ChannelState {
    const newState: Encoding = {};
    for (const k of Object.keys(channels)) {
        const key = k as keyof ChannelState;
        const ch = channels[key];
        let replacement: ChannelDef | undefined = undefined;
        if (ch) {
            if (typeof ch.field !== "undefined") {
                const f = ch.field;
                if (typeof f === "number") {
                    replacement = { ...ch, field: `${lookupName(f, fields)}_${f}` } as ChannelDef;
                    // Patch axis titles, too
                    if (replacement.axis && !replacement.axis.title) {
                        replacement.axis.title = lookupName(f, fields);
                    }
                    if (!replacement.axis) {
                        replacement.axis = {title: lookupName(f, fields)};
                    }
                    // And patch legend titles
                    if (replacement.legend && !replacement.legend.title) {
                        replacement.legend.title = lookupName(f, fields);
                    }
                    if (!replacement.legend) {
                        replacement.legend = {title: lookupName(f, fields)};
                    }
                }
            }
        }
        newState[key] = (replacement || channels[key]) as ChannelDef;
    }
    return newState;
}

// Adding defaults allows us to always generate a spec vega will accept
const defaults = {
    mark: "bar"
};

export function compileState({sources, marks, fields: fieldTable, transforms, channels}: ModelState) {
    const fields = Object.keys(fieldTable).map(f => fieldTable[+f]);
    // Simple case: all selected fields from same data source
    const dataSources = Object.keys(fields.reduce((state, f) => (state[f.dataSource] = true, state), {} as { [index: number]: boolean }));
    if (fields.length === 0 || dataSources.length === 0 || (dataSources.length === 1 && !transforms.post_filter)) { // Only use fast path if there's no required joins and no filters
        return {
            ...defaults,
            data: {
                values: fields.map(f => sources[f.dataSource].cache)[0] || []
            },
            encoding: remapFieldsToNames(channels, fieldTable),
            ...marks
        };
    }
    else {
        const query = generateQuery();
        const tables = dataSources.map(d => sources[+d].cache);
        tables.unshift(tables.pop()); // Move last element to the front, since we likewise use the last data source first in our query
        return {
            ...defaults,
            data: {
                values: alasql(query, tables) || []
            },
            encoding: remapFieldsToJoinNames(channels, fieldTable),
            ...marks
        };
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
        const query = `
        SELECT ${fields.map(f => `_data${f.dataSource}.${f.name} AS ${f.name}_${f.id}`).join(", ")}
        ${transforms.joins && transforms.joins.length ? createJoinList() : createDataInsert()}
        ${transformFiltersToQuery(transforms.post_filter)}`;
        return query;
    }

    function createJoinList() {
        const fromSource = fieldTable[transforms.joins[transforms.joins.length - 1].right].dataSource;
        const joinedSet = {[fromSource]: 0};
        const query = `FROM ? _data${fromSource}
            ${transforms.joins.map(d => {
                const l = fieldTable[d.left];
                const lsource = l.dataSource;
                joinedSet[lsource] = joinedSet[lsource] || 0;
                joinedSet[lsource]++;
                const r = fieldTable[d.right];
                const rsource = r.dataSource;
                joinedSet[rsource] = joinedSet[rsource] || 0;
                joinedSet[rsource]++;
                return `JOIN ? _data${lsource} ON
                    _data${lsource}.${l.name}=_data${rsource}.${r.name} `;
            }).join("\n")}`;

        // All data sources repersented by the given fields should appear in the joined set.
        for (const f of fields) {
            if (!joinedSet[f.dataSource]) throw new Error(`Field ${f.id} references data source ${f.dataSource} which does not have any accompanying joins.`);
        }

        return query;
    }


    function createDataInsert() {
        return `FROM ? _data${fields[0].dataSource}`;
    }

    function transformDescriptorToQuery(descr: NestedDescriptor): string {
        switch (descr.type) {
            case "fieldref": {
                const t = descr as FieldSelector;
                const field = fieldTable[t.field];
                return `_data${field.dataSource}.${field.name}`;
            }
            case "constant": {
                const c = descr as ConstantSelector;
                if (c.kind === "string") {
                    return `'${c.value.replace(`'`, `\\'`)}'`; // Escape strings
                }
                else {
                    return `${c.value}`; // Numbers can be used verbatim. Probably.
                }
            }
            default: {
                const f = descr as FilterDescriptor;
                return transformFilterToQuery(f);
            }
        }
    }

    // TODO: Support non-binary operatons IS NULL / IS NOT NULL / BETWEEN / IN
    // TODO: Support calling transforms on fields, ie, YEAR(d) or MONTH(d)
    function transformFilterToQuery(filter: FilterDescriptor): string {
        switch (filter.type) {
            case "AND": return `(${transformDescriptorToQuery(filter.left)} AND ${transformDescriptorToQuery(filter.right)})`;
            case "OR": return `(${transformDescriptorToQuery(filter.left)} OR ${transformDescriptorToQuery(filter.right)})`;
            case "GT": return `(${transformDescriptorToQuery(filter.left)} > ${transformDescriptorToQuery(filter.right)})`;
            case "GTE": return `(${transformDescriptorToQuery(filter.left)} >= ${transformDescriptorToQuery(filter.right)})`;
            case "LT": return `(${transformDescriptorToQuery(filter.left)} < ${transformDescriptorToQuery(filter.right)})`;
            case "LTE": return `(${transformDescriptorToQuery(filter.left)} <= ${transformDescriptorToQuery(filter.right)})`;
            case "EQ": return `(${transformDescriptorToQuery(filter.left)} = ${transformDescriptorToQuery(filter.right)})`;
            case "NE": return `(${transformDescriptorToQuery(filter.left)} <> ${transformDescriptorToQuery(filter.right)})`; // != may also work, depending.
            case "LIKE": return `(${transformDescriptorToQuery(filter.left)} LIKE ${transformDescriptorToQuery(filter.right)})`;
            default: throw new Error(`Unexpected filter type ${(filter as any).type}`);
        }
    }

    function transformFiltersToQuery(filter: FilterDescriptor | undefined): string {
        if (filter === undefined) return "";
        return `WHERE ${transformFilterToQuery(filter)}`;
    }
}
