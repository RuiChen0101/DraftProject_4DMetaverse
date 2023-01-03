import { Component, createRef, ReactNode, RefObject } from "react";
import { FilterSetting } from "../../utils/SearchFilter";
import {
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './FilterDialog.scss';

import Button from "react-bootstrap/esm/Button";
import WithChildrenProps from "../../props/WithChildrenProps";

interface FilterDialogProp extends WithChildrenProps {
    className?: string;
    width: string;
    setting: FilterSetting;
    onHide: () => void;
    onApply: () => void;
}

class FilterDialog extends Component<FilterDialogProp>{
    private _dialogRef: RefObject<HTMLDivElement> = createRef();
    componentDidMount() {
        document.addEventListener('keydown', this._onKeyStroke);
        document.addEventListener("mousedown", this._handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this._handleClickOutside);
        document.removeEventListener('keydown', this._onKeyStroke);
    }

    private _handleClickOutside = (event: any): void => {
        if (this._dialogRef.current && !this._dialogRef.current.contains(event.target)) {
            this.props.onHide();
        }
    }

    private _onKeyStroke = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            this.props.onHide();
        }
    }

    render(): ReactNode {
        return (
            <div
                ref={this._dialogRef}
                className={`filter-dialog ${this.props.className ?? ""}`}
                style={{ width: this.props.width }}
            >
                <div className="filter-dialog-header">
                    <span>{this.props.setting?.text ?? 'test'}</span>
                    <Button
                        className="px-2 py-0"
                        variant="link"
                        onClick={this.props.onHide}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </Button>
                </div>
                <div className="filter-dialog-body">
                    {this.props.children}
                </div>
                <div className="filter-dialog-footer">
                    <Button
                        className="ms-auto"
                        variant="primary"
                        onClick={this.props.onApply}
                    >
                        套用
                    </Button>
                </div>
            </div>
        )
    }
}

export default FilterDialog;