# Leetcode题解助手

## 功能介绍

这个油猴脚本主要用于Leetcode题解查询和语言切换。  
支持九章算法、Github和博客园上的优秀题解的查询。     

~~旧版功能：五个按钮分别支持九章算法查询、python题解查询、java题解查询、谷歌题目搜索、语言切换。~~    

新版功能：提供九章算法、python题解、grandyang题解（主要是c++和java）、花花酱博主的快速查询，并且提供直接在谷歌上搜索题目、切换中英文的功能。（应要求去掉了水中的鱼、百度搜索功能，最后的[补充说明](#补充说明)中提到了恢复的方法）    

一键直达，方便快捷，节约刷题时找题解的时间。    

**此次重大更新：可折叠**，点击题解按钮即可实现收放功能。（点开题目自动折叠题解的方法见补充说明）  

1. 九章算法：九章算法基本可以满足了python、java、C++三种语言的题解需求。  
2. python：python题解，利用Github上的高赞项目lc_all_solutions，解答质量很不错，特地搬运过来。  
3. grandyang：java题解，利用https://www.cnblogs.com/grandyang/p/4606334.html 中的解析。  
4. 搜索花花酱：搜索花花酱up主的题解视频
5. 谷歌搜索：有的时候看了解析还是可能不太明白，可以用谷歌查询网络上博客中的更详细的解析。  
6. 切换语言：语言切换也是十分重要的一个功能。英语版的讨论区较为丰富，但官方题解不太全，中文版的题解较多。这两者可以综合起来学习。  
## 安装方法

1. GreasyMonkey安装：<https://greasyfork.org/zh-CN/scripts/386679-leetcode-answer-helper>  
2. 复制[`leetcode题解助手_新版.user.js`](<https://github.com/sherpahu/LeetcodeAnswerHelper/blob/master/leetcode%E9%A2%98%E8%A7%A3%E5%8A%A9%E6%89%8B_%E6%96%B0%E7%89%88.user.js>)中的所有代码->点击油猴脚本标识->添加新脚本->ctrl+s保存  

## To-Do

1. 提供用户自定义设置功能（如关闭某些题解，关闭百度等功能）。待我好好学习一下`AC-baidu`设置功能的构建方法，争取不鸽
2. 没有对应题解就不显示相关按钮，重新爬虫一遍吧。前600道题基本没问题，已经做了600多题的大佬暂且忍耐一下吧，哈哈

## 参考

### 题解来源：

九章算法：<https://www.jiuzhang.com/>    

python：<https://github.com/csujedihy/lc-all-solutions>    

grandyang：<https://www.cnblogs.com/grandyang/p/4606334.html>    

花花酱：<https://space.bilibili.com/9880352/video?tid=0&page=2&keyword=&order=pubdate>    

水中的鱼：<http://fisherlei.blogspot.com/>    

### 脚本参考：

<https://github.com/lecoler/md-list>

## 补充说明

水中的鱼、百度搜索恢复方法：油猴脚本标识->管理面板->leetcode题解助手->//get solution下将对应代码取消注释。

自动折叠方法：油猴脚本标识->管理面板->leetcode题解助手->把`function createDom()`中的`$listDom.slideDown('fast');`改为`$listDom.slideUp('fast');`

