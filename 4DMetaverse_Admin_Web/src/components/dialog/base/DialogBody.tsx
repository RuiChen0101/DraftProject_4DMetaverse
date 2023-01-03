import { Component, ReactNode } from 'react';
import WithChildrenProps from '../../../props/WithChildrenProps';

import './DialogBody.scss';

interface DialogBodyProp extends WithChildrenProps {
    className?: string;
}

class DialogBody extends Component<DialogBodyProp>{
    render(): ReactNode {
        return (
            <div className={`dialog-body ${this.props.className ?? ''}`}>
                {this.props.children}
            </div>
        )
    }
}

export default DialogBody;