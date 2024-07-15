import { PLUGIN_DESCRIPTION } from '../utils/t'
import { GUI_PATH, LOCALE_PATH } from './constants'

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

const autoCreate = (path: string, data: string) => {
  if (File.exists(path)) return
  return File.writeTo(path, data)
}

autoCreate(
  `${LOCALE_PATH}/en_US.toml`,
  String.raw`plugin.description = "The next generation's most comprehensive server foundation & integrated functionality plugin"

  # System
  info.mode_0 = "Survival Mode"
  info.mode_1 = "Creative Mode"
  info.mode_2 = "Adventure Mode"
  info.mode_3 = "Spectator Mode"
  info.perm_0 = "Member"
  info.perm_1 = "Admin"
  info.perm_2 = "Console"
  info.dim_0 = "Overworld"
  info.dim_1 = "Nether"
  info.dim_2 = "The End"
  info.dim_3 = "Custom Dimension"
  info.miss_gmlib = "GMLIB LegacyRemoteCallApi is not currently installed, PlacheholderAPI will be unavailable"
  update.msg.error = "Unable to get update information, please check your network connection"
  update.msg.new = "New version {0} found, current version {1}, please visit {2} to get the latest version"
  cmd.sirius.msg.version = "§l§9Sirius§r - §2{0}\n§rCurrent version: §l§a{1}\n§rProject author: §l§b{2}\n§rSource address: §l§3{3}\n§rLicense: §l§c{4}\n§r"
  cmd.sirius.description = "Sirius plugin management"
  cmd.sirius.msg.reload = "Plugin data reloaded successfully"
  
  # Gui
  gui.confirm = "§aConfirm"
  gui.cancel = "§cCancel"
  gui.normal_confirm = "Confirm"
  gui.normal_cancel = "Cancel"
  gui.not_op = "§cYou don't have permission to use this GUI§r"
  cmd.gui.description = "Open specified GUI or reload GUI data"
  cmd.gui.msg.reload = "GUI data has been reloaded"
  cmd.gui.msg.not_found = "§cSpecified GUI data file not found"
  cmd.menu.description = "Open server menu"
  
  # Helper
  cmd.nbt.description = "NBT retrieval"
  info.no_notice = "No announcement set for the current server"
  gui.notice.title = "Announcement"
  cmd.back.description = "Return to last death point"
  cmd.back.msg.success = "Teleported to last death point"
  cmd.back.msg.error = "Unable to find last death point"
  info.died = "You died at {0}, use /back to return to the death location"
  cmd.suicide.description = "Suicide"
  cmd.msgui.description = "Open private message menu"
  gui.msgui.title = "Private Message"
  gui.msgui.dropdown = "Target player"
  gui.msgui.input = "Message content"
  cmd.clock.description = "Give clock"
  cmd.notice.description = "View server announcement"
  cmd.noticeset.description = "Set server announcement"
  cmd.noticeset.msg = "Announcement set successfully"
  cmd.here.description = "Send your current coordinates to all players"
  info.here = "{0} I'm here: §a{1}§c!"
  
  # Money
  cmd.money.description = "Economy system"
  gui.money.pay.title = "Transfer"
  gui.money.pay.dropdown = "Target player"
  gui.money.pay.input = "Transfer amount"
  gui.money.pay.error.target_not_found = "Target player is not online"
  gui.money.pay.error.empty = "Please enter an amount"
  gui.money.pay.error.not_number = "Amount must be a number"
  gui.money.pay.error.not_positive = "Amount must be positive"
  gui.money.pay.error.not_enough_money = "You don't have enough coins"
  gui.money.pay.success = "Successfully transferred {1} coins to {0}"
  gui.money.pay.target_received = "You received {1} coins from {0}"
  info.moeny_not_found = "LLMoney is not currently installed"
  info.hunter = "Killed {0}, gained {1} coins"
  cmd.shop.description = "Open shop menu"
  gui.shop.title = "Shop"
  gui.shop.item_list.title = "§6Shop§r: {0}"
  gui.shop.item_list.item = "{0}: {1} x {2} - §e{3} coins§r"
  gui.shop.item_list.buy = "§bBuy§r"
  gui.shop.item_list.sell = "§cCancel§r"
  cmd.shop.msg.item_not_found = "Invalid item identifier {0}"
  cmd.shop.msg.not_enough_money = "§cNot enough coins {0}!"
  cmd.shop.msg.buy = "Successfully bought {0} x {1}, spent {2} coins"
  cmd.shop.msg.not_enough_item = "§cYou don't have enough {0}!"
  cmd.shop.msg.sell = "Successfully sold {0} x {1}, gained {2} coins"
  
  # Manager
  cmd.safe.description = "Toggle server maintenance status"
  cmd.safe.msg = "Setting successful"
  gui.safe.title = "Toggle Server Maintenance Status"
  gui.safe.label = "When server maintenance is enabled, non-admins will not be able to enter the server"
  gui.safe.switch = "Maintenance Status"
  info.safe_mode = "Server is under maintenance, temporarily unable to enter. Please try again later"
  gui.manger.btn.safe = "Toggle Server Maintenance Status"
  gui.manger.btn.vanish = "Set Invisibility"
  gui.manger.btn.skick = "Force Kick Player"
  gui.manger.btn.crash = "Crash Player Client"
  gui.manger.btn.info = "Get Player Information"
  gui.manger.btn.ban = "Ban Player"
  gui.manger.btn.unban = "Unban Player"
  gui.manger.btn.banls = "View Ban List"
  gui.manger.btn.runas = "Run Command as Specified Player"
  gui.manger.btn.stop = "Stop Server"
  cmd.manger.description = "Server management menu"
  gui.skick.title = "Force Kick Player"
  gui.crash.title = "Crash Player Client"
  gui.info.title = "Get Player Information"
  gui.ban.title = "Ban Player"
  gui.ban.player = "Target player"
  gui.ban.banip = "Ban IP"
  gui.ban.reason = "Optional: Ban reason"
  gui.ban.time = "Optional: Ban duration (seconds), default is permanent"
  gui.unban.title = "Unban Player"
  gui.runas.title = "Run Command as Specified Player"
  gui.runas.player = "Target player"
  gui.runas.command = "Command"
  gui.manger.title = "Server Management"
  cmd.vanish.description = "Set invisibility"
  cmd.vanish.msg.off = "Invisibility turned off"
  cmd.vanish.msg.on = "Invisibility turned on"
  cmd.runas.description = "Run command as specified player"
  cmd.runas.msg.not_found = "Target player is not online"
  cmd.runas.msg.success = "Command sent to {0}"
  info.ban.kick = "Player {0} is on the local blacklist and has been kicked"
  info.ban.reason = "Reason: {0}"
  info.ban.forever = "You have been permanently banned from the server{0}"
  info.ban.time = "You have been banned from the server until {0}{1}"
  info.ban_ip.forever = "Current IP {0} has been permanently banned from the server{1}"
  info.ban_ip.time = "Current IP {0} has been banned from the server until {1}{2}"
  cmd.ban.description = "Ban player"
  cmd.ban.msg.empty = "Current ban list is empty"
  cmd.ban.msg.not_found = "Target player is not online"
  cmd.ban.msg.not_found_2 = "Target player is not in the ban list"
  cmd.ban.msg.unban = "Player {0} has been unbanned"
  cmd.ban.msg.list = "Current ban list: {0}"
  cmd.ban.msg.item_ip.time = "\nIP: {0} Time: {1}{2}"
  cmd.ban.msg.item_ip.forever = "\nIP: {0} Time: Permanent{1}"
  cmd.ban.msg.item.time = "\nPlayer: {0} Time: {1}{2}"
  cmd.ban.msg.item.forever = "\nPlayer: {0} Time: Permanent{1}"
  cmd.ban.msg.ban.ban_ip.time = "IP {0} has been banned until{1}{2}"
  cmd.ban.msg.ban.ban_ip.forever = "IP {0} has been permanently banned{1}{2}"
  cmd.ban.msg.ban.ban.time = "Player {0} has been banned until{1}{2}"
  cmd.ban.msg.ban.ban.forever = "Player {0} has been permanently banned{1}{2}"
  cmd.cloudBlackCheck.msg.error = "Cloud blacklist API request failed, please check your network connection"
  cmd.cloudBlackCheck.msg.kick = "You have been listed in the BlackBe cloud blacklist, please contact an administrator if you have any questions"
  cmd.cloudBlackCheck.msg.kicked = "Player {0} has been listed in the BlackBe cloud blacklist"
  cmd.skick.description = "Force kick related players"
  cmd.skick.msg = "Player {0} has been kicked"
  cmd.crash.description = "Crash the specified player's client"
  cmd.crash.msg.success = "Client crash successful"
  cmd.crash.msg.error = "Client crash failed"
  cmd.crash.msg.not_found = "Target player is not online"
  cmd.info.description = "Get specified player information"
  cmd.info.msg.success = "Player name: {0}\nXUID: {1}\nUUID: {2}\nIP: {3}\nSystem: {4}\nInput mode: {5}\nLatency: {6}ms\nPacket loss: {7}%\nConnection address: {8}\nClient ID: {9}"
  cmd.info.msg.not_found = "Target player is not online"
  cmd.stop.description = "Stop server"
  
  # Teleport
  cmd.transfer.description = "Cross-server teleportation"
  cmd.transfer.msg.transfer = "Teleporting target to server {0} : {1}"
  cmd.tpr.description = "Random teleport"
  cmd.tpr.msg.error.dimension = "You must be in the overworld to use this command"
  cmd.tpr.msg.success = "Randomly teleported to {0}"
  cmd.tpa.description = "Teleport request"
  gui.tpa.title = "Teleport Request"
  gui.tpa.btn.accept = "Accept"
  gui.tpa.btn.reject = "Reject"
  gui.tpa.dropdown.mode = "Teleport mode"
  gui.tpa.dropdown.target = "Target player"
  gui.tpa.settings.title = "Teleport Settings"
  gui.tpa.settings.block = "Block teleport requests"
  cmd.tpa.msg.accepted = "Request accepted"
  cmd.tpa.msg.rejected = "Request rejected"
  cmd.tpa.msg.error.no_request = "There is no ongoing teleport request"
  cmd.tpa.msg.canceled = "Teleport request canceled"
  cmd.tpa.msg.error.existing_request = "There is already an ongoing teleport request"
  cmd.tpa.msg.error.player_offline = "Target player is not online"
  cmd.tpa.msg.error.blocked = "Target player has blocked teleport requests"
  cmd.tpa.msg.expired = "Teleport request has expired"
  cmd.tpa.msg.request.to.req = "Player {0} requests to teleport to your current location"
  cmd.tpa.msg.request.to.notify = "Player {0} requests to teleport to your current location, type /tpa ac to accept the request"
  cmd.tpa.msg.sent.to = "Teleport request to {0}'s location has been sent"
  cmd.tpa.msg.request.here.req = "Player {0} requests you to teleport to their current location"
  cmd.tpa.msg.request.here.notify = "Player {0} requests you to teleport to their current location, type /tpa ac to accept the request"
  cmd.tpa.msg.sent.here = "Teleport request for {0} to come here has been sent"
  cmd.tpa.msg.accept.req = "Accepted {0}'s teleport request"
  cmd.tpa.msg.accept.notify = "Player {0} accepted your teleport request"
  cmd.tpa.msg.reject.req = "Rejected {0}'s teleport request"
  cmd.tpa.msg.reject.notify = "Player {0} rejected your teleport request"
  cmd.tpa.msg.unblocked = "Teleport requests unblocked"
  cmd.tpa.msg.blocked = "Teleport requests blocked"
  cmd.home.description = "Personal teleport points"
  gui.home.title = "Personal Teleport Points"
  gui.home.delete.title = "Delete Personal Teleport Point"
  gui.home.delete.content = "Select the teleport point to delete"
  gui.home.add.title = "Add Personal Teleport Point"
  gui.home.add.name = "Name"
  cmd.home.msg.error.no_homes = "No teleport points set currently"
  cmd.home.msg.error.not_exist = "Personal teleport point {0} does not exist"
  cmd.home.msg.error.already_exist = "Personal teleport point {0} already exists"
  cmd.home.msg.error.limit = "Personal teleport point limit reached"
  cmd.home.msg.added = "Personal teleport point {0} added"
  cmd.home.msg.deleted = "Personal teleport point {0} deleted"
  cmd.warp.description = "Public teleport points"
  gui.warp.title = "Public Teleport Points"
  gui.warp.delete.title = "Delete Public Teleport Point"
  gui.warp.delete.content = "Select the teleport point to delete"
  gui.warp.add.title = "Add Public Teleport Point"
  gui.warp.add.name = "Name"
  cmd.warp.msg.error.no_warps = "No teleport points set currently"
  cmd.warp.msg.error.not_exist = "Public teleport point {0} does not exist"
  cmd.warp.msg.error.no_permission = "You don't have permission to execute this command"
  cmd.warp.msg.error.already_exist = "Public teleport point {0} already exists"
  cmd.warp.msg.added = "Public teleport point {0} added"
  cmd.warp.msg.deleted = "Public teleport point {0} deleted"
  
  # Land
  land.current_location = "Currently in {0}'s land"
  land.enter = "You have entered land {0}"
  land.error.not_found = "No land matching the target"
  land.teleport.success = "Successfully teleported to land {0}"
  land.error.creation_in_progress = "Land creation is currently in progress, if you need to recreate, please send /land giveup first"
  land.error.name_required = "Please enter a land name"
  land.error.name_exists = "A land with the same name already exists"
  land.create.start = "Starting land creation, please send /land set a to set the starting coordinate point of the land"
  land.error.no_creation_in_progress = "There is no ongoing land creation"
  land.error.incomplete_selection = "The current land creation selection is not complete"
  land.set.a = "Land starting coordinate point set to {0}"
  land.set.b = "Land ending coordinate point set to {0}"
  land.create.giveup = "Land creation abandoned"
  land.error.intersection = "Land creation failed, the selected land intersects with existing land, please recreate"
  land.error.too_large = "Land creation failed, land size exceeds {0} blocks"
  land.error.insufficient_funds = "Land creation failed, not enough coins {0}"
  land.create.success = "Land {0} created successfully, cost {1} coins"
  land.error.no_lands = "There are currently no lands"
  land.error.player_offline = "Target player is not online"
  land.error.already_whitelisted = "This player is already on the whitelist"
  land.whitelist.added = "Player has been added to the whitelist"
  land.welcome.set = "Welcome message has been set"
  land.leave.set = "Leave message has been set"
  land.rename.success = "Land has been renamed to {0}"
  land.error.self_transfer = "Cannot transfer to yourself"
  land.transfer.new_name = "{0} From: {1}"
  land.transfer.received = "Player {0} has transferred land {1} to you"
  land.transfer.success = "Land {0} has been transferred to player {1}"
  land.delete.success = "Land has been deleted, {0} coins refunded"
  gui.land.create.title = "Create Land"
  gui.land.create.name = "Land Name"
  gui.land.manage.title = "Land Management"
  gui.land.manage.land_title = "Land: {0} Management"
  gui.land.manage.land_info = "Start coordinates: {0}\nEnd coordinates: {1}"
  gui.land.manage.add_whitelist = "Add to Whitelist"
  gui.land.manage.add_whitelist_title = "Land: {0} Add to Whitelist"
  gui.land.manage.select_player = "Select Player"
  gui.land.manage.teleport = "Teleport to Land"
  gui.land.manage.set_welcome = "Set Welcome Message"
  gui.land.manage.set_welcome_title = "Land: {0} Set Welcome Message"
  gui.land.manage.welcome_message = "Welcome Message"
  gui.land.manage.set_leave = "Set Leave Message"
  gui.land.manage.set_leave_title = "Land: {0} Set Leave Message"
  gui.land.manage.leave_message = "Leave Message"
  gui.land.manage.rename = "Rename Land"
  gui.land.manage.rename_title = "Land: {0} Rename"
  gui.land.manage.new_name = "New Name"
  gui.land.manage.transfer = "Transfer Land"
  gui.land.manage.transfer_title = "Land: {0} Transfer"
  gui.land.manage.transfer_to = "Transfer to"
  gui.land.manage.delete = "Delete Land"
  gui.land.manage.delete_title = "Land: {0} Delete"
  gui.land.manage.delete_confirm = "Deleting will refund {0} coins. Are you sure you want to delete this land?"
`
)

