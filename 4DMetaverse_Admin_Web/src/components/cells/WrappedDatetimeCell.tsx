import format from 'date-fns/format'
import { Component, ReactNode } from "react";

import './WrappedDatetimeCell.scss';

interface WrappedDatetimeCellProp {
    dateTime: string | Date;
}

class WrappedDatetimeCell extends Component<WrappedDatetimeCellProp>{
    private _date: Date;
    constructor(prop: WrappedDatetimeCellProp) {
        super(prop);
        if (prop.dateTime instanceof Date) {
            this._date = prop.dateTime;
        } else {
            this._date = new Date(prop.dateTime);
        }
    }

    render(): ReactNode {
        return (
            <div className="wrapped-datetime-cell">
                <div className="d-flex flex-column text-start">
                    <span className="date">{format(this._date, "yyyy-MM-dd")}</span>
                    <span className="time">{format(this._date, "HH:mm:ss")}</span>
                </div>
            </div>
        )
    }
}

export default WrappedDatetimeCell;