import Form from "react-bootstrap/esm/Form";
import { Component, ReactNode } from "react";

import FilterDialog from "../FilterDialog";
import { FilterComparator, FilterItem, FilterOption, FilterSetting } from "../../../utils/SearchFilter";

interface DropdownFilterProp {
    setting: FilterSetting;
    onHide: () => void;
    onApply: (item: FilterItem) => void;
}

class DropdownFilter extends Component<DropdownFilterProp>{
    private _value: string | number = "";

    private _onApply = (): void => {
        if (this._value === "") {
            this.props.onHide();
            return;
        }
        this.props.onApply({
            key: this.props.setting.key,
            comparator: FilterComparator.equal,
            value: this._value
        });
    }

    private _onChange = (v: string): void => {
        try {
            this._value = parseInt(v);
        } catch (_) {
            this._value = v;
        }
    }

    render(): ReactNode {
        return (
            <FilterDialog
                className="dropdown-filter"
                setting={this.props.setting}
                width="250px"
                onHide={this.props.onHide}
                onApply={this._onApply}
            >
                <div className="dropdown-filter-body">
                    <Form.Select onChange={(e) => this._onChange(e.target.value)}>
                        <option >選擇選項...</option>
                        {
                            (this.props.setting.options ?? []).map((opt: FilterOption, index: number) => {
                                return (
                                    <option key={`select-${index}`} value={opt.value}>{opt.text}</option>
                                )
                            })
                        }
                    </Form.Select>
                </div>
            </FilterDialog>
        )
    }
}

export default DropdownFilter;