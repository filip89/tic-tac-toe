export default class Solution {
    fields: { id: number; value: string }[];

    constructor(fieldIds: number[]) {
        this.fields = fieldIds.map((fieldId) => ({ id: fieldId, value: '' }));
    }
}
