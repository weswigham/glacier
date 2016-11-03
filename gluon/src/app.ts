class DemonstrateScopingProblems {
    private status = "blah";

    public run = () => {
	    
    }
}
import * as glacier from "glacier";
console.log("test")

const model = glacier.createModel();
const adapter = glacier.createSqlFileDataSource(model, "../../data/CycleChain.sqlite");
const exporter = glacier.createSvgExporter(model);
// TODO: Update this example to appropriately insert encodings once encodings are held within the store
const unsubscribe = model.subscribe(() => exporter.export().then(value => {
    console.log(value);
    unsubscribe();
    adapter.remove();
}).catch(err => console.log(err)));
adapter.updateCache();