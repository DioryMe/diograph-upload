import * as React from 'react';

export interface SearchCreateState { searchResults: any, searchTerm: string }
export interface SearchCreateProps { onFocusClick: any }

export class DiographSearchCreate extends React.Component<SearchCreateProps, SearchCreateState> {

  constructor(props) {
    super(props)
    this.state = {searchResults: [], searchTerm: ""}
  }

  render() {
    return (
      <div>
        Jeejee
      </div>
    )
  }

  onFocusClick(dioryId) {
    this.setState({searchResults: []})
    this.setState({searchTerm: ""})
    this.props.onFocusClick(dioryId)
  }

}
