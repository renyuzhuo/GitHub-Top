import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'

import SearchBar from '../../components/search/searchBar'

import './history.less'

class Index extends Component {

  config = {
    navigationBarTitleText: 'Search',
    navigationBarBackgroundColor: '#ef5350',
    navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidMount() {
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }

  onFocus(){
    Taro.navigateTo({
      url: '../search/index'
    })
  }

  render() {
    const { history } = this.state
    return (
      <View className='content'>
        <View className='search-bar-fixed'>
          <SearchBar onFocus={this.onFocus.bind(this)} />
        </View>
      </View>
    )
  }
}
