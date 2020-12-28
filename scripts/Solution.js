export default class Solution {
    fields;

    constructor(fieldIds) {
        this.fields = fieldIds.map(fieldId => ({id: fieldId, value: ''}));
    }
}