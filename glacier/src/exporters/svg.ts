import * as vl from "vega-lite";
declare global {
    interface Element {}
}
import * as vega from "vega";
import redux = require("redux");
import {ModelState, MarkState} from "../";
import {Exporter} from "./";
import alasql = require("alasql");

export function createSvgExporter(store: redux.Store<ModelState>) {
    const updater = ((() => {
        // On update...
        // store.getState()
    }) as Exporter<string>);
    updater.export = async () => {
        const {sources, marks, fields: fieldTable, transforms} = store.getState();
        const fields = Object.keys(fieldTable).map(f => fieldTable[+f]);
        const spec: MarkState & {data?: any} = Object.create(marks);
        // Simple case: all selected fields from same data source
        if (Object.keys(fields.reduce((state, f) => (state[f.dataSource] = true, state), {} as { [index: number]: boolean })).length === 1) {
            spec.data = {
                values: fields.map(f => sources[f.dataSource].cache)[0]
            };
        }
        else {
            // TODO: Issue error when there aren;t enough joins to join all selected fields!
            // join across all utilized data sources using the field information provided
            // SELECT _data1.field1 AS _field1, ... _dataN.fieldM AS _fieldM FROM ? _data1
            //   JOIN ? _data2 ON _data1.field1=_data2.field2
            //   ...
            //   JOIN ? _dataN ON _dataN-1.fieldN=_dataN.fieldM
            const data = await alasql.promise(`
            SELECT ${fields.map(f => `_data${f.dataSource}.${f.name} AS _field${f.id}`).join(", ")}
            FROM ? _data${fieldTable[transforms.joins[transforms.joins.length - 1].right].dataSource} ${transforms.joins.map(d => `JOIN ? _data${fieldTable[d.left].dataSource} ON _data${fieldTable[d.left].dataSource}.${fieldTable[d.left].name}=_data${fieldTable[d.right].dataSource}.${fieldTable[d.right].name} `).join("\n")}
            `, fields.map(f => sources[f.dataSource].cache));
            spec.data = {values: data};
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