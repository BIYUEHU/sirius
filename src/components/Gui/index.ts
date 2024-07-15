import { GUI_PATH, type Config } from '../../constants/constants'
import Component from '../../utils/component'
import t from '../../utils/t'

type MagicExpr = string
type MagicExprAction = string
type ModalCallback = (pl: Player) => void
type SimpleCallback = (pl: Player, id: []) => void
// biome-ignore lint:
type CustomCallback = (pl: Player, ...data: any[]) => void

interface GuiModalData {
  advanced?: boolean
  type: 'modal'
  title: string
  content: string
  confirmButton?: string
  cancelButton?: string
  confirmAction: MagicExprAction | ModalCallback
  cancelAction?: MagicExprAction | ModalCallback
}

interface GuiSimpleData {
  type?: 'simple'
  title: string
  content?: string
  buttons?: Array<{
    text: string
    action: MagicExprAction | SimpleCallback
    icon?: string
    onlyOp?: boolean
  }>
}

interface GuiCustomData {
  type: 'custom'
  title: string
  elements: Array<
    | { type: 'label'; text: string | MagicExpr }
    | { type: 'input'; title: string; placeholder?: string | MagicExpr; default?: string | MagicExpr }
    | { type: 'switch'; title: string; default?: boolean | MagicExpr }
    | { type: 'dropdown'; title: string; items: Array<string> | MagicExpr; default?: number | MagicExpr }
    | {
        type: 'slider'
        title: string
        min: number | MagicExpr
        max: number | MagicExpr
        step?: number | MagicExpr
        default?: number | MagicExpr
      }
    | { type: 'stepSlider'; title: string; items: Array<string> | MagicExpr; default?: number | MagicExpr }
  >
  action: MagicExprAction | CustomCallback
  onlyOp?: boolean
}

