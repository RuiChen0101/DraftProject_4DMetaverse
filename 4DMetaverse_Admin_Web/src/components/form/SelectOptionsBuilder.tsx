import { Component, ReactNode } from 'react';

interface SelectOptionsBuilderProp {
    data: any[];
}

class SelectOptionsBuilder extends Component<SelectOptionsBuilderProp>{
    render(): ReactNode {
        const options = this.props.data.map(
            (d: any) => <option key={d.value ?? d.text} value={d.value}>{d.text}</option>
        );
        return (
            <>{options}</>
        );
    }
}

export default SelectOptionsBuilder;