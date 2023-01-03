import { format as SQLFormat } from 'mysql';
import IQueryJson, { IQueryLink, IQueryOrderBy, IQueryWhere } from './IQueryJson';

const ORDER_DIRECTION: string[] = ['asc', 'ASC', 'desc', 'DESC'];
const DUALITY_OPERATOR: string[] = ['=', '!=', '<', '<=', '>', '>=', 'LIKE'];
const UNITY_OPERATOR: string[] = ['IS NULL', 'IS NOT NULL'];
const IN_OPERATOR: string[] = ['IN', 'NOT IN'];

// parse QueryJson into UnifyQL format
class QueryJsonStringify {
    public stringifyQuery(queryJson: IQueryJson): string {
        const query = `QUERY ${queryJson.query}`;
        const withStr = this._buildWith(queryJson.with);
        const definedTable: string[] = [queryJson.query, ...(queryJson.with ?? [])];
        const link = this._buildLink(definedTable, queryJson.link);
        const where = this._buildWhere(definedTable, queryJson.where);
        const orderBy = this._buildOrderBy(definedTable, queryJson.orderBy);
        const limit = this._buildLimit(queryJson.limit);
        return `${query}${withStr}${link}${where}${orderBy}${limit}`;
    }

    public stringifyCount(queryJson: IQueryJson): string {
        const count = `COUNT ${queryJson.query}`;
        const withStr = this._buildWith(queryJson.with);
        const definedTable: string[] = [queryJson.query, ...(queryJson.with ?? [])];
        const link = this._buildLink(definedTable, queryJson.link);
        const where = this._buildWhere(definedTable, queryJson.where);
        return `${count}${withStr}${link}${where}`;
    }

    public stringifySum(queryJson: IQueryJson): string {
        const sum = `SUM ${queryJson.query}`;
        const withStr = this._buildWith(queryJson.with);
        const definedTable: string[] = [queryJson.query.split('.')[0], ...(queryJson.with ?? [])];
        const link = this._buildLink(definedTable, queryJson.link);
        const where = this._buildWhere(definedTable, queryJson.where);
        return `${sum}${withStr}${link}${where}`;
    }

    private _buildWith(withList?: string[]): string {
        if (withList === undefined) return '';
        return ` WITH ${withList.join(',')}`;
    }

    private _buildLink(definedTable: string[], link?: IQueryLink[]): string {
        if (link === undefined) return '';
        const linkList: string[] = [];
        for (const l of link) {
            const leftTable = l.left.split('.')[0];
            const rightTable = l.right.split('.')[0];
            if (!definedTable.includes(leftTable) || !definedTable.includes(rightTable)) {
                throw new Error('linking table not in select');
            }
            linkList.push(`${l.left}=${l.right}`);
        }
        return ` LINK ${linkList.join(', ')}`;
    }

    private _buildWhere(definedTable: string[], where?: IQueryWhere[]): string {
        if (where === undefined) return '';
        const whereList: string[] = [];
        for (const w of where) {
            const leftTable = w.left.replace('(', '').split('.')[0];
            let whereStr: string = '';
            if (!definedTable.includes(leftTable)) {
                throw new Error('where condition table not in select');
            }
            if (DUALITY_OPERATOR.includes(w.op)) {
                whereStr = SQLFormat(`${w.left} ${w.op} ?`, [w.right]);
            } else if (UNITY_OPERATOR.includes(w.op)) {
                whereStr = `${w.left} ${w.op}`;
            } else if (IN_OPERATOR.includes(w.op)) {
                if (w.right === undefined || w.right.length === 0) {
                    throw new Error('IN operator cannot have empty array');
                }
                const replacer: string = `?${",?".repeat(w.right.length - 1)}`;
                whereStr = SQLFormat(`${w.left} ${w.op} (${replacer})`, w.right);
            } else {
                throw new Error('invalid operator');
            }
            whereList.push(whereStr.replaceAll('\'', '"'));
        }
        return ` WHERE ${whereList.join(' AND ')}`;
    }

    private _buildOrderBy(definedTable: string[], orderBy?: IQueryOrderBy[]): string {
        if (orderBy === undefined) return '';
        const orderByList: string[] = [];
        for (const o of orderBy) {
            const colTable = o.column.split('.')[0];
            if (!definedTable.includes(colTable)) {
                throw new Error('order by table not in select');
            }
            if (!ORDER_DIRECTION.includes(o.direction)) {
                throw new Error('invalid direction');
            }
            orderByList.push(`${o.column} ${o.direction}`);
        }
        return ` ORDER BY ${orderByList.join(',')}`;
    }

    private _buildLimit = (limit?: number[]): string => {
        if (limit === undefined) {
            return '';
        }
        if (limit.length !== 2) {
            throw new Error('argument mismatch');
        }
        return ` LIMIT ${limit[0]}, ${limit[1]}`;
    }
}

export default QueryJsonStringify;