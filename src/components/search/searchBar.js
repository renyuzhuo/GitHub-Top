import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Input } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './searchBar.less'

export default class SearchBar extends Component {

  static propTypes = {
    onFocus: PropTypes.func,
    onClickSearch: PropTypes.func,
  }

  static defaultProps = {
    onFocus: () => { },
    onClickSearch: () => {}
  }

  componentWillMount() {
  }

  render() {
    const { onFocus, onClickSearch } = this.props
    return (
      <View className='content'>
        <View className='search-bar-bg'>
          <AtIcon className='icon' value='search' size='18' color='#666' />
          <Input className='search-bar'
                 type='text'
                 placeholder='Search what you want...'
                 confirmType='search'
                 onFocus={onFocus.bind(this)}
                 onConfirm={onClickSearch.bind(this)}
          />
          <View className='icon' />
          {/*<AtIcon className='icon'*/}
                  {/*value='close'*/}
                  {/*size='18'*/}
                  {/*color='#666'*/}
                  {/*onClick={this.onClickClear.bind(this)} />*/}
        </View>
      </View>
    )
  }
}
