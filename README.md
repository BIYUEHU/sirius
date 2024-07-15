<div align="center">
  <img src="sirius.png" alt="LL-Sirius" width="200">

# LL-Sirius · 🐺

[![wakatime](https://wakatime.com/badge/user/018dc603-712a-4205-a226-d4c9ccd0d02b/project/603af708-3a70-4749-b71b-a20b6f5b8bfd.svg)](https://wakatime.com/badge/user/018dc603-712a-4205-a226-d4c9ccd0d02b/project/603af708-3a70-4749-b71b-a20b6f5b8bfd) ![](https://camo.githubusercontent.com/947664ff2940a0485658c4fe6e3c0f748ff2842db47553f51c71598285f18398/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f626979756568752f7473756b696b6f3f636f6c6f723d626c7565)

⚡ 基于 LeviLamina 运行的下一代最全面的 Minecraft 基岩版 BDS 服务器基础&综合性功能插件。 ⚡

[🌿 使用手册](USAGE.md) | [📃 更新日志](CHANGELOG.md) | [💡 贡献指南](CONTRIBUTING.md) | [🖍️ 计划列表](TODO.md)

**_📦 [插件交流群：633721784](https://qm.qq.com/q/UnrEFdELm0)_**

</div>

`Sirius`（/ˈsɪriəs/）指代⌈天狼星⌋，其词源为希腊语中的⌈Σείριος⌋。天狼星是北半球夏季夜空中最亮的恒星，同时也是著名的双星系统之一。其忧郁般的深蓝色光芒着实令人震撼。

## 🎯 Background

LeviLamina 作为一统 BDS Loader 的大型项目，其生态可谓百花齐放，但也造就插件质量参差不齐，某个简简单单的功能却还要装多个插件，更不用提很多脚本插件（尤其是 JavaScript）的开发者并未有过工程化开发经历，致使其代码可靠性与可维护性不堪入目还不自知。同时，LeviLamina 不如曾经的 BedrockX 的预装插件就已提供了官方实现、安全可靠的 Tpa、Home、Warp、Menu、Gui、Money、Helper 等多个基础功能，而 Sirius 则正是为 LeviLamina 填补该空缺，此外有不少指令也模仿了 BedrockX 进行实现。

## 🔎 Install

1. 前往 [GitHub Releases](https://github.com/biyuehu/sirius/releases) 下载构建完毕的发行版本
2. 解压所有文件解压至 `BDS/plugins/Sirius` 目录下（确保构建好的 JS 文件位于 `BDS/plugins/sirius/Sirius.js`）
3. 启动 LeviLamina

期望目录结构：

```
BDS/plugins/sirius/
  ├── data
  │  ├── data.json
  │  ├── notice.txt
  ├── gui
  ├── locales
  ├── Sirius.js
  ├── manifest.json
  └── config.json
```

> `data` 文件夹将会在服务器启动时由 Sirius 自动生成，无需手动创建。

## 🧩 Features

### Main

- 🔧 Utils：工具系统
  - itemsUseOn：自定义物品点击触发指令
  - joinWelcome：玩家进入服务器欢迎信息
  - motdDynasty：服务器动态 Motd 信息循环
  - chatFormat：自定义玩家聊天信息格式
  - sidebar：自定义侧边栏
- 🪜 Helper：帮手系统
  - notice：服务器公告
  - suicide：自杀
  - back：返回上次死亡位置
  - tpa：传送请求
  - home：玩家个人传送点
  - warp：服务器公共传送点
  - clock：给钟
  - msgui：玩家私聊菜单
  - here：发送当前位置坐标
  - map：自定义导入地图（待实现）
- 🥏 Teleport：传送系统
  - tpa：传送请求
  - tpr：随机传送
  - home：玩家个人传送点
  - warp：服务器公共传送点
  - transfer：跨服传送
- 🧮 Gui：表单系统
  - menu：服务器菜单
  - json gui：高可用、强大的自定义表单接口
- ⛓️ Manger：管理系统
  - vanish：自我隐身
  - runas：以指定玩家身份运行指令
  - ban：玩家 / IP 封禁
  - cloudBlackCheck：玩家进服 [BlackBe](https://blackbe.work/) 云黑检测
  - skick：强制踢除玩家
  - crash：崩溃玩家客户端
  - stop：停止服务器
  - info：玩家信息、数据查询
  - safe：服务器维护状态切换
- 🧱 Land：领地系统
- 💴 Money：经济系统、
  - syncScoreboard：计分板与 LL 经济互相同步（待实现）
  - gui：转账、查询、记录可视化表单
  - shop：GUI 商店
  - hunter：赏金猎人

### Comment

1. 考虑到 LeviLamina 已有官方的 Money 实现不必重复造轮，因此 Sirius 的 Money 实则与其完全一致并进行了相关扩展。
2. 对于反作弊功能，一是由于 Sirius 初衷是涵盖各种基础&综合性功能，二是社区已有十分强大且完善的反作弊插件，故不再造轮
3. 对于箱子商店、行为记录、数据统计、背包检查、定时任务、定时消息、服务器卫星地图、地图自动备份、连锁挖矿等著名功能，如若需求量大，将会在未来实现而加入到 Sirius 的功能中。

## 🔨 Advantages

- 全面化：涵盖了大量基础性与综合性功能，不必再为某个小功能就去安装一个新插件，同时为近乎所有指令提供了 GUI 表单与纯命令两种操作方式
- 可扩展：Sirius 提供了一套强大而又完备的 JSON GUI 表单接口，可轻松实现各种复杂表单
- 坚固化：Sirius 的源码完全由 TypeScript 开发，强大的类型编程为类型安全保驾护航，同时也极大程度上提高开发效率
- 专业化：不同于其它近乎 90% 的游戏插件/ Addons，我们摒弃将几千行的代码堆在一个渺小的脚本文件（甚至是 JS 文件）成为屎山的行为，并为插件开发引入了包管理、CI/CD、自动化测试、自动化构建等多个工程化开发思想的具体实现
- 国际化：Sirius 支持 英语、日语、繁体中文、简体中文 四国语言

## 📭 Contributes

- Sirius 是一个开源项目，任何漏洞、想要的新功能建议均可向其提交 [Issues](https://github.com/biyuehu/sirius/issues)，开发者将不断完善和优化 Sirius，以满足用户需求
- 欢迎广大有 TypeScript 或 前端开发经验的开发者参与 Sirius 的开发，欢迎任何形式的贡献，包括但不限于代码、文档、Bug 反馈、功能建议等。

## 📢 Declaration

遵循 **General Public License v3.0** 开源协议。
