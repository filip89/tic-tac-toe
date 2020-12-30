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
    isSolvable() {
        return (this.fields.reduce((arr, field) => {
            if (field.sign && !arr.includes(field.sign)) {
                arr.push(field.sign);
            }
            return arr;
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
