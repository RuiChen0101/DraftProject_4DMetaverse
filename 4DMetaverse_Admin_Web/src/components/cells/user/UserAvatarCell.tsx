import { Component, ReactNode } from "react";

import './UserAvatarCell.scss';

class UserAvatarCell extends Component {
    render(): ReactNode {
        return (
            <div className="user-avatar-cell">
                <img src={require('../../../assets/avatar.jpg')} alt="avatar" />
            </div>
        )
    }
}

export default UserAvatarCell;