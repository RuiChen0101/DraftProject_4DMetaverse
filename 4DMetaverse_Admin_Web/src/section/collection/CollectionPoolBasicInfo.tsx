import { toast } from "react-toastify";
import Form from "react-bootstrap/esm/Form";
import { Component, ReactNode } from "react";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import { EFilePermission, getStorage } from "4dmetaverse_admin_sdk/storage";
import { withNavigator, WithNavigatorProps } from "../../wrapper/WithNavigator";
import { getCollection, ICollectionPool } from "4dmetaverse_admin_sdk/collection";

import './CollectionPoolBasicInfo.scss';

import IdGenerator from "../../utils/IdGenerator";
import TitleCard from "../../components/card/TitleCard";
import InputGroup from "react-bootstrap/esm/InputGroup";
import showFileSelect from "../../components/form/ShowFileSelect";
import ConfirmDialog from "../../components/dialog/ConfirmDialog";
import { showDialog } from "../../components/dialog/base/DialogBase";

interface CollectionPoolBasicInfoProp extends WithNavigatorProps {
    poolId: string;
}

interface CollectionPoolBasicInfoState {
    editablePool?: ICollectionPool;
    isLoading: boolean;
    isEditing: boolean;
}

class CollectionPoolBasicInfo extends Component<CollectionPoolBasicInfoProp, CollectionPoolBasicInfoState>{
    private _pool?: ICollectionPool;
    constructor(prop: CollectionPoolBasicInfoProp) {
        super(prop);
        this.state = {
            isLoading: true,
            isEditing: false
        }
    }

    componentDidMount(): void {
        this._loadData();
    }

    private _loadData = async (): Promise<void> => {
        this.setState({
            isLoading: true,
            isEditing: false
        });
        this._pool = await getCollection().getPool(this.props.poolId);
        this.setState({
            editablePool: JSON.parse(JSON.stringify(this._pool)),
            isLoading: false
        });
    }

    private _onBasicInfoSave = async (): Promise<void> => {
        this.setState({
            isLoading: true,
            isEditing: false
        });
        try {
            const pool = this.state.editablePool!;
            await getCollection().updatePool(this.props.poolId, {
                name: pool.name,
                coverImageUrl: pool.coverImageUrl
            });
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            this._loadData();
        }
    }

    private _onDelete = async (): Promise<void> => {
        showDialog((close: () => void): ReactNode => {
            return (
                <ConfirmDialog
                    text={`確認刪除收藏池: ${this._pool?.name ?? ""}`}
                    onClose={close}
                    onConfirm={async (): Promise<void> => {
                        this.setState({ isLoading: true });
                        try {
                            await getCollection().deletePool(this.props.poolId);
                            this.props.navigate(-1);
                        } catch (e: any) {
                            toast.error(e.message);
                        } finally {
                            this.setState({ isLoading: false });
                        }
                    }}
                />
            )
        });
    }

    private _onCoverImageUploadClick = (): void => {
        showFileSelect({
            accept: "image/*",
            onSelect: async (files: FileList | null): Promise<void> => {
                if (files === null) return;
                toast.info("封面正在上傳, 請勿關閉...");
                try {
                    const c = this.state.editablePool!;
                    const file = await getStorage().upload({
                        file: files![0],
                        overrideName: `cover_${new IdGenerator().nanoid8()}`,
                        path: `collection/${this.props.poolId}`,
                        permission: EFilePermission.Public
                    });
                    c.coverImageUrl = file.publicUrl;
                    this.setState({ editablePool: c });
                    toast.success(`封面上傳成功`);
                } catch (e: any) {
                    toast.error(`上傳失敗: ${e.message}`);
                }
            }
        });
    }

    render(): ReactNode {
        return (
            <div className="collection-pool-basic-info">
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-12 col-md-6 order-2 order-md-1 mb-3 ps-0">
                            <TitleCard title="基本資料">
                                <div className="d-flex flex-column mb-3">
                                    <div className="ms-auto">
                                        {
                                            this.state.isEditing ?
                                                <>
                                                    <Button className="me-3" variant="secondary" onClick={() => {
                                                        this.setState({
                                                            editablePool: JSON.parse(JSON.stringify(this._pool!)),
                                                            isEditing: false
                                                        })
                                                    }}>
                                                        取消
                                                    </Button>
                                                    <Button variant="success" onClick={this._onBasicInfoSave} >
                                                        儲存
                                                    </Button>
                                                </>
                                                :
                                                <>
                                                    <Button className="me-3" onClick={() => this.setState({ isEditing: true })}>
                                                        修改
                                                    </Button>
                                                    <Button variant="danger" onClick={this._onDelete}>
                                                        刪除
                                                    </Button>
                                                </>
                                        }
                                    </div>
                                </div>
                                {
                                    this.state.isLoading ?
                                        <Spinner animation="border" variant="primary" />
                                        :
                                        <div>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text>
                                                    Id
                                                </InputGroup.Text>
                                                <Form.Control
                                                    disabled={true}
                                                    defaultValue={this.props.poolId}
                                                />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text>
                                                    名稱
                                                </InputGroup.Text>
                                                <Form.Control
                                                    placeholder="名稱"
                                                    disabled={!this.state.isEditing}
                                                    value={this.state.editablePool!.name}
                                                    onChange={(e) => {
                                                        const c = this.state.editablePool!;
                                                        c.name = e.target.value;
                                                        this.setState({ editablePool: c });
                                                    }}
                                                />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text>
                                                    封面URL
                                                </InputGroup.Text>
                                                <Form.Control
                                                    placeholder="封面圖片"
                                                    disabled={!this.state.isEditing}
                                                    value={this.state.editablePool!.coverImageUrl}
                                                    onChange={(e) => {
                                                        const c = this.state.editablePool!;
                                                        c.coverImageUrl = e.target.value;
                                                        this.setState({ editablePool: c });
                                                    }}
                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    disabled={!this.state.isEditing}
                                                    onClick={this._onCoverImageUploadClick}
                                                >
                                                    上傳
                                                </Button>
                                            </InputGroup>
                                        </div>
                                }
                            </TitleCard>
                        </div>
                        <div className="col-12 col-md-6 order-2 order-md-1 mb-3 pe-0">
                            <TitleCard title="預覽">
                                {
                                    this.state.isLoading ?
                                        <Spinner animation="border" variant="primary" />
                                        :
                                        <div className="collection-pool-ui-preview">
                                            <div className="collection-pool-ui-preview-example">
                                                <h6>收藏庫中展示</h6>
                                                <div className="d-flex justify-content-center mb-2">
                                                    <div className="collection-pool-preview">
                                                        <img src={this.state.editablePool!.coverImageUrl} alt="" />
                                                        <div className="collection-pool-preview-body">
                                                            <span>{this.state.editablePool!.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </TitleCard>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withNavigator(CollectionPoolBasicInfo);