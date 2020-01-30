import Taro, { Component } from '@tarojs/taro'
import {Image, Text, View, Button} from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtAvatar, AtIcon } from 'taro-ui'
import { NAVIGATE_TYPE } from '../../constants/navigateType'
import { hasLogin } from '../../utils/common'
import api from '../../service/api'

import './organitionInfo.less'
import {baseUrl} from "../../service/config";

class OrganitionInfo extends Component {

  config = {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#ef5350',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      organitionInfo: null,
      isShare: false
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      username: params.username,
      isShare: params.share
    })
  }

  componentDidMount() {
    Taro.showLoading({title: GLOBAL_CONFIG.LOADING_TEXT})
    this.getOrganitionInfo()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh() {
    this.getOrganitionInfo()
  }

  getOrganitionInfo() {
    const { username } = this.state
    let that = this
    let url = '/users/' + username
    api.get(url).then((res)=>{
      that.setState({
        organitionInfo: res.data
      })
      Taro.hideLoading()
    })
  }

  handleNavigate(type) {
    const { organitionInfo } = this.state
    switch (type) {
      case NAVIGATE_TYPE.REPOS: {
        Taro.navigateTo({
          url: '/pages/repo/repoList?url=' + encodeURI(organitionInfo.repos_url)
        })
      }
        break
      default: {
      }
    }
  }
  onShareAppMessage(obj) {
    const { organitionInfo } = this.state
    return {
      title: (organitionInfo.name || organitionInfo.login) + ' - GitHub',
      path: '/pages/account/organitionInfo?username=' + organitionInfo.login + '&share=true'
    }
  }

  onClickedHome () {
    Taro.reLaunch({
      url: '/pages/top/top'
    })
  }

  render() {
    const { organitionInfo, isShare } = this.state
    if (!organitionInfo) return <View />
    return (
      <View className='content'>
        <Image className='account_bg' src={require('../../assets/images/account_bg.png')}/>
        <View className='user_info'>
          <AtAvatar className='avatar' circle image={organitionInfo.avatar_url}/>
          <Text className='username'>
            {organitionInfo.name || organitionInfo.login}
          </Text>
          <View className='login_name'>{organitionInfo.bio.length > 0 && <View className='bio'>{organitionInfo.bio}</View>}</View>
        </View>
        <View className='list_view'>
          <View className='list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.REPOS)}>
            <View className='list_title'>Repos</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='20' color='#7f7f7f' />
          </View>
        </View>
        <View className='list_view'>
          <View className='list'>
            <View className='list_title'>Email</View>
            <View className='list_content'>{organitionInfo.email.length > 0 ? organitionInfo.email : '--'}</View>
          </View>
          <View className='list'>
            <View className='list_title'>Blog</View>
            <View className='list_content'>{organitionInfo.blog.length > 0 ? organitionInfo.blog : '--'}</View>
          </View>
          <View className='list'>
            <View className='list_title'>Location</View>
            <View className='list_content'>{organitionInfo.location.length > 0 ? organitionInfo.location : '--'}</View>
          </View>
        </View>
        <View className='bottom_view' />
        {
          isShare &&
          <View className='home_view' onClick={this.onClickedHome.bind(this)}>
            <AtIcon prefixClass='ion'
                    value='ios-home'
                    size='30'
                    color='#fff' />
          </View>
        }
      </View>
    )
  }
}

export default OrganitionInfo
