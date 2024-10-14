import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import Tab from './tab'

import './segment.less'

export default class Segment extends Component {

  static propTypes = {
    current: PropTypes.number,
    onTabChange: PropTypes.func,
    tabList: PropTypes.array
  }

  static defaultProps = {
    current: 0,
    onTabChange: () => {},
    tabList: []
  }

  onActionSearch () {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }

  render() {
    const { current, onTabChange, tabList} = this.props
    return (
      <View className='content'>
        <View className='action-view' />
        <Tab tabList={tabList} current={current} onTabClick={onTabChange.bind(this)} />
        <View className='action-view' />
      </View>
    )
  }
}
