import { Component, ReactNode, lazy } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import GuardedRoute from './GuardedRoute';
import Dashboard from '../pages/Dashboard';
import { withSuspense } from '../wrapper/WithSuspense';

const Unauthorized = withSuspense(lazy(() => import('../pages/Unauthorized')));
const TwoFactorVerify = withSuspense(lazy(() => import('../pages/auth/TwoFactorVerify')));

const Users = withSuspense(lazy(() => import('../pages/user/Users')));
const UserDetail = withSuspense(lazy(() => import('../pages/user/UserDetail')));

const CollectionPools = withSuspense(lazy(() => import('../pages/collection/CollectionPools')));
const CollectionDetail = withSuspense(lazy(() => import('../pages/collection/CollectionDetail')));
const CollectionPoolDetail = withSuspense(lazy(() => import('../pages/collection/CollectionPoolDetail')));

const ShopGroups = withSuspense(lazy(() => import('../pages/shop/ShopGroups')));

const Storage = withSuspense(lazy(() => import('../pages/storage/Storage')));

class Router extends Component {
    render(): ReactNode {
        return (
            <BrowserRouter>
                <Routes>
                    <Route index element={<Login />} />
                    <Route path='2fa_verify' element={<TwoFactorVerify />} />
                    <Route path='unauthorized' element={<Unauthorized />} />
                    <Route path='home' element={<GuardedRoute element={<Home />} />} >
                        <Route index element={<Dashboard />} />
                        <Route path='users' element={<Users />} />
                        <Route path='user-detail' element={<UserDetail />} />
                        <Route path='shop-groups' element={<ShopGroups />} />
                        <Route path='collection-pools' element={<CollectionPools />} />
                        <Route path='collection-detail' element={<CollectionDetail />} />
                        <Route path='collection-pool-detail' element={<CollectionPoolDetail />} />
                        <Route path='storage' element={<Storage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }
}

export default Router;