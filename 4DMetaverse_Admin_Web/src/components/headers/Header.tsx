import { Component, ReactNode } from 'react';

import './Header.scss';

class Header extends Component {
    render(): ReactNode {
        return (
            <div className='header'>
                <img src={require('../../assets/logo.png')} alt="logo" />
                <span>4DMetaverse管理後台</span>
            </div>
        );
    }
}

export default Header;