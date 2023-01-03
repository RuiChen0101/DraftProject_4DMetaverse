import hash from 'object-hash';
import { Component, ReactNode } from "react";
import Dropdown from "react-bootstrap/esm/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFilter,
    faXmark
} from '@fortawesome/free-solid-svg-icons';

import "./Search.scss";

import FilterItemPill from "./FilterItemPill";
import InputFilter from "./filters/InputFilter";
import Button from 'react-bootstrap/esm/Button';
import DropdownFilter from './filters/DropdownFilter';
import { FilterSetting, FilterItem, FilterType, buildFilterText } from "../../utils/SearchFilter";

interface SearchProp {
    filterSetting: FilterSetting[];
    onSearchUpdate: (result: FilterItem[]) => void;
}

interface SearchState {
    filterItems: FilterItem[];
    selectSetting?: FilterSetting;
}

class Search extends Component<SearchProp, SearchState> {
    constructor(prop: SearchProp) {
        super(prop);
        this.state = {
            filterItems: [],
        }
    }

    private _onDropdownClick = (setting: FilterSetting): void => {
        this.setState({
            selectSetting: setting
        });
    }

    private _onDialogHide = (): void => {
        this.setState({
            selectSetting: undefined
        })
    }

    private _onItemDelete = (h: string): void => {
        const filterItem = this.state.filterItems.filter((value: FilterItem) => hash(value) !== h);
        this.setState({
            filterItems: filterItem
        });
        this.props.onSearchUpdate(filterItem);
    }

    private _onItemClear = (): void => {
        if (this.state.filterItems.length === 0) return;
        this.setState({
            filterItems: []
        });
        this.props.onSearchUpdate([]);
    }

    private _onApply = (item: FilterItem): void => {
        const filterItem = [...this.state.filterItems, item];
        this.setState({
            filterItems: filterItem,
            selectSetting: undefined
        });
        this.props.onSearchUpdate(filterItem);
    }

    private _buildDialog = (): ReactNode => {
        const setting: FilterSetting | undefined = this.state.selectSetting;
        if (setting === undefined) {
            return (<></>);
        }
        switch (setting.type ?? FilterType.inputLike) {
            case FilterType.inputLike:
            case FilterType.inputEq:
                return (<InputFilter
                    setting={this.state.selectSetting!}
                    onHide={this._onDialogHide}
                    onApply={this._onApply}
                />)
            case FilterType.dropdown:
                return (<DropdownFilter
                    setting={this.state.selectSetting!}
                    onHide={this._onDialogHide}
                    onApply={this._onApply}
                />)
        }
    }

    render(): ReactNode {
        return (
            <div className="search">
                <div className="d-inline-block position-relative">
                    {this._buildDialog()}
                </div>
                <Dropdown>
                    <Dropdown.Toggle className="search-button me-2" variant="link" >
                        <FontAwesomeIcon icon={faFilter} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {this.props.filterSetting.map(
                            (setting: FilterSetting, index: number) => {
                                return <Dropdown.Item
                                    key={`search-dropdown-${index}`}
                                    onClick={() => this._onDropdownClick(setting)}
                                >
                                    {setting.text}
                                </Dropdown.Item>
                            })}
                    </Dropdown.Menu>
                </Dropdown>
                {
                    this.state.filterItems.length === 0 ?
                        <span className="search-filter-text ms-2">過濾器</span> :
                        this.state.filterItems.map(
                            (item: FilterItem) => {
                                const h = hash(item);
                                return (<FilterItemPill
                                    key={h}
                                    hash={h}
                                    className="mx-1"
                                    text={buildFilterText(this.props.filterSetting, item)}
                                    onDelete={this._onItemDelete}
                                />)
                            }
                        )
                }
                <Button
                    className="search-clear ms-auto"
                    variant="link"
                    onClick={this._onItemClear}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </Button>
            </div>
        )
    }
}

export default Search;