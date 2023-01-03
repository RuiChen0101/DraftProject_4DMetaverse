import { Navigate } from 'react-router-dom';
import { getAuth } from '4dmetaverse_admin_sdk/auth';
import { ReactElement, Component, ReactNode } from 'react';

interface GuardedRouteProp {
    element?: ReactElement;
}

class GuardedRoute extends Component<GuardedRouteProp>{
    render(): ReactNode {
        const auth = getAuth();
        if (auth.accessTokenData === undefined || auth.accessTokenData!.role < 50) {
            auth.logout();
            return (<Navigate replace to="/unauthorized" />);
        } else {
            return this.props.element;
        }
    }
}

export default GuardedRoute;