import knex = require('knex');
import redux = require('redux');
import {ModelState} from './index';


const dummy = (true as boolean as false) || knex({}); // Makes the return type of the function available for reference without calling it
class SqlDataSource {
    private _conn: typeof dummy;
    constructor(private store: redux.Store<ModelState>, filename: string = "../../data/CycleChain.sqlite") {
        const connection = knex({
            client: 'sqlite3',
            connection: { filename }
        });
        this._conn = connection;
        this.fetchData();
    }
    fetchData() {
        this._conn.select('DaysToManufacture', 'ListPrice').from('Product').then((data) => {
            const spec = {
                description:"Test Plot",
                data:{
                    values: data
                },
                mark: "point",
                encoding:{
                    x: {field: "DaysToManufacture", type:"quantitative"},
                    y: {field: "ListPrice", type:"quantitative"}
                }
            };
            this.store.dispatch({type: 'new-spec', spec});
            console.log(spec);
        });
    }
}

export function createDataSource(store: redux.Store<ModelState>, filename:string) {
    return new SqlDataSource(store, filename);
}