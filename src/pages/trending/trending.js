import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { HTTP_STATUS, REFRESH_STATUS } from '../../constants/status'
import { get as getGlobalData, set as setGlobalData } from '../../utils/global_data'
import { AtNoticebar } from 'taro-ui'

import ItemList from '../../components/index/itemList'
import Empty from '../../components/index/empty'
import LoadMore from '../../components/common/loadMore'

import './trending.less'

class Tending extends Component {

  config = {
    navigationBarTitleText: 'Trending',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#ef5350',
    navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      category: {
        'name': 'Today',
        'value': 'daily'
      },
      animation: null,
      isHidden: false,
      fixed: false,
      notice: null,
      notice_closed: false,
      repos: [],
      developers: [],
      range: [
        [{
          'name': 'Today',
          'value': 'daily'
        },
        {
          'name': 'Week',
          'value': 'weekly'
        },
        {
          'name': 'Month',
          'value': 'monthly'
        }]
      ]
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    Taro.showLoading({ title: GLOBAL_CONFIG.LOADING_TEXT })
    this.loadItemList()
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }

  onPullDownRefresh() {
    this.loadItemList()
  }

  onPageScroll(obj) {
    const { fixed } = this.state
    if (obj.scrollTop > 0) {
      if (!fixed) {
        this.setState({
          fixed: true
        })
      }
    } else {
      this.setState({
        fixed: false
      })
    }
  }

  onScroll(e) {
    if (e.detail.scrollTop < 0) return;
    if (e.detail.deltaY > 0) {
      let animation = Taro.createAnimation({
        duration: 400,
        timingFunction: 'ease',
      }).bottom(25).step().export()
      this.setState({
        isHidden: false,
        animation: animation
      })
    } else {
      if (!this.state.isHidden) {
        let animation = Taro.createAnimation({
          duration: 400,
          timingFunction: 'ease',
        }).bottom(-95).step().export()
        this.setState({
          isHidden: true,
          animation: animation
        })
      }
    }
  }

  onChangeTime(e) {
    this.setState({
      category: this.state.range[0][e.detail.value[0]]
    }, () => {
      Taro.showLoading({ title: GLOBAL_CONFIG.LOADING_TEXT })
      this.loadItemList()
    })
  }

  loadItemList() {
    const { current, category } = this.state
    let that = this
    console.log(category)
    Taro.request({
      url: 'https://github-trending-api.now.sh/repositories',
      data: {
        since: category.value
      }
    }).then(json => {
      console.log(json)
      that.setState({
        repos: json.data
      }, () => {
        Taro.pageScrollTo({
          scrollTop: 0
        })
        if (current === 0) {
          Taro.hideLoading()
          Taro.stopPullDownRefresh()
        }
      })
    }).catch(err => {
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    })
  }

  onShareAppMessage(obj) {
  }

  handleChange() {

  }

  render() {
    let categoryType = 0
    let categoryValue = this.state.category.value
    if (categoryValue === 'weekly') {
      categoryType = 1
    } else if (categoryValue === 'monthly') {
      categoryType = 2
    }
    const { repos, current } = this.state
    if (repos.length === 0) return <View />
    return (
      <View className='content'>
        {
          current === 0 &&
          (repos.length > 0 ? <ItemList itemList={repos} type={0} categoryType={categoryType} /> : <Empty />)

        }
        <LoadMore status={REFRESH_STATUS.NO_MORE_DATA} />
        <View className='bottom-empty' />
        {
          <View>
            <Picker mode='multiSelector' range={this.state.range} rangeKey={'name'} onChange={this.onChangeTime.bind(this)} >
              <View className='filter' animation={this.state.animation}>
                <Text className='category'>{this.state.category.name}</Text>
              </View>
            </Picker>
          </View>
        }
      </View>
    )
  }
}

export default Tending
