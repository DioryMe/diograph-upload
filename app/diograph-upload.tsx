import * as React from 'react';
import { Upload } from './lib/upload';

export interface UploadState {}
export interface UploadProps { secrets: any }

export class DiographUpload extends React.Component <UploadProps, UploadState> {

  constructor(props) {
    super(props)
    this.state = {searchResults: [], searchTerm: ""}
  }

  render() {
    return (
      <div>
        <input type="file" onChange={ event => Upload.uploadFiles(event, this.props.secrets.master) } />
      </div>
    )
  }

}
