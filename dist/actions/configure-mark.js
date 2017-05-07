"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createMarkConfiguration(settingName, settingValue) {
    return { type: "UPDATE_MARK", payload: { settingName: settingName, settingValue: settingValue } };
}
exports.createMarkConfiguration = createMarkConfiguration;
function createUpdateMarkTypeAction(typeValue) {
    return { type: "UPDATE_MARK", payload: { settingName: "markType", settingValue: typeValue } };
}
exports.createUpdateMarkTypeAction = createUpdateMarkTypeAction;
function createUpdateSizeAction(height, width) {
    return { type: "UPDATE_MARK", payload: { settingName: "size", settingValue: { width: width, height: height } } };
}
exports.createUpdateSizeAction = createUpdateSizeAction;
function createUpdateDescriptionAction(desc) {
    return { type: "UPDATE_MARK", payload: { settingName: "desc", settingValue: desc } };
}
exports.createUpdateDescriptionAction = createUpdateDescriptionAction;
