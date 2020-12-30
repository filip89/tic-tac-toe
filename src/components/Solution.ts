interface Field {
    id: number;
    sign: string | null;
}

export default class Solution {
    fields: Field[];

    get firstSign(): string | null {
        return this.fields[0].sign;
    }

    constructor(fieldIds: number[]) {
        this.fields = fieldIds.map((fieldId) => ({ id: fieldId, sign: null }));
    }

    getEmptyFields(): Field[] {
        return this.fields.filter((field) => !field.sign);
    }

    isSolvable(): boolean {
        return (
            this.fields.reduce<string[]>((arr, field) => {
                if (field.sign && !arr.includes(field.sign)) {
                    arr.push(field.sign);
                }
                return arr;
            }, []).length < 2
        );
    }

    isSolvableBySign(sign: string): boolean {
        return !this.fields.find((field) => field.sign && field.sign !== sign);
    }

    isResolved(): boolean {
        if (!this.firstSign) return false;
        return this.fields.every((field) => field.sign === this.firstSign);
    }

    isMarkable(): boolean {
        return this.getEmptyFields().length > 0;
    }
}
