import * as vl from "vega-lite";
declare global {
    interface Element {}
}
import * as vega from "vega";
import redux = require("redux");
import {ModelState, MarkState, Encoding, ChannelState, FieldId, FieldState, ChannelDef} from "../";
import {Exporter} from "./";
import alasql = require("alasql");


function lookupName(f: FieldId, fields: FieldState): string {
    return fields[f].name;
}

function remapFieldsToNames(channels: ChannelState, fields: FieldState): ChannelState {
    const newState: Encoding = {};
    for (const k of Object.keys(channels)) {
        const key = k as keyof ChannelState;
        const ch = channels[key];
        let replacement: ChannelDef | undefined = undefined;
        if (ch) {
            if (ch.field) {
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
            if (ch.field) {
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
                }
            }
        }
        newState[key] = (replacement || channels[key]) as ChannelDef;
    }
    return newState;
}


export function createSvgExporter(store: redux.Store<ModelState>) {
    const updater = ((() => {
        // On update...
        // store.getState()
    }) as Exporter<string>);
    updater.export = async () => {
        const {sources, marks, fields: fieldTable, transforms, channels} = store.getState();
        const fields = Object.keys(fieldTable).map(f => fieldTable[+f]);
        const spec: MarkState & {data?: any} & {encoding?: Encoding} = Object.create(marks);
        // Simple case: all selected fields from same data source
        const dataSources = Object.keys(fields.reduce((state, f) => (state[f.dataSource] = true, state), {} as { [index: number]: boolean }));
        if (dataSources.length === 1) {
            spec.data = {
                values: fields.map(f => sources[f.dataSource].cache)[0]
            };
            spec.encoding = remapFieldsToNames(channels, fieldTable) as Encoding;
        }
        else {
            // TODO: Issue error when there aren't enough joins to join all selected fields!
            // join across all utilized data sources using the field information provided
            // SELECT _data1.field1 AS _field1, ... _dataN.fieldM AS _fieldM FROM ? _data1
            //   JOIN ? _data2 ON _data1.field1=_data2.field2
            //   ...
            //   JOIN ? _dataN ON _dataN-1.fieldN=_dataN.fieldM
            const query = `
            SELECT ${fields.map(f => `_data${f.dataSource}.${f.name} AS ${f.name}_${f.id}`).join(", ")}
            FROM ? _data${fieldTable[transforms.joins[transforms.joins.length - 1].right].dataSource} ${transforms.joins.map(d => `JOIN ? _data${fieldTable[d.left].dataSource} ON _data${fieldTable[d.left].dataSource}.${fieldTable[d.left].name}=_data${fieldTable[d.right].dataSource}.${fieldTable[d.right].name} `).join("\n")}
            `;
            const tables = dataSources.map(d => sources[+d].cache);
            tables.unshift(tables.pop()); // Move last element to the front, since we likewise use the last data source first in our query
            const data = alasql(query, tables);
            spec.data = {values: data};
            spec.encoding = remapFieldsToJoinNames(channels, fieldTable) as Encoding;
        }
        return await new Promise<string>((resolve, reject) => {
            const {spec: compiled} = vl.compile(spec);
            vega.parse.spec(compiled, chart => {
                let result: string | undefined;
                try {
                    result = chart({renderer: "svg"}).update().svg();
                }
                catch (e) {
                    return reject(e);
                }
                resolve(result);
            });
        });
    };
    store.subscribe(updater);
    return updater;
}
