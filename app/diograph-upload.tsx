import * as React from 'react';
import { Upload } from './lib/upload';

export interface UploadState { state: string }
export interface UploadProps { secrets: any }

export class DiographUpload extends React.Component <UploadProps, UploadState> {

  constructor(props) {
    super(props)
    this.state = {state: "loading"}
  }

  render() {
    switch(this.state.state) {
      case "pending": {
        return (
          <div>
            <input type="file" onChange={ event => Upload.uploadFiles(event, this.props.secrets.master) } />
          </div>
        )
      }
      case "loading": {
        return ( <div>Uploading the image... 10%</div> )
      }
      case "success": {
        return ( <div>Image succesfully uploaded!</div> )
      }
      case "error": {
        return ( <div>Something went wrong while uploading the image...</div> )
      }
    }
  }

}
