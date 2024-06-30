import { Config, DATA } from '../../constants';
import Component from '../../utils/component';
import { ObjToPos, PosToObj } from '../../utils/position';
import Gui from '../Gui/index';

export default class Teleport extends Component<Config['teleport']> {
  public register() {
    if (this.config.transferCmdEnabled) this.transfer();
    if (this.config.tprCmdEnabled) this.tpr();
    if (this.config.tpaCmdEnabled) this.tpa();
    if (this.config.homeCmdEnabled) this.home();
    if (this.config.warpCmdEnabled) this.warp();
  }

  private readonly tpaTargetsRunning: Map<string, [string, () => void]> = new Map();

  private transfer() {
    const transferCmd = this.cmd('transfer', '跨服传送', PermType.GameMasters);
    transferCmd.mandatory('player', ParamType.Player);
    transferCmd.mandatory('ip', ParamType.String);
    transferCmd.optional('port', ParamType.Int);
    transferCmd.overload(['player', 'ip', 'port']);
    transferCmd.setCallback((_, __, out, { ip, port, player }) => {
      out.addMessage(`传送目标到服务器 ${ip} : ${port}`);
      player.forEach((pl: Player) => pl.transServer(ip, port ?? 19132));
    });
  }

  private tpr() {
    const tprCmd = this.cmd('tpr', '随机传送', PermType.Any);
    tprCmd.overload([]);
    tprCmd.setCallback((_, { player: pl }, out) => {
      if (!pl) return;
      if (pl.pos.dimid !== 0) {
        out.error('你必须在主世界才能使用该命令');
        return;
      }

      const init = this.config.tprMaxDistance - this.config.tprMinDistance + 1 + this.config.tprMinDistance;
      const position = mc.newIntPos(
        Math.floor(Math.random() * init),
        this.config.tprSafeHeight,
        Math.floor(Math.random() * init),
        0
      );
      pl.teleport(position);
      pl.addEffect(27, 10, 1, false);
      out.success(`随机传送至 ${position.toString()}`);
    });
  }

  private getTpaRunningBySender(target: Player) {
    let callback: undefined | (() => void);
    this.tpaTargetsRunning.forEach((value) => {
      if (callback) return;
      if (value[0] === target.xuid) callback = value[1];
    });
    return callback;
  }

  private removeTpaRunningBySender(pl: Player) {
    this.tpaTargetsRunning.forEach((value, key) => {
      if (value[0] === pl.xuid) this.tpaTargetsRunning.delete(key);
    });
  }

