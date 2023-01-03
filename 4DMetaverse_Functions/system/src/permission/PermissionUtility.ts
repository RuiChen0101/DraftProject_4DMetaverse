import IQueryJson from "../utility/IQueryJson";

const arrayEquals = (a: any[], b: any[]): boolean => {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
        return false
    }
    const sa = a.sort();
    const sb = b.sort();
    return sa.every((val, index) => val === sb[index]);
}

export const isWhereContain = (query: IQueryJson, left: string, op: string, right?: any): boolean => {
    if (query.where === undefined) return false;
    for (const where of query.where) {
        if (left === where.left && op === where.op && (right === undefined || right === where.right || arrayEquals(right, where.right))) {
            return true;
        }
    }
    return false;
}