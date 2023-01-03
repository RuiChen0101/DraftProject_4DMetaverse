import { Component, ReactNode } from "react";
import Dropdown from "react-bootstrap/esm/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserSlash,
    faEllipsisVertical
} from "@fortawesome/free-solid-svg-icons";

import './UserActionCell.scss';

interface UserActionCellProp {
    userId: string;
}

class UserActionCell extends Component<UserActionCellProp>{
    render(): ReactNode {
        return (
            <Dropdown className="user-action-cell">
                <Dropdown.Toggle variant="link" >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item
                        onClick={() => { }}
                    >
                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon className="me-2" icon={faUserSlash} />
                            <span>凍結</span>
                        </div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}

export default UserActionCell;