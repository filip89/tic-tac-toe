export default class Solution {
    constructor(fieldIds) {
        this.fields = fieldIds.map((fieldId) => ({ id: fieldId, value: '' }));
    }
}
