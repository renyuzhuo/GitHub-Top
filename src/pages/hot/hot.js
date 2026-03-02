import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { REFRESH_STATUS } from '../../constants/status'
import Markdown from '../../components/repo/markdown'
import LoadMore from '../../components/common/loadMore'

import api from '../../service/api'

import '../repo/repo.less'
import './hot.less'

class Repo extends Component {

  config = {
    navigationBarTitleText: '',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#ef5350',
    navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
    this.state = {
      readme: null
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.showLoading({ title: GLOBAL_CONFIG.LOADING_TEXT })
    this.getReadme()
  }

  onPullDownRefresh() {
    this.getReadme()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onPageScroll(e) {
    Taro.setNavigationBarTitle({
      title: "今日热点"
    })
  }

  onShareAppMessage(obj) {
    return {
      title: '今日热点',
      path: 'pages/hot/hot'
    }
  }

  getReadme() {
    let url = 'https://weibo.g.renyuzhuo.cn/README.md'
    api.get(url).then((res) => {
      console.log(res)
      console.log(res.data)
      let readme = res.data
      if (readme) {
        let con = readme
        this.setState({
          readme: con
        })
      } else {
        this.setState({
          readme: null
        })
      }
      Taro.hideLoading()
    })
  }

  onClickedHome() {
    Taro.reLaunch({
      url: '/pages/hot/hot'
    })
  }

  onClickedActionButton(index) {
  }

  loadError(event) {
  }

  render() {
    const { readme } = this.state
    return (
      <View className='content'>
        {
          readme &&
          <View className='markdown'>
            <View className='hot_md'>
              <Markdown md={readme} />
            </View>
          </View>
        }
        <official-account></official-account>
        <LoadMore status={REFRESH_STATUS.NO_MORE_DATA} />
      </View>
    )
  }
}

export default Repo
