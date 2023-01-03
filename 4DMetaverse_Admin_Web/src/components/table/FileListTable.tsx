import { Component, ReactNode } from 'react';
import Spinner from 'react-bootstrap/esm/Spinner';
import { IDirectory, IFile } from '4dmetaverse_admin_sdk/storage';
import DirectoryNameCell from '../cells/storage/DirectoryNameCell';

import FileNameCell from '../cells/storage/FileNameCell';
import GenericDatetimeCell from '../cells/GenericDatetimeCell';

import './FileListTable.scss'
import FileSizeCell from '../cells/storage/FileSizeCell';

interface FileListTableProp {
    dirs: IDirectory[];
    files: IFile[];
    isLoading?: boolean;
    onBack: () => void;
    onNav: (name: string) => void;
    onDirClick: (dir: IDirectory) => void;
    onFileClick: (name: IFile) => void;
}

class FileListTable extends Component<FileListTableProp> {
    render(): ReactNode {
        const row = [(
            <tr key={`tdir-back`}>
                <td><DirectoryNameCell name=".." onNameClick={this.props.onBack} /></td>
                <td>-</td>
                <td>資料夾</td>
                <td>-</td>
            </tr>
        ),
        ...this.props.dirs.map(
            (data: IDirectory, index: number) =>
                <tr key={`tdir-${index}`} className="file-list-table-dir-row" onClick={() => this.props.onDirClick(data)}>
                    <td>
                        <DirectoryNameCell
                            name={data.name ?? ''}
                            onNameClick={() => this.props.onNav(data.name ?? '')}
                        />
                    </td>
                    <td>-</td>
                    <td>資料夾</td>
                    <td><GenericDatetimeCell dateTime={data.createAt ?? ''} format="yyyy年MM月dd日" /></td>
                </tr>
        ), ...this.props.files.map(
            (data: IFile, index: number) =>
                <tr key={`tfile-${index}`} className="file-list-table-file-row" onClick={() => this.props.onFileClick(data)}>
                    <td><FileNameCell name={data.name ?? ''} /></td>
                    <td><FileSizeCell size={data.size ?? 0} /></td>
                    <td className="file-list-table-file-row-mime-type">{data.mimeType}</td>
                    <td><GenericDatetimeCell dateTime={data.updateAt ?? ''} format="yyyy年MM月dd日" /></td>
                </tr>
        )];
        return (
            <div className="file-list-table">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '55%' }}>名稱</th>
                            <th>大小</th>
                            <th>類型</th>
                            <th>建立/更新時間</th>
                        </tr>
                    </thead>
                    {
                        (this.props.isLoading === undefined || !this.props.isLoading) ?
                            <tbody>{row}</tbody> :
                            null
                    }
                </table>
                {
                    this.props.isLoading !== undefined && this.props.isLoading ?
                        <div className="file-list-table-loading">
                            <Spinner animation="border" variant="primary" />
                        </div> : null
                }
            </div>
        );
    }
}

export default FileListTable;