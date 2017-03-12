import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      user: null,
      pictures: [],
      uploadValue: 0
    }
  }

  componentWillMount () {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        user
      });
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      })
    })
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(result))
      .catch(error => console.log(error));
  }

  handleUpload(event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      })
    },
    error => console.log(error),
    () => {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      };

      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    });
  }

  handleLogout() {
    firebase.auth().signOut()
      .then(result => console.log(result))
      .catch(error => console.log(error));
  }

  __renderLoginButton(){
    if(this.state.user) {
      return <div>
        <img src={this.state.user.photoURL} alt={this.state.user.displayName}/>
        <p>Hola {this.state.user.displayName}</p>
        <button onClick={() => this.handleLogout()}>Salir</button>
        <FileUpload
          uploadValue={this.state.uploadValue}
          onUpload={(event) => this.handleUpload(event)}
        />
        {
          this.state.pictures.map(picture =>
            <div>
              <img width="320" src={picture.image} alt=""/>
              <img width="320" src={picture.photoURL} alt={picture.displayName}/>
              <img width="320" src={picture.displayName} alt=""/>
            </div>
          )
        }
      </div>;
    }

    return (
      <button onClick={() => this.handleAuth()}>
          Login con google
        </button>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">

          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
        {this.__renderLoginButton()}
        </p>
      </div>
    );
  }
}

export default App;
