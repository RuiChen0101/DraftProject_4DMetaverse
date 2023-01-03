import { Collapse } from "react-collapse";
import { Component, ReactNode } from "react";
import Button from "react-bootstrap/esm/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import './SidebarGroup.scss';

import WithChildrenProps from "../../props/WithChildrenProps";

interface SidebarGroupProps extends WithChildrenProps {
    title: string;
    key: string;
}

interface SidebarGroupState {
    isOpen: boolean;
}

class SidebarGroup extends Component<SidebarGroupProps, SidebarGroupState>{
    constructor(prop: SidebarGroupProps) {
        super(prop);
        this.state = {
            isOpen: true
        }
    }

    private _toggleCollapse = (): void => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render(): ReactNode {
        return (
            <div className="sidebar-group">
                <div className="sidebar-group-title">
                    <span>{this.props.title}</span>
                    <Button className="collapse-button" variant="link" onClick={this._toggleCollapse}>
                        {
                            this.state.isOpen ?
                                <FontAwesomeIcon icon={faAngleDown} /> :
                                <FontAwesomeIcon icon={faAngleUp} />
                        }
                    </Button>
                </div>
                <Collapse isOpened={this.state.isOpen}>
                    {this.props.children}
                </Collapse >
            </div>
        );
    }
}

export default SidebarGroup;