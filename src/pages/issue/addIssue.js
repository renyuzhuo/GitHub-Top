import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtInput, AtTextarea, AtCheckbox } from 'taro-ui'
import { HTTP_STATUS } from '../../constants/status'

import api from '../../service/api'

import './addIssue.less'

class AddIssue extends Component {

  config = {
    navigationBarTitleText: 'Issue',
    navigationBarBackgroundColor: '#ef5350',
    navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
    let checkedList = Taro.getStorageSync('issueEnd')
    this.state = {
      repo: null,
      title: '',
      comment: '',
      checkedList: checkedList ? checkedList : ['open'],
      checkedListHot: [],
      checkedListTop: [],
      isHot: false,
      isTop: false,
      isShowCopyRepoJson: Taro.getStorageSync('myId') === 7275046
    }

    this.checkboxOption = [{
      value: 'open',
      label: '末尾自动添加: 提交自 GitHub Top'
    }]
    this.checkboxOptionHot = [{
      value: 'hot',
      label: 'Hot'
    }]
    this.checkboxOptionTop = [{
      value: 'top',
      label: 'Top'
    }]
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      repo: params.repo
    })
  }

  componentDidMount() {
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleChange(value) {
    this.setState({
      title: value
    })
  }

  handleTextareaChange(event) {
    this.setState({
      comment: event.target.value
    })
  }

  handleSubmit() {
    const { title, comment, checkedList, checkedListHot, checkedListTop } = this.state
    if (title.length === 0) {
      Taro.showToast({
        title: 'Please input title',
        icon: 'none'
      })
    } else {
      Taro.showLoading({ title: GLOBAL_CONFIG.LOADING_TEXT })
      let url = '/repos/' + this.state.repo + '/issues'
      let source = '[**提交自 GitHub Top 小程序**](https://github.com/renyuzhuo/GitHub-Top)'
      let body = ''
      if (comment.length > 0) {
        if (checkedList.length === 0) {
          body = comment
        } else {
          body = comment + '\n\n' + source
        }
      } else {
        if (checkedList.length === 0) {
          body = ''
        } else {
          body = source
        }
      }
      let labels = []
      if (checkedListHot.length > 0) {
        labels.push('Hot')
      }
      if (checkedListTop.length > 0) {
        labels.push('Top')
      }
      let params = {
        title: title,
        body: body,
        labels: labels
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

  onChangeTop(value) {
    let that = this
    this.setState({
      checkedListTop: value
    })
  }

  onChangeHot(value) {
    this.setState({
      checkedListHot: value
    })
  }

  render() {
    const { isShowCopyRepoJson } = this.state
    return (
      <View className='content'>
        <View className='issue_title'>
          <AtInput
            className='input_title'
            name='title'
            title=''
            type='text'
            placeholder='Title'
            value={this.state.title}
            border={false}
            onChange={this.handleChange.bind(this)}
          />
        </View>
        <View className='issue_comment'>
          <AtTextarea
            className='input_comment'
            height={'300px'}
            count={false}
            maxlength={10000}
            value={this.state.comment}
            onChange={this.handleTextareaChange.bind(this)}
            placeholder='Leave a comment'
          />
        </View>
        <View className='issue_comment'>
          <AtCheckbox
            options={this.checkboxOption}
            selectedList={this.state.checkedList}
            onChange={this.onChangeEnd.bind(this)}
          />
          {
            isShowCopyRepoJson &&
            <AtCheckbox
              options={this.checkboxOptionHot}
              selectedList={this.state.checkedListHot}
              onChange={this.onChangeHot.bind(this)}
            />
          }
          {
            isShowCopyRepoJson &&
            <AtCheckbox
              options={this.checkboxOptionTop}
              selectedList={this.state.checkedListTop}
              onChange={this.onChangeTop.bind(this)}
            />
          }
        </View>
        <View className='submit' onClick={this.handleSubmit.bind(this)}>
          提交
        </View>
      </View>
    )
  }
}

export default AddIssue
