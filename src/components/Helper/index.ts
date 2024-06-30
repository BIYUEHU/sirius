import { Config, DATA, Data, NOTICE_FILE } from '../../constants';
import Component from '../../utils/component';
import Gui from '../Gui/index';

export default class Helper extends Component<Config['helper']> {
  private loadNotice() {
    const noticeContent = File.readFrom(NOTICE_FILE);
    if (!noticeContent) return null;
    return [noticeContent, noticeContent.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0)] as const;
  }

  private saveNotice(notice: string) {
    File.writeTo(NOTICE_FILE, notice);
  }

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
    const notice = this.loadNotice();
    if (!notice) {
      pl.tell('当前服务器未设置公告');
      return;
    }
    const [noticeContent, hash] = notice;
    Gui.sendModal(pl, '公告', noticeContent, (pl) => {
      const noticed = DATA.get('noticed');
      if (noticed.hash === hash) {
        if (noticed.list.includes(pl.xuid)) return;
        noticed.list = [...noticed.list, pl.xuid];
        return;
      }
      noticed.hash = hash;
      noticed.list = [pl.xuid];
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

    mc.listen('onPlayerDie', (pl) => {
      this.playerDieCache.set(pl.xuid, pl.pos);
      pl.tell(`你在 ${pl.pos.x} ${pl.pos.y} ${pl.pos.z} 死了，使用 /back 可返回死亡地点`);
    });
  }

  private suicide() {
    const suicideCmd = this.cmd('suicide', '自爆', PermType.Any);
    suicideCmd.overload([]);
    suicideCmd.setCallback((_, { player: pl }) => pl && pl.kill());
  }

  private msgui() {
    const msguiCmd = this.cmd('msgui', '打开私聊界面', PermType.Any);
    msguiCmd.overload([]);
    msguiCmd.setCallback(
      (_, { player: pl }) =>
        pl &&
        Gui.send(pl, {
          type: 'custom',
          title: '私聊',
          elements: [
            { type: 'dropdown', title: '选择玩家', items: '@players' },
            { type: 'input', title: '发送内容' }
          ],
          action: `msg "{0}" "${1}"`
        })
      //const playersList = mc.getOnlinePlayers().map((pl) => pl.realName);
      //const form = mc.newCustomForm().setTitle('私聊').addDropdown('选择玩家', playersList, 0).addInput('发送内容');
      //pl.sendForm(form, (_, data) => data && pl.runcmd(`msg "${playersList[data[0]]}" "${data[1]}`));
    );
  }

  private clock() {
    const clockCmd = this.cmd('clock', '获取钟表', PermType.Any);
    clockCmd.overload([]);
    clockCmd.setCallback((_, { player: pl }) => {
      if (!pl) return;
      pl.clearItem('minecraft:clock', 1);
      pl.giveItem(mc.newItem('minecraft:clock', 1)!);
    });
  }

  private notice() {
    const noticeCmd = this.cmd('notice', '查看公告', PermType.Any);
    noticeCmd.overload([]);
    noticeCmd.setCallback((_, { player: pl }) => pl && this.sendNotice(pl));

    const noticesetCmd = this.cmd('noticeset', '设置公告', PermType.GameMasters);
    noticesetCmd.mandatory('content', ParamType.String);
    noticesetCmd.overload(['content']);
    noticesetCmd.setCallback((_, { player: pl }, { success }, { content }) => {
      this.saveNotice(content);
      success('公告设置成功');
    });

    mc.listen('onJoin', (pl) => {
      const notice = this.loadNotice();
      if (!notice) return;
      if (DATA.get('noticed').hash === notice[1] && DATA.get('noticed').list.includes(pl.xuid)) return;
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
