import { GUI_PATH, Config } from '../../constants';
import Component from '../../utils/component';

type MagicExpr = string;
type MagicExprAction = string;
type ModalCallback = (pl: Player) => void;
type SimpleCallback = (pl: Player, id: []) => void;
type CustomCallback = (pl: Player, ...data: any[]) => void;

interface GuiModalData {
  advanced?: boolean;
  type: 'modal';
  title: string;
  content: string;
  confirmButton?: string;
  cancelButton?: string;
  confirmAction: MagicExprAction | ModalCallback;
  cancelAction?: MagicExprAction | ModalCallback;
}

interface GuiSimpleData {
  type?: 'simple';
  title: string;
  content?: string;
  buttons?: Array<{
    text: string;
    action: MagicExprAction | SimpleCallback;
    icon?: string;
    onlyOp?: boolean;
  }>;
}

interface GuiCustomData {
  type: 'custom';
  title: string;
  elements: Array<
    | { type: 'label'; text: string | MagicExpr }
    | { type: 'input'; title: string; placeholder?: string | MagicExpr; default?: string | MagicExpr }
    | { type: 'switch'; title: string; default?: boolean | MagicExpr }
    | { type: 'dropdown'; title: string; items: Array<string> | MagicExpr; default?: number | MagicExpr }
    | {
        type: 'slider';
        title: string;
        min: number | MagicExpr;
        max: number | MagicExpr;
        step?: number | MagicExpr;
        default?: number | MagicExpr;
      }
    | { type: 'stepSlider'; title: string; items: Array<string> | MagicExpr; default?: number | MagicExpr }
  >;
  action: MagicExprAction | CustomCallback;
  onlyOp?: boolean;
}

type GuiData = GuiModalData | GuiSimpleData | GuiCustomData;

// mc.listen('onUseItemOn', (pl, item) => {
//   if (item.type !== 'minecraft:clock') return;
//   if (playerUseClockCache.has(pl.xuid)) return;
//   playerUseClockCache.add(pl.xuid);
//   setTimeout(() => playerUseClockCache.delete(pl.xuid), 500);
//   send(pl);
// });

// private playerUseClockCache: Set<string> = new Set();

export default class Gui extends Component<Config['gui']> {
  public static sendModal(
    pl: Player,
    title: string,
    content: string,
    confirmAction: ModalCallback,
    cancelAction?: ModalCallback,
    confirmButton?: string,
    cancelButton?: string
  ) {
    Gui.send(pl, {
      type: 'modal',
      advanced: true,
      title,
      content,
      confirmAction,
      cancelAction,
      confirmButton: confirmButton ?? '§a确认',
      cancelButton: cancelButton ?? '§c取消'
    });
  }

  public static hanldeMagicExpression<T>(
    pl: Player,
    expr: T | ModalCallback | SimpleCallback | CustomCallback,
    data: (string | number)[] = [],
    isAction: boolean = false
  ) {
    if (!expr) return;
    if (typeof expr === 'function') {
      (expr as CustomCallback)(pl, ...data);
      return null;
    }
    if (typeof expr !== 'string') return expr;

    const prefix = expr.charAt(0);
    let content = expr.slice(1);

    data.forEach((d, index) => {
      content = content.replace(new RegExp(`\{${index}\}`, 'g'), d.toString());
    });

    if (isAction) {
      switch (prefix) {
        case '/':
          return pl.runcmd(content);
        case '~':
          return mc.runcmd(content);
        case '#':
          return pl.tell(content);
        default:
          if (['@', '$'].includes(prefix)) break;
          return pl.runcmd(`gui open "${expr}"`);
      }

      switch (prefix) {
        case '@':
          if (content === 'players') return mc.getOnlinePlayers().map((p) => p.realName);
          return logger.error(`unknown magic expression shortcut: ${prefix}`);
        case '$':
          try {
            return ll.eval(content);
          } catch (e) {
            return logger.error(`magic expression eval error: ${(e as Error).message}`);
          }
        default:
          return `${prefix}${content}`;
      }
    }
  }

  public static send(pl: Player, guiData: GuiData) {
    const handle = <T>(par: T) => (par === undefined ? undefined : this.hanldeMagicExpression(pl, par));

    const { title, type } = guiData;

    if (type === 'modal') {
      const { advanced, content, confirmButton, cancelButton, confirmAction, cancelAction } = guiData;
      if (advanced) {
        const form = mc
          .newSimpleForm()
          .setTitle(title)
          .setContent(content)
          .addButton(confirmButton ?? '确认')
          .addButton(cancelButton ?? '取消');
        pl.sendForm(form, (pl, id) => this.hanldeMagicExpression(pl, id === 0 ? confirmAction : cancelAction));
        return;
      }
      pl.sendModalForm(title, content, confirmButton ?? '确认', cancelButton ?? '取消', (pl, result) => {
        if (result) this.hanldeMagicExpression(pl, confirmAction);
        else if (cancelAction) this.hanldeMagicExpression(pl, cancelAction);
      });
      return;
    }

    if (type === 'custom') {
      if (guiData.onlyOp && !pl.isOP()) return pl.tell('§c你没有权限使用该 GUI§r');
      let value: string[];
      const els: { type: GuiCustomData['elements'][number]['type']; value?: string[] }[] = [];
      const { elements, action } = guiData;
      const form = mc.newCustomForm();
      elements.forEach((el) => {
        switch (el.type) {
          case 'label':
            form.addLabel(handle(el.text));
            els.push({ type: 'label' });
            break;
          case 'input':
            form.addInput(el.title, handle(el.placeholder), handle(el.default));
            els.push({ type: 'input' });
            break;
          case 'switch':
            form.addSwitch(title, handle(el.default));
            els.push({ type: 'switch' });
            break;
          case 'dropdown':
            value = Array.isArray(el.items) ? el.items : handle(el.items);
            form.addDropdown(title, value, handle(el.default));
            els.push({ type: 'dropdown', value });
            break;
          case 'slider':
            form.addSlider(title, handle(el.min), handle(el.max), handle(el.step), handle(el.default));
            els.push({ type: 'slider' });
            break;
          case 'stepSlider':
            value = Array.isArray(el.items) ? el.items : handle(el.items);
            form.addStepSlider(title, value, handle(el.default));
            break;
          default:
            logger.error(`unknown custom gui element type ${type}`);
            break;
        }
      });
      pl.sendForm(form, (pl, data) => {
        if (!action) return;
        if (!data) return;
        this.hanldeMagicExpression(
          pl,
          action,
          data.map(({ type, value }) =>
            ['dropdown', 'stepSlider'].includes(type) ? handle(value) : type === 'input' ? value : value
          )
        );
      });
      return;
    }

    const { content, buttons } = guiData;

    const form = mc.newSimpleForm().setTitle(title);
    if (content) form.setContent(content);
    const btn = buttons?.filter(({ onlyOp }) => !onlyOp || pl.isOP()) ?? [];

    btn.forEach(({ text, icon }) => form.addButton(text, icon ?? ''));
    pl.sendForm(form, (pl, id) => {
      if (typeof id !== 'number') return;
      const { action } = btn[id];
      if (!action) return;
      this.hanldeMagicExpression(pl, action, [id]);
    });
  }

  public register() {
    this.getAll();
    this.gui();
    if (this.config.menuCmdEnabled) this.menu();
  }

  private list: Map<string, GuiData> = new Map();

  private getAll(path: string = GUI_PATH) {
    File.getFilesList(path).forEach((filename) => {
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
        ((file.type === 'simple' || !file.type) &&
          (!Array.isArray(file.buttons) ||
            file.buttons.filter((btn) => typeof btn.action !== 'string' || !btn.text).length > 0)) ||
        (file.type === 'custom' && (typeof file.action !== 'string' || !Array.isArray(file.elements))) ||
        (file.type === 'modal' && (typeof file.confirmAction !== 'string' || !file.confirmButton || !file.cancelButton))
      ) {
        logger.error(`Gui file format invalid at ${dir}`);
        return;
      }

      if (file.type === 'simple' || !file.type) {
        const invalidBtn = file.buttons?.filter(
          (btn) =>
            typeof btn.action === 'string' &&
            !['/', '~', '#', '@', '$'].includes(btn.action.charAt(0)) &&
            !File.exists(`${GUI_PATH}/${btn.action}.json`)
        );
        if (invalidBtn && invalidBtn.length > 0) {
          invalidBtn.forEach((btn) => logger.error(`cannot find action "${btn.action}" gui file at ${dir}`));
          return;
        }
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
    Gui.send(pl, guiData);
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
