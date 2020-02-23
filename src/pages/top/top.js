import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Navigator } from '@tarojs/components'
import { GLOBAL_CONFIG } from '../../constants/globalConfig'
import { AtIcon } from 'taro-ui'
import { base64_decode } from '../../utils/base64'
import { hasLogin } from '../../utils/common'
import { HTTP_STATUS, REFRESH_STATUS } from '../../constants/status'
import { NAVIGATE_TYPE } from '../../constants/navigateType'
import Markdown from '../../components/repo/markdown'
import Painter from '../../components/repo/painter'
import LoadMore from '../../components/common/loadMore'

import api from '../../service/api'

import '../repo/repo.less'
import './top.less'

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
      url: '',
      repo: null,
      readme: null,
      hasStar: false,
      hasWatching: false,
      isShare: false,
      baseUrl: null,
      posterData: null,
      body: null,
      notification: null
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      url: decodeURI(params.url),
      isShare: params.share
    })
  }

  componentDidMount() {
    Taro.showLoading({ title: GLOBAL_CONFIG.LOADING_TEXT })
    this.setState({
      repo: null
    })
    this.getRepo()
    this.getNotification()
  }

  getNotification() {
    if (!hasLogin()) {
      return
    }

    let that = this

    let np = {
      all: false
    }
    api.get('/notifications', np).then(json => {
      if (json.data.length > 0) {
        let notice = json.data[0]
        let lastNoticeId = Taro.getStorageSync('lastNoticeId')
        if (notice.id > lastNoticeId) {
          that.setState({
            notification: {
              id: notice.id,
              content: notice.subject.title
            }
          })
        }
      }
    })
  }

  onPullDownRefresh() {
    this.getRepo()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onPageScroll(e) {
    let title = ''
    const { repo } = this.state
    if (!repo) {
      return
    }
    if (e.scrollTop > 0) {
      title = repo.name
    }
    Taro.setNavigationBarTitle({
      title: title
    })
  }

  onShareAppMessage(obj) {
    const { repo, url } = this.state
    if (!repo) {
      return {
        title: 'GitHub 最新最热开源项目',
        path: 'pages/top/top'
      }
    }
    let path = '/pages/repo/repo?url=' + encodeURI(url) + '&share=true'
    return {
      title: `「${repo.name}」★${repo.star} - GitHub 最新最热开源项目`,
      path: path
    }
  }

  getRepo() {
    let params = {
      page: 1,
      labels: 'Top',
      state: 'open',
      per_page: 1
    }

    api.get('https://api.github.com/repos/renyuzhuo/GitHub-Top/issues', params)
      .then(json => {
        let repo = JSON.parse(json.data[0].body)
        this.state.url = repo.url

        this.setState({
          repo: repo
        })

        let that = this
        api.get(this.state.url).then((res) => {
          if (res.statusCode === HTTP_STATUS.SUCCESS) {
            let baseUrl = 'https://raw.githubusercontent.com/' + res.data.full_name + '/master/'
            let project = res.data
            that.setState({
              repo: {
                name: project.name,
                full_name: project.full_name,
                description: project.description,
                url: project.url,
                homepage: project.homepage,
                star: project.stargazers_count,
                watchers_count: project.watchers_count,
                forks: project.forks_count,
                license: project.license,
                watch: project.subscribers_count,
                issues: project.open_issues_count,
                owner: {
                  login: project.owner.login,
                  type: project.owner.type
                }
              },
              baseUrl: baseUrl
            }, () => {
              that.getReadme()
              that.checkStarring()
            })
          } else {
            Taro.showToast({
              icon: 'none',
              title: res.data.message
            })
          }
          Taro.stopPullDownRefresh()
          Taro.hideLoading()
        })
      })
  }

  getReadme() {
    const { repo } = this.state
    if (!repo) {
      return
    }
    let url = '/repos/' + repo.full_name + '/readme'
    let that = this
    api.get(url).then((res) => {
      console.log(res.data)
      let readme = res.data.content
      if (readme) {
        let con = base64_decode(readme)
        if (con.length > 3500) {
          con = con.slice(0, 3000) + '\n\n---\n**README 过长，由于内存会占用过多，小程序闪退，因此无法完全显示，仅显示前 3000 字符。\n如仍需查看，请到上面 Code 中查看 README 文件。 😞**\n*—— By GitHub Top*'
          this.setState({
            readme: con
          })
        } else {
          this.setState({
            readme: con
          })
        }

      } else {
        this.setState({
          readme: null
        })
      }


      // console.log(res.data)
      // let readme = res.data.content
      // if (readme) {
      //   this.setState({
      //     readme: base64_decode(readme)
      //   })
      // } else {
      //   this.setState({
      //     readme: null
      //   })
      // }
    })
  }

  checkStarring() {
    if (hasLogin()) {
      const { repo } = this.state
      if (!repo) {
        return
      }
      let that = this
      let url = '/user/starred/' + repo.full_name
      api.get(url).then((res) => {
        that.setState({
          hasStar: res.statusCode === 204
        })
      })
    }
  }

  checkWatching() {
    if (hasLogin()) {
      const { repo } = this.state
      if (!repo) {
        return
      }
      let that = this
      let url = '/repos/' + repo.full_name + '/subscription'
      api.get(url).then((res) => {
        that.setState({
          hasWatching: res.statusCode === 200
        })
      })
    }
  }

  handleStar() {
    Taro.showLoading({ title: GLOBAL_CONFIG.LOADING_TEXT })
    const { hasStar, repo } = this.state
    if (!repo) {
      return
    }
    let url = '/user/starred/' + repo.full_name
    let that = this
    if (hasStar) {
      api.delete(url).then((res) => {
        if (res.statusCode === 204) {
          that.getRepo()
        } else {
          Taro.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      api.put(url).then((res) => {
        if (res.statusCode === 204) {
          that.getRepo()
        } else {
          Taro.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  }

  handleFork() {
    Taro.showLoading({ title: GLOBAL_CONFIG.LOADING_TEXT })
    const { repo } = this.state
    if (!repo) {
      return
    }
    let url = '/repos/' + repo.full_name + '/forks'
    api.post(url).then((res) => {
      Taro.hideLoading()
      if (res.statusCode === HTTP_STATUS.ACCEPTED) {
        Taro.showToast({
          title: 'Success',
          icon: 'success'
        })
      } else {
        Taro.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  }

  handleNavigate(type) {
    const { repo } = this.state
    if (!repo) {
      return
    }
    switch (type) {
      case NAVIGATE_TYPE.USER: {
        if (repo.owner.type === 'User') {
          Taro.navigateTo({
            url: '/pages/account/developerInfo?username=' + repo.owner.login
          })
        } else if (repo.owner.type === 'Organization') {
          Taro.navigateTo({
            url: '/pages/account/organitionInfo?username=' + repo.owner.login
          })
        }
      }
        break
      case NAVIGATE_TYPE.REPO_CONTENT_LIST: {
        Taro.navigateTo({
          url: '/pages/code/folder?repo=' + repo.full_name
        })
      }
        break
      case NAVIGATE_TYPE.ISSUES: {
        let url = '/pages/issue/issues?url=/repos/' + repo.full_name + '/issues&repo=' + repo.full_name
        Taro.navigateTo({
          url: url
        })
      }
        break
      case NAVIGATE_TYPE.REPO_CONTRIBUTORS_LIST: {
        let url = '/pages/repo/contributors?url=/repos/' + repo.full_name + '/contributors'
        Taro.navigateTo({
          url: url
        })
      }
        break
      case NAVIGATE_TYPE.REPO_EVENTS_LIST: {
        let url = '/pages/repo/repoEvents?url=/repos/' + repo.full_name + '/events'
        Taro.navigateTo({
          url: url
        })
      }
        break
      default: {
      }
    }
  }

  onClickedHome() {
    Taro.reLaunch({
      url: '/pages/top/top'
    })
  }

  onClickedActionButton(index) {
    const { repo } = this.state
    if (!repo) {
      return
    }
    if (index === 1) {
      this.loadWXACode()
    } else if (index === 2) {
      const url = `https://github.com/${repo.full_name}`
      Taro.setClipboardData({
        data: url
      })
    }
  }

  loadWXACode() {
    const { repo, url } = this.state
    const path = '/pages/repo/repo?url=' + encodeURI(url) + '&share=true'
    let that = this
    Taro.showLoading({ title: GLOBAL_CONFIG.LOADING_TEXT })
    that.generatePoster('../../assets/images/code.png')
  }

  generatePoster(imgUrl) {
    const { repo } = this.state
    let goodsWords = [
      'Stay hungry. Stay foolish.',
      'Talk is cheap. Show me the code.',
      '生活除了工作，还有诗和远方',
      '愿你出走半生，归来仍是少年',
      'E=mc²'
    ]
    const data = {
      background: '#f7f7f7',
      width: '750rpx',
      height: '1100rpx',
      borderRadius: '0rpx',
      views: [
        {
          type: 'rect',
          css: {
            left: '50rpx',
            width: '650rpx',
            top: '50rpx',
            color: '#ffffff',
            height: '900rpx',
            borderRadius: '20rpx',
            shadow: '10rpx 10rpx 5rpx #888888',
          }
        },
        {
          type: 'rect',
          css: {
            left: '50rpx',
            width: '650rpx',
            height: '640rpx',
            top: '50rpx',
            color: '#ef5350',
            borderRadius: '20rpx',
          }
        },
        {
          type: 'rect',
          css: {
            left: '50rpx',
            width: '650rpx',
            height: '50rpx',
            top: '640rpx',
            color: '#ef5350',
          }
        },
        {
          type: 'text',
          text: `「${repo.name}」`,
          css: {
            top: '80rpx',
            left: '375rpx',
            align: 'center',
            fontSize: '38rpx',
            color: '#ffffff',
            width: '550rpx',
            maxLines: '1',
          }
        },
        {
          type: 'text',
          text: `Stars：★${repo.star}  ${repo.star > 99 ? '🔥' : ''}`,
          css: {
            top: '150rpx',
            left: '80rpx',
            width: '550rpx',
            maxLines: '1',
            fontSize: '28rpx',
            color: '#ffffff'
          }
        },
        {
          type: 'text',
          text: `作者：${repo.owner.login}`,
          css: {
            top: '250rpx',
            left: '80rpx',
            width: '550rpx',
            maxLines: '1',
            fontSize: '28rpx',
            color: '#ffffff'
          }
        },
        {
          type: 'text',
          text: `GitHub：https://github.com/${repo.full_name}`,
          css: {
            top: '350rpx',
            left: '80rpx',
            width: '550rpx',
            fontSize: '28rpx',
            color: '#ffffff',
            lineHeight: '36rpx',
            maxLines: '2',
          }
        },
        {
          type: 'text',
          text: `项目描述：${repo.description || '暂无描述'}`,
          css: {
            top: '450rpx',
            left: '80rpx',
            width: '550rpx',
            fontSize: '28rpx',
            maxLines: '4',
            color: '#ffffff',
            lineHeight: '36rpx'
          }
        },
        {
          type: 'image',
          url: `${imgUrl}`,
          css: {
            bottom: '180rpx',
            left: '120rpx',
            width: '200rpx',
            height: '200rpx',
          },
        },
        {
          type: 'text',
          text: '长按识别，查看项目详情',
          css: {
            bottom: '290rpx',
            left: '350rpx',
            fontSize: '28rpx',
            color: '#666666'
          }
        },
        {
          type: 'text',
          text: '分享自「GitHub Top」',
          css: {
            bottom: '230rpx',
            left: '350rpx',
            fontSize: '28rpx',
            color: '#666666',
          }
        },
        {
          type: 'text',
          text: goodsWords[Math.floor((Math.random() * 5))],
          css: {
            bottom: '60rpx',
            left: '375rpx',
            align: 'center',
            fontSize: '28rpx',
            color: '#666666',
          }
        }
      ],
    }
    this.setState({
      posterData: data
    })
  }

  onPainterFinished() {
    this.setState({
      posterData: null
    })
  }

  loadError(event) {
  }

  onClickHomepage() {
    const { repo } = this.state
    let that = this
    if (!repo) {
      return
    }
    Taro.setClipboardData({
      data: that.state.repo.homepage
    })
  }

  onCloseNotification() {
    const { notification } = this.state
    Taro.setStorageSync('lastNoticeId', notification.id)
    this.setState({
      notification: null
    })
  }

  render() {
    const { repo, hasStar, isShare, readme, baseUrl, posterData, notification } = this.state
    return (
      <View className='content'>
        <View className='repo_bg_view'>
          {
            notification &&
            <View className='notification'>
              <AtIcon className='notification-bell' value='bell' size='20px' />
              <Text className='notification-text'>{notification.content.length > 21 ? notification.content.slice(0, 20) : notification.content}</Text>
              <AtIcon className='notification-close' value='close-circle' size='20px' onClick={this.onCloseNotification.bind(this)} />
            </View>
          }
          <Text className='repo_info_title'>{repo ? repo.name : '获取信息中...'}</Text>
          {
            repo && repo.fork &&
            <View className='fork'>
              <AtIcon prefixClass='ion' value='ios-git-network' size='15' color='#fff' />
              <Navigator url={'/pages/repo/repo?url=' + encodeURI(repo.parent.url)}>
                <Text className='fork_title'>
                  {repo.parent.full_name}
                </Text>
              </Navigator>
            </View>
          }
          <Text className='repo_info_desc'>{repo.description || '下拉刷新'}</Text>
        </View>
        <View className='repo_number_view'>
          <View className='repo_number_item_view'>
            <View className='repo_number_item'>
              <AtIcon prefixClass='ion' value='ios-eye' size='25' color='#333' />
              <Text className='repo_number_title'>{repo ? repo.watch : 0}</Text>
            </View>
            <View className='repo_number_item' onClick={this.handleStar.bind(this)}>
              <AtIcon prefixClass='ion'
                value={hasStar ? 'ios-star' : 'ios-star-outline'}
                size='25'
                color={hasStar ? '#333' : '#333'} />
              <Text className='repo_number_title'>{repo ? repo.star : 0}</Text>
            </View>
            <View className='repo_number_item' onClick={this.handleFork.bind(this)}>
              <AtIcon prefixClass='ion' value='ios-git-network' size='25' color='#333' />
              <Text className='repo_number_title'>{repo ? repo.forks : 0}</Text>
            </View>
          </View>
          <View className='share_item_view'>
            <View className='repo_share_item'>
              <Button className='action_button'
                openType='share'
                onClick={this.onClickedActionButton.bind(this, 0)}>
                <AtIcon prefixClass='ion' value='ios-share-alt' size='25' color='#333' />
                <Text className='action_button_title'>Share</Text>
              </Button>
            </View>
            <View className='repo_share_item'>
              <Button className='action_button'
                onClick={this.onClickedActionButton.bind(this, 1)}>
                <AtIcon prefixClass='ion' value='md-images' size='22' color='#333' />
                <Text className='action_button_title'>Save</Text>
              </Button>
            </View>
            <View className='repo_share_item'>
              <Button className='action_button'
                onClick={this.onClickedActionButton.bind(this, 2)}>
                <AtIcon prefixClass='ion' value='ios-link' size='23' color='#333' />
                <Text className='action_button_title'>Copy</Text>
              </Button>
            </View>
          </View>
        </View>
        <View className='repo_info_list_view'>
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.USER)}>
            <View className='list_title'>Author</View>
            <View className='list_content'>
              <Text className='list_content_title'>{repo.owner.login}</Text>
              <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
            </View>
          </View>
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.REPO_CONTENT_LIST)}>
            <View className='list_title'>Code</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
          {
            repo && repo.homepage &&
            <View className='repo_info_list'>
              <View className='list_title'>Homepage</View>
              <View className='list_content'>
                <Text className='list_content_title' onClick={this.onClickHomepage.bind(this)} >{repo.homepage.length > 25 ? repo.homepage.slice(0, 20) + '...' : repo.homepage}</Text>
              </View>
            </View>
          }
          <View className='repo_info_list'>
            <View className='list_title'>License</View>
            <View className='list_content'>
              <Text className='list_content_title'>{repo.license.spdx_id || '--'}</Text>
            </View>
          </View>
        </View>
        <View className='repo_info_list_view'>
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.ISSUES)}>
            <View className='list_title'>Issues</View>
            <View className='list_content'>
              {
                repo.issues > 0 &&
                <View className='tag'>{repo.issues}</View>
              }
              <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
            </View>
          </View>
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.REPO_EVENTS_LIST)}>
            <View className='list_title'>Events</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
          <View className='repo_info_list' onClick={this.handleNavigate.bind(this, NAVIGATE_TYPE.REPO_CONTRIBUTORS_LIST)}>
            <View className='list_title'>Contributors</View>
            <AtIcon prefixClass='ion' value='ios-arrow-forward' size='18' color='#7f7f7f' />
          </View>
        </View>
        {
          readme &&
          <View className='markdown'>
            <Text className='md_title'>README</Text>
            <View className='repo_md'>
              <Markdown md={readme} />
            </View>
          </View>
        }
        {
          isShare &&
          <View className='home_view' onClick={this.onClickedHome.bind(this)}>
            <AtIcon prefixClass='ion'
              value='ios-home'
              size='30'
              color='#fff' />
          </View>
        }
        {
          posterData && <Painter style='position:fixed;top:-9999rpx' data={posterData} save onPainterFinished={this.onPainterFinished.bind(this)} />
        }
        <LoadMore status={REFRESH_STATUS.NO_MORE_DATA} />
      </View>
    )
  }
}

export default Repo
