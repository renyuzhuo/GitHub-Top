import React, {Component} from 'react';
import Taro from '@tarojs/taro';
import {View} from '@tarojs/components'
import {GLOBAL_CONFIG} from '../../constants/globalConfig'

import './notification.less'
import Item from '../../components/notification/notificationItem'
import Empty from '../../components/index/empty'
import api from "../../service/api";

class Notification extends Component {

  config = {
    navigationBarTitleText: 'Unread Notification',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#ef5350',
    navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
    this.state = {
      notices: null,
      count: 0
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.loadNotification()
  }

  onPullDownRefresh() {
    this.loadNotification()
  }

  loadNotification() {
    let that = this
    api.get('/notifications').then(json => {
      console.log(json)
      that.setState({
        notices: json.data,
        count: json.data.length
      })

      Taro.stopPullDownRefresh()
      Taro.hideLoading()
    })
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  handleClickedNoticeItem(item) {
  }

  onClickItem(item) {
    console.log(item)
  }

  render() {
    const {notices, count} = this.state
    if (!notices) {
      return <Empty/>
    }
    let list = notices.map((item, index) => {
      return (
        <View onClick={this.handleClickedNoticeItem.bind(this, item)} key={item.id}>
          <Item item={item} onClick={this.onClickItem.bind(this)}/>
        </View>
      )
    })

    return (
      <View className='content'>
        {count === 0 ? <Empty/> : list}
        <View className='bottom'/>
      </View>
    )
  }
}

export default Notification
