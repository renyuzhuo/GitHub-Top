import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import { get as getGlobalData, set as setGlobalData } from './utils/global_data'

import Index from './pages/top'

import configStore from './store'

import './app.less'
import './assets/ionicons/css/ionicons.min.css'

const store = configStore

class App extends Component {

  config = {
    pages: [
      'pages/top/top',
      'pages/history/history',
      'pages/trending/trending',
      'pages/activity/activity',
      'pages/login/login',

      'pages/account/account',

      'pages/about/about',

      'pages/code/file',
      'pages/code/folder',

      'pages/issue/issues',
      'pages/issue/issueDetail',
      'pages/issue/addIssue',
      'pages/issue/addComment',

      'pages/repo/repo',
      'pages/repo/repoList',
      'pages/repo/contributors',
      'pages/repo/starredRepo',
      'pages/repo/repoEvents',

      'pages/account/follow',
      'pages/account/organitionInfo',
      'pages/account/developerInfo',

      'pages/search/index',
      'pages/search/searchResult',

      'pages/notification/notification',
      'pages/contact/contact',
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'GitHub Top',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      list: [
        {
          pagePath: 'pages/top/top',
          text: 'Top',
          iconPath: './assets/images/tab_trend.png',
          selectedIconPath: './assets/images/tab_trend_s.png'
        },
        {
          pagePath: 'pages/history/history',
          text: 'History',
          iconPath: './assets/images/tab_history.png',
          selectedIconPath: './assets/images/tab_history_s.png'
        },
        {
          pagePath: 'pages/trending/trending',
          text: 'Trending',
          iconPath: './assets/images/tab_trending.png',
          selectedIconPath: './assets/images/tab_trending_s.png'
        },
        {
          pagePath: 'pages/activity/activity',
          text: 'Activity',
          iconPath: './assets/images/tab_news.png',
          selectedIconPath: './assets/images/tab_news_s.png'
        },
        {
          pagePath: 'pages/account/account',
          text: 'Me',
          iconPath: './assets/images/tab_me.png',
          selectedIconPath: './assets/images/tab_me_s.png'
        }
      ],
      color: '#8a8a8a',
      selectedColor: '#ef5350',
      backgroundColor: '#ffffff',
      borderStyle: 'white'
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
