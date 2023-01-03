import { Component, ReactNode } from "react";

import './SidebarDivider.scss';

class SidebarDivider extends Component {
    render(): ReactNode {
        return (
            <hr className="sidebar-divider" />
        );
    }
}

export default SidebarDivider;