# 使用手册

## 语言支持

默认支持以下四个不同国家的语言，欢迎你贡献更多语言文件：

- English：`en_US`
- 日本語：`ja_JP`
- 繁體中文：`zh_TW`
- 简体中文：`zh_CN`

## 插件配置

配置文件位于 `BDS/plugins/Sirius/config.toml`，按需修改。

```toml
[global]
decode = true
# 使用语言标识符，例如 zh_CN
lang = "zh_CN"

[utils]
# 是否开启工具系统
enabled = true
# 是否开启进服欢迎信息
joinWelcomeEnabled = true
joinWelcomeMsg = "Welcome to the server, %name%!"
# 是否开启动态 MOTD 循环
motdDynastyEnabled = true
# 动态 MOTD 循环内容
motdMsgs = [ "server motd!" ]
# 动态 MOTD 更新间隔（单位：秒）
motdInterval = 5
# 是否开启自定义聊天信息格式
chatFormatEnabled = true
chatFormat = "%y%-%m%-%d% %h%:%min%:%s% [%dim%] [%ping%ms] %name%: %msg%"
# 是否开启自定义侧边栏
sidebarEnabled = true
# 自定义侧边栏标题
sidebarTitle = "Server Info"
# 自定义侧边栏内容（从 0 开始依次递增）
sidebarList = [ "speed: %speed%", "Ping: %ping%ms", "Time: %m%-%d% %h%:%min%" ]
# 自定义物品点击触发指令
[utils.itemsUseOn]
# "物品 ID" = "指令（不加 / ）"
"minecraft:clock" = "menu"

[helper]
# 是否开启帮手系统
enabled = true
# 是否开启服务器公告指令
noticeCmdEnabled = true
# 是否开启自杀指令
suicideCmdEnabled = true
# 是否开启返回上次死亡位置指令
backCmdEnabled = true
# 是否开启给钟指令
clockCmdEnabled = true
# 是否开启玩家私聊菜单指令
msguiCmdEnabled = true
# 是否开启发送当前位置坐标指令
hereCmdEnabled = true
# 是否开启自定义导入地图指令
mapCmdEnabled = true

[teleport]
# 是否开启传送系统
enabled = true
# 是否开启传送请求指令
tpaCmdEnabled = true
# 传送请求过期时间（单位：秒）
tpaExpireTime = 20
# 是否开启随机传送指令
tprCmdEnabled = true
# 随机传送最大距离
tprMaxDistance = 10000
# 随机传送最小距离
tprMinDistance = 1000
# 随机传送安全高度
tprSafeHeight = 120
# 是否开启玩家个人传送点指令
homeCmdEnabled = true
# 玩家个人传送点最大数量
homeMaxCount = 15
# 是否开启服务器公告传送点指令
warpCmdEnabled = true
# 是否开启跨服传送指令
transferCmdEnabled = true

[gui]
# 是否开启 GUI 系统（传送系统、管理、经济系统、领地系统的前置系统）
enabled = true
# 是否开启服务器菜单指令
menuCmdEnabled = true
# 服务器菜单指令别名
menuCmdAlias = "cd"

[manger]
# 是否开启管理系统
enabled = true
# 是否开启管理指令
mangerCmdEnabled = true
# 是否开启隐身指令
vanishCmdEnabled = true
# 是否开启以指定玩家身份运行指令
runasCmdEnabled = true
# 是否开启封禁指令
banCmdEnabled = true
# 是否开启玩家进服云黑检测
cloudBlackCheckEnabled = true
# 是否开启强制踢除玩家指令
skickCmdEnabled = true
# 是否开启崩溃玩家客户端指令
crashCmdEnabled = true
# 是否开启停止服务器指令
stopCmdEnabled = true
# 是否开启玩家信息、数据查询指令
infoCmdEnabled = true
# 是否开启服务器维护状态切换指令
safeCmdEnabled = true

[land]
# 是否开启领地系统
enabled = true
# 领地最多方块数量
maxBlockCount = 900000
# 每个方块购买价格
buyPrice = 0.5
# 每个方块销毁价格（删除领地时）
destPrice = 0.4

[money]
# 是否开启经济系统
enabled = true
# 经济系统的计分板名称
scoreboardName = "money"
# 同步 LLMoney
syncLLMoney = true
# 是否开启商店指令
shopCmdEnabled = true
# 是否开启赏金猎人
hunterEnabled = true

# 赏金猎人设置
[[hunter]]
# 实体 ID
entityId = "minecraft:villager_v2"
# 价格（字面量形式）
price = 100

[[hunter]]
entityId = "minecraft:zombie"
# 价格（范围形式，将随机返回 [min, max] 之间的一个整数值）
price = [ 100, 200 ]

# 商店设置
[shop]
# [[shop."商店分类名字（支持中文）"]]
[[shop.default]]
# 物品显示图标，资源包路径（可选）
icon = "textures/items/diamond.png"
# 物品 ID
itemId = "minecraft:diamond"
# 物品名称（可自定义）
text = "Diamond"
# 物品标价
price = 100
# 物品类型，"buy" 购买 或 "sell" 售出
type = "buy"

[[shop.default]]
icon = "textures/items/gold_ingot.png"
itemId = "minecraft:gold_ingot"
text = "Gold Ingot"
price = 500
type = "sell"
```

