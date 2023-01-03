import { NavigateFunction, useNavigate, useSearchParams } from 'react-router-dom'

export interface WithNavigatorProps {
    navigate: NavigateFunction;
    searchParams: URLSearchParams;
}

export const withNavigator = (Component: any) => {
    const Wrapper = (props: any) => {
        const navigate = useNavigate();
        const searchParams = useSearchParams()[0];

        return (
            <Component
                navigate={navigate}
                searchParams={searchParams}
                {...props}
            />
        );
    };

    return Wrapper;
}
