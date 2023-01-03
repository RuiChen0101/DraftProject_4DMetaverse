import { Component, ReactNode } from "react";
import Button from "react-bootstrap/esm/Button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './FilterItemPill.scss';

interface FilterItemPillProp {
    className?: string;
    hash: string;
    text: string;
    onDelete: (hash: string) => void;
}

class FilterItemPill extends Component<FilterItemPillProp>{
    render(): ReactNode {
        return (
            <div className={`filter-item-pill ${this.props.className ?? ""}`}>
                <span className="me-2">{this.props.text}</span>
                <Button
                    variant="link"
                    onClick={() => this.props.onDelete(this.props.hash)}
                >
                    <FontAwesomeIcon icon={faXmark} size="xs" />
                </Button>
            </div>
        )
    }
}

export default FilterItemPill;