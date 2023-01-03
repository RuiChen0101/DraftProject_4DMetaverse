import { Component, ReactNode } from 'react';

import './TitleCard.scss';

import WithChildrenProps from '../../props/WithChildrenProps';

interface TitleCardProp extends WithChildrenProps {
    className?: string
    title?: string;
    fluid?: boolean;
}

class TitleCard extends Component<TitleCardProp>{
    render(): ReactNode {
        return (
            <div className={`title-card ${this.props.className ?? ""}`}>
                <div className="title-card-header">
                    <span>{this.props.title}</span>
                </div>
                <div className={`title-card-body ${!!this.props.fluid ? "fluid" : ""}`}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default TitleCard;