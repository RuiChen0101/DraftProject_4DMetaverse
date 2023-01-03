
// where operation interface
export interface IQueryWhere {
    left: string;
    op: '=' | '!=' | '<' | '<=' | '>' | '>=' | 'LIKE' | 'IS NULL' | 'IS NOT NULL' | 'IN' | 'NOT IN';
    right?: any;
}
// link operation interface
export interface IQueryLink {
    left: string;
    right: string;
}

// orderBy operation interface
export interface IQueryOrderBy {
    column: string;
    direction: 'asc' | 'desc' | 'ASC' | 'DESC';
}

export default interface IQueryJson {
    query: string;
    with?: string[];
    link?: IQueryLink[];
    where?: IQueryWhere[];
    orderBy?: IQueryOrderBy[];
    limit?: number[];
}