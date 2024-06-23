const playerDieCache: Map<string, Player['pos']> = new Map();

function sendNotice(pl: Player) {
  pl.sendModalForm('公告', '这里是公告内容', '§a确认§r', '§c取消§r', (pl, result) => {
    if (result) {
      /* TODO: 处理确认，更新玩家已读数据 */
    }
  });
}

mc.listen('onJoin', (pl) => {
  /* TODO: 判断玩家是否已读公告 */
  sendNotice(pl);
});

mc.listen('onPlayerDie', (pl) => playerDieCache.set(pl.xuid, pl.pos));

const backCmd = mc.newCommand('back', '回到上次死亡点', PermType.Any);
backCmd.overload([]);
backCmd.setCallback((_, { player: pl }, out) => {
  if (!pl) return;
  const pos = playerDieCache.get(pl.xuid);
  if (!pos) {
    out.error('未能找到上次死亡点');
    return;
  }
  pl.teleport(pos);
  out.success('已传送至上次死亡点');
});
backCmd.setup();

const suicideCmd = mc.newCommand('suicide', '杀死自己', PermType.Any);
suicideCmd.overload([]);
suicideCmd.setCallback((_, { player: pl }) => pl && pl.kill());
suicideCmd.setup();

const msguiCmd = mc.newCommand('msgui', '打开私聊界面', PermType.Any);
msguiCmd.overload([]);
msguiCmd.setCallback((_, { player: pl }) => {
  if (!pl) return;
  const playersList = mc.getOnlinePlayers().map((pl) => pl.realName);
  const form = mc.newCustomForm().setTitle('私聊').addDropdown('选择玩家', playersList, 0).addInput('发送内容');
  pl.sendForm(form, (_, data) => data && pl.runcmd(`msg "${playersList[data[0]]}" "${data[1]}`));
});
msguiCmd.setup();

const clockCmd = mc.newCommand('clock', '获取钟表', PermType.Any);
clockCmd.overload([]);
clockCmd.setCallback((_, { player: pl }) => {
  if (!pl) return;
  mc.runcmdEx(`clear "${pl.realName}" clock 0 1`);
  mc.runcmdEx(`give "${pl.realName}" clock 1`);
});
clockCmd.setup();

const noticeCmd = mc.newCommand('notice', '查看公告', PermType.Any);
noticeCmd.overload([]);
noticeCmd.setCallback((_, { player: pl }) => pl && sendNotice(pl));
noticeCmd.setup();
