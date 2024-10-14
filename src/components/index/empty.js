import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text } from '@tarojs/components'

import './empty.less'

export default class Segment extends Component {

  static propTypes = {
    content: PropTypes.string,
  }

  static defaultProps = {
    content: '这里什么也没有...'
  }

  componentWillMount() {
  }

  render() {
    const { content } = this.props
    return (
      <View className='content'>
        <Image className='img' src={require('../../assets/images/octocat.png')} />
        <Text className='text'>{content}</Text>
      </View>
    )
  }
}
