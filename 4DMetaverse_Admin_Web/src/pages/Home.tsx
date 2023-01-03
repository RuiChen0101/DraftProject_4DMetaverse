import { Outlet } from 'react-router-dom';
import { Component, ReactNode } from 'react';

import './Home.scss';

import Sidebar from '../components/sidebar/Sidebar';

class Home extends Component {
    render(): ReactNode {
        return (
            <div className="home-main d-flex min-vh-100">
                <Sidebar />
                <div className="wrapper">
                    <Outlet />
                </div>
            </div>
        );
    }
}

export default Home;