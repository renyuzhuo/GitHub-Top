import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtTextarea, AtCheckbox } from 'taro-ui'
import { HTTP_STATUS } from '../../constants/status'

import api from '../../service/api'

import './addComment.less'

class AddComment extends Component {
  $instance = getCurrentInstance();

  constructor(props) {
    super(props)
    let checkedList = Taro.getStorageSync('issueEnd')
    this.state = {
      url: null,
      comment: null,
      checkedList: checkedList ? checkedList : ['open']
    }
    this.checkboxOption = [{
      value: 'open',
      label: '末尾自动添加: 提交自 GitHub Top'
    }]
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillMount() {
    let params = this.$instance.router.params
    this.setState({
      url: decodeURI(params.url)
    })
  }

  componentDidMount() {
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleTextareaChange(event) {
    this.setState({
      comment: event.target.value
    })
  }

  handleSubmit() {
    const { comment, url, checkedList } = this.state
    if (comment.length === 0) {
      Taro.showToast({
        title: '评论不可为空',
        icon: 'none'
      })
    } else {
      Taro.showLoading({ title: GLOBAL_CONFIG.LOADING_TEXT })
      let source = '[**提交自 GitHub Top 小程序**](https://github.com/renyuzhuo/GitHub-Top)'

      let body = comment
      if (checkedList.length !== 0) {
        body = body + '\n\n' + source
      }

      let params = {
        body: body
      }
      api.post(url, params).then((res) => {
        if (res.statusCode === HTTP_STATUS.CREATED) {
          Taro.navigateBack()
        } else {
          Taro.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        Taro.hideLoading()
      })
    }
  }

  onChangeEnd(value) {
    Taro.setStorageSync('issueEnd', value)
    this.setState({
      checkedList: value
    })
  }

  render() {
    return (
      <View className='content'>
        <View className='issue_comment'>
          <AtTextarea
            className='input_comment'
            height={'300px'}
            count={false}
            maxlength={10000}
            value={this.state.comment}
            onChange={this.handleTextareaChange.bind(this)}
            placeholder='Leave a comment...'
          />
        </View>
        <View className='issue_comment'>
          <AtCheckbox
            options={this.checkboxOption}
            selectedList={this.state.checkedList}
            onChange={this.onChangeEnd.bind(this)}
          />
        </View>
        <View className='submit' onClick={this.handleSubmit.bind(this)}>
          提交
        </View>
      </View>

    )
  }
}

export default AddComment
