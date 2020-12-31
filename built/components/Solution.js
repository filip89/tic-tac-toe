export default class Solution {
    constructor(fieldIds) {
        this.fields = fieldIds.map((fieldId) => ({ id: fieldId, sign: null }));
    }
    get firstSign() {
        return this.fields[0].sign;
    }
    getEmptyFields() {
        return this.fields.filter((field) => !field.sign);
    }
    getMarkedFieldsIds() {
        return this.fields.filter((field) => field.sign).map((field) => field.id);
    }
    isSolvable() {
        return (this.fields.reduce((uniqueNonEmptySigns, field) => {
            if (field.sign && !uniqueNonEmptySigns.includes(field.sign)) {
                uniqueNonEmptySigns.push(field.sign);
            }
            return uniqueNonEmptySigns;
        }, []).length < 2);
    }
    isSolvableBySign(sign) {
        return !this.fields.find((field) => field.sign && field.sign !== sign);
    }
    isResolved() {
        if (!this.firstSign)
            return false;
        return this.fields.every((field) => field.sign === this.firstSign);
    }
    isMarkable() {
        return this.getEmptyFields().length > 0;
    }
}