## PlaceholderAPI 支持列表

> 基于 `GMLIB LegacyRemoteCallApi` 库

支持的占位符值：

- `%name%`：玩家（真实）名字
- `%locale%`：玩家使用语言标识符
- `%dim%`：玩家当前维度
- `%pos%`：玩家当前坐标
- `%xuid%`：玩家 XUID
- `%uuid%`：玩家 UUID
- `%speed%`：玩家当前速度
- `%health%`：玩家当前生命值
- `%max_health%`：玩家最大生命值
- `%game_mode%`：玩家游戏模式
- `%perm_level%`：玩家权限等级
- `%ping%`：玩家网络延迟
- `%loss%`：玩家网络丢包率
- `%ip%`：玩家 IP
- `%y%`：当前年份
- `%m%`：当前月份
- `%d%`：当前日期
- `%h%`：当前小时
- `%min%`：当前分钟
- `%s%`：当前秒

支持使用占位符的地方：

- Utils
  - joinWelcome：玩家进入服务器欢迎信息
  - chatFormat：自定义玩家聊天信息格式
  - sidebar：自定义玩家侧边栏
- Land
  - welcomeMsg：领地欢迎消息
  - leaveMsg：领地离开消息

在 `Utils -> chatFormat` 中可以额外使用 `%msg%` 占位符用于表示聊天内容。

## 指令列表

### Sirius

- `/sirius reload`：重新加载插件数据
- `/sirius version`：查看 Sirius 信息

仅管理员可用。

### Gui

- `/gui reload`：重新加载 GUI 数据
- `/gui open <file>`：打开指定 GUI 文件

仅管理员可用。`file` 以 `BDS/plugins/Sirius/gui/` 为基准目录，且无需添加文件后缀，例如 `/gui open land`。

---

- `/menu`: 打开服务器菜单
- `/<alias>`：打开服务器菜单

