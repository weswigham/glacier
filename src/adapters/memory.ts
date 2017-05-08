import redux = require("redux");
import { DataSourceId } from "../";
import { DataAdapter } from "./";
import { createAddDataSourceAction } from "../actions";
import { SinglyLoadedMemoryDataSource } from "./single-memory-load-base";

export interface MemoryDataSourceAdapter extends DataAdapter {
    (data: any): void;
}

class InternalMemoryDataSource extends SinglyLoadedMemoryDataSource {
    setData(data: any[]) {
        this.storedData = data;
    }
}

export function createMemoryDataSource(store: redux.Store<{}>): MemoryDataSourceAdapter {
    const base = new InternalMemoryDataSource([], store);
    const func = (((data: any[]) => {
        base.setData(data);
    }) as MemoryDataSourceAdapter);
    const createAction = createAddDataSourceAction("memory", {}, {}, func);
    base.id = createAction.payload.id;
    // You can probably replace the below with `func.id = base.id` unless some sort of
    //   data source id swapping is going on to get ES3 compatibility
    Object.defineProperties(func, {
        id: {
            configurable: true,
            enumerable: true,
            get() {
                return base.id;
            },
            set(x: DataSourceId) {
                return base.id = x;
            }
        }
    });
    func.defaultFieldSelection = (x?: number) => base.defaultFieldSelection(x);
    func.updateCache = () => base.updateCache();
    func.remove = () => base.remove();
    store.dispatch(createAction);
    return func;
}