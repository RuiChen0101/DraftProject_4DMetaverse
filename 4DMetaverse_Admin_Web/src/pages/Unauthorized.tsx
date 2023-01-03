import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Header from '../components/headers/Header';

import './Unauthorized.scss';

class Unauthorized extends Component {
    render(): ReactNode {
        return (
            <div className="unauthorized-main">
                <Header />
                <div className="unauthorized">
                    <h1 className="mb-2">Oops!沒有訪問權限</h1>
                    <p className="mb-2">如果這是非預期結果請聯絡系統管理員</p>
                    <Button href='/'>返回</Button>
                </div>
            </div>
        );
    }
}

export default Unauthorized;