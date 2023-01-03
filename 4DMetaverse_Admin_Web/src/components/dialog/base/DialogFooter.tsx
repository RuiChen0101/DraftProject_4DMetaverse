import { Component, ReactNode } from 'react';
import WithChildrenProps from '../../../props/WithChildrenProps';

import './DialogFooter.scss';

class DialogFooter extends Component<WithChildrenProps> {
    render(): ReactNode {
        return (
            <div className="dialog-footer">
                {this.props.children}
            </div>
        )
    }
}

export default DialogFooter;