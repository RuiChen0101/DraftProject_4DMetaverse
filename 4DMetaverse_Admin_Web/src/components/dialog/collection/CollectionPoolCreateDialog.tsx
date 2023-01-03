import Form from "react-bootstrap/esm/Form";
import { Component, ReactNode } from "react";
import { getCollection } from "4dmetaverse_admin_sdk/collection";
import { EFilePermission, getStorage } from "4dmetaverse_admin_sdk/storage";

import { DialogShareProp } from "../base/DialogBase";
import IdGenerator from "../../../utils/IdGenerator";
import StandardDialogTemplate from "../template/StandardDialogTemplate";

interface CollectionPoolCreateDialogProp extends DialogShareProp {
    onSuccess: (id: string) => void;
}

interface CollectionPoolCreateDialogState {
    isLoading: boolean;
    errorMessage?: string;
    formError: { [key: string]: string };
}

class CollectionPoolCreateDialog extends Component<CollectionPoolCreateDialogProp, CollectionPoolCreateDialogState>{
    private _name: string = "";
    private _coverImage: File | null = null;

    constructor(prop: CollectionPoolCreateDialogProp) {
        super(prop);
        this.state = {
            isLoading: false,
            formError: {}
        };
    }

    private _validate = (): boolean => {
        const formError: { [key: string]: string } = {};
        let pass = true;

        if (this._coverImage === null) {
            formError['coverImage'] = '請選擇檔案';
            pass = false;
        }

        if (this._name === '') {
            formError['name'] = '請輸入收藏池名稱';
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
            const generator = new IdGenerator();
            const id = generator.uuidv4();
            const file = await getStorage().upload({
                file: this._coverImage!,
                overrideName: `cover_${generator.nanoid8()}`,
                path: `collection/${id}`,
                permission: EFilePermission.Public
            });
            await getCollection().createPool({
                id: id,
                name: this._name,
                coverImageUrl: file.publicUrl
            })
            this.props.onSuccess(id);
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

    render(): ReactNode {
        return (
            <StandardDialogTemplate
                isLoading={this.state.isLoading}
                errorMessage={this.state.errorMessage}
                onClose={this.props.onClose}
                onSuccess={this._onCreate}
                title="新增收藏池"
                closeText="取消"
                successText="新增"
            >
                <Form.Group className="mb-3 text-start" controlId="createName">
                    <Form.Label>名稱</Form.Label>
                    <Form.Control isInvalid={!!this.state.formError.name} disabled={this.state.isLoading} placeholder="名稱" onChange={(e) => this._name = e.target.value} />
                    <Form.Control.Feedback type="invalid">
                        {this.state.formError.name}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 text-start" controlId="createCoverImage">
                    <Form.Label>封面圖片</Form.Label>
                    <Form.Control
                        isInvalid={!!this.state.formError.coverImage}
                        disabled={this.state.isLoading}
                        type="file"
                        accept="image/*"
                        onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                                this._coverImage = e.target.files === null ? null : e.target.files[0];
                            }
                        }
                    />
                    <Form.Control.Feedback type="invalid">
                        {this.state.formError.coverImage}
                    </Form.Control.Feedback>
                </Form.Group>
            </StandardDialogTemplate>
        );
    }
}

export default CollectionPoolCreateDialog;