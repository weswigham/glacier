"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createUpdateDataCacheAction(id, cache) {
    return { type: "UPDATE_DATA_CACHE", payload: { id: id, cache: cache } };
}
exports.createUpdateDataCacheAction = createUpdateDataCacheAction;
