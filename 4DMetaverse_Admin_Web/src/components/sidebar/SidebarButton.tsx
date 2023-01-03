import { NavLink } from "react-router-dom";
import { Component, ReactNode } from "react";
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import './SidebarButton.scss';

interface SidebarButtonProps {
    to: string;
    text: string;
    icon: IconDefinition;
}

class SidebarButton extends Component<SidebarButtonProps>{
    render(): ReactNode {
        return (
            <div className="sidebar-button">
                <NavLink end to={this.props.to}>
                    <FontAwesomeIcon className="me-2" width={28} icon={this.props.icon} />
                    <span>{this.props.text}</span>
                </NavLink>
            </div>
        );
    }
}

export default SidebarButton;