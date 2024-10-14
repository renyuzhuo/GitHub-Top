import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import {Image, View} from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { hasLogin } from '../../utils/common'
import { HTTP_STATUS, REFRESH_STATUS } from '../../constants/status'

import ActivityItem from '../../components/activity/activityItem'
import Empty from '../../components/index/empty'
import LoadMore from '../../components/common/loadMore'

import api from '../../service/api'

import './activity.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      page: 1,
      refresh_status: REFRESH_STATUS.NORMAL
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.eventCenter.on('login_success', (res)=>{
      Taro.startPullDownRefresh()
    })
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getActivityList()

    if (!hasLogin()) {
      Taro.showModal({
        title: '请登录',
        content: '请登录再查看您的活动',
        showCancel: true,
        cancelText: '再看看',
        cancelColor: '#7f7f7f',
        confirmText: '登录',
        confirmColor: '#ef5350',
        success(res) {
          if (res.confirm) {
            Taro.navigateTo({
              url: '/pages/login/login'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }

  componentWillUnmount () {
  }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh() {
    let that = this
    this.setState({
      page: 1
    }, ()=>{
      that.getActivityList()
    })
  }

  onReachBottom() {
    const { page, refresh_status } = this.state
    if (refresh_status !== REFRESH_STATUS.NO_MORE_DATA) {
      let that = this
      this.setState({
        page: page + 1
      }, ()=>{
        that.getActivityList()
      })
    }
  }

  getActivityList() {
    const { page, list } = this.state
    let url = '/events'
    let that = this
    if (hasLogin()) {
      let login = Taro.getStorageSync('login')
      url = '/users/' + login + '/received_events'
    }else{
      refresh_status: REFRESH_STATUS.REFRESHING
      Taro.stopPullDownRefresh()
      Taro.hideLoading()
      that.setState({
        list: {}
      })
      return
    }

    if (page !== 1) {
      that.setState({
        refresh_status: REFRESH_STATUS.REFRESHING
      })
    }

    let params = {
      per_page: GLOBAL_CONFIG.PER_PAGE,
      page: page
    }
    api.get(url, params).then((res)=>{
      if (res.statusCode === HTTP_STATUS.SUCCESS) {
        if (page === 1) {
          that.setState({
            list: res.data
          })
        } else {
          that.setState({
            list: list.concat(res.data)
          })
        }
        let status = res.data.length < GLOBAL_CONFIG.PER_PAGE ? REFRESH_STATUS.NO_MORE_DATA : REFRESH_STATUS.NORMAL
        that.setState({
          refresh_status: status
        })
      } else {
        Taro.showToast({
          title: res.data.message,
          icon: 'none'
        })
        that.setState({
          refresh_status: REFRESH_STATUS.NORMAL
        })
      }
    Taro.stopPullDownRefresh()
    Taro.hideLoading()
    })
  }

  render () {
    const { list, refresh_status } = this.state
    return (
      <View className='content'>
        {
          list.length > 0 ? (
            list.map((item, index)=>{
              return (
                <View key={item.id} className='list_view'>
                  <ActivityItem item={item} />
                </View>
              )
            })
          ) : <Empty />
        }
        <LoadMore status={refresh_status} />
      </View>
    )
  }
}

export default Index
