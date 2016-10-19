import knex = require('knex');
import redux = require('redux');
import {ModelState} from './index';


const dummy = !!0 && knex({})
class SqlDataSource {
    private _conn: typeof dummy;
    constructor(private store: redux.Store<ModelState>, filename: string) {
        const connection = knex({
            client: 'sqlite3',
            connection: {
                filename: "../../data/CycleChain.sqlite"
            }
        });
        this._conn = connection;
        this.fetchData();
    }
    fetchData() {
        (this._conn.select('DaysToManufacture', 'ListPrice').from('Product') as any).then(function(a){
            const spec = {
                description:"Test Plot",
                data:{
                    values:a
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