仅管理员可用。等同于 `/gui open index`，自动打开 `gui/` 目录下的 `index.json` 文件，具体内容请参考 [自定义菜单](#自定义菜单（JSON GUI）)。`<alias>` 为服务器菜单指令别名，可在配置文件中设置，默认为 `cd`。

### Money

- `/shop`：打开商店菜单

### Helper

- `/back`：回到上次死亡点
- `/suicide`：自杀
- `/msgui`：打开私聊菜单
- `/clock`：给钟
- `/here`：向所有玩家发送自己当前坐标
- `/notice`：查看服务器公告

---

- `/noticeset`：设置服务器公告

仅管理员可用。

### Manger

- `/vanish`：设置隐身
- `/runas <name>`：以指定玩家身份运行指令

仅管理员可用。

---

- `/ban ls`：查看封禁列表
- `/ban ban <name> [time] [reason]`：封禁指定玩家
- `/ban banip <ip> [time] [reason]`：封禁指定玩家的 IP
- `/ban unban <name>`：解封指定玩家或 IP

仅管理员可用。`time` 为封禁时长，单位为分钟，默认为 0 表示永久封禁。
`reason` 为封禁原因，可选。

---

- `/skick <name>`：强制踢出所有以 `name` 开头的玩家
- `/stops`：关闭服务器
- `/info <name>`：查询指定玩家信息
- `/crashes <name>`：崩掉指定玩家的客户端

仅管理员可用。

---

- `/safe`：打开服务器维护状态切换菜单
- `/safe <on/off>`：开启/关闭服务器维护状态

仅管理员可用。

---

- `/manger`：打开服务器管理菜单
- `/manger <skick/crash/info/ban/banls/unban.runas>`：打开指定子菜单

仅管理员可用。

### Teleport

- `/transfers <player> <ip> [port]`：将指定玩家传送到其他服务器

仅管理员可用。`port` 为可选参数，默认为 19132。

---

- `/tpr`：随机传送

将玩家随机传送到主世界的一个位置。

---

- `/tpa to <player>`：请求传送到指定玩家的位置
- `/tpa here <player>`：请求指定玩家传送到自己的位置
- `/tpa cancel`：取消当前的传送请求
- `/tpa ac`：接受传送请求
- `/tpa de`：拒绝传送请求
- `/tpa toggle`：切换是否接收传送请求
- `/tpa gui`：打开传送请求 GUI 菜单

---

- `/home ls`：列出所有个人传送点
- `/home add <name>`：添加一个新的个人传送点
- `/home del <name>`：删除指定的个人传送点
- `/home go <name>`：传送到指定的个人传送点
- `/home gui_add`：打开添加个人传送点的 GUI 菜单
- `/home gui_del`：打开删除个人传送点的 GUI 菜单

每个玩家可以设置的个人传送点数量有上限。

---

- `/warp ls`：列出所有公共传送点
- `/warp add <name>`：添加一个新的公共传送点
- `/warp del <name>`：删除指定的公共传送点
- `/warp go <name>`：传送到指定的公共传送点
- `/warp gui_add`：打开添加公共传送点的 GUI 菜单
- `/warp gui_del`：打开删除公共传送点的 GUI 菜单

添加和删除公共传送点仅管理员可用。所有玩家都可以使用公共传送点。

### Land

- `/land gui`：打开领地管理菜单
- `/land new`：创建新的领地
- `/land set a`：设置领地起始坐标点
- `/land set b`：设置领地结束坐标点
- `/land buy`：购买当前设定的领地
- `/land giveup`：放弃当前正在创建的领地
- `/land tp`：传送到指定名称的领地

## 自定义菜单（JSON GUI）

所有的用户自定义菜单文件均位于 `BDS/plugins/Sirius/gui/` 目录下，文件名格式为 `*.json`，支持子文件夹，其中每个文件夹下的 `index.json` 文件将作为菜单的入口。以下是一个自定义菜单文件的基础骨架：

```json
{
  "$schema": "https://raw.githubusercontent.com/biyuehu/sirius/master/schema/gui.json",
  "type": "here is type of the menu",
  "title": "Here is title of the menu"
  /* other properties... */
}
```

- `$schema`：JSON 校验文件，非必须。如若你在 VSCode 等编辑器中编写自定义菜单，添加此属性可以获得更好的代码提示和校验
- `type`：菜单类型，支持三种值：`simple`、`modal`、`custom`，选填，默认为 `simple`
- `title`：菜单标题，必填

> 上述 `$schema` 中的文件地址为直接引用 GitHub 资源，考虑到部分国内用户面临长城防火墙等问题，Sirius 在此提供了一个代理地址供使用：
> `https://hotaru.icu/api/agent/?url=https://raw.githubusercontent.com/biyuehu/sirius/master/schema/gui.json`

### Simple 菜单

Simple 菜单允许定义菜单描述以及若干个按钮：

```json
{
  "title": "§l§d菜单",
  "content": "菜单可通过钟表点地或 /menu 或 /cd 指令打开",
  "buttons": [
    {
      "text": "助手系统",
      "action": "`helper"
    },
    {
      "text": "管理系统",
      "action": "/manger",
      "onlyOp": true
    },
    {
      "text": "退出",
      "action": ""
    }
  ]
}
```

- `content`：菜单描述，选填
- `buttons`：按钮列表，必填，数组类型，每个元素代表一个按钮
  - `text`：按钮文字，必填
  - `action`：按钮动作，必填，关于 `action` 的详细说明请参考下文
  - `onlyOp`：仅管理员可用，选填，布尔类型，默认为 `false`

### Modal 菜单

Modal 菜单允许定义一个询问框，会有确认与取消两个按钮：

```json
{
  "type": "modal",
  "title": "新手向导",
  "advanced": true,
  "content": "欢迎，请仔细阅读群内文件\n常用指令：\n获取钟表/clock\n查看公告/notice\n开公告传送点/warp gui\n\n更多内容参考《服务器管理制度条例◆第二章》\n大部分功能均可在菜单内找到",
  "confirmText": "我已阅读完毕",
  "confirmAction": "/me 已阅读完毕",
  "cancelText": "我再看看",
  "cancelAction": ""
}
```

- `advanced`：是否启用高级模式，选填，布尔类型，默认为 `false`。默认情况下使用原版自带的 Modal 表单，开启后将使用基于 Simple 菜单封装的 Modal 菜单
- `confirmText`：确认按钮文字，选填，默认为 `确认`
- `confirmAction`：确认按钮动作，必填，关于 `action` 的详细说明请参考下文
- `cancelText`：取消按钮文字，选填，默认为 `取消`
- `cancelAction`：取消按钮动作，选填，关于 `action` 的详细说明请参考下文

### Custom 菜单

Custom 菜单允许定义各种复制元素的提交表单：

```json
{
  "type": "custom",
  "onlyOp": true,
  "title": "跨服传送",
  "elements": [
    {
      "type": "dropdown",
      "items": "@players",
      "title": "目标玩家"
    },
    {
      "type": "input",
      "title": "目标服务器 IP 地址"
    },
    {
      "type": "input",
      "title": "目标服务器端口",
      "default": "19132",
      "placeholder": "选填，默认 19132"
    }
  ],
  "action": "/transfers \"{0}\" {1} {2}"
}
```

- `elements`：表单元素列表，必填，数组类型，每个元素代表一个表单元素
- `action`：表单提交动作，必填，关于 `action` 的详细说明请参考下文

对于 `elements` 支持以下元素类型：

```typescript
type MagicExpr = string;

