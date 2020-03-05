import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'

import {AtList, AtListItem} from "taro-ui"

import './contact.less'

class About extends Component {

  config = {
    navigationBarTitleText: '与我联系',
    navigationBarBackgroundColor: '#ef5350',
    navigationBarTextStyle: 'white'
  }

  handleClickEmail(){
    Taro.setClipboardData({
      data: 'renyuzhuo@foxmail.com'
    })
  }

  handleClickWeChat(){
    Taro.setClipboardData({
      data: 'r-saodiseng'
    })
  }

  render() {
    return (
      <View className='content'>
        <AtList className='list'>
          <AtListItem id='email' title ='邮箱' note='renyuzhuo@foxmail.com' onClick={this.handleClickEmail.bind(this)} /> 
          <AtListItem id='wechat' title ='微信' note='r-saodiseng' onClick={this.handleClickWeChat.bind(this)} /> 
        </AtList>

        <Button className='contact' open-type="contact">直接微信发消息</Button>
      </View>
    )
  }
}

export default About
