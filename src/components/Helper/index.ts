import { Config } from '../../constants';
import Component from '../../utils/component';

export default class Helper extends Component<Config['helper']> {
  public register() {
    if (this.config.backCmdEnabled) this.back();
    if (this.config.suicideCmdEnabled) this.suicide();
    if (this.config.msguiCmdEnabled) this.msgui();
    if (this.config.clockCmdEnabled) this.clock();
    if (this.config.noticeCmdEnabled) this.notice();
    if (this.config.hereCmdEnabled) this.here();
  }

  private readonly playerDieCache: Map<string, Player['pos']> = new Map();

  private sendNotice(pl: Player) {
    pl.sendModalForm('公告', '这里是公告内容', '§a确认§r', '§c取消§r', (pl, result) => {
      if (result) {
        /* TODO: 处理确认，更新玩家已读数据 */
      }
    });
  }

  private back() {
    const backCmd = this.cmd('back', '回到上次死亡点', PermType.Any);
    backCmd.overload([]);
    backCmd.setCallback((_, { player: pl }, out) => {
      if (!pl) return;
      const pos = this.playerDieCache.get(pl.xuid);
      if (!pos) {
        out.error('未能找到上次死亡点');
        return;
      }
      pl.teleport(pos);
      out.success('已传送至上次死亡点');
    });

    mc.listen('onPlayerDie', (pl) => this.playerDieCache.set(pl.xuid, pl.pos));
  }

  private suicide() {
    const suicideCmd = this.cmd('suicide', '自爆', PermType.Any);
    suicideCmd.overload([]);
    suicideCmd.setCallback((_, { player: pl }) => pl && pl.kill());
  }

  private msgui() {
    const msguiCmd = this.cmd('msgui', '打开私聊界面', PermType.Any);
    msguiCmd.overload([]);
    msguiCmd.setCallback((_, { player: pl }) => {
      if (!pl) return;
      const playersList = mc.getOnlinePlayers().map((pl) => pl.realName);
      const form = mc.newCustomForm().setTitle('私聊').addDropdown('选择玩家', playersList, 0).addInput('发送内容');
      pl.sendForm(form, (_, data) => data && pl.runcmd(`msg "${playersList[data[0]]}" "${data[1]}`));
    });
  }

  private clock() {
    const clockCmd = this.cmd('clock', '获取钟表', PermType.Any);
    clockCmd.overload([]);
    clockCmd.setCallback((_, { player: pl }) => {
      if (!pl) return;
      mc.runcmdEx(`clear "${pl.realName}" clock 0 1`);
      mc.runcmdEx(`give "${pl.realName}" clock 1`);
    });
  }

  private notice() {
    const noticeCmd = this.cmd('notice', '查看公告', PermType.Any);
    noticeCmd.overload([]);
    noticeCmd.setCallback((_, { player: pl }) => pl && this.sendNotice(pl));

    mc.listen('onJoin', (pl) => {
      /* TODO: 判断玩家是否已读公告 */
      this.sendNotice(pl);
    });
  }

  private here() {
    const hereCmd = this.cmd('here', '发送当前坐标', PermType.Any);
    hereCmd.overload([]);
    hereCmd.setCallback(
      (_, { player: pl }) =>
        pl &&
        mc.runcmdEx(
          `tellraw "@a" {"rawtext":[{"text":"${pl.realName} 我在这里：§a${pl.pos.x} ${pl.pos.y} ${pl.pos.z}！"}]}`
        )
    );
  }
}