type GuiData = GuiModalData | GuiSimpleData | GuiCustomData

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
      confirmButton: confirmButton ?? t`gui.confirm`,
      cancelButton: cancelButton ?? t`gui.cancel`
    })
  }

  public static handleMagicExpression<T>(
    pl: Player,
    expr: T | ModalCallback | SimpleCallback | CustomCallback,
    data: (string | number)[] = []
  ) {
    if (expr === undefined) return
    if (typeof expr === 'function') {
      ;(expr as CustomCallback)(pl, ...data)
      return null
    }
    if (typeof expr !== 'string') return expr

    const prefix = expr.charAt(0)
    let content = expr.slice(1)

    data.forEach((d, index) => {
      content = content.replace(new RegExp(`\\{${index}\\}`, 'g'), String(d))
    })

    switch (prefix) {
      case '/':
        return pl.runcmd(content)
      case '~':
        return mc.runcmd(content)
      case '#':
        return pl.tell(content)
      case '@':
        if (content === 'players') return mc.getOnlinePlayers().map((p) => p.realName)
        return logger.error(`unknown magic expression shortcut: ${prefix}`)
      case '$':
        try {
          return ll.eval(content)
        } catch (e) {
          return logger.error(`magic expression eval error: ${(e as Error).message}`)
        }
      case '`':
        // biome-ignore lint:
        if (Gui.list.has(content)) return Gui.send(pl, Gui.list.get(content)!)
        return logger.error(`cannot find gui data for "${content}"`)
      default:
        return expr
    }
  }

  public static send(pl: Player, guiData: GuiData) {
    // biome-ignore lint:
    const handle = <T, A extends any[]>(par: T, data?: A) => this.handleMagicExpression(pl, par, data)

    const { title, type } = guiData

    if (type === 'modal') {
      const { advanced, content, confirmButton, cancelButton, confirmAction, cancelAction } = guiData
      if (advanced) {
        const form = mc
          .newSimpleForm()
          .setTitle(title)
          .setContent(content)
          .addButton(confirmButton ?? t`gui.normal_confirm`)
          .addButton(cancelButton ?? t`gui.normal_cancel`)
        pl.sendForm(form, (_, id) => handle(id === 0 ? confirmAction : cancelAction))
        return
      }
      pl.sendModalForm(
        title,
        content,
        confirmButton ?? t`gui.normal_confirm`,
        cancelButton ?? t`gui.normal_cancel`,
        (pl, result) => {
          if (result) handle(confirmAction)
          else if (cancelAction) handle(cancelAction)
        }
      )
      return
    }

    if (type === 'custom') {
      if (guiData.onlyOp && !pl.isOP()) return pl.tell(t`gui.not_op`)
      let value: string[]
      const els: string[][] = []
      const { elements, action } = guiData
      const form = mc.newCustomForm()
      form.setTitle(title)
      for (const el of elements) {
        switch (el.type) {
          case 'label':
            form.addLabel(handle(el.text))
            els.push([])
            break
          case 'input':
            form.addInput(
              el.title,
              el.placeholder !== undefined ? handle(el.placeholder) : '',
              el.default !== undefined ? handle(el.default) : ''
            )
            els.push([])
            break
          case 'switch':
            form.addSwitch(el.title, el.default !== undefined ? handle(el.default) : false)
            els.push([])
            break
          case 'dropdown':
            value = Array.isArray(el.items) ? el.items : handle(el.items)
            form.addDropdown(el.title, value)
            els.push(value)
            break
          case 'slider':
            form.addSlider(
              el.title,
              handle(el.min),
              handle(el.max),
              el.step !== undefined ? handle(el.step) : 1,
              el.default !== undefined ? handle(el.default) : handle(el.min)
            )
            els.push([])
            break
          case 'stepSlider':
            value = Array.isArray(el.items) ? el.items : handle(el.items)
            form.addStepSlider(el.title, value, el.default !== undefined ? handle(el.default) : 0)
            els.push(value)
            break
          default:
            logger.error(`unknown custom gui element type ${type}`)
            break
        }
      }
      pl.sendForm(form, (pl, data) => {
        if (!action) return
        if (!data) return
        Gui.handleMagicExpression(
          pl,
          action,
          data.map((value, index) => els[index][value] ?? value)
        )
      })
      return
    }

    const { content, buttons } = guiData

    const form = mc.newSimpleForm().setTitle(title)
    if (content) form.setContent(content)
    const btn = buttons?.filter(({ onlyOp }) => !onlyOp || pl.isOP()) ?? []

    for (const { text, icon } of btn) {
      form.addButton(text, icon ?? '')
    }

    pl.sendForm(form, (_, id) => {
      if (typeof id !== 'number') return
      const { action } = btn[id]
      if (!action) return
      handle(action, [id])
    })
  }

  private static readonly list: Map<string, GuiData> = new Map()

  public static getAll(path: string = GUI_PATH) {
    const { list } = Gui
    for (const filename of File.getFilesList(path)) {
      const dir = `${path}/${filename}`
      if (File.checkIsDir(dir)) {
        Gui.getAll(dir)
        continue
      }

      const file: GuiData | null = data.parseJson(File.readFrom(dir) ?? '')
      if (!file) {
        logger.error(`Gui file json parse error at ${dir}`)
        continue
      }

      if (
        ((file.type === 'simple' || !file.type) &&
          (!Array.isArray(file.buttons) ||
            file.buttons.filter((btn) => typeof btn.action !== 'string' || !btn.text).length > 0)) ||
        (file.type === 'custom' && (typeof file.action !== 'string' || !Array.isArray(file.elements))) ||
        (file.type === 'modal' && typeof file.confirmAction !== 'string')
      ) {
        logger.error(`Gui file format invalid at ${dir}`)
        continue
      }

      if (file.type === 'simple' || !file.type) {
        if (!file.buttons) continue
        for (const btn of file.buttons) {
          if (btn.action && typeof btn.action === 'string' && btn.action.charAt(0) === '`') {
            const guiName = btn.action.slice(1)
            if (File.exists(`${GUI_PATH}/${guiName}.json`)) continue
            logger.error(`cannot find action "${btn.action}" gui file at ${dir}`)
          }
        }
      }

      list.set(dir.replace(/(.*)\/gui\/(.*)\.json/, '$2'), file)
    }
  }

  public register() {
    this.gui()
    if (this.config.menuCmdEnabled) this.menu()
  }

  private send(pl: Player, formName = 'index') {
    const guiData = formName ? Gui.list.get(formName) : undefined
    if (!guiData) {
      if (formName) logger.error(`cannot find gui data file for ${formName}`)
      return false
    }
    Gui.send(pl, guiData)
    return true
  }

  private gui() {
    const guiCmd = this.cmd('gui', t`cmd.gui.description`, PermType.GameMasters)
    guiCmd.setEnum('ReloadAction', ['reload'])
    guiCmd.setEnum('OpenAction', ['open'])
    guiCmd.mandatory('action', ParamType.Enum, 'ReloadAction', 1)
    guiCmd.mandatory('action', ParamType.Enum, 'OpenAction', 1)
    guiCmd.mandatory('name', ParamType.String)
    guiCmd.overload(['ReloadAction'])
    guiCmd.overload(['OpenAction', 'name'])
    guiCmd.setCallback((_, { player: pl }, out, result) => {
      if (result.action === 'reload') {
        Gui.list.forEach((_, key) => Gui.list.delete(key))
        Gui.getAll()
        out.success(t`cmd.gui.msg.reload`)
        return
      }
      if (!pl) return
      if (!this.send(pl, result.name)) out.error(t`cmd.gui.msg.not_found`)
    })
  }

  private menu() {
    const menuCmd = this.cmd('menu', t`cmd.menu.description`, PermType.Any)
    if (this.config.menuCmdAlias) menuCmd.setAlias(this.config.menuCmdAlias)
    menuCmd.overload([])
    menuCmd.setCallback((_, { player: pl }) => pl && this.send(pl))
  }
}

Gui.getAll()
