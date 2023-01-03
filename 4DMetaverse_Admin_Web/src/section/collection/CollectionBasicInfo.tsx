import { toast } from "react-toastify";
import Form from "react-bootstrap/esm/Form";
import { Component, ReactNode } from "react";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { EFilePermission, getStorage } from "4dmetaverse_admin_sdk/storage";
import { getCollection, ICollection } from "4dmetaverse_admin_sdk/collection";

import './CollectionBasicInfo.scss';

import IdGenerator from "../../utils/IdGenerator";
import TitleCard from "../../components/card/TitleCard";
import ConfirmDialog from "../../components/dialog/ConfirmDialog";
import showFileSelect from "../../components/form/ShowFileSelect";
import { showDialog } from "../../components/dialog/base/DialogBase";
import { collectionTypeOptions } from "../../mapping/MCollectionType";
import { collectionStatusOptions } from "../../mapping/MCollectionStatus";
import SelectOptionsBuilder from "../../components/form/SelectOptionsBuilder";
import { withNavigator, WithNavigatorProps } from "../../wrapper/WithNavigator";

interface CollectionBasicInfoProp extends WithNavigatorProps {
    collection: ICollection;
    onRefresh: () => void;
}

interface CollectionBasicInfoState {
    editableCollection: ICollection;
    isLoading: boolean;
    isEditing: boolean;
}

class CollectionBasicInfo extends Component<CollectionBasicInfoProp, CollectionBasicInfoState>{

    constructor(prop: CollectionBasicInfoProp) {
        super(prop);
        this.state = {
            editableCollection: JSON.parse(JSON.stringify(prop.collection)),
            isLoading: false,
            isEditing: false
        }
    }

    private _onBasicInfoSave = async (): Promise<void> => {
        this.setState({
            isLoading: true,
            isEditing: false
        });
        try {
            const collection = this.state.editableCollection;
            await getCollection().update(this.props.collection.id!, {
                name: collection.name,
                status: collection.status,
                mediaUrl: collection.mediaUrl,
                previewImageUrl: collection.previewImageUrl,
                unlockedImageUrl: collection.unlockedImageUrl
            });
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            this.setState({
                isLoading: false
            });
            this.props.onRefresh();
        }
    }