autoCreate(
  `${LOCALE_PATH}/ja_JP.toml`,
  String.raw`plugin.description = "次世代の最も包括的なサーバー基盤＆総合機能プラグイン"

  # System
  info.mode_0 = "サバイバルモード"
  info.mode_1 = "クリエイティブモード"
  info.mode_2 = "アドベンチャーモード"
  info.mode_3 = "スペクテイターモード"
  info.perm_0 = "メンバー"
  info.perm_1 = "管理者"
  info.perm_2 = "コンソール"
  info.dim_0 = "オーバーワールド"
  info.dim_1 = "ネザー"
  info.dim_2 = "エンド"
  info.dim_3 = "カスタムディメンション"
  info.miss_gmlib = "現在 GMLIB LegacyRemoteCallApi がインストールされていないため、PlacheholderAPI は使用できません"
  update.msg.error = "アップデート情報を取得できません。ネットワーク接続を確認してください"
  update.msg.new = "新バージョン {0} が見つかりました。現在のバージョンは {1} です。最新バージョンを取得するには {2} にアクセスしてください"
  cmd.sirius.msg.version = "§l§9Sirius§r - §2{0}\n§r現在のバージョン：§l§a{1}\n§rプロジェクト作者：§l§b{2}\n§rソースアドレス：§l§3{3}\n§rライセンス：§l§c{4}\n§r"
  cmd.sirius.description = "Sirius プラグイン管理"
  cmd.sirius.msg.reload = "プラグインデータが正常にリロードされました"
  
  # Gui
  gui.confirm = "§a確認"
  gui.cancel = "§cキャンセル"
  gui.normal_confirm = "確認"
  gui.normal_cancel = "キャンセル"
  gui.not_op = "§cこの GUI を使用する権限がありません§r"
  cmd.gui.description = "指定された GUI を開くか、GUI データをリロードする"
  cmd.gui.msg.reload = "GUI データがリロードされました"
  cmd.gui.msg.not_found = "§c指定された GUI データファイルが見つかりません"
  cmd.menu.description = "サーバーメニューを開く"
  
  # Helper
  cmd.nbt.description = "NBT 取得"
  info.no_notice = "現在サーバーにお知らせが設定されていません"
  gui.notice.title = "お知らせ"
  cmd.back.description = "最後の死亡地点に戻る"
  cmd.back.msg.success = "最後の死亡地点にテレポートしました"
  cmd.back.msg.error = "最後の死亡地点が見つかりません"
  info.died = "あなたは {0} で死亡しました。/back を使用して死亡地点に戻ることができます"
  cmd.suicide.description = "自殺"
  cmd.msgui.description = "プライベートメッセージメニューを開く"
  gui.msgui.title = "プライベートメッセージ"
  gui.msgui.dropdown = "対象プレイヤー"
  gui.msgui.input = "メッセージ内容"
  cmd.clock.description = "時計を与える"
  cmd.notice.description = "サーバーのお知らせを表示"
  cmd.noticeset.description = "サーバーのお知らせを設定"
  cmd.noticeset.msg = "お知らせが正常に設定されました"
  cmd.here.description = "現在の座標を全プレイヤーに送信"
  info.here = "{0} 私はここにいます：§a{1}§c！"
  
  # Money
  cmd.money.description = "経済システム"
  gui.money.pay.title = "送金"
  gui.money.pay.dropdown = "対象プレイヤー"
  gui.money.pay.input = "送金額"
  gui.money.pay.error.target_not_found = "対象プレイヤーがオンラインではありません"
  gui.money.pay.error.empty = "金額を入力してください"
  gui.money.pay.error.not_number = "金額は数字でなければなりません"
  gui.money.pay.error.not_positive = "金額は正の数でなければなりません"
  gui.money.pay.error.not_enough_money = "十分なコインがありません"
  gui.money.pay.success = "{0} に {1} コインを正常に送金しました"
  gui.money.pay.target_received = "{0} から {1} コインを受け取りました"
  info.moeny_not_found = "現在 LLMoney がインストールされていません"
  info.hunter = "{0} を倒し、{1} コインを獲得しました"
  cmd.shop.description = "ショップメニューを開く"
  gui.shop.title = "ショップ"
  gui.shop.item_list.title = "§6ショップ§r：{0}"
  gui.shop.item_list.item = "{0}：{1} x {2} - §e{3} コイン§r"
  gui.shop.item_list.buy = "§b購入§r"
  gui.shop.item_list.sell = "§cキャンセル§r"
  cmd.shop.msg.item_not_found = "無効なアイテム識別子 {0}"
  cmd.shop.msg.not_enough_money = "§c十分なコインがありません {0}！"
  cmd.shop.msg.buy = "{0} x {1} を正常に購入し、{2} コインを消費しました"
  cmd.shop.msg.not_enough_item = "§c十分な {0} がありません！"
  cmd.shop.msg.sell = "{0} x {1} を正常に売却し、{2} コインを獲得しました"
  
  # Manager
  cmd.safe.description = "サーバーメンテナンス状態の切り替え"
  cmd.safe.msg = "設定が成功しました"
  gui.safe.title = "サーバーメンテナンス状態の切り替え"
  gui.safe.label = "サーバーメンテナンスが有効になると、管理者以外はサーバーに入ることができなくなります"
  gui.safe.switch = "メンテナンス状態"
  info.safe_mode = "サーバーはメンテナンス中のため、一時的に入ることができません。後でもう一度お試しください"
  gui.manger.btn.safe = "サーバーメンテナンス状態の切り替え"
  gui.manger.btn.vanish = "透明化の設定"
  gui.manger.btn.skick = "プレイヤーの強制キック"
  gui.manger.btn.crash = "プレイヤークライアントのクラッシュ"
  gui.manger.btn.info = "プレイヤー情報の取得"
  gui.manger.btn.ban = "プレイヤーのBAN"
  gui.manger.btn.unban = "プレイヤーのBAN解除"
  gui.manger.btn.banls = "BANリストの表示"
  gui.manger.btn.runas = "指定プレイヤーとしてコマンドを実行"
  gui.manger.btn.stop = "サーバーの停止"
  cmd.manger.description = "サーバー管理メニュー"
  gui.skick.title = "プレイヤーの強制キック"
  gui.crash.title = "プレイヤークライアントのクラッシュ"
  gui.info.title = "プレイヤー情報の取得"
  gui.ban.title = "プレイヤーのBAN"
  gui.ban.player = "対象プレイヤー"
  gui.ban.banip = "IP BAN"
  gui.ban.reason = "オプション：BAN理由"
  gui.ban.time = "オプション：BAN期間（秒）、デフォルトは永久"
  gui.unban.title = "プレイヤーのBAN解除"
  gui.runas.title = "指定プレイヤーとしてコマンドを実行"
  gui.runas.player = "対象プレイヤー"
  gui.runas.command = "コマンド"
  gui.manger.title = "サーバー管理"
  cmd.vanish.description = "透明化の設定"
  cmd.vanish.msg.off = "透明化がオフになりました"
  cmd.vanish.msg.on = "透明化がオンになりました"
  cmd.runas.description = "指定プレイヤーとしてコマンドを実行"
  cmd.runas.msg.not_found = "対象プレイヤーがオンラインではありません"
  cmd.runas.msg.success = "コマンドが {0} に送信されました"
  info.ban.kick = "プレイヤー {0} はローカルブラックリストに存在するため、キックされました"
  info.ban.reason = "理由：{0}"
  info.ban.forever = "あなたはサーバーから永久BANされました{0}"
  info.ban.time = "あなたは {0} までサーバーからBANされています{1}"
  info.ban_ip.forever = "現在の IP {0} はサーバーから永久BANされています{1}"
  info.ban_ip.time = "現在の IP {0} は {1} までサーバーからBANされています{2}"
  cmd.ban.description = "プレイヤーをBAN"
  cmd.ban.msg.empty = "現在のBANリストは空です"
  cmd.ban.msg.not_found = "対象プレイヤーがオンラインではありません"
  cmd.ban.msg.not_found_2 = "対象プレイヤーはBANリストにありません"
  cmd.ban.msg.unban = "プレイヤー {0} のBANが解除されました"
  cmd.ban.msg.list = "現在のBANリスト：{0}"
  cmd.ban.msg.item_ip.time = "\nIP：{0} 期間：{1}{2}"
  cmd.ban.msg.item_ip.forever = "\nIP：{0} 期間：永久{1}"
  cmd.ban.msg.item.time = "\nプレイヤー：{0} 期間：{1}{2}"
  cmd.ban.msg.item.forever = "\nプレイヤー：{0} 期間：永久{1}"
  cmd.ban.msg.ban.ban_ip.time = "IP {0} は {1} までBANされました{2}"
  cmd.ban.msg.ban.ban_ip.forever = "IP {0} は永久BANされました{1}{2}"
  cmd.ban.msg.ban.ban.time = "プレイヤー {0} は {1} までBANされました{2}"
  cmd.ban.msg.ban.ban.forever = "プレイヤー {0} は永久BANされました{1}{2}"
  cmd.cloudBlackCheck.msg.error = "クラウドブラックリスト API リクエストに失敗しました。ネットワーク接続を確認してください"
  cmd.cloudBlackCheck.msg.kick = "あなたは BlackBe クラウドブラックリストに登録されています。質問がある場合は管理者に連絡してください"
  cmd.cloudBlackCheck.msg.kicked = "プレイヤー {0} は BlackBe クラウドブラックリストに登録されています"
  cmd.skick.description = "関連プレイヤーを強制キック"
  cmd.skick.msg = "プレイヤー {0} がキックされました"
  cmd.crash.description = "指定プレイヤーのクライアントをクラッシュさせる"
  cmd.crash.msg.success = "クライアントのクラッシュに成功しました"
  cmd.crash.msg.error = "クライアントのクラッシュに失敗しました"
  cmd.crash.msg.not_found = "対象プレイヤーがオンラインではありません"
  cmd.info.description = "指定プレイヤーの情報を取得"
  cmd.info.msg.success = "プレイヤー名：{0}\nXUID：{1}\nUUID：{2}\nIP：{3}\nシステム：{4}\n入力モード：{5}\n遅延：{6}ms\nパケットロス：{7}%\n接続アドレス：{8}\nクライアントID：{9}"
  cmd.info.msg.not_found = "対象プレイヤーがオンラインではありません"
  cmd.stop.description = "サーバーを停止"
  
  # Teleport
  cmd.transfer.description = "クロスサーバーテレポート"
  cmd.transfer.msg.transfer = "対象を サーバー {0} : {1} にテレポート"
  cmd.tpr.description = "ランダムテレポート"
  cmd.tpr.msg.error.dimension = "このコマンドを使用するにはオーバーワールドにいる必要があります"
  cmd.tpr.msg.success = "{0} にランダムテレポートしました"
  cmd.tpa.description = "テレポートリクエスト"
  gui.tpa.title = "テレポートリクエスト"
  gui.tpa.btn.accept = "承諾"
  gui.tpa.btn.reject = "拒否"
  gui.tpa.dropdown.mode = "テレポートモード"
  gui.tpa.dropdown.target = "対象プレイヤー"
  gui.tpa.settings.title = "テレポート設定"
  gui.tpa.settings.block = "テレポートリクエストをブロック"
  cmd.tpa.msg.accepted = "リクエストが承諾されました"
  cmd.tpa.msg.rejected = "リクエストが拒否されました"
  cmd.tpa.msg.error.no_request = "進行中のテレポートリクエストはありません"
  cmd.tpa.msg.canceled = "テレポートリクエストがキャンセルされました"
  cmd.tpa.msg.error.existing_request = "すでに進行中のテレポートリクエストがあります"
  cmd.tpa.msg.error.player_offline = "対象プレイヤーがオンラインではありません"
  cmd.tpa.msg.error.blocked = "対象プレイヤーはテレポートリクエストをブロックしています"
  cmd.tpa.msg.expired = "テレポートリクエストが期限切れになりました"
  cmd.tpa.msg.request.to.req = "プレイヤー {0} があなたの現在位置へのテレポートをリクエストしています"
  cmd.tpa.msg.request.to.notify = "プレイヤー {0} があなたの現在位置へのテレポートをリクエストしています。/tpa ac と入力してリクエストを承諾してください"
  cmd.tpa.msg.sent.to = "{0} の位置へのテレポートリクエストを送信しました"
  cmd.tpa.msg.request.here.req = "プレイヤー {0} があなたを自分の現在位置へテレポートするようリクエストしています"
  cmd.tpa.msg.request.here.notify = "プレイヤー {0} があなたを自分の現在位置へテレポートするようリクエストしています。/tpa ac と入力してリクエストを承諾してください"
  cmd.tpa.msg.sent.here = "{0} をここへテレポートするリクエストを送信しました"
  cmd.tpa.msg.accept.req = "{0} のテレポートリクエストを承諾しました"
  cmd.tpa.msg.accept.notify = "プレイヤー {0} があなたのテレポートリクエストを承諾しました"
  cmd.tpa.msg.reject.req = "{0} のテレポートリクエストを拒否しました"
  cmd.tpa.msg.reject.notify = "プレイヤー {0} があなたのテレポートリクエストを拒否しました"
  cmd.tpa.msg.unblocked = "テレポートリクエストのブロックを解除しました"
  cmd.tpa.msg.blocked = "テレポートリクエストをブロックしました"
  cmd.home.description = "個人テレポートポイント"
  gui.home.title = "個人テレポートポイント"
  gui.home.delete.title = "個人テレポートポイントの削除"
  gui.home.delete.content = "削除するテレポートポイントを選択"
  gui.home.add.title = "個人テレポートポイントの追加"
  gui.home.add.name = "名前"
  cmd.home.msg.error.no_homes = "現在設定されているテレポートポイントはありません"
  cmd.home.msg.error.not_exist = "個人テレポートポイント {0} は存在しません"
  cmd.home.msg.error.already_exist = "個人テレポートポイント {0} はすでに存在します"
  cmd.home.msg.error.limit = "個人テレポートポイントの上限に達しました"
  cmd.home.msg.added = "個人テレポートポイント {0} を追加しました"
  cmd.home.msg.deleted = "個人テレポートポイント {0} を削除しました"
  cmd.warp.description = "公共テレポートポイント"
  gui.warp.title = "公共テレポートポイント"
  gui.warp.delete.title = "公共テレポートポイントの削除"
  gui.warp.delete.content = "削除するテレポートポイントを選択"
  gui.warp.add.title = "公共テレポートポイントの追加"
  gui.warp.add.name = "名前"
  cmd.warp.msg.error.no_warps = "現在設定されているテレポートポイントはありません"
  cmd.warp.msg.error.not_exist = "公共テレポートポイント {0} は存在しません"
  cmd.warp.msg.error.no_permission = "このコマンドを実行する権限がありません"
  cmd.warp.msg.error.already_exist = "公共テレポートポイント {0} はすでに存在します"
  cmd.warp.msg.added = "公共テレポートポイント {0} を追加しました"
  cmd.warp.msg.deleted = "公共テレポートポイント {0} を削除しました"
  
  # Land
  land.current_location = "現在 {0} の土地にいます"
  land.enter = "{0} の土地に入りました"
  land.error.not_found = "対象に一致する土地が見つかりません"
  land.teleport.success = "土地 {0} にテレポートしました"
  land.error.creation_in_progress = "現在土地の作成中です。再作成する必要がある場合は、まず /land giveup を送信してください"
  land.error.name_required = "土地名を入力してください"
  land.error.name_exists = "同じ名前の土地がすでに存在します"
  land.create.start = "土地の作成を開始します。/land set a を送信して土地の開始座標点を設定してください"
  land.error.no_creation_in_progress = "進行中の土地作成はありません"
  land.error.incomplete_selection = "現在の土地作成の選択が完了していません"
  land.set.a = "土地の開始座標点を {0} に設定しました"
  land.set.b = "土地の終了座標点を {0} に設定しました"
  land.create.giveup = "土地の作成を放棄しました"
  land.error.intersection = "土地の作成に失敗しました。選択された土地が既存の土地と交差しています。再作成してください"
  land.error.too_large = "土地の作成に失敗しました。土地のサイズが {0} ブロックを超えています"
  land.error.insufficient_funds = "土地の作成に失敗しました。{0} コインが不足しています"
  land.create.success = "土地 {0} の作成に成功しました。{1} コインを消費しました"
  land.error.no_lands = "現在、土地はありません"
  land.error.player_offline = "対象プレイヤーがオンラインではありません"
  land.error.already_whitelisted = "このプレイヤーはすでにホワイトリストに登録されています"
  land.whitelist.added = "プレイヤーがホワイトリストに追加されました"
  land.welcome.set = "歓迎メッセージが設定されました"
  land.leave.set = "退出メッセージが設定されました"
  land.rename.success = "土地の名前が {0} に変更されました"
  land.error.self_transfer = "自分自身に譲渡することはできません"
  land.transfer.new_name = "{0} 元：{1}"
  land.transfer.received = "プレイヤー {0} が土地 {1} をあなたに譲渡しました"
  land.transfer.success = "土地 {0} をプレイヤー {1} に譲渡しました"
  land.delete.success = "土地が削除され、{0} コインが返金されました"
  gui.land.create.title = "土地の作成"
  gui.land.create.name = "土地名"
  gui.land.manage.title = "土地管理"
  gui.land.manage.land_title = "土地：{0} 管理"
  gui.land.manage.land_info = "開始座標：{0}\n終了座標：{1}"
  gui.land.manage.add_whitelist = "ホワイトリストに追加"
  gui.land.manage.add_whitelist_title = "土地：{0} ホワイトリストに追加"
  gui.land.manage.select_player = "プレイヤーを選択"
  gui.land.manage.teleport = "土地にテレポート"
  gui.land.manage.set_welcome = "歓迎メッセージを設定"
  gui.land.manage.set_welcome_title = "土地：{0} 歓迎メッセージを設定"
  gui.land.manage.welcome_message = "歓迎メッセージ"
  gui.land.manage.set_leave = "退出メッセージを設定"
  gui.land.manage.set_leave_title = "土地：{0} 退出メッセージを設定"
  gui.land.manage.leave_message = "退出メッセージ"
  gui.land.manage.rename = "土地の名前を変更"
  gui.land.manage.rename_title = "土地：{0} 名前変更"
  gui.land.manage.new_name = "新しい名前"
  gui.land.manage.transfer = "土地を譲渡"
  gui.land.manage.transfer_title = "土地：{0} 譲渡"
  gui.land.manage.transfer_to = "譲渡先"
  gui.land.manage.delete = "土地を削除"
  gui.land.manage.delete_title = "土地：{0} 削除"
  gui.land.manage.delete_confirm = "削除すると {0} コインが返金されます。この土地を削除してもよろしいですか？"
`
)

