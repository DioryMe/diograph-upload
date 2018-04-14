import * as React from 'react';
import { Upload } from './lib/upload';

// export interface UploadState { searchResults: any, searchTerm: string }
// export interface UploadProps { onFocusClick: any }

export class DiographUpload extends React.Component { // <UploadProps, UploadState>

  constructor(props) {
    super(props)
    this.state = {searchResults: [], searchTerm: ""}
  }

  render() {
    return (
      <div>
        { Upload.test() }
      </div>
    )
  }

  onFocusClick(dioryId) {
    this.setState({searchResults: []})
    this.setState({searchTerm: ""})
    // this.props.onFocusClick(dioryId)
  }

}
