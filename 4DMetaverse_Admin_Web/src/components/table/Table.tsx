import hash from 'object-hash';
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import { Component, ReactElement, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleLeft,
    faAngleRight
} from '@fortawesome/free-solid-svg-icons';

import './Table.scss';

interface TableColumn {
    text: string;
    key?: string;
    width?: string;
    element?: (data: any) => ReactElement;
}

interface TableProps {
    className?: string;
    column: TableColumn[];
    data: any[];
    onDataSupply?: (offset: number, size: number) => Promise<void>;
    loading?: boolean;
    total?: number;
    pageSize?: number;
    pagination?: boolean;
    headerInsert?: ReactElement;
}

interface TableState {
    currentPage: number;
    slicedData: any[];
}

class Table extends Component<TableProps, TableState> {
    private _pageSize: number;
    private _total: number;
    private _totalPage: number;
    constructor(prop: TableProps) {
        super(prop);
        if (prop.pagination ?? false) {
            this._pageSize = prop.pageSize ?? 10;
            this._total = prop.total ?? 10;
        } else {
            this._pageSize = prop.data.length;
            this._total = prop.data.length;
        }
        this.state = {
            currentPage: 1,
            slicedData: prop.data.slice(0, this._pageSize)
        }
        this._totalPage = Math.ceil(this._total / this._pageSize);
    }

    private _buildRow = (data: any, row: number): ReactNode[] => {
        return this.props.column.map((col: TableColumn, index: number) => {
            if (col.element === undefined) {
                return (<td key={`tbody-${row}-${index}`}>{data[col.key ?? col.text]}</td>);
            } else {
                return (<td key={`tbody-${row}-${index}`}>{col.element(data)}</td>);
            }
        });
    }

    componentDidUpdate(prev: TableProps): void {
        if (hash(prev.data) === hash(this.props.data) && this.props.total === prev.total) return;
        if (this.props.pagination ?? false) {
            this._total = this.props.total ?? 10;
        } else {
            this._pageSize = this.props.data.length;
            this._total = this.props.data.length;
        }
        const page = this.props.total === prev.total ? this.state.currentPage : 1;
        this.setState({
            currentPage: this.props.total === prev.total ? this.state.currentPage : 1,
            slicedData: this._slicingData(page)
        })
        this._totalPage = Math.ceil(this._total / this._pageSize);
    }

    private _slicingData = (page: number): any[] => {
        return this.props.data.slice((page - 1) * this._pageSize, page * this._pageSize)
    }

    private _onPrev = async (): Promise<void> => {
        const page = this.state.currentPage - 1;
        if (page < 0) return;
        this.setState({
            currentPage: page,
            slicedData: this._slicingData(page)
        })
    }

    private _onNext = (): void => {
        const page = this.state.currentPage + 1;
        if (page > this._totalPage) return;
        const requiredData = page * this._pageSize;
        if (this.props.data.length < requiredData && this.props.total! > this.props.data.length) {
            if (this.props.onDataSupply === undefined) return;
            this.setState({
                currentPage: page,
            });
            this.props.onDataSupply(this.props.data.length, requiredData);
        } else {
            this.setState({
                currentPage: page,
                slicedData: this._slicingData(page)
            });
        }
    }

    render(): ReactNode {
        const head = this.props.column.map(
            (col: TableColumn, index: number) =>
                <th key={`thead-${index}`} style={{ width: col.width }}>
                    {col.text}
                </th>
        );
        const row = this.state.slicedData.map(
            (data: any, index: number) =>
                <tr key={`tbody-${index}`}>
                    {this._buildRow(data, index)}
                </tr>
        );
        return (
            <div className={`table-main ${this.props.className ?? ""}`}>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>{head}</tr>
                            {this.props.headerInsert !== undefined ?
                                <tr className="header-insert">
                                    <th colSpan={this.props.column.length}>
                                        {this.props.headerInsert}
                                    </th>
                                </tr> : null
                            }
                        </thead>
                        {
                            (this.props.loading === undefined || !this.props.loading) && this.props.data.length !== 0 ?
                                <tbody>{row}</tbody> :
                                null
                        }
                    </table>
                </div>
                {
                    this.props.loading !== undefined && this.props.loading ?
                        <div className="table-loading">
                            <Spinner animation="border" variant="primary" />
                        </div> : null
                }
                {
                    (this.props.loading === undefined || !this.props.loading) && this.props.data.length === 0 ?
                        <div className="table-data-empty">
                            <span>Oops! 找不到資料</span>
                        </div> : null
                }
                <div className="table-pagination mt-3 mb-2">
                    <span className="me-3">{`共${this._total}筆`}</span>
                    <Button
                        disabled={this.state.currentPage === 1}
                        className="page-button me-3"
                        variant="link"
                        onClick={this._onPrev}
                    >
                        <FontAwesomeIcon className="me-2" icon={faAngleLeft} />
                        <span>Prev</span>
                    </Button>

                    <span>{Object.is(this._totalPage, NaN) ? "--" : this.state.currentPage}</span>
                    <span className="mx-1">/</span>
                    <span className="me-3">{Object.is(this._totalPage, NaN) ? "--" : this._totalPage}</span>

                    <Button
                        disabled={this.state.currentPage === this._totalPage}
                        className="page-button"
                        variant="link"
                        onClick={this._onNext}
                    >
                        <span className="me-2">Next</span>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </Button>
                </div>
            </div>
        );
    }
}

export default Table;
export type { TableColumn }