autoCreate(
  `${LOCALE_PATH}/zh_TW.toml`,
  String.raw`plugin.description = "下壹代最全面的服務器基礎&綜合性功能插件"

  # System
  info.mode_0 = "生存模式"
  info.mode_1 = "創造模式"
  info.mode_2 = "冒險模式"
  info.mode_3 = "旁觀者模式"
  info.perm_0 = "成員"
  info.perm_1 = "管理員"
  info.perm_2 = "控制台"
  info.dim_0 = "主世界"
  info.dim_1 = "下界"
  info.dim_2 = "末地"
  info.dim_3 = "自定義維度"
  info.miss_gmlib = "當前未安裝 GMLIB LegacyRemoteCallApi，PlacheholderAPI 將不可用"
  update.msg.error = "無法獲取更新信息，請檢查網絡連接"
  update.msg.new = "發現新版本 {0}，當前版本 {1}，請前往 {2} 獲取最新版本"
  cmd.sirius.msg.version = "§l§9Sirius§r - §2{0}\n§r當前版本：§l§a{1}\n§r項目作者：§l§b{2}\n§r開原地址：§l§3{3}\n§r開源協議：§l§c{4}\n§r"
  cmd.sirius.description = "Sirius 插件管理"
  cmd.sirius.msg.reload = "插件數據重載成功"
  
  # Gui
  gui.confirm = "§a確認"
  gui.cancel = "§c取消"
  gui.normal_confirm = "確認"
  gui.normal_cancel = "取消"
  gui.not_op = "§c妳沒有權限使用該 GUI§r"
  cmd.gui.description = "打開指定 GUI 或重裝 GUI 數據"
  cmd.gui.msg.reload = "GUI 數據已重新加載"
  cmd.gui.msg.not_found = "§c找不到指定 GUI 數據文件"
  cmd.menu.description = "打開服務器菜單"
  
  # Helper
  cmd.nbt.description = "NBT 獲取"
  info.no_notice = "當前服務器未設置公告"
  gui.notice.title = "公告"
  cmd.back.description = "回到上次死亡點"
  cmd.back.msg.success = "已傳送至上次死亡點"
  cmd.back.msg.error = "無法找到上次死亡點"
  info.died = "妳在 {0} 死了，使用 /back 可返回死亡地點"
  cmd.suicide.description = "自殺"
  cmd.msgui.description = "打開私聊菜單"
  gui.msgui.title = "私聊"
  gui.msgui.dropdown = "目標玩家"
  gui.msgui.input = "消息內容"
  cmd.clock.description = "給鍾"
  cmd.notice.description = "查看服務器公告"
  cmd.noticeset.description = "設置服務器公告"
  cmd.noticeset.msg = "公告設置成功"
  cmd.here.description = "向所有玩家發送自己當前坐標"
  info.here = "{0} 我在這裏：§a{1}§c！"
  
  # Money
  cmd.money.description = "經濟系統"
  gui.money.pay.title = "轉賬"
  gui.money.pay.dropdown = "目標玩家"
  gui.money.pay.input = "轉賬金額"
  gui.money.pay.error.target_not_found = "目標玩家不在線"
  gui.money.pay.error.empty = "請輸入金額"
  gui.money.pay.error.not_number = "金額必須爲數字"
  gui.money.pay.error.not_positive = "金額必須爲正數"
  gui.money.pay.error.not_enough_money = "妳沒有足夠的金幣"
  gui.money.pay.success = "成功向 {0} 轉賬 {1} 金幣"
  gui.money.pay.target_received = "妳收到來自 {0} 的 {1} 金幣"
  info.moeny_not_found = "當前未安裝 LLMoney"
  info.hunter = "擊殺 {0}，獲得了 {1} 金幣"
  cmd.shop.description = "打開商店菜單"
  gui.shop.title = "商店"
  gui.shop.item_list.title = "§6商店§r：{0}"
  gui.shop.item_list.item = "{0}：{1} x {2} - §e{3} 金幣§r"
  gui.shop.item_list.buy = "§b出售§r"
  gui.shop.item_list.sell = "§c取消§r"
  cmd.shop.msg.item_not_found = "錯誤的物品標識符 {0}"
  cmd.shop.msg.not_enough_money = "§c沒有足夠的金幣 {0}！"
  cmd.shop.msg.buy = "成功購買了 {0} x {1}，消費了 {2} 金幣"
  cmd.shop.msg.not_enough_item = "§c妳沒有足夠的 {0}！"
  cmd.shop.msg.sell = "成功出售了 {0} x {1}，獲得了 {2} 金幣"
  
  # Manger
  cmd.safe.description = "服務器維護狀態切換"
  cmd.safe.msg = "設置成功"
  gui.safe.title = "服務器維護狀態切換"
  gui.safe.label = "開啓服務器維護後，非管理員將無法進入服務器"
  gui.safe.switch = "維護狀態"
  info.safe_mode = "服務器維護中暫時無法進入服務器，請稍後再試"
  gui.manger.btn.safe = "服務器維護狀態切換"
  gui.manger.btn.vanish = "設置隱身"
  gui.manger.btn.skick = "強制踢出玩家"
  gui.manger.btn.crash = "崩玩家客戶端"
  gui.manger.btn.info = "獲取玩家信息"
  gui.manger.btn.ban = "封禁玩家"
  gui.manger.btn.unban = "解封玩家"
  gui.manger.btn.banls = "查看封禁列表"
  gui.manger.btn.runas = "以指定玩家身份運行命令"
  gui.manger.btn.stop = "停止服務器"
  cmd.manger.description = "服務器管理菜單"
  gui.skick.title = "強制踢出玩家"
  gui.crash.title = "崩玩家客戶端"
  gui.info.title = "獲取玩家信息"
  gui.ban.title = "封禁玩家"
  gui.ban.player = "目標玩家"
  gui.ban.banip = "封禁 IP"
  gui.ban.reason = "選填：封禁原因"
  gui.ban.time = "選填：封禁時長（秒），默認永久"
  gui.unban.title = "解封玩家"
  gui.runas.title = "以指定玩家身份運行命令"
  gui.runas.player = "目標玩家"
  gui.runas.command = "命令"
  gui.manger.title = "服務器管理"
  cmd.vanish.description = "設置隱身"
  cmd.vanish.msg.off = "隱身已關閉"
  cmd.vanish.msg.on = "隱身已開啓"
  cmd.runas.description = "以指定玩家身份運行命令"
  cmd.runas.msg.not_found = "目標玩家不在線"
  cmd.runas.msg.success = "命令已發送給 {0}"
  info.ban.kick = "玩家 {0} 存在于本地黑名單中，已被踢出"
  info.ban.reason = "原因：{0}"
  info.ban.forever = "妳已被服務器永久封禁{0}"
  info.ban.time = "妳已被服務器封禁至 {0}{1}"
  info.ban_ip.forever = "當前 IP {0} 已被服務器永久封禁{1}"
  info.ban_ip.time = "當前 IP {0} 已被服務器封禁至 {1}{2}"
  cmd.ban.description = "封禁玩家"
  cmd.ban.msg.empty = "當前封禁列表爲空"
  cmd.ban.msg.not_found = "目標玩家不在線"
  cmd.ban.msg.not_found_2 = "目標玩家不在封禁列表"
  cmd.ban.msg.unban = "玩家 {0} 已被解封"
  cmd.ban.msg.list = "當前封禁列表：{0}"
  cmd.ban.msg.item_ip.time = "\nIP：{0} 時間：{1}{2}"
  cmd.ban.msg.item_ip.forever = "\nIP：{0} 時間：永久{1}"
  cmd.ban.msg.item.time = "\n玩家：{0} 時間：{1}{2}"
  cmd.ban.msg.item.forever = "\n玩家：{0} 時間：永久{1}"
  cmd.ban.msg.ban.ban_ip.time = "IP {0} 已被封禁至{1}{2}"
  cmd.ban.msg.ban.ban_ip.forever = "IP {0} 已被永久封禁{1}{2}"
  cmd.ban.msg.ban.ban.time = "玩家 {0} 已被封禁至{1}{2}"
  cmd.ban.msg.ban.ban.forever = "玩家 {0} 已被永久封禁{1}{2}"
  cmd.cloudBlackCheck.msg.error = "雲黑接口請求失敗，請檢查妳的網絡連接"
  cmd.cloudBlackCheck.msg.kick = "妳已被列入 BlackBe 雲黑名單，如有疑問請聯系管理員"
  cmd.cloudBlackCheck.msg.kicked = "玩家 {0} 已被列入 BlackBe 雲黑名單"
  cmd.skick.description = "強制踢除相關玩家"
  cmd.skick.msg = "已踢除玩家 {0}"
  cmd.crash.description = "崩掉指定玩家的客戶端"
  cmd.crash.msg.success = "客戶端崩潰成功"
  cmd.crash.msg.error = "客戶端崩潰失敗"
  cmd.crash.msg.not_found = "目標玩家不在線"
  cmd.info.description = "獲取指定玩家信息"
  cmd.info.msg.success = "玩家名：{0}\nXUID：{1}\nUUID：{2}\nIP：{3}\n系統：{4}\n輸入模式：{5}\n延遲：{6}ms\n丟包率：{7}%\n連接地址：{8}\n客戶端 ID：{9}"
  cmd.info.msg.not_found = "目標玩家不在線"
  cmd.stop.description = "停止服務器"
  
  # Teleport
  cmd.transfer.description = "跨服傳送"
  cmd.transfer.msg.transfer = "傳送目標到服務器 {0} : {1}"
  cmd.tpr.description = "隨機傳送"
  cmd.tpr.msg.error.dimension = "妳必須在主世界才能使用該命令"
  cmd.tpr.msg.success = "隨機傳送至 {0}"
  cmd.tpa.description = "傳送請求"
  gui.tpa.title = "傳送請求"
  gui.tpa.btn.accept = "接受"
  gui.tpa.btn.reject = "拒絕"
  gui.tpa.dropdown.mode = "傳送模式"
  gui.tpa.dropdown.target = "目標玩家"
  gui.tpa.settings.title = "傳送設置"
  gui.tpa.settings.block = "屏蔽傳送請求"
  cmd.tpa.msg.accepted = "請求已被接受"
  cmd.tpa.msg.rejected = "請求已被拒絕"
  cmd.tpa.msg.error.no_request = "當前沒有正在進行的傳送請求"
  cmd.tpa.msg.canceled = "取消了傳送請求"
  cmd.tpa.msg.error.existing_request = "當前已有正在進行的傳送請求"
  cmd.tpa.msg.error.player_offline = "目標玩家不在線"
  cmd.tpa.msg.error.blocked = "目標玩家已屏蔽傳送請求"
  cmd.tpa.msg.expired = "傳送請求已過期"
  cmd.tpa.msg.request.to.req = "玩家 {0} 請求傳送到妳當前位置"
  cmd.tpa.msg.request.to.notify = "玩家 {0} 請求傳送到妳當前位置，輸入 /tpa ac 接受請求"
  cmd.tpa.msg.sent.to = "已向玩家 {0} 發送到對方的傳送請求"
  cmd.tpa.msg.request.here.req = "玩家 {0} 請求妳傳送到對方當前位置"
  cmd.tpa.msg.request.here.notify = "玩家 {0} 請求妳傳送到對方當前位置，輸入 /tpa ac 接受請求"
  cmd.tpa.msg.sent.here = "已向玩家 {0} 發送到這裏的傳送請求"
  cmd.tpa.msg.accept.req = "接受了 {0} 的傳送請求"
  cmd.tpa.msg.accept.notify = "玩家 {0} 接受了妳的傳送請求"
  cmd.tpa.msg.reject.req = "拒絕了 {0} 的傳送請求"
  cmd.tpa.msg.reject.notify = "玩家 {0} 拒絕了妳的傳送請求"
  cmd.tpa.msg.unblocked = "已取消屏蔽傳送請求"
  cmd.tpa.msg.blocked = "已屏蔽傳送請求"
  cmd.home.description = "個人傳送點"
  gui.home.title = "個人傳送點"
  gui.home.delete.title = "刪除個人傳送點"
  gui.home.delete.content = "選擇要刪除的傳送點"
  gui.home.add.title = "添加個人傳送點"
  gui.home.add.name = "名稱"
  cmd.home.msg.error.no_homes = "當前沒有設置任何傳送點"
  cmd.home.msg.error.not_exist = "個人傳送點 {0} 不存在"
  cmd.home.msg.error.already_exist = "個人傳送點 {0} 已存在"
  cmd.home.msg.error.limit = "個人傳送點數量已達上限"
  cmd.home.msg.added = "已添加個人傳送點 {0}"
  cmd.home.msg.deleted = "已刪除個人傳送點 {0}"
  cmd.warp.description = "公共傳送點"
  gui.warp.title = "公共傳送點"
  gui.warp.delete.title = "刪除公共傳送點"
  gui.warp.delete.content = "選擇要刪除的傳送點"
  gui.warp.add.title = "添加公共傳送點"
  gui.warp.add.name = "名稱"
  cmd.warp.msg.error.no_warps = "當前沒有設置任何傳送點"
  cmd.warp.msg.error.not_exist = "公共傳送點 {0} 不存在"
  cmd.warp.msg.error.no_permission = "妳沒有權限執行該命令"
  cmd.warp.msg.error.already_exist = "公共傳送點 {0} 已存在"
  cmd.warp.msg.added = "已添加公共傳送點 {0}"
  cmd.warp.msg.deleted = "已刪除公共傳送點 {0}"
  
  # Land
  land.current_location = "當前位于 {0} 的領地"
  land.enter = "妳已進入領地 {0}"
  land.error.not_found = "沒有與目標匹配的領地"
  land.teleport.success = "成功傳送到領地 {0}"
  land.error.creation_in_progress = "當前正在進行領地創建中，如若需要重新創建請先發送 /land giveup"
  land.error.name_required = "請輸入領地名稱"
  land.error.name_exists = "已經有同名的領地"
  land.create.start = "開始領地創建中，請發送 /land set a 設置領地起始坐標點"
  land.error.no_creation_in_progress = "當前沒有正在進行的領地創建"
  land.error.incomplete_selection = "當前領地創建選點還未設置完成"
  land.set.a = "已設置領地起始坐標點 {0}"
  land.set.b = "已設置領地結束坐標點 {0}"
  land.create.giveup = "已放棄領地創建"
  land.error.intersection = "領地創建失敗，選定的領地與已有領地有交叉，請重新創建"
  land.error.too_large = "領地創建失敗，領地大小超過 {0} 塊"
  land.error.insufficient_funds = "領地創建失敗，沒有足夠的金幣 {0}"
  land.create.success = "領地 {0} 創建成功，花費 {1} 金幣"
  land.error.no_lands = "當前沒有任何領地"
  land.error.player_offline = "目標玩家不在線"
  land.error.already_whitelisted = "該玩家已經在白名單中"
  land.whitelist.added = "玩家已添加到白名單"
  land.welcome.set = "歡迎語已設置"
  land.leave.set = "離開語已設置"
  land.rename.success = "領地已重命名爲 {0}"
  land.error.self_transfer = "不能轉讓給自己"
  land.transfer.new_name = "{0} 來自：{1}"
  land.transfer.received = "玩家 {0} 將領地 {1} 已轉讓給妳"
  land.transfer.success = "領地 {0} 已轉讓給玩家 {1}"
  land.delete.success = "領地已刪除，返還 {0} 金幣"
  gui.land.create.title = "創建領地"
  gui.land.create.name = "領地名稱"
  gui.land.manage.title = "領地管理"
  gui.land.manage.land_title = "領地：{0} 管理"
  gui.land.manage.land_info = "起始坐標：{0}\n結束坐標：{1}"
  gui.land.manage.add_whitelist = "添加白名單"
  gui.land.manage.add_whitelist_title = "領地：{0} 添加白名單"
  gui.land.manage.select_player = "選擇玩家"
  gui.land.manage.teleport = "傳送至領地"
  gui.land.manage.set_welcome = "設置歡迎語"
  gui.land.manage.set_welcome_title = "領地：{0} 設置歡迎語"
  gui.land.manage.welcome_message = "歡迎語"
  gui.land.manage.set_leave = "設置離開語"
  gui.land.manage.set_leave_title = "領地：{0} 設置離開語"
  gui.land.manage.leave_message = "離開語"
  gui.land.manage.rename = "重命名領地"
  gui.land.manage.rename_title = "領地：{0} 重命名"
  gui.land.manage.new_name = "新的名稱"
  gui.land.manage.transfer = "轉讓領地"
  gui.land.manage.transfer_title = "領地：{0} 轉讓"
  gui.land.manage.transfer_to = "轉讓給"
  gui.land.manage.delete = "刪除領地"
  gui.land.manage.delete_title = "領地：{0} 刪除"
  gui.land.manage.delete_confirm = "刪除後將得將返還金幣 {0}，確定要刪除該領地嗎？"
`
)

