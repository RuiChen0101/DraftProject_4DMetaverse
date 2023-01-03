import { Component, ReactNode } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import { getStorage } from "4dmetaverse_admin_sdk/storage";
import { faFaceDizzy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './ProtectedImage.scss';

interface ProtectedImageProp {
    className?: string;
    src: string;
}

interface ProtectedImageState {
    isLoading: boolean;
    objectUrl?: string;
}

class ProtectedImage extends Component<ProtectedImageProp, ProtectedImageState> {
    constructor(prop: ProtectedImageProp) {
        super(prop);
        this.state = {
            isLoading: true,
        }
    }

    async componentDidMount(): Promise<void> {
        try {
            const blob = await getStorage().download(this.props.src);
            this.setState({
                objectUrl: URL.createObjectURL(blob),
                isLoading: false
            });
        } catch (e: any) {
            this.setState({
                isLoading: false
            });
        }
    }

    render(): ReactNode {
        return (
            <div className={`protected-image ${this.props.className}`}>
                {
                    this.state.isLoading &&
                    <Spinner animation="border" variant="primary" />
                }
                {
                    !this.state.isLoading && this.state.objectUrl === undefined &&
                    <FontAwesomeIcon className="me-2 fa-3x" icon={faFaceDizzy} />
                }
                {
                    !this.state.isLoading && this.state.objectUrl !== undefined &&
                    <img src={this.state.objectUrl} />
                }
            </div>
        )
    }
}

export default ProtectedImage;