type elements = Array<
  | { type: "label"; text: string | MagicExpr }
  | {
      type: "input";
      title: string;
      placeholder?: string | MagicExpr;
      default?: string | MagicExpr;
    }
  | { type: "switch"; title: string; default?: boolean | MagicExpr }
  | {
      type: "dropdown";
      title: string;
      items: Array<string> | MagicExpr;
      default?: number | MagicExpr;
    }
  | {
      type: "slider";
      title: string;
      min: number | MagicExpr;
      max: number | MagicExpr;
      step?: number | MagicExpr;
      default?: number | MagicExpr;
    }
  | {
      type: "stepSlider";
      title: string;
      items: Array<string> | MagicExpr;
      default?: number | MagicExpr;
    }
>;
```

#### label 标签

1. `text`：标签文字，必填

#### input 输入框

- `title`：输入框标题，必填
- `placeholder`：输入框提示文字，选填
- `default`：默认值，选填

#### switch 开关

- `title`：开关标题，必填
- `default`：默认值，选填，布尔类型

#### dropdown 下拉框

- `title`：下拉框标题，必填
- `items`：选项列表，必填，数组类型，每个元素代表一个选项
- `default`：默认值，选填，数字类型，从 0 开始

#### slider 滑块

- `title`：滑块标题，必填
- `min`：最小值，必填，数字类型
- `max`：最大值，必填，数字类型
- `step`：步长，选填，数字类型，默认为 1
- `default`：默认值，选填，数字类型，从 `min` 开始

#### stepSlider 步进滑块

- `title`：步进滑块标题，必填
- `items`：选项列表，必填，数组类型，每个元素代表一个选项
- `default`：默认值，选填，数字类型，从 0 开始

### action 动作

`action` 在 Sirius 内部中将其命名为 魔法表达式 `MagicExpr`，本质是一个具有特定作用的字符串，魔法表达式可谓整个 JSON GUI 的精华所在，尤其是通过其与 Custom 菜单的结合，可以轻松通过编写 JSON 实现各种复杂的交互功能和文字内容动态渲染，这是其它所有插件所不及的。

以下是支持解析魔法表达式的属性：

- Simple
  - `buttons`
    - `action`：按钮动作
- Modal
  - `confirmAction`：确认按钮动作
  - `cancelAction`：取消按钮动作
- Custom
  - `elements`
    - label
      - `text`：标签文字
    - input
      - `placeholder`：输入框提示文字
      - `default`：默认值
    - switch
      - `default`：默认值
    - dropdown
      - `items`：选项列表
      - `default`：默认值
    - slider
      - `min`：最小值
      - `max`：最大值
      - `step`：步长
      - `default`：默认值
    - stepSlider
      - `items`：选项列表
      - `default`：默认值
  - `action`：表单提交动作

魔法表达式主要通过 `前缀操作符`（即表达式的第一个字符） 进行识别操作类型，支持以下前缀操作符：

- `/`：以触发动作的玩家身份执行一条指令，如：`/say 你好`，返回指令执行是否成功
- `~`：以控制台身份执行一条命令，如：`~kill @a`，返回命令执行是否成功
- `#`：向触发动作的玩家发送一条聊天信息，如：`#你好`，返回消息发送是否成功
- `@`：语法糖
  - `@players`，返回一个含有当前所有在线玩家的名字的字符串数组，主要用于 Custom 菜单中的 dropdown、stepSlider 元素的 `items` 属性