autoCreate(
  `${LOCALE_PATH}/zh_CN.toml`,
  String.raw`
plugin.description = "下一代最全面的服务器基础&综合性功能插件"

# System
info.mode_0 = "生存模式"
info.mode_1 = "创造模式"
info.mode_2 = "冒险模式"
info.mode_3 = "旁观者模式"
info.perm_0 = "成员"
info.perm_1 = "管理员"
info.perm_2 = "控制台"
info.dim_0 = "主世界"
info.dim_1 = "下界"
info.dim_2 = "末地"
info.dim_3 = "自定义维度"
info.miss_gmlib = "当前未安装 GMLIB LegacyRemoteCallApi，PlacheholderAPI 将不可用"
update.msg.error = "无法获取更新信息，请检查网络连接"
update.msg.new = "发现新版本 {0}，当前版本 {1}，请前往 {2} 获取最新版本"
cmd.sirius.msg.version = "§l§9Sirius§r - §2{0}\n§r当前版本：§l§a{1}\n§r项目作者：§l§b{2}\n§r开原地址：§l§3{3}\n§r开源协议：§l§c{4}\n§r"
cmd.sirius.description = "Sirius 插件管理"
cmd.sirius.msg.reload = "插件数据重载成功"

# Gui
gui.confirm = "§a确认"
gui.cancel = "§c取消"
gui.normal_confirm = "确认"
gui.normal_cancel = "取消"
gui.not_op = "§c你没有权限使用该 GUI§r"
cmd.gui.description = "打开指定 GUI 或重装 GUI 数据"
cmd.gui.msg.reload = "GUI 数据已重新加载"
cmd.gui.msg.not_found = "§c找不到指定 GUI 数据文件"
cmd.menu.description = "打开服务器菜单"

# Helper
cmd.nbt.description = "NBT 获取"
info.no_notice = "当前服务器未设置公告"
gui.notice.title = "公告"
cmd.back.description = "回到上次死亡点"
cmd.back.msg.success = "已传送至上次死亡点"
cmd.back.msg.error = "无法找到上次死亡点"
info.died = "你在 {0} 死了，使用 /back 可返回死亡地点"
cmd.suicide.description = "自杀"
cmd.msgui.description = "打开私聊菜单"
gui.msgui.title = "私聊"
gui.msgui.dropdown = "目标玩家"
gui.msgui.input = "消息内容"
cmd.clock.description = "给钟"
cmd.notice.description = "查看服务器公告"
cmd.noticeset.description = "设置服务器公告"
cmd.noticeset.msg = "公告设置成功"
cmd.here.description = "向所有玩家发送自己当前坐标"
info.here = "{0} 我在这里：§a{1}§c！"

# Money
cmd.money.description = "经济系统"
gui.money.pay.title = "转账"
gui.money.pay.dropdown = "目标玩家"
gui.money.pay.input = "转账金额"
gui.money.pay.error.target_not_found = "目标玩家不在线"
gui.money.pay.error.empty = "请输入金额"
gui.money.pay.error.not_number = "金额必须为数字"
gui.money.pay.error.not_positive = "金额必须为正数"
gui.money.pay.error.not_enough_money = "你没有足够的金币"
gui.money.pay.success = "成功向 {0} 转账 {1} 金币"
gui.money.pay.target_received = "你收到来自 {0} 的 {1} 金币"
info.moeny_not_found = "当前未安装 LLMoney"
info.hunter = "击杀 {0}，获得了 {1} 金币"
cmd.shop.description = "打开商店菜单"
gui.shop.title = "商店"
gui.shop.item_list.title = "§6商店§r：{0}"
gui.shop.item_list.item = "{0}：{1} x {2} - §e{3} 金币§r"
gui.shop.item_list.buy = "§b出售§r"
gui.shop.item_list.sell = "§c取消§r"
cmd.shop.msg.item_not_found = "错误的物品标识符 {0}"
cmd.shop.msg.not_enough_money = "§c没有足够的金币 {0}！"
cmd.shop.msg.buy = "成功购买了 {0} x {1}，消费了 {2} 金币"
cmd.shop.msg.not_enough_item = "§c你没有足够的 {0}！"
cmd.shop.msg.sell = "成功出售了 {0} x {1}，获得了 {2} 金币"

# Manger
cmd.safe.description = "服务器维护状态切换"
cmd.safe.msg = "设置成功"
gui.safe.title = "服务器维护状态切换"
gui.safe.label = "开启服务器维护后，非管理员将无法进入服务器"
gui.safe.switch = "维护状态"
info.safe_mode = "服务器维护中暂时无法进入服务器，请稍后再试"
gui.manger.btn.safe = "服务器维护状态切换"
gui.manger.btn.vanish = "设置隐身"
gui.manger.btn.skick = "强制踢出玩家"
gui.manger.btn.crash = "崩玩家客户端"
gui.manger.btn.info = "获取玩家信息"
gui.manger.btn.ban = "封禁玩家"
gui.manger.btn.unban = "解封玩家"
gui.manger.btn.banls = "查看封禁列表"
gui.manger.btn.runas = "以指定玩家身份运行命令"
gui.manger.btn.stop = "停止服务器"
cmd.manger.description = "服务器管理菜单"
gui.skick.title = "强制踢出玩家"
gui.crash.title = "崩玩家客户端"
gui.info.title = "获取玩家信息"
gui.ban.title = "封禁玩家"
gui.ban.player = "目标玩家"
gui.ban.banip = "封禁 IP"
gui.ban.reason = "选填：封禁原因"
gui.ban.time = "选填：封禁时长（秒），默认永久"
gui.unban.title = "解封玩家"
gui.runas.title = "以指定玩家身份运行命令"
gui.runas.player = "目标玩家"
gui.runas.command = "命令"
gui.manger.title = "服务器管理"
cmd.vanish.description = "设置隐身"
cmd.vanish.msg.off = "隐身已关闭"
cmd.vanish.msg.on = "隐身已开启"
cmd.runas.description = "以指定玩家身份运行命令"
cmd.runas.msg.not_found = "目标玩家不在线"
cmd.runas.msg.success = "命令已发送给 {0}"
info.ban.kick = "玩家 {0} 存在于本地黑名单中，已被踢出"
info.ban.reason = "原因：{0}"
info.ban.forever = "你已被服务器永久封禁{0}"
info.ban.time = "你已被服务器封禁至 {0}{1}"
info.ban_ip.forever = "当前 IP {0} 已被服务器永久封禁{1}"
info.ban_ip.time = "当前 IP {0} 已被服务器封禁至 {1}{2}"
cmd.ban.description = "封禁玩家"
cmd.ban.msg.empty = "当前封禁列表为空"
cmd.ban.msg.not_found = "目标玩家不在线"
cmd.ban.msg.not_found_2 = "目标玩家不在封禁列表"
cmd.ban.msg.unban = "玩家 {0} 已被解封"
cmd.ban.msg.list = "当前封禁列表：{0}"
cmd.ban.msg.item_ip.time = "\nIP：{0} 时间：{1}{2}"
cmd.ban.msg.item_ip.forever = "\nIP：{0} 时间：永久{1}"
cmd.ban.msg.item.time = "\n玩家：{0} 时间：{1}{2}"
cmd.ban.msg.item.forever = "\n玩家：{0} 时间：永久{1}"
cmd.ban.msg.ban.ban_ip.time = "IP {0} 已被封禁至{1}{2}"
cmd.ban.msg.ban.ban_ip.forever = "IP {0} 已被永久封禁{1}{2}"
cmd.ban.msg.ban.ban.time = "玩家 {0} 已被封禁至{1}{2}"
cmd.ban.msg.ban.ban.forever = "玩家 {0} 已被永久封禁{1}{2}"
cmd.cloudBlackCheck.msg.error = "云黑接口请求失败，请检查你的网络连接"
cmd.cloudBlackCheck.msg.kick = "你已被列入 BlackBe 云黑名单，如有疑问请联系管理员"
cmd.cloudBlackCheck.msg.kicked = "玩家 {0} 已被列入 BlackBe 云黑名单"
cmd.skick.description = "强制踢除相关玩家"
cmd.skick.msg = "已踢除玩家 {0}"
cmd.crash.description = "崩掉指定玩家的客户端"
cmd.crash.msg.success = "客户端崩溃成功"
cmd.crash.msg.error = "客户端崩溃失败"
cmd.crash.msg.not_found = "目标玩家不在线"
cmd.info.description = "获取指定玩家信息"
cmd.info.msg.success = "玩家名：{0}\nXUID：{1}\nUUID：{2}\nIP：{3}\n系统：{4}\n输入模式：{5}\n延迟：{6}ms\n丢包率：{7}%\n连接地址：{8}\n客户端 ID：{9}"
cmd.info.msg.not_found = "目标玩家不在线"
cmd.stop.description = "停止服务器"

# Teleport
cmd.transfer.description = "跨服传送"
cmd.transfer.msg.transfer = "传送目标到服务器 {0} : {1}"
cmd.tpr.description = "随机传送"
cmd.tpr.msg.error.dimension = "你必须在主世界才能使用该命令"
cmd.tpr.msg.success = "随机传送至 {0}"
cmd.tpa.description = "传送请求"
gui.tpa.title = "传送请求"
gui.tpa.btn.accept = "接受"
gui.tpa.btn.reject = "拒绝"
gui.tpa.dropdown.mode = "传送模式"
gui.tpa.dropdown.target = "目标玩家"
gui.tpa.settings.title = "传送设置"
gui.tpa.settings.block = "屏蔽传送请求"
cmd.tpa.msg.accepted = "请求已被接受"
cmd.tpa.msg.rejected = "请求已被拒绝"
cmd.tpa.msg.error.no_request = "当前没有正在进行的传送请求"
cmd.tpa.msg.canceled = "取消了传送请求"
cmd.tpa.msg.error.existing_request = "当前已有正在进行的传送请求"
cmd.tpa.msg.error.player_offline = "目标玩家不在线"
cmd.tpa.msg.error.blocked = "目标玩家已屏蔽传送请求"
cmd.tpa.msg.expired = "传送请求已过期"
cmd.tpa.msg.request.to.req = "玩家 {0} 请求传送到你当前位置"
cmd.tpa.msg.request.to.notify = "玩家 {0} 请求传送到你当前位置，输入 /tpa ac 接受请求"
cmd.tpa.msg.sent.to = "已向玩家 {0} 发送到对方的传送请求"
cmd.tpa.msg.request.here.req = "玩家 {0} 请求你传送到对方当前位置"
cmd.tpa.msg.request.here.notify = "玩家 {0} 请求你传送到对方当前位置，输入 /tpa ac 接受请求"
cmd.tpa.msg.sent.here = "已向玩家 {0} 发送到这里的传送请求"
cmd.tpa.msg.accept.req = "接受了 {0} 的传送请求"
cmd.tpa.msg.accept.notify = "玩家 {0} 接受了你的传送请求"
cmd.tpa.msg.reject.req = "拒绝了 {0} 的传送请求"
cmd.tpa.msg.reject.notify = "玩家 {0} 拒绝了你的传送请求"
cmd.tpa.msg.unblocked = "已取消屏蔽传送请求"
cmd.tpa.msg.blocked = "已屏蔽传送请求"
cmd.home.description = "个人传送点"
gui.home.title = "个人传送点"
gui.home.delete.title = "删除个人传送点"
gui.home.delete.content = "选择要删除的传送点"
gui.home.add.title = "添加个人传送点"
gui.home.add.name = "名称"
cmd.home.msg.error.no_homes = "当前没有设置任何传送点"
cmd.home.msg.error.not_exist = "个人传送点 {0} 不存在"
cmd.home.msg.error.already_exist = "个人传送点 {0} 已存在"
cmd.home.msg.error.limit = "个人传送点数量已达上限"
cmd.home.msg.added = "已添加个人传送点 {0}"
cmd.home.msg.deleted = "已删除个人传送点 {0}"
cmd.warp.description = "公共传送点"
gui.warp.title = "公共传送点"
gui.warp.delete.title = "删除公共传送点"
gui.warp.delete.content = "选择要删除的传送点"
gui.warp.add.title = "添加公共传送点"
gui.warp.add.name = "名称"
cmd.warp.msg.error.no_warps = "当前没有设置任何传送点"
cmd.warp.msg.error.not_exist = "公共传送点 {0} 不存在"
cmd.warp.msg.error.no_permission = "你没有权限执行该命令"
cmd.warp.msg.error.already_exist = "公共传送点 {0} 已存在"
cmd.warp.msg.added = "已添加公共传送点 {0}"
cmd.warp.msg.deleted = "已删除公共传送点 {0}"

# Land
land.current_location = "当前位于 {0} 的领地"
land.enter = "你已进入领地 {0}"
land.error.not_found = "没有与目标匹配的领地"
land.teleport.success = "成功传送到领地 {0}"
land.error.creation_in_progress = "当前正在进行领地创建中，如若需要重新创建请先发送 /land giveup"
land.error.name_required = "请输入领地名称"
land.error.name_exists = "已经有同名的领地"
land.create.start = "开始领地创建中，请发送 /land set a 设置领地起始坐标点"
land.error.no_creation_in_progress = "当前没有正在进行的领地创建"
land.error.incomplete_selection = "当前领地创建选点还未设置完成"
land.set.a = "已设置领地起始坐标点 {0}"
land.set.b = "已设置领地结束坐标点 {0}"
land.create.giveup = "已放弃领地创建"
land.error.intersection = "领地创建失败，选定的领地与已有领地有交叉，请重新创建"
land.error.too_large = "领地创建失败，领地大小超过 {0} 块"
land.error.insufficient_funds = "领地创建失败，没有足够的金币 {0}"
land.create.success = "领地 {0} 创建成功，花费 {1} 金币"
land.error.no_lands = "当前没有任何领地"
land.error.player_offline = "目标玩家不在线"
land.error.already_whitelisted = "该玩家已经在白名单中"
land.whitelist.added = "玩家已添加到白名单"
land.welcome.set = "欢迎语已设置"
land.leave.set = "离开语已设置"
land.rename.success = "领地已重命名为 {0}"
land.error.self_transfer = "不能转让给自己"
land.transfer.new_name = "{0} 来自：{1}"
land.transfer.received = "玩家 {0} 将领地 {1} 已转让给你"
land.transfer.success = "领地 {0} 已转让给玩家 {1}"
land.delete.success = "领地已删除，返还 {0} 金币"
gui.land.create.title = "创建领地"
gui.land.create.name = "领地名称"
gui.land.manage.title = "领地管理"
gui.land.manage.land_title = "领地：{0} 管理"
gui.land.manage.land_info = "起始坐标：{0}\n结束坐标：{1}"
gui.land.manage.add_whitelist = "添加白名单"
gui.land.manage.add_whitelist_title = "领地：{0} 添加白名单"
gui.land.manage.select_player = "选择玩家"
gui.land.manage.teleport = "传送至领地"
gui.land.manage.set_welcome = "设置欢迎语"
gui.land.manage.set_welcome_title = "领地：{0} 设置欢迎语"
gui.land.manage.welcome_message = "欢迎语"
gui.land.manage.set_leave = "设置离开语"
gui.land.manage.set_leave_title = "领地：{0} 设置离开语"
gui.land.manage.leave_message = "离开语"
gui.land.manage.rename = "重命名领地"
gui.land.manage.rename_title = "领地：{0} 重命名"
gui.land.manage.new_name = "新的名称"
gui.land.manage.transfer = "转让领地"
gui.land.manage.transfer_title = "领地：{0} 转让"
gui.land.manage.transfer_to = "转让给"
gui.land.manage.delete = "删除领地"
gui.land.manage.delete_title = "领地：{0} 删除"
gui.land.manage.delete_confirm = "删除后将得将返还金币 {0}，确定要删除该领地吗？"
`
)
autoCreate(`${GUI_PATH}/newer.json`, '')