  private tpa() {
    const tpaCmd = this.cmd('tpa', '传送请求', PermType.Any);
    tpaCmd.setEnum('RequestAction', ['to', 'here']);
    tpaCmd.setEnum('ResponseAction', ['ac', 'de', 'cancel', 'toggle', 'gui_toggle', 'gui']);
    tpaCmd.mandatory('action', ParamType.Enum, 'RequestAction', 1);
    tpaCmd.mandatory('action', ParamType.Enum, 'ResponseAction', 1);
    tpaCmd.mandatory('player', ParamType.Player);
    tpaCmd.overload(['RequestAction', 'player']);
    tpaCmd.overload(['ResponseAction']);

    tpaCmd.setCallback((_, { player: pl }, out, result) => {
      const sendTpaModal = (message: string, command: string) =>
        result.player.forEach((targetPl: Player) =>
          Gui.sendModal(
            targetPl,
            '传送请求',
            message,
            (targetPl) => {
              targetPl.runcmd(command);
              out.success(`请求已被接受`);
            },
            () => out.error(`请求已被拒绝`),
            '接受',
            '拒绝'
          )
        );

      if (!pl) return;

      const enableList = DATA.get('tpasEnableList');

      // Gui
      if (result.action === 'gui') {
        return Gui.send(pl, {
          type: 'custom',
          title: '传送请求',
          elements: [
            { type: 'dropdown', title: '传送模式', items: ['to', 'here'] },
            { type: 'dropdown', title: '目标玩家', items: '@players' }
          ],
          action: `tpa {0} "{1}"`
        });
      }

      if (result.action === 'gui_toggle') {
        return Gui.send(pl, {
          type: 'custom',
          title: '传送设置',
          elements: [{ type: 'switch', title: '屏蔽传送请求', default: enableList.includes(pl.xuid) }],
          action: (pl, enabled) => {
            if (enabled === enableList.includes(pl.xuid)) pl.runcmd('tpa toggle');
            pl.runcmd('tpa toggle');
          }
        });
      }

      // As sender
      if (['to', 'here', 'cancel'].includes(result.action)) {
        const hasRunning = this.getTpaRunningBySender(pl);

        if (result.action === 'cancel') {
          if (!hasRunning) return out.error('当前没有正在进行的传送请求');
          this.removeTpaRunningBySender(pl);
          return out.success(`取消了传送请求`);
        }

        if (hasRunning) return out.error('当前已有正在进行的传送请求');
        if (result.includes(result.player.xuid)) return out.error('目标玩家已屏蔽传送请求');

        // Auto clear expired tpa
        setTimeout(() => this.tpaTargetsRunning.delete(result.player.xuid), this.config.tpaExpireTime * 1000);

        if (result.action === 'to') {
          // add more methods next line
          this.tpaTargetsRunning.set(result.player.xuid, [pl.xuid, () => pl.teleport(result.player.pos)]);
          sendTpaModal(`玩家 ${pl.realName} 请求传送到你当前位置`, 'tpa ac');
          return out.success(`已向玩家 ${pl.realName} 发送到对方的传送请求`);
        }

        this.tpaTargetsRunning.set(result.player.xuid, [pl.xuid, () => result.player.teleport(pl.pos)]);
        sendTpaModal(`玩家 ${pl.realName} 请求你传送到对方当前位置`, 'tpa ac');
        return out.success(`已向玩家 ${pl.realName} 发送到对方的传送请求`);
      }

      // As receiver
      if (['ac', 'de'].includes(result.action)) {
        if (!this.tpaTargetsRunning.has(pl.xuid)) return out.error('当前没有正在进行的传送请求');
        this.tpaTargetsRunning.delete(pl.xuid);
        if (result.action === 'ac') {
          this.tpaTargetsRunning.get(pl.xuid)![1]();
          return out.success(`接受了 ${result.player.realName} 的传送请求`);
        }
        return out.success(`拒绝了 ${result.player.realName} 的传送请求`);
      }

      if (enableList.includes(pl.xuid)) {
        DATA.set(
          'tpasEnableList',
          enableList.filter((x) => x !== pl.xuid)
        );
        return out.error('已取消屏蔽传送请求');
      }

      DATA.set('tpasEnableList', [...enableList, pl.xuid]);
      return out.success('已屏蔽传送请求');
    });

    // Auto clear on players leaving
    mc.listen('onLeft', (pl) => {
      this.removeTpaRunningBySender(pl);
      this.tpaTargetsRunning.delete(pl.xuid);
    });
  }

