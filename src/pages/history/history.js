import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtIcon } from 'taro-ui'
import RepoItem from '../../components/account/repoItem'

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
      repos: []
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidMount() {
    this.getRepos()
  }

  onPullDownRefresh() {
    this.getRepos()
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }

  getRepos(){
    Taro.showLoading({ title: GLOBAL_CONFIG.LOADING_TEXT })
    Taro.stopPullDownRefresh()
    let that = this
    api.get('https://api.github.com/repos/renyuzhuo/GitHub-Hot/issues?filter=created&page=1&per_page=10&labels=Hot&state=open').then(json=>{
      let issues = json.data
      let projects = []
      issues.forEach((issue, index)=>{
        projects.push(JSON.parse(issue.body))
      })
      that.setState({
        repos: projects
      })
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
    const { repos } = this.state
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
                placeholder='Search project'
                onClick={this.onClick.bind(this)}
              />
            </View>
          </View>
        </View>
      </View>
        {
          repos && repos.length > 0 &&
          list
        }
      </View>
    )
  }
}
