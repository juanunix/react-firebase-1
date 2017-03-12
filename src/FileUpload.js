import React, { Component } from 'react';

class FileUpload extends Component {
  render(){
    return (
      <div>
        <progress value={this.props.uploadValue} max="100" />
        <input type="file" onChange={(event) => this.props.onUpload(event)} />
      </div>
    )
  }
}

export default FileUpload

