import Router from './router/Router';
import { Spinner } from 'react-bootstrap';
import { Component, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { getAuth } from '4dmetaverse_admin_sdk/auth';

import './App.scss';

interface AppState {
  isLoading: boolean;
}

class App extends Component<any, AppState> {
  private _auth = getAuth();

  constructor(prop: any) {
    super(prop);
    this.state = {
      isLoading: true
    }
    this._init();
  }

  private _init = async (): Promise<void> => {
    await this._auth.initializeAuth();
    this.setState({
      isLoading: false
    });
  }

  render(): ReactNode {
    return (
      <div className="App">
        {
          this.state.isLoading ? <div className="min-vh-100 min-vw-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" variant="primary" />
          </div> :
            <Router />
        }
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={false}
        />
      </div>
    );
  }
}

export default App;
