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

## 数据迁移
