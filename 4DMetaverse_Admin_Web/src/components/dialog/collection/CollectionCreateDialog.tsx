import { toast } from 'react-toastify';
import Form from 'react-bootstrap/esm/Form';
import { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import { EFilePermission, getStorage } from '4dmetaverse_admin_sdk/storage';
import { ECollectionType, getCollection } from '4dmetaverse_admin_sdk/collection';

import { DialogShareProp } from '../base/DialogBase';
import IdGenerator from '../../../utils/IdGenerator';
import showFileSelect from '../../form/ShowFileSelect';
import SelectOptionsBuilder from '../../form/SelectOptionsBuilder';
import StandardDialogTemplate from '../template/StandardDialogTemplate';
import { collectionTypeOptions } from '../../../mapping/MCollectionType';

interface CollectionCreateDialogProp extends DialogShareProp {
    poolId: string;
    onSuccess: (id: string) => void;
}

interface CollectionCreateDialogState {
    name: string;
    previewImageUrl: string;
    unlockedImageUrl: string;
    media: File | null;
    isLoading: boolean;
    errorMessage?: string;
    formError: { [key: string]: string };
}

class CollectionCreateDialog extends Component<CollectionCreateDialogProp, CollectionCreateDialogState>{
    private _id: string = "";
    private _type: number = ECollectionType.Text;

    constructor(prop: CollectionCreateDialogProp) {
        super(prop);
        this.state = {
            name: "",
            previewImageUrl: "",
            unlockedImageUrl: "",
            media: null,
            isLoading: false,
            formError: {}
        };
        this._id = new IdGenerator().uuidv4();
    }

    private _validate = (): boolean => {
        const formError: { [key: string]: string } = {};
        let pass = true;

        if (this.state.name === '') {
            formError['name'] = '請輸入收藏名稱';
            pass = false;
        }

        if (this.state.previewImageUrl === '') {
            formError['previewImageUrl'] = '請輸入預覽封面圖連結或上傳新檔案';
            pass = false;
        } else if (!/^(http(s)?:\/\/)(.*)$/.test(this.state.previewImageUrl)) {
            formError['previewImageUrl'] = '請輸入正確檔案連結';
            pass = false;
        }

        if (this.state.unlockedImageUrl === '') {
            formError['unlockedImageUrl'] = '請輸入解鎖後封面圖連結或上傳新檔案';
            pass = false;
        } else if (!/^(http(s)?:\/\/)(.*)$/.test(this.state.unlockedImageUrl)) {
            formError['unlockedImageUrl'] = '請輸入正確檔案連結';
            pass = false;
        }

        if (this.state.media === null) {
            formError['media'] = '請選擇媒體檔案';
            pass = false;
        }

        this.setState({
            formError: formError
        });

        return pass;
    }

    private _onCreate = async (): Promise<void> => {
        if (!(this._validate())) return;
        this.setState({
            isLoading: true
        });
        try {
            const media = await getStorage().upload({
                file: this.state.media!,
                overrideName: `media_${new IdGenerator().nanoid8()}`,
                path: `collection/${this.props.poolId}/${this._id}`,
                permission: EFilePermission.Public
            });
            await getCollection().create({
                id: this._id,
                collectionPoolId: this.props.poolId,
                name: this.state.name,
                type: this._type,
                previewImageUrl: this.state.previewImageUrl,
                unlockedImageUrl: this.state.unlockedImageUrl,
                mediaUrl: media.publicUrl!,
            })
            this.props.onSuccess(this._id);
            this.props.onClose();
        } catch (e: any) {
            this.setState({
                errorMessage: e.message,
            });
        } finally {
            this.setState({
                isLoading: false
            });
        }
    }

    private _onPreviewImageUploadClick = (): void => {
        showFileSelect({
            accept: "image/*",
            onSelect: async (files: FileList | null): Promise<void> => {
                if (files === null) return;
                toast.info("預覽封面正在上傳, 請勿關閉...");
                try {
                    const file = await getStorage().upload({
                        file: files![0],
                        overrideName: `preview_${new IdGenerator().nanoid8()}`,
                        path: `collection/${this.props.poolId}/${this._id}`,
                        permission: EFilePermission.Public
                    });
                    this.setState({
                        previewImageUrl: file.publicUrl!
                    });
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
                    const file = await getStorage().upload({
                        file: files![0],
                        overrideName: `unlock_${new IdGenerator().nanoid8()}`,
                        path: `collection/${this.props.poolId}/${this._id}`,
                        permission: EFilePermission.Public
                    });
                    this.setState({
                        unlockedImageUrl: file.publicUrl!
                    });
                    toast.success(`解鎖封面上傳成功`);
                } catch (e: any) {
                    toast.error(`上傳失敗: ${e.message}`);
                }
            }
        });
    }

    private _onMediaSelectClick = (): void => {
        showFileSelect({
            onSelect: async (files: FileList | null): Promise<void> => {
                if (files === null) return;
                this.setState({
                    media: files[0]
                })
            }
        });
    }

    render(): ReactNode {
        return (
            <StandardDialogTemplate
                isLoading={this.state.isLoading}
                errorMessage={this.state.errorMessage}
                onClose={this.props.onClose}
                onSuccess={this._onCreate}
                title="新增收藏"
                closeText="取消"
                successText="新增"
            >
                <div className="d-flex justify-content-between mb-3">
                    <Form.Group className="me-1 flex-fill-equal" controlId="createName">
                        <Form.Label>名稱</Form.Label>
                        <Form.Control
                            isInvalid={!!this.state.formError.name}
                            disabled={this.state.isLoading}
                            value={this.state.name}
                            placeholder="名稱"
                            onChange={(e) => this.setState({ name: e.target.value })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {this.state.formError.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="ms-1 flex-fill-equal" controlId="createType">
                        <Form.Label>種類</Form.Label>
                        <Form.Select disabled={this.state.isLoading} onChange={(e) => this._type = parseInt(e.target.value)}>
                            <SelectOptionsBuilder data={collectionTypeOptions} />
                        </Form.Select>
                    </Form.Group>
                </div>
                <Form.Group className="mb-3" controlId="createUnlockedImageUrl">
                    <Form.Label>媒體檔案</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            isInvalid={!!this.state.formError.media}
                            disabled={true}
                            value={this.state.media?.name}
                            placeholder="請選擇檔案"
                        />
                        <Button
                            variant="outline-secondary"
                            disabled={this.state.isLoading}
                            onClick={this._onMediaSelectClick}
                        >
                            選擇檔案
                        </Button>
                        <Form.Control.Feedback type="invalid">
                            {this.state.formError.media}
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="createPreviewImageUrl">
                    <Form.Label>預覽封面</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            isInvalid={!!this.state.formError.previewImageUrl}
                            disabled={this.state.isLoading || this.state.name === ""}
                            value={this.state.previewImageUrl}
                            placeholder="檔案連結"
                            onChange={(e) => this.setState({ previewImageUrl: e.target.value })}
                        />
                        <Button
                            variant="outline-secondary"
                            disabled={this.state.isLoading || this.state.name === ""}
                            onClick={this._onPreviewImageUploadClick}
                        >
                            上傳新檔案
                        </Button>
                        <Form.Control.Feedback type="invalid">
                            {this.state.formError.previewImageUrl}
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="createMediaUrl">
                    <Form.Label>解鎖封面</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            isInvalid={!!this.state.formError.unlockedImageUrl}
                            disabled={this.state.isLoading || this.state.name === ""}
                            value={this.state.unlockedImageUrl}
                            placeholder="檔案連結"
                            onChange={(e) => this.setState({ unlockedImageUrl: e.target.value })}
                        />
                        <Button
                            variant="outline-secondary"
                            disabled={this.state.isLoading || this.state.name === ""}
                            onClick={this._onUnlockedImageUploadClick}
                        >
                            上傳新檔案
                        </Button>
                        <Form.Control.Feedback type="invalid">
                            {this.state.formError.unlockedImageUrl}
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </StandardDialogTemplate>
        )
    }
}

export default CollectionCreateDialog;