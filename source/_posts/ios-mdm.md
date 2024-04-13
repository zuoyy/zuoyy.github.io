title: ios-mdm介绍与实现
date: 2014-06-12 22:52:03
categories: 技术
---

---
>最近一直在研究mdm系统，首先从ios下手，自己也写了一个demo，目前把学习和实践过程中总结的东西记录下。

MDM介绍
---
MDM的全称是Mobile Device Management，顾名思义是移动设备管理，帮助企业将IT管理能力从传统的PC延伸到移动设备甚至移动应用APP。

<!--more-->

MDM能够做些什么？
---
* 配置

    账户配置（wifi、vpn、email等）
    
    密码策略（密码复杂度等配置）
    
    安全与隐私（是否允许发送诊断数据到Apple等）
    
    设备功能限制（是否允许摄像头，是否允许siri）
    
    应用限制（是否允许用iTunesstore，Safari等）
    
    云（是否允许云备份、照片流等）
    
    内容分级

* 信息查询

    基本信息（UDID、设备名、imei等）
    
    网络信息（iccid、蓝牙和wifi的mac、手机号等）
    
    合规性和安全性(安装的profile、是否有密码保护等）
    
    应用（已安装应用id、已安装应用名称等）
    
* 管理

    管理配置（安装和删除一个profile）
    
    管理Apps（安装和删除一个in-houseApp）
    
    擦除设备、清除密码、锁屏

如何实现MDM服务？
---
![mdm](http://i11.tietuku.com/b2b78b6218ecfa76.png)

根据iOS mdm 架构图，我们知道我们要做些工作:

1. 搭建一个MDM Server与设备之间通过HTTPS连接下发mdm指令到设备。
2. 配置MDM Push证书来向设备发送mdm 推送消息通知。

搭建一个MDM Server
---
1. 配置tomcat https支持（配置证书）
2. 处理checkin及server请求
3. 根据mdm协议实现所有mdm命令
4. 配置消息推送Java-apns[(https://github.com/notnoop/java-apns)](https://github.com/notnoop/java-apns)

我自己写了一个Server。[github链接](https://github.com/zuoyy/IOS-MDM-Server)

配置MDM Push证书
---
![mdm](http://i11.tietuku.com/3c8183ed7fa0ddae.png)

