import { GUI_PATH } from '../constants';

interface GuiData {
  title: string;
  content?: string;
  /** @property {boolean} back - Whether to show a back button at the bottom of the form default true */
  buttons?: Array<{
    text: string;
    action: string;
    icon?: string;
    onlyOp?: boolean;
    byConsole?: boolean;
  }>;
}

let GUI_DATA = getAllGuiFiles();

function getAllGuiFiles(path: string = GUI_PATH) {
  const list: Map<string, GuiData> = new Map();
  File.getFilesList(path).forEach((filename) => {
    const dir = `${path}/${filename}`;
    if (File.checkIsDir(dir)) {
      getAllGuiFiles(dir).forEach((val, key) => list.set(key, val));
      return;
    }

    const file: GuiData | null = data.parseJson(File.readFrom(dir) ?? '');
    if (!file) {
      logger.error(`Gui file json parse error at ${dir}`);
      return;
    }

    if (
      !file.title ||
      !Array.isArray(file.buttons) ||
      file.buttons.filter((btn) => typeof btn.action !== 'string' || !btn.text).length > 0
    ) {
      logger.error(`Gui file format invalid at ${dir}`);
      return;
    }

    const invalidBtn = file.buttons?.filter(
      (btn) => btn.action && !btn.action.startsWith('/') && !File.exists(`${GUI_PATH}/${btn.action}.json`)
    );
    if (invalidBtn && invalidBtn.length > 0) {
      invalidBtn.forEach((btn) => logger.error(`cannot find action "${btn.action}" gui file at ${dir}`));
      return;
    }

    list.set(dir.replace(/(.*)\/gui\/(.*)\.json/, '$2'), file);
  });
  return list;
}

function sendFormGuiData(pl: Player, formName: string = 'index') {
  const guiData = formName ? GUI_DATA.get(formName) : undefined;
  if (!guiData) {
    if (formName) logger.error(`cannot find gui data file for ${formName}`);
    return false;
  }

  const { title, content, buttons } = guiData;
  const form = mc.newSimpleForm().setTitle(title);
  if (content) form.setContent(content);
  const btn = buttons?.filter(({ onlyOp }) => !onlyOp || pl.isOP()) ?? [];

  btn.forEach(({ text, icon }) => form.addButton(text, icon ?? ''));
  pl.sendForm(form, (pl, id) => {
    if (typeof id !== 'number') return;
    const { action, byConsole } = btn[id];
    if (!action) return;
    if (action.startsWith('/')) {
      (byConsole ? mc : pl).runcmd(action.slice(1));
      return;
    }
    sendFormGuiData(pl, action);
  });
  return true;
}

const menuCmd = mc.newCommand('menu', '打开 GUI 菜单', PermType.Any);
menuCmd.setAlias('cd');
menuCmd.overload([]);
menuCmd.setCallback((_, { player: pl }) => pl && sendFormGuiData(pl));
menuCmd.setup();

const guiCmd = mc.newCommand('gui', '打开指定 GUI 或重装 GUI 数据', PermType.GameMasters);
guiCmd.setEnum('ReloadAction', ['reload']);
guiCmd.setEnum('OpenAction', ['open']);
guiCmd.mandatory('action', ParamType.Enum, 'ReloadAction', 1);
guiCmd.mandatory('action', ParamType.Enum, 'OpenAction', 1);
guiCmd.mandatory('name', ParamType.String);
guiCmd.overload(['ReloadAction']);
guiCmd.overload(['OpenAction', 'name']);
guiCmd.setCallback((_, { player: pl }, out, result) => {
  if (result.action === 'reload') {
    GUI_DATA = getAllGuiFiles();
    out.success('GUI 数据已重新加载');
    return;
  }
  if (!pl) return;
  if (!sendFormGuiData(pl, result.name)) out.error('找不到指定 GUI 数据文件');
});
guiCmd.setup();

const playerUseClockCache: Set<string> = new Set();

mc.listen('onUseItemOn', (pl, item) => {
  if (item.type !== 'minecraft:clock') return;
  if (playerUseClockCache.has(pl.xuid)) return;
  playerUseClockCache.add(pl.xuid);
  setTimeout(() => playerUseClockCache.delete(pl.xuid), 500);
  sendFormGuiData(pl);
});
