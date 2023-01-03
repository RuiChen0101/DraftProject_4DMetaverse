import { Component, ReactNode } from "react";
import { mUserRole } from '../../../mapping/MUserRole';

interface UserRoleCellProp {
    role: number;
}

class UserRoleCell extends Component<UserRoleCellProp>{
    render(): ReactNode {
        return (
            <span className="user-role-cell">
                {mUserRole[this.props.role]}
            </span>
        )
    }
}

export default UserRoleCell;