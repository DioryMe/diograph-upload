import * as React from 'react'
import { configure, shallow } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16';
import { DiographUpload } from '../app/diograph-upload'

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

  it('sets secrets from props', () => {
    expect(component.props.secrets).toEqual(secrets)
  })

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

})
