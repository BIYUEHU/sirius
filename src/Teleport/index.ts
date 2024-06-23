const transferCmd = mc.newCommand('transfer', '跨服传送', PermType.GameMasters);
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
transferCmd.setup();

const config = {
  rangeX: [-100000, 100000],
  rangeZ: [-100000, 100000],
  posY: 120
};

const tprCmd = mc.newCommand('tpr', '随机传送', PermType.Any);
tprCmd.overload([]);
tprCmd.setCallback((_, { player: pl }, out) => {
  if (!pl) return;
  if (pl.pos.dimid !== 0) {
    out.error('你必须在主世界才能使用该命令');
    return;
  }
  const position = mc.newIntPos(
    Math.floor(Math.random() * (config.rangeX[1] - config.rangeX[0] + 1) + config.rangeX[0]),
    config.posY,
    Math.floor(Math.random() * (config.rangeZ[1] - config.rangeZ[0] + 1) + config.rangeZ[0]),
    0
  );
  pl.teleport(position);
  mc.runcmdEx(`effect "${pl.realName}" slow_falling 10  `);
  out.success(`随机传送至 ${position.toString()}`);
});
tprCmd.setup();
