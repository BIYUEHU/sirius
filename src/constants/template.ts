import { GUI_PATH, PLUGIN_DESCRIPTION } from './constants'

new JsonConfigFile(
  `${GUI_PATH}/index.json`,
  String.raw`{
  "$schema": "../../schema/gui.json",
  "title": "§l§d菜单",
  "content": "菜单可通过钟表点地或 /menu 或 /cd 指令打开",
  "buttons": [
    {
      "text": "新手向导",
      "action": "\`newer"
    },
    {
      "text": "助手系统",
      "action": "\`helper"
    },
    {
      "text": "传送系统",
      "action": "\`teleport"
    },
    {
      "text": "经济系统",
      "action": "/money gui"
    },
    {
      "text": "领地系统",
      "action": "\`land"
    },
    {
      "text": "管理系统",
      "action": "/manger",
      "onlyOp": true
    },
    {
      "text": "关于",
      "action": "\`about"
    },
    {
      "text": "退出",
      "action": ""
    }
  ]
}
`
)

new JsonConfigFile(
  `${GUI_PATH}/newer.json`,
  String.raw`{
  "$schema": "../../schema/gui.json",
  "type": "modal",
  "title": "新手向导",
  "advanced": true,
  "content": "欢迎，请仔细阅读群内文件\n常用指令：\n获取钟表/clock\n查看公告/notice\n开公告传送点/warp gui\n\n更多内容参考《服务器管理制度条例◆第二章》\n大部分功能均可在菜单内找到",
  "confirmAction": ""
}
`
)

new JsonConfigFile(
  `${GUI_PATH}/helper.json`,
  String.raw`{
  "$schema": "../../schema/gui.json",
  "title": "助手系统",
  "buttons": [
    {
      "text": "查看公告",
      "action": "/notice"
    },
    {
      "text": "自杀",
      "action": "/suicide"
    },
    {
      "text": "回到死亡点",
      "action": "/back"
    },
    {
      "text": "发送当前坐标",
      "action": "/here"
    },
    {
      "text": "私聊",
      "action": "/msgui"
    },
    {
      "text": "获得钟表",
      "action": "/clock"
    },
    {
      "text": "返回",
      "action": "\`index"
    }
  ]
}
`
)

new JsonConfigFile(
  `${GUI_PATH}/teleport.json`,
  String.raw`{
    "$schema": "../../schema/gui.json",
    "title": "传送系统",
    "buttons": [
      {
        "text": "跨服传送",
        "action": "\`transfer"
      },
      {
        "text": "随机传送",
        "action": "/tpr"
      },
      {
        "text": "发起传送请求",
        "action": "/tpa gui"
      },
      {
        "text": "个人传送点",
        "action": "/home ls"
      },
      {
        "text": "公共传送点",
        "action": "/warp ls"
      },
      {
        "text": "返回",
        "action": "\`index"
      }
    ]
  }
 `
)

// new JsonConfigFile(
//   `${GUI_PATH}/money.json`,
//   String.raw`{

new JsonConfigFile(
  `${GUI_PATH}/land.json`,
  String.raw`{
    "$schema": "../../schema/gui.json",
    "title": "领地系统",
    "content": "圈地流程：\n1.新建领地\n2.站在领地某个角落选点 a，在另一个角落选点 b\n3.购买或放弃",
    "buttons": [
      {
        "text": "新建领地",
        "action": "/land new"
      },
      {
        "text": "选点a",
        "action": "/land set a"
      },
      {
        "text": "选点b",
        "action": "/land set b"
      },
      {
        "text": "购买",
        "action": "/land buy"
      },
      {
        "text": "放弃",
        "action": "/land giveup"
      },
      {
        "text": "管理",
        "action": "/land gui"
      },
      {
        "text": "返回",
        "action": "\`index"
      }
    ]
  }`
)

new JsonConfigFile(
  `${GUI_PATH}/transfer.json`,
  String.raw`{
    "$schema": "../../schema/gui.json",
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
`
)

new JsonConfigFile(
  `${GUI_PATH}/about.json`,
  String.raw`{
    "$schema": "../../schema/gui.json",
    "title": "关于",
    "content": "${PLUGIN_DESCRIPTION}",
    "buttons": [
      {
        "text": "返回",
        "action": "\`index"
      }
    ]
  }
`
)
