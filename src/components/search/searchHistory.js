import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Input, Text } from '@tarojs/components'
import { AtTag } from 'taro-ui'

import './searchHistory.less'

export default class SearchHistory extends Component {

  static propTypes = {
    items: PropTypes.array,
    onTagClick: PropTypes.func
  }

  static defaultProps = {
    items: [],
    onTagClick: ()=>{}
  }

  componentWillMount() {
  }

  render() {
    const { items, onTagClick } = this.props
    let customStyle = 'background-color: #ffffff; border-color:#ef5350; color: #ef5350;'
    const list = items.map((name, index) => {
      return <View key={name.id} className='tag-item'>
            <AtTag className='at-tag--active' circle active onClick={onTagClick.bind(this)} name={name} customStyle={customStyle}>{name}</AtTag>
      </View>
    })
    return (
      <View className='content'>
        <View className='tag-view'>
          {list}
        </View>
      </View>
    )
  }
}
