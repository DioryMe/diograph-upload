import * as React from 'react';
import { DioryFactory } from './lib/diory-factory';

export interface UploadState { state: string }
export interface UploadProps { secrets: any }

export class DiographUpload extends React.Component <UploadProps, UploadState> {

  constructor(props) {
    super(props)
    this.state = {state: "pending"}
  }

  render() {
    switch(this.state.state) {
      case "pending": {
        return (
          <div>
            Select file: <br/>
            <input type="file" onChange={ event => this.startUploading(event) } />
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

  startUploading(event) {
    this.setState({state: "loading"})
    DioryFactory.createDioryFromFile(event.target.files[0], this.props.secrets.master).then(diory => {
      console.log(diory)
      this.setState({state: "success"})
    }, e => {
      console.log(e)
      console.log(e.message)
      this.setState({state: "error"})
    })
  }

}
