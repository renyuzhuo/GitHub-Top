# GitHub Top

本项目为 GitHub 热点项目微信小程序客户端，首页仅推荐一个热点项目，这个项目往往是社会热门事件所催生的一个项目，如 [996.ICU](https://github.com/996icu/996.ICU)、[wuhan2020](https://github.com/wuhan2020/wuhan2020)，所推荐项目标准为：**积极、健康、热点、具有一定进步性**。

GitHub 小程序有很多，但推荐热点项目的往往是拉取 [GitHub Trending](https://github.com/trending) 数据，有其意义（本小程序也支持此功能），但获取所需信息效率较低，不一定找得到你所需要的项目，因此创建本项目。本项目创建的目标是：**打开即所需**。

## 本项目使用方法

**喜欢闲逛 GitHub 的开发者**、**GitHub 相关内容公众号运营者**, 以及 **热点项目的关注者**，都可以关注收藏此项目，欢迎日常查看；也可在公众号后台关联此项目，在文章中插入小程序，读者可方便跳转并查看 GitHub 项目，插入小程序方法请点击 [这里](https://api.renyuzhuo.cn/to-wechat.html)。

## 功能介绍

1. 首页推荐唯一热点项目
2. 第二个 Tab 页推荐热点周边或历史热点项目
3. 第三个 Tab 页显示 [GitHub Trending](https://github.com/trending)
4. 第四个 Tab 页显示你所 Follow 的人的最近活动，往往在这里也可能找到你所感兴趣的项目
5. 第五个 Tab 页显示你的 GitHub 账号信息，对自己项目进行管理
6. 在本项目中，你可以方便 Star 或 Fork 你所感兴趣的项目，提 Issues 或针对 Issues 进行评论等，也可方便 Follow 某人，这些操作都是为了让你不至看到某些感兴趣的项目但不方便操作，导致日后失联。相关邮箱或主页虽不可在小程序内直接操作，但点击后都可复制邮箱或主页链接，也可满足大多数的需求。
7. 当然，在小程序中还有一些小小的彩蛋，请你自己去发现吧！

## 小程序码

<img width='200' src='https://api.renyuzhuo.cn/code.jpg'>

## 预览截图

<img width='240' src='https://api.renyuzhuo.cn/screenshot/p0.png'><img width='240' src='https://api.renyuzhuo.cn/screenshot/p1.png'><img width='240' src='https://api.renyuzhuo.cn/screenshot/p2.png'><img width='240' src='https://api.renyuzhuo.cn/screenshot/p3.png'><img width='240' src='https://api.renyuzhuo.cn/screenshot/p4.png'><img width='240' src='https://api.renyuzhuo.cn/screenshot/p5.png'>

<details>

<summary><b>实现相关（点击展开）</b></summary>

- GitHub 项目相关实时数据来自 [GitHub API V3](https://developer.github.com/v3/)
- Top 和 History 相关配置来自于本项目 Tag 为 [Top](https://github.com/renyuzhuo/GitHub-Top/issues?q=is%3Aissue+is%3Aopen+label%3ATop) 和 [Hot](https://github.com/renyuzhuo/GitHub-Top/issues?q=is%3Aissue+is%3Aopen+label%3AHot) 的 Issues（原计划用 GitHub Page，但是相应速度有问题，自己搭建服务器维护成本太高，因此最后采用在 Issue 中配置 Json 文件）
- Trending 数据来自 [github-trending-api](https://github.com/huchenme/github-trending-api)
- Markdown 解析采用 [towxml](https://github.com/sbfkcel/towxml) 2.x，暂不考虑升级为 3.x，可能是我使用的问题，3.x 一直有错误，已经提 Issues 给原项目。
- 项目构建采用京东开源项目 [Taro 2.0.2](https://taro.aotu.io/) 版本。
- 无自建云端服务器。

</details>

## 说明及感谢

本小程序是基于 [Gitter](https://github.com/huangjianke/Gitter) 项目的二次开发，是我对 [Gitter](https://github.com/huangjianke/Gitter) 的拙劣的模仿，特此感谢！

## License

Apache License 2.0

## 其他

捐赠请点击 [这里](https://renyuzhuo.cn/donate)