    private _onDelete = async (): Promise<void> => {
        showDialog((close: () => void): ReactNode => {
            return (
                <ConfirmDialog
                    text={`確認刪除收藏池: ${this.props.collection?.name ?? ""}`}
                    onClose={close}
                    onConfirm={async (): Promise<void> => {
                        this.setState({ isLoading: true });
                        try {
                            await getCollection().delete(this.props.collection.id!);

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

    private _onPreviewImageUploadClick = (): void => {
        showFileSelect({
            accept: "image/*",
            onSelect: async (files: FileList | null): Promise<void> => {
                if (files === null) return;
                toast.info("預覽封面正在上傳, 請勿關閉...");
                try {
                    const c = this.state.editableCollection!;
                    const file = await getStorage().upload({
                        file: files![0],
                        overrideName: `preview_${new IdGenerator().nanoid8()}`,
                        path: `collection/${c.collectionPoolId}/${c.id}`,
                        permission: EFilePermission.Public
                    });
                    c.previewImageUrl = file.publicUrl;
                    this.setState({ editableCollection: c });
                    toast.success(`預覽封面上傳成功`);
                } catch (e: any) {
                    toast.error(`上傳失敗: ${e.message}`);
                }
            }
        });
    }

    private _onUnlockedImageUploadClick = (): void => {
        showFileSelect({
            accept: "image/*",
            onSelect: async (files: FileList | null): Promise<void> => {
                if (files === null) return;
                toast.info("解鎖封面正在上傳, 請勿關閉...");
                try {
                    const c = this.state.editableCollection!;
                    const file = await getStorage().upload({
                        file: files![0],
                        overrideName: `unlock_${new IdGenerator().nanoid8()}`,
                        path: `collection/${c.collectionPoolId}/${c.id}`,
                        permission: EFilePermission.Public
                    });
                    c.unlockedImageUrl = file.publicUrl;
                    this.setState({ editableCollection: c });
                    toast.success(`解鎖封面上傳成功`);
                } catch (e: any) {
                    toast.error(`上傳失敗: ${e.message}`);
                }
            }
        });
    }

    private _onMediaUploadClick = (): void => {
        showFileSelect({
            onSelect: async (files: FileList | null): Promise<void> => {
                if (files === null) return;
                toast.info("媒體檔案正在上傳, 請勿關閉...");
                try {
                    const c = this.state.editableCollection!;
                    const file = await getStorage().upload({
                        file: files![0],
                        overrideName: `media_${new IdGenerator().nanoid8()}`,
                        path: `collection/${c.collectionPoolId}/${c.id}`,
                        permission: EFilePermission.Public
                    });
                    c.mediaUrl = file.publicUrl;
                    this.setState({ editableCollection: c });
                    toast.success(`媒體檔案上傳成功`);
                } catch (e: any) {
                    toast.error(`上傳失敗: ${e.message}`);
                }
            }
        });
    }

    render(): ReactNode {
        return (
            <div className="collection-basic-info">
                {
                    this.state.isLoading ?
                        <Spinner animation="border" variant="primary" />
                        :
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <TitleCard className="mb-3" title="基本資料">
                                        <div className="d-flex flex-column mb-3">
                                            <div className="ms-auto">
                                                {
                                                    this.state.isEditing ?
                                                        <>
                                                            <Button className="me-3" variant="secondary" onClick={() => {
                                                                this.setState({
                                                                    editableCollection: JSON.parse(JSON.stringify(this.props.collection)),
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
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>
                                                Id
                                            </InputGroup.Text>
                                            <Form.Control
                                                disabled={true}
                                                value={this.state.editableCollection!.id}
                                            />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>
                                                名稱
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="名稱"
                                                disabled={!this.state.isEditing}
                                                value={this.state.editableCollection!.name}
                                                onChange={(e) => {
                                                    const c = this.state.editableCollection!;
                                                    c.name = e.target.value;
                                                    this.setState({ editableCollection: c });
                                                }}
                                            />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>
                                                已解鎖數量
                                            </InputGroup.Text>
                                            <Form.Control
                                                disabled={true}
                                                value={this.state.editableCollection!.totalUnlocked}
                                            />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>
                                                狀態
                                            </InputGroup.Text>
                                            <Form.Select
                                                disabled={!this.state.isEditing}
                                                value={this.state.editableCollection!.status}
                                                onChange={(e) => {
                                                    const c = this.state.editableCollection!;
                                                    c.status = parseInt(e.target.value);
                                                    this.setState({ editableCollection: c });
                                                }}
                                            >
                                                <SelectOptionsBuilder data={collectionStatusOptions} />
                                            </Form.Select>
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>
                                                種類
                                            </InputGroup.Text>
                                            <Form.Select
                                                disabled={true}
                                                value={this.state.editableCollection!.type}
                                            >
                                                <SelectOptionsBuilder data={collectionTypeOptions} />
                                            </Form.Select>
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>
                                                預覽封面
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="預覽封面"
                                                disabled={!this.state.isEditing}
                                                value={this.state.editableCollection!.previewImageUrl}
                                                onChange={(e) => {
                                                    const c = this.state.editableCollection!;
                                                    c.previewImageUrl = e.target.value;
                                                    this.setState({ editableCollection: c });
                                                }}
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                disabled={!this.state.isEditing}
                                                onClick={this._onPreviewImageUploadClick}
                                            >
                                                上傳
                                            </Button>
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>
                                                解鎖封面
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="解鎖封面"
                                                disabled={!this.state.isEditing}
                                                value={this.state.editableCollection!.unlockedImageUrl}
                                                onChange={(e) => {
                                                    const c = this.state.editableCollection!;
                                                    c.unlockedImageUrl = e.target.value;
                                                    this.setState({ editableCollection: c });
                                                }}
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                disabled={!this.state.isEditing}
                                                onClick={this._onUnlockedImageUploadClick}
                                            >
                                                上傳
                                            </Button>
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>
                                                媒體檔案
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="媒體檔案"
                                                disabled={!this.state.isEditing}
                                                value={this.state.editableCollection!.mediaUrl}
                                                onChange={(e) => {
                                                    const c = this.state.editableCollection!;
                                                    c.mediaUrl = e.target.value;
                                                    this.setState({ editableCollection: c });
                                                }}
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                disabled={!this.state.isEditing}
                                                onClick={this._onMediaUploadClick}
                                            >
                                                上傳
                                            </Button>
                                        </InputGroup>
                                    </TitleCard>
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <TitleCard title="預覽">
                                        <div className="collection-ui-preview">
                                            <div className="collection-ui-preview-example mb-3">
                                                <h6>購買預覽</h6>
                                                <div className="collection-purchase-preview">
                                                    <img src={this.state.editableCollection.previewImageUrl} alt="" />
                                                    <span className="collection-purchase-preview-name">{this.state.editableCollection.name}</span>
                                                    <span className="collection-purchase-preview-quant">x1</span>
                                                </div>
                                            </div>
                                            <div className="collection-ui-preview-example">
                                                <h6>收藏庫中展示</h6>
                                                <div className="d-flex justify-content-center mb-2">
                                                    <div className="collection-unlocked-preview">
                                                        <img src={this.state.editableCollection.unlockedImageUrl} alt="" />
                                                        <div className="collection-unlocked-preview-body">
                                                            <span>{this.state.editableCollection.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TitleCard>
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default withNavigator(CollectionBasicInfo);