import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './notificationItem.less'

export default class ContentListItem extends Component {
  static propTypes = {
    item: PropTypes.object,
  }

  static defaultProps = {
    item: null,
  }

  onClickItem(e) {
    e.stopPropagation()
    const { item } = this.props

    console.log(item)

    if (item.subject.type === 'Issue') {
      const url = '/pages/issue/issueDetail?url=' + encodeURI(item.subject.url)
      Taro.navigateTo({
        url: url
      })
    } else {
      const url = '/pages/repo/repo?url=' + encodeURI(item.repository.url)
      Taro.navigateTo({
        url: url
      })
    }
  }

  render() {
    const { item } = this.props
    console.log(item)
    if (!item) return <View />
    return (
      <View className='content' onClick={this.onClickItem.bind(this)}>
        <View className='repo_title_view'>
          <View className='repo_title'>{item.repository.name}</View>
        </View>
        <View className='repo_desc'>{item.subject.title}</View>
      </View>
    )
  }
}
