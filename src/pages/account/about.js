import Taro, { Component } from '@tarojs/taro'
import { View, Navigator, Image, Text, Ad } from '@tarojs/components'

import './about.less'

class About extends Component {

  config = {
    navigationBarTitleText: '关于',
    navigationBarBackgroundColor: '#ef5350',
    navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
    this.state = {
      config: null
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
    require('../../assets/images/code.png')
  }

  componentWillMount() {
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  logout() {
    Taro.showModal({
      title: '你确定要退出登录吗',
      content: '退出登录后无法查看活动，提交 Issues 和 Star 项目等',
      showCancel: true,
      cancelText: '再想想',
      cancelColor: '#7f7f7f',
      confirmText: '退出',
      confirmColor: '#ef5350',
      success(res) {
        if (res.confirm) {
          Taro.clearStorage()
          Taro.navigateBack()
        }
      }
    })

  }

  render() {
    let api = 'https://api.github.com/repos/renyuzhuo/GitHub-Hot'
    let url = '/pages/repo/repo?url=' + encodeURI(api)
    return (
      <View className='content'>
        <Image mode='aspectFit'
          className='logo'
          src={require('../../assets/images/logo.png')} />
        <Text className='version'>
          GitHub Hot V1.0.0
        </Text>
        <Navigator url={url}>
          <Text className='link'>
            https://github.com/renyuzhuo/GitHub-Hot
          </Text>
        </Navigator>
        <View className='logout' onClick={this.logout.bind(this)}>退出</View>
        <Button className='contact' open-type="contact">与我联系</Button>
      </View>
    )
  }
}

export default About
