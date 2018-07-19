import * as React from 'react'
import { configure, shallow } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16';
import { DiographUpload } from '../app/diograph-upload'
import { Upload } from '../app/lib/upload'

declare var Promise: any;

describe('<DiographUpload />', () => {
  let wrapper, component, secrets
  configure({ adapter: new Adapter() })

  beforeEach(() => {
    secrets = {"master": "kissa123"}
    wrapper = shallow(
      <DiographUpload secrets={ secrets } />
    )
    component = wrapper.instance();
  })

  // Secrets props

  it('sets secrets from props', () => {
    expect(component.props.secrets).toEqual(secrets)
  })

  // Integration tests for file uploading

  it('calls Upload.uploadFiles() with correct attributes when file(s) are chosen', () => {
    let uploadFilesReturnValue = new Promise(resolve => { resolve("jeejee") })
    let uploadFilesSpy = spyOn(Upload, 'uploadFiles').and.returnValue(uploadFilesReturnValue)
    wrapper.find('input').first().simulate('change', "eventObject");
    expect(uploadFilesSpy).toHaveBeenCalled()
    expect(uploadFilesSpy.calls.argsFor(0)).toEqual(["eventObject", "kissa123"])
  })


  // Integration tests for UI states

  it('Pending state: correct content for div', () => {
    wrapper.setState({ state: "pending" })
    let componentText = wrapper.find('div').text();
    expect(componentText).toEqual("Select file: ")
  })

  it('Loading state: correct content for div', () => {
    wrapper.setState({ state: "loading" })
    let componentText = wrapper.find('div').text();
    expect(componentText).toEqual("Uploading the image... 10%")
  })

  it('Success state: correct content for div', () => {
    wrapper.setState({ state: "success" })
    let componentText = wrapper.find('div').text();
    expect(componentText).toEqual("Image succesfully uploaded!")
  })

  it('Error state: correct content for div', () => {
    wrapper.setState({ state: "error" })
    let componentText = wrapper.find('div').text();
    expect(componentText).toEqual("Something went wrong while uploading the image...")
  })

})