  private home() {
    const homeCmd = this.cmd('home', '个人传送点', PermType.Any);
    homeCmd.setEnum('GuiAction', ['ls', 'gui_add', 'gui_del']);
    homeCmd.setEnum('OptionAction', ['add', 'del', 'go']);
    homeCmd.mandatory('action', ParamType.Enum, 'RequestAction', 1);
    homeCmd.mandatory('action', ParamType.Enum, 'ResponseAction', 1);
    homeCmd.mandatory('home', ParamType.String);
    homeCmd.overload(['OptionAction', 'home']);
    homeCmd.overload(['GuiAction']);
    homeCmd.setCallback((_, { player: pl }, out, result) => {
      if (!pl) return;

      const allHomes = DATA.get('homes');
      if (pl.xuid in allHomes) allHomes[pl.xuid] = {};
      const homes = allHomes[pl.xuid];

      // Gui
      if (['gui_del', 'ls']) {
        if (result.action === 'ls') {
          if (Object.keys(homes).length === 0) return out.error('当前没有设置任何传送点');
          return Gui.send(pl, {
            title: '个人传送点',
            buttons: Object.keys(homes).map((text) => ({ text, action: `home go "${text}"` }))
          });
        }

        return Gui.send(pl, {
          title: '删除个人传送点',
          content: '选择要删除的传送点',
          buttons: Object.keys(homes).map((text) => ({ text, action: `home del "${text}"` }))
        });
      }

      if (result.action === 'gui_add') {
        return Gui.send(pl, {
          type: 'custom',
          title: '添加个人传送点',
          elements: [{ type: 'input', title: '名称' }],
          action: `home add "{0}"`
        });
      }

      // Operation
      if (result.action === 'go') {
        if (!homes[result.home]) return out.error(`个人传送点 ${result.home} 不存在`);
        return pl.teleport(ObjToPos(homes[result.home]));
      }

      if (result.action === 'add') {
        if (result.home in homes) return out.error(`个人传送点 ${result.home} 已存在`);
        if (Object.keys(homes).length >= this.config.homeMaxCount) return out.error('个人传送点数量已达上限');
        homes[result.home] = PosToObj(pl.pos);
        return out.success(`已添加个人传送点 ${result.home}`);
      }

      if (!homes[result.home]) return out.error(`个人传送点 ${result.home} 不存在`);
      delete homes[result.home];
      return out.success(`已删除个人传送点 ${result.home}`);
    });
  }

  private warp() {
    const warpCmd = this.cmd('warp', '公共传送点', PermType.Any);
    warpCmd.setEnum('GuiAction', ['ls', 'gui_add', 'gui_del']);
    warpCmd.setEnum('OptionAction', ['add', 'del', 'go']);
    warpCmd.mandatory('action', ParamType.Enum, 'RequestAction', 1);
    warpCmd.mandatory('action', ParamType.Enum, 'ResponseAction', 1);
    warpCmd.mandatory('warp', ParamType.String);
    warpCmd.overload(['OptionAction', 'warp']);
    warpCmd.overload(['GuiAction']);
    warpCmd.setCallback((_, { player: pl }, out, result) => {
      if (!pl) return;

      const warps = DATA.get('warps');

      // Gui
      if (['gui_del', 'ls']) {
        if (result.action === 'ls') {
          if (Object.keys(warps).length === 0) return out.error('当前没有设置任何传送点');
          return Gui.send(pl, {
            title: '公共传送点',
            buttons: Object.keys(warps).map((text) => ({ text, action: `warp go "${text}"` }))
          });
        }

        return Gui.send(pl, {
          title: '删除公共传送点',
          content: '选择要删除的传送点',
          onlyOp: true,
          buttons: Object.keys(warps).map((text) => ({ text, action: `warp del "${text}"` }))
        });
      }

      if (result.action === 'gui_add') {
        return Gui.send(pl, {
          type: 'custom',
          title: '添加公共传送点',
          onlyOp: true,
          elements: [{ type: 'input', title: '名称' }],
          action: `warp add "{0}"`
        });
      }

      // Operation
      if (result.action === 'go') {
        if (!warps[result.warp]) return out.error(`公共传送点 ${result.warp} 不存在`);
        return pl.teleport(ObjToPos(warps[result.warp]));
      }

      if (!pl.isOP()) return out.error('你没有权限执行该命令');

      if (result.action === 'add') {
        if (result.warp in warps) return out.error(`公共传送点 ${result.warp} 已存在`);
        warps[result.warp] = PosToObj(pl.pos);
        return out.success(`已添加公共传送点 ${result.warp}`);
      }

      if (!warps[result.warp]) return out.error(`公共传送点 ${result.warp} 不存在`);
      delete warps[result.warp];
      return out.success(`已删除公共传送点 ${result.warp}`);
    });
  }
}
