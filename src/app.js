// import '@tarojs/async-await'
import {Component} from 'react';

import './app.less'
import './assets/ionicons/css/ionicons.min.css'

class App extends Component {
  render() {
    return this.props.children;
  }
}

export default App;
