import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View, Text, Navigator } from '@tarojs/components'
import { AtIcon, AtTag } from 'taro-ui'
import { timeago } from '../../utils/common'
import IssueLabels from './issueLabels'

import './issueItem.less'

export default class IssueItem extends Component {
  static propTypes = {
    item: PropTypes.object
  }

  static defaultProps = {
    item: null
  }

  onClickRepo(e) {
    e.stopPropagation()
    const { item } = this.props
    const url = '/pages/repo/repo?url=' + encodeURI(item.repository.url)
    Taro.navigateTo({
      url: url
    })
  }

  render() {
    const { item } = this.props
    if (!item) return <View />
    let desc = '#' + item.number
    desc = desc + ' opend ' + timeago(Date.parse(new Date(item.created_at))) + ' by ' + item.user.login
    return (
      <View className='content'>
        <AtIcon prefixClass='ion'
          value={item.state === 'open' ? 'ios-information-circle-outline' : 'ios-checkmark-circle-outline'}
          size='20'
          color={item.state === 'open' ? '#28a745' : '#ff4949'} />
        <View className='detail'>
          <Text className='issue_title'>
            {item.title}
          </Text>
          {
            item.labels.length > 0 &&
            <IssueLabels items={item.labels} />
          }
          {
            item.comments > 0 &&
            <Text className='issue_desc'>
              {item.comments + (item.comments === 1 ? ' comment' : ' comments')}
            </Text>
          }
          <Text className='issue_desc'>
            {desc}
          </Text>
          {
            item.repository &&
            <Text className='issue_repo' onClick={this.onClickRepo.bind(this)}>
              {item.repository.full_name}
            </Text>
          }
        </View>
      </View>
    )
  }

}
