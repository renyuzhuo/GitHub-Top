import Taro, { Component } from '@tarojs/taro'
import { View, Navigator, Image, Text, Ad } from '@tarojs/components'

import './about.less'

class About extends Component {

  config = {
    navigationBarTitleText: 'About'
  }

  constructor(props) {
    super(props)
    this.state = {
      config: null
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
  }

  componentDidMount() {
    let that = this
    Taro.getStorage({
      key: 'config_gitter',
      success(res) {
        console.log('config_gitter', res)
        if (res.data) {
          that.setState({
            config: res.data
          })
        }
      }
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  logout() {

    Taro.showModal({
      content: 'Are you sure?',
      showCancel: true,
      cancelText: 'No',
      cancelColor: '#7f7f7f',
      confirmText: 'Yeah',
      confirmColor: '#ef5350',
      success(res) {
        if (res.confirm) {
          Taro.setStorageSync('Authorization', '')
          Taro.setStorageSync('userInfo', null)
          Taro.navigateBack()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }

  previewImage() {
    const { config } = this.state
    Taro.previewImage({
      urls: [config.support_url]
    })
  }

  render() {
    const { config } = this.state
    console.log('config', config)
    let api = 'https://api.github.com/repos/renyuzhuo/GitHub-Hot'
    let url = '/pages/repo/repo?url=' + encodeURI(api)
    return (
      <View className='content'>
        <Image mode='aspectFit'
          className='logo'
          src={require('../../assets/images/logo.png')} />
        <Text className='version'>
          Gitter v1.3.2
        </Text>
        <Navigator url={url}>
          <Text className='link'>
            https://github.com/renyuzhuo/GitHub-Hot
          </Text>
        </Navigator>
        <View className='logout' onClick={this.logout.bind(this)}>
          Logout
        </View>
        {
          config.support && (
            <View className='support_view'>
              <Text className='support_title'>Support Gitter ❤</Text>
              <Image className='support_image'
                src={config.support_url}
                onClick={this.previewImage}
              />
              <Text className='support_title'>点击长按识别</Text>
            </View>
          )
        }
      </View>
    )
  }
}

export default About
