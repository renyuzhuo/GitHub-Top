import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { REFRESH_STATUS } from '../../constants/status'

import { AtIcon } from 'taro-ui'
import RepoItem from '../../components/account/repoItem'
import LoadMore from '../../components/common/loadMore'
import Empty from '../../components/index/empty'

import api from '../../service/api'

import './history.less'

class Index extends Component {

  config = {
    navigationBarTitleText: 'History',
    navigationBarBackgroundColor: '#ef5350',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      repos: [],
      page: 0,
      status: REFRESH_STATUS.NORMAL,
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidMount() {
    Taro.showLoading({ title: GLOBAL_CONFIG.LOADING_TEXT })
    this.getRepos(1)
  }

  onPullDownRefresh() {
    this.setState({
      status: REFRESH_STATUS.REFRESHING
    })
    this.getRepos(1)
  }

  onReachBottom() {
    let that = this
    const { repo, page, status } = this.state
    if (status !== REFRESH_STATUS.NO_MORE_DATA) {
      this.setState({
        page: page + 1
      }, () => {
        that.getRepos(page + 1)
      })
    }
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }

  getRepos(index){
    const { repo, page, status } = this.state

    let that = this
    this.state.page = index
    let params = {
      page: index,
      labels: 'Hot',
      state: 'open',
      per_page: 10
    }

    let projects = index == 1 ? [] : repo

    api.get('https://api.github.com/repos/renyuzhuo/GitHub-Hot/issues', params).then(json=>{
      Taro.stopPullDownRefresh()

      let issues = json.data
      if(issues.length == 0){
        that.setState({
          status: REFRESH_STATUS.NO_MORE_DATA
        })
      }else{
        issues.forEach((issue, index) => {
          projects.push(JSON.parse(issue.body))
        })
        that.setState({
          repos: projects,
          status: issues.length < 10 ? REFRESH_STATUS.NO_MORE_DATA : REFRESH_STATUS.NORMAL
        })
      }
      Taro.hideLoading()
    })
  }

  onClick(){
    Taro.navigateTo({
      url: '../search/index'
    })
  }

  handleClickedRepoItem(item){
    let url = '/pages/repo/repo?url=' + encodeURI(item.url)
    Taro.navigateTo({
      url: url
    })
  }

  render() {
    const { repos, status } = this.state
    let list = repos.map((item, index) => {
      return (
        <View onClick={this.handleClickedRepoItem.bind(this, item)} key={item.id}>
          <RepoItem item={item} />
        </View>
      )
    })
    return (
      <View>
        <View className='content'>
          <View className='search-bar-fixed'>
            <View className='content'>
              <View className='search-bar-bg'>
                <AtIcon className='icon' value='search' size='18' color='#666' />
                <Input className='search-bar'
                  disabled='true'
                  placeholder='Search All GitHub'
                  onClick={this.onClick.bind(this)}
                />
              </View>
            </View>
          </View>
        </View>
        {
          repos && repos.length > 0 ? list : <Empty />
        }
        <LoadMore status={status}/>
      </View>
    )
  }
}
