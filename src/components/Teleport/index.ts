import { Config } from '../../constants';
import Component from '../../utils/component';

export default class Teleport extends Component<Config['teleport']> {
  public register() {
    if (this.config.transferCmdEnabled) this.transfer();
    if (this.config.tprCmdEnabled) this.tpr();
    // if (this.config.tpaCmdEnabled) this.tpa();
  }

  private transfer() {
    const transferCmd = this.cmd('transfer', '跨服传送', PermType.GameMasters);
    transferCmd.mandatory('target', ParamType.Player);
    transferCmd.mandatory('ip', ParamType.String);
    transferCmd.optional('port', ParamType.Int);
    transferCmd.overload(['target', 'ip', 'port']);
    transferCmd.setCallback((_, { player: pl }, out, result) => {
      if (!pl) return;
      out.addMessage(`传送目标到服务器 ${result.ip} : ${result.port}`);
      logger.info(result);
      pl.transServer(result.ip, result.port ?? 19132);
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
      mc.runcmdEx(`effect "${pl.realName}" slow_falling 10  `);
      out.success(`随机传送至 ${position.toString()}`);
    });
  }
}
