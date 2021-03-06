import * as React from 'react'
import { configure, shallow } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16';
import { DiographUpload } from '../app/diograph-upload'
import { DioryFactory } from '../app/lib/diory-factory'

declare var Promise: any;

describe('<DiographUpload />', () => {
  let wrapper, component, secrets
  configure({ adapter: new Adapter() })

  beforeEach(() => {
    secrets = {"master": "kissa123"}
    wrapper = shallow(
      <DiographUpload
        secrets={ secrets }
        onDioryCreated={ diory => { console.log(diory) } } />
    )
    component = wrapper.instance();
  })

  // Secrets props

  it('sets secrets from props', () => {
    expect(component.props.secrets).toEqual(secrets)
  })

  // Integration tests for file uploading

  it('calls DioryFactory.createDioryFromFile() with correct attributes when file(s) are chosen', () => {
    // TODO: Return a real diory instead of "diory"
    let uploadFilesReturnValue = new Promise(resolve => { resolve("diory") })
    let uploadFilesSpy = spyOn(DioryFactory, 'createDioryFromFile').and.returnValue(uploadFilesReturnValue)
    let eventObject = { target: { files: ["file"] } }
    wrapper.find('input').first().simulate('change', eventObject);
    expect(uploadFilesSpy).toHaveBeenCalled()
    expect(uploadFilesSpy.calls.argsFor(0)).toEqual(["file", "kissa123"])
  })

  it('goes to error state when error is thrown in DioryFactory.createDioryFromFile', () => {
    let uploadFilesReturnValue = new Promise(() => { throw new Error("error") })
    let uploadFilesSpy = spyOn(DioryFactory, 'createDioryFromFile').and.returnValue(uploadFilesReturnValue)

    let eventObject = { target: { files: ["file"] } }
    component.startUploading(eventObject).then(() => {
      expect(wrapper.state().state).toEqual("error")
    })
  })

  it('goes to success state when diory is returned from DioryFactory.createDioryFromFile', () => {
    // TODO: Return a real diory instead of "diory"
    let uploadFilesReturnValue = new Promise(resolve => { resolve("diory") })
    let uploadFilesSpy = spyOn(DioryFactory, 'createDioryFromFile').and.returnValue(uploadFilesReturnValue)

    let eventObject = { target: { files: ["file"] } }
    component.startUploading(eventObject).then(() => {
      expect(wrapper.state().state).toEqual("success")
    })
  })

  // UI states

  it('Pending state: correct content for div', () => {
    wrapper.setState({ state: "pending" })
    let componentText = wrapper.find('div').first().text();
    expect(componentText).toEqual("Select file: ")
  })

  it('Loading state: correct content for div', () => {
    wrapper.setState({ state: "loading" })
    let componentText = wrapper.find('#message').text();
    expect(componentText).toEqual("Uploading the image...")
  })

  it('Success state: correct content for div', () => {
    wrapper.setState({ state: "success" })
    let componentText = wrapper.find('#message').text();
    expect(componentText).toEqual("Diory succesfully created!")
  })

  it('Error state: correct content for div', () => {
    wrapper.setState({ state: "error" })
    let componentText = wrapper.find('#message').text();
    expect(componentText).toEqual("Something went wrong while uploading the image...")
  })

})
