import format from 'date-fns/format'
import { Component, ReactNode } from "react";

interface GenericDatetimeCellProp {
    className?: string;
    dateTime: string | Date;
    format?: string;
}

class GenericDatetimeCell extends Component<GenericDatetimeCellProp>{
    private _date: Date;
    constructor(prop: GenericDatetimeCellProp) {
        super(prop);
        if (prop.dateTime instanceof Date) {
            this._date = prop.dateTime;
        } else {
            this._date = new Date(prop.dateTime);
        }
    }

    render(): ReactNode {
        return (
            <span className={this.props.className}>{format(this._date, this.props.format ?? "yyyy年MM月dd日 HH:mm:ss")}</span>
        )
    }
}

export default GenericDatetimeCell;