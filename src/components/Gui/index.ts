import { GUI_PATH, Config } from '../../constants';
import Component from '../../utils/component';

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

// mc.listen('onUseItemOn', (pl, item) => {
//   if (item.type !== 'minecraft:clock') return;
//   if (playerUseClockCache.has(pl.xuid)) return;
//   playerUseClockCache.add(pl.xuid);
//   setTimeout(() => playerUseClockCache.delete(pl.xuid), 500);
//   send(pl);
// });

// private playerUseClockCache: Set<string> = new Set();

export default class Gui extends Component<Config['gui']> {
  public register() {
    this.getAll();
    this.gui();
    if (this.config.menuCmdEnabled) this.menu();
  }

  private list: Map<string, GuiData> = new Map();

  private getAll(path: string = GUI_PATH) {
    const getFiles = File.getFilesList(path).forEach((filename) => {
      const dir = `${path}/${filename}`;
      if (File.checkIsDir(dir)) {
        this.getAll(dir);
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

      this.list.set(dir.replace(/(.*)\/gui\/(.*)\.json/, '$2'), file);
    });
  }

  private send(pl: Player, formName: string = 'index') {
    const guiData = formName ? this.list.get(formName) : undefined;
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
      this.send(pl, action);
    });
    return true;
  }

  private gui() {
    const guiCmd = this.cmd('gui', '打开指定 GUI 或重装 GUI 数据', PermType.GameMasters);
    guiCmd.setEnum('ReloadAction', ['reload']);
    guiCmd.setEnum('OpenAction', ['open']);
    guiCmd.mandatory('action', ParamType.Enum, 'ReloadAction', 1);
    guiCmd.mandatory('action', ParamType.Enum, 'OpenAction', 1);
    guiCmd.mandatory('name', ParamType.String);
    guiCmd.overload(['ReloadAction']);
    guiCmd.overload(['OpenAction', 'name']);
    guiCmd.setCallback((_, { player: pl }, out, result) => {
      if (result.action === 'reload') {
        this.list.forEach((_, key) => this.list.delete(key));
        this.getAll();
        out.success('GUI 数据已重新加载');
        return;
      }
      if (!pl) return;
      if (!this.send(pl, result.name)) out.error('找不到指定 GUI 数据文件');
    });
  }

  private menu() {
    const menuCmd = this.cmd('menu', '打开 GUI 菜单', PermType.Any);
    if (this.config.menuCmdAlias) menuCmd.setAlias(this.config.menuCmdAlias);
    menuCmd.overload([]);
    menuCmd.setCallback((_, { player: pl }) => pl && this.send(pl));
  }
}