- `$`：执行 JavaScript 代码，该功能具有一定风险，请慎用，如：`$mc.getOnlinePlayers().map((p) => p.realName)`，等价于 `@players`
- _\`_：打开指定 GUI 文件，不带文件后缀，以 `BDS/plugins/Sirius/gui/` 目录为基准，如：_\`helper_，等价于 `~gui open helper`，返回打开 GUI 是否成功

若前缀不为以上任何一个，则将作为普通字符串直接返回

## 数据迁移

Sirius 是 LeviLamina 生态的新生力量，诚然，从旧的生态迁移到新的生态是一件令人苦恼而又厌烦的事，因为大家都习惯安于现状。在此，Sirius 以为你提供了一些常见的其它插件的数据迁移方法。

以下是一个 Sirius 数据文件的基础骨架：

```json
{
  "xuids": {},
  "homes": {},
  "warps": {},
  "lands": {},
  "noticed": {
    "hash": 0
  },
  "denylist": {},
  "bans": {},
  "safe": {
    "status": false
  }
}
```

### 转换 BedrockX 的 Home、Warp 数据

Sirius 制作初衷即为提供一个可直接继承于 BedrockX 预装插件数据的插件。

- 使用 `[LLTpaReader](https://github.com/ShrBox/LLTpaReader)` 插件处理你的 BedrockX 数据，具体步骤请参考该项目详情页
- 一切就绪后文件将会输出在 `plugins/LLTpaReader/output.json`，其格式大致为如下所示：

```json
{
  "homes": {
    /* ... */
  },
  "warps": {
    /* ... */
  }
}
```

- 将其直接合并到上述基础骨架中。

### 转换 ILand 插件数据

- 在 ILand 插件的数据文件夹中你将找到 `relationship.json` 和 `data.json`，将其复制到任意空文件夹中即可
- 使用 Sirius 编写的一个 Node.js 脚本 [`scripts/i-convert.ts`](https://github.com/BIYUEHU/sirius/blob/master/scripts/i-convert.ts)，将其直接下载到你的电脑上，并放置于上一步骤中的同一个文件夹中，现在目录结构应是如下所示：

```text
./
 ├── i-convert.ts
 ├── relationship.json
 └── data.json
```

- 安装 Node.js 环境（建议版本 >= 17.0.0）
- 在该文件夹中运行 `npx tsx i-convert` 指令，执行完毕后将在该文件夹中生成 `output.json` 文件，其格式大致为如下所示：

```json
{
  "lands": {
    /* ... */
  }
}
```

- 同理，将其直接合并到上述基础骨架中。

### 载入转换数据

- 将合并完毕的基础骨架转换成 TOML 格式，推荐使用 [TOML INFO](https://calc.free-for-dev.com/toml/zh/json-to-toml) 工具进行在线转换
- 将转换后的 TOML 数据放置于 `BDS/plugins/Sirius/data/data.toml`
- 重启服务器或在游戏内输入 `/sirius reload`
