import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { DiographUpload } from './diograph-upload'

ReactDOM.render(
  <DiographUpload
    secrets={{ "master": "kissa123" }}
    onDioryCreated={ diory => { console.log(diory) } } />,
  document.getElementById('app')
)
