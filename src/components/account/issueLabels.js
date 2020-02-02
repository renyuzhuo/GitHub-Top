import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types';
import { View } from '@tarojs/components'
import { AtTag } from 'taro-ui'


import './issueLabels.less'

export default class IssueLabels extends Component {
  static propTypes = {
    items: PropTypes.array
  }

  static defaultProps = {
    items: []
  }

  render() {
    const { items } = this.props
    if (items.length === 0) return <View />
    let customStyle = 'background-color: #ffffff;border-color:#f0f0f0; color: #7f7f7f;'
    return (
      <View className='content'>
        {
          items.map((item, index) => {
            return (
              <View key={item.id} className='tag'>
                <AtTag circle active type='primary' size='small' customStyle={customStyle}>
                  {item.name}
                </AtTag>
              </View>
            )
          })
        }
      </View>
    )
  }
}
