import * as React from 'react';
import { DioryFactory } from './lib/diory-factory';

export interface UploadState { state: string }
export interface UploadProps { onDioryCreated: any, secrets: any }

export class DiographUpload extends React.Component <UploadProps, UploadState> {

  constructor(props) {
    super(props)
    this.state = {state: "pending"}
  }

  render() {
    let message
    switch(this.state.state) {
      case "pending": {
        break
      }
      case "loading": {
        message = "Uploading the image..."
        break
      }
      case "success": {
        message = "Diory succesfully created!"
        break
      }
      case "error": {
        message = "Something went wrong while uploading the image..."
        break
      }
    }
    return (
      <div>
        Select file: <br/>
        <input type="file" onChange={ event => this.startUploading(event) } />
        <div id="message">{ message }</div>
      </div>
    )
  }

  startUploading(event) {
    this.setState({state: "loading"})
    return DioryFactory.createDioryFromFile(event.target.files[0], this.props.secrets.master).then(diory => {
      console.log(diory)
      this.setState({state: "success"})
      this.props.onDioryCreated(diory)
    }, e => {
      console.log(e)
      console.log(e.message)
      this.setState({state: "error"})
    })
  }

}
