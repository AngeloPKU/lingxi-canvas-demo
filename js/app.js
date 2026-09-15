/* ============ 灵犀原型 · 交互逻辑 ============ */
(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  /* ---------- 状态 ---------- */
  // session: { id, title, messages: [{role:'user',text} | {role:'ai',reply}] }
  let sessions = [];        // 用户发起的会话（在侧栏「新建」上方插入）
  let currentId = null;     // null = 首页
  let running = false;
  const openedSeeds = new Set();  // 已打开的种子会话，避免列表重复

  /* Canvas 分屏状态：tab 跟随会话保存，切会话时还原 */
  // canvasState = { tabs: [doc], activeId: docId }（挂在 session 对象上）

  /* ---------- 工具 ---------- */
  const uid = () => 'S' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function img(name, size) {
    const i = document.createElement('img');
    i.src = iconSrc(name);
    if (size) { i.width = size; i.height = size; }
    return i;
  }
  function toast(text) {
    const t = $('#toast');
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 1800);
  }
  const currentSession = () => sessions.find((s) => s.id === currentId) || null;

  /* ---------- 视图切换 ---------- */
  function showView(name) {
    $('#view-home').hidden = name !== 'home';
    $('#view-chat').hidden = name !== 'chat';
    $('#view-space').hidden = name !== 'space';
    if (name === 'chat' && currentSession()) $('#chat-title').textContent = currentSession().title;
  }

  /* ---------- 侧栏菜单渲染 ---------- */
  function renderMenu() {
    const menu = $('#menu');
    menu.innerHTML = '';

    // 第 0 组前插入「新对话区」：用户发起的会话
    MENU.forEach((group, gi) => {
      const g = el('div', 'menu-group' + (gi === 0 ? ' first' : ''));
      if (group.title) {
        const t = el('div', 'menu-group-title');
        t.appendChild(el('span', 'gt', group.title));
        if (group.add) {
          const a = el('button', 'act');
          a.appendChild(img(group.add, 12));
          a.title = '新建';
          a.onclick = () => newChat();
          t.appendChild(a);
        } else if (group.act) {
          const a = el('button', 'act');
          a.appendChild(img(group.act, 12));
          t.appendChild(a);
        }
        g.appendChild(t);
      }
      // 用户发起的会话显示在「最近」分组顶部
      if (group.dynamic && sessions.length) {
        sessions.forEach((s) => g.appendChild(sessionItem(s)));
      }
      (group.items || []).forEach((it) => {
        if (it.action === 'openSeed' && openedSeeds.has(it.seed)) return;
        g.appendChild(menuItem(it));
      });
      menu.appendChild(g);
    });
  }

  function sessionItem(s) {
    const b = el('button', 'menu-item' + (s.id === currentId ? ' active' : ''));
    b.appendChild(img('folder', 16));
    b.appendChild(el('span', 'txt', esc(s.title)));
    b.onclick = () => openSession(s.id);
    return b;
  }

  function menuItem(it) {
    const b = el('button', 'menu-item' + (it.song ? ' song' : ''));
    if (it.icon) b.appendChild(el('span', '', '').appendChild(img(it.icon, 16)).parentElement);
    b.appendChild(el('span', 'txt', esc(it.text)));
    if (it.pin) { const p = el('span', 'pin'); p.appendChild(img('pushpin', 12)); b.appendChild(p); }
    if (it.arrow) { const c = el('span', 'chev'); c.appendChild(img('arrow_right_s', 16)); b.appendChild(c); }
    b.onclick = () => {
      if (it.action === 'newChat') newChat();
      else if (it.action === 'toast') toast(it.toast);
      else if (it.action === 'openSeed') openSeed(it.seed);
    };
    return b;
  }

  /* ---------- 首页卡片 ---------- */
  function renderCards() {
    const row = $('#card-row');
    row.innerHTML = '';
    CARDS.forEach((c) => {
      const card = el('button', 'p-card');
      const head = el('div', 'p-card-head');
      head.appendChild(img(c.icon, 16));
      head.appendChild(el('span', 'p-card-title', esc(c.title)));
      card.appendChild(head);
      card.appendChild(el('div', 'p-card-desc', esc(c.desc)));
      card.onclick = () => {
        if (c.action === 'toast') { toast(c.toast); return; }
        // 项目卡片 → 以标题发起示例对话
        startWithText(c.title === '27版灵犀' ? '介绍一下 27 版灵犀的主要变化' : '介绍一下 MUSE 项目');
      };
      row.appendChild(card);
    });
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    $$('.tab').forEach((t) => {
      t.onclick = () => {
        $$('.tab').forEach((x) => x.classList.remove('active'));
        t.classList.add('active');
        if (t.dataset.tab === 'recent') toast('原型演示：最近文档列表暂未接入');
      };
    });
  }

  /* ---------- 消息渲染 ---------- */
  function scrollBottom() {
    requestAnimationFrame(() => {
      const sc = $('#chat-scroll');
      sc.scrollTop = sc.scrollHeight;
    });
  }

  function renderUser(text) {
    const me = el('div', 'me');
    me.appendChild(el('div', 'user-msg', esc(text)));
    $('#feed').appendChild(me);
    scrollBottom();
  }

  function renderAiShell() {
    const block = el('div', 'ai-block');
    const head = el('div', 'steps-head');
    head.appendChild(el('span', 'sh-text', '正在思考…'));
    const arrow = el('span', 'sh-arrow');
    arrow.appendChild(img('arrow_right_s', 16));
    head.appendChild(arrow);
    const detail = el('div', 'steps-detail');
    const answer = el('div', 'answer', '');
    const reco = el('div', 'reco', '');
    head.onclick = () => head.classList.toggle('open');
    block.append(head, detail, answer, reco);
    $('#feed').appendChild(block);
    scrollBottom();
    return { block, head, headText: head.querySelector('.sh-text'), detail, answer, reco };
  }

  function renderSteps(detail, steps) {
    detail.innerHTML = '';
    return steps.map((s) => {
      const it = el('div', 'step-item pending');
      it.appendChild(el('span', 'st-ic', '○'));
      it.appendChild(el('span', 'step-title', esc(s.title)));
      it.appendChild(el('span', 'step-status', esc(s.detail)));
      detail.appendChild(it);
      return it;
    });
  }

  function renderReco(reco, texts) {
    reco.innerHTML = '';
    texts.forEach((t) => {
      const chip = el('button', 'reco-chip');
      chip.appendChild(el('span', '', esc(t)));
      chip.appendChild(img('arrow_right_s', 16));
      chip.onclick = () => sendMessage(t);
      reco.appendChild(chip);
    });
  }

  function renderActions(block, answerText) {
    const bar = el('div', 'action-bar');
    const mk = (iconName, title) => {
      const b = el('button', 'action-btn', '');
      b.appendChild(img(iconName, 18));
      b.title = title;
      bar.appendChild(b);
      return b;
    };
    const copyBtn = mk('copy', '复制');
    copyBtn.onclick = () => {
      navigator.clipboard?.writeText(answerText);
      toast('已复制到剪贴板');
    };
    const up = mk('gesture_thumb', '有帮助');
    const down = mk('gesture_thumb_down', '无帮助');
    up.onclick = () => up.classList.toggle('on');
    down.onclick = () => down.classList.toggle('on');
    block.appendChild(bar);
  }

  /* ---------- 文档卡片（Figma「文档卡片」组件 21:3623） ---------- */
  // 三套图标按设计稿：卡片大图标 40 / tab 内小图标 16 / 文件名行格式图标 16
  const TYPE_ICONS = {
    docx: { big: 'fmt_docx_40', tab: 'doc_ap', name: 'wps_format_s' },
    pptx: { big: 'fmt_pptx_40', tab: 'doc_wpp', name: 'wpp_format_s' },
    xlsx: { big: 'fmt_xlsx_40', tab: 'sheet_two', name: 'et_format_s' },
  };
  function docCard(doc) {
    const card = el('button', 'doc-card');
    card.appendChild(img(TYPE_ICONS[doc.type].big, 40)).className = 'dc-icon';
    const info = el('div', 'dc-info');
    info.appendChild(el('div', 'dc-name', esc(doc.name)));
    info.appendChild(el('div', 'dc-type', doc.type));
    card.appendChild(info);
    card.title = '点击在右侧打开';
    card.onclick = () => openCanvasTab(doc);
    return card;
  }

  /* ---------- Canvas 分屏 ---------- */
  // 当前正在显示的文档（编辑回写、事件委托都基于它）
  let displayedDoc = null;

  function canvasState() {
    const s = currentSession();
    if (!s) return null;
    if (!s.canvas) s.canvas = { tabs: [], activeId: null };
    return s.canvas;
  }

  function openCanvasTab(doc) {
    const st = canvasState();
    if (!st) return;
    // 草稿期跨文件打开：先确认
    if (selById.size && st.activeId && st.activeId !== doc.id) {
      askSwitchConfirm(() => {
        dropPendingSels();
        doOpenCanvasTab(doc);
      });
      return;
    }
    doOpenCanvasTab(doc);
  }

  function doOpenCanvasTab(doc) {
    const st = canvasState();
    if (!st) return;
    // 同文件已打开 → 只激活；同名不同实例 → 新 tab
    const existed = st.tabs.find((t) => t.id === doc.id);
    if (existed) {
      st.activeId = doc.id;
    } else {
      st.tabs.push(doc);
      st.activeId = doc.id;
    }
    $('#view-chat').classList.add('canvas-open');
    $('#canvas-panel').hidden = false;
    renderCanvas();
  }

  function activateCanvasTab(id) {
    const st = canvasState();
    if (!st || !st.tabs.some((t) => t.id === id)) return;
    if (st.activeId === id) return;
    // 草稿期有待发送选区：先确认
    if (selById.size && st.tabs.find((t) => t.id === st.activeId) !== st.tabs.find((t) => t.id === id)) {
      askSwitchConfirm(() => {
        dropPendingSels();
        st.activeId = id;
        renderCanvas();
      });
      return;
    }
    st.activeId = id;
    renderCanvas();
  }

  // 清除待发送选区：pill 移除，指令文字保留为普通文字
  function dropPendingSels() {
    const comp = $('#chat-input');
    comp.querySelectorAll('.sel-pill').forEach((p) => p.remove());
    selById.clear();
  }

  function askSwitchConfirm(onOk) {
    const mask = $('#switch-mask');
    mask.hidden = false;
    const done = (ok) => {
      mask.hidden = true;
      $('#switch-ok').onclick = null;
      $('#switch-cancel').onclick = null;
      mask.onclick = null;
      if (ok) onOk();
    };
    $('#switch-ok').onclick = () => done(true);
    $('#switch-cancel').onclick = () => done(false);
    mask.onclick = (e) => { if (e.target === mask) done(false); };
  }

  function closeCanvasTab(id) {
    const st = canvasState();
    if (!st) return;
    const idx = st.tabs.findIndex((t) => t.id === id);
    if (idx < 0) return;
    st.tabs.splice(idx, 1);
    if (!st.tabs.length) { closeCanvas(); return; }
    if (st.activeId === id) st.activeId = st.tabs[Math.min(idx, st.tabs.length - 1)].id;
    renderCanvas();
  }

  function closeCanvas() {
    saveCanvasEdits();
    hideSelToolbar();
    clearXlsxRange();
    displayedDoc = null;
    const st = canvasState();
    if (st) { st.tabs = []; st.activeId = null; }
    $('#view-chat').classList.remove('canvas-open');
    $('.main').classList.remove('canvas-full');
    $('#canvas-panel').hidden = true;
  }

  // 切会话时还原该会话的 Canvas 状态
  function syncCanvas() {
    const st = canvasState();
    // 主题指代上下文跟随会话最后一份文档
    const s = currentSession();
    if (s) {
      const lastDoc = [...s.messages].reverse().find((m) => m.role === 'ai' && m.reply.doc);
      if (typeof setLastDocTopic === 'function') setLastDocTopic(lastDoc ? lastDoc.reply.doc.topic : '');
    }
    if (st && st.tabs.length) {
      $('#view-chat').classList.add('canvas-open');
      $('#canvas-panel').hidden = false;
      renderCanvas();
    } else {
      closeCanvas();
    }
  }

  function renderCanvas() {
    const st = canvasState();
    if (!st) return;
    // tab 条
    const strip = $('#canvas-tabs');
    strip.innerHTML = '';
    st.tabs.forEach((t) => {
      const tab = el('button', 'canvas-tab' + (t.id === st.activeId ? ' active' : ''));
      const inb = el('div', 'canvas-tab-in');
      inb.appendChild(img(TYPE_ICONS[t.type].tab, 16));
      inb.appendChild(el('span', 'canvas-tab-name', esc(t.name)));
      tab.appendChild(inb);
      const x = el('span', 'tab-x');
      x.appendChild(img('symbol_cross_two', 16));
      tab.appendChild(x);
      tab.onclick = () => activateCanvasTab(t.id);
      x.onclick = (e) => { e.stopPropagation(); closeCanvasTab(t.id); };
      strip.appendChild(tab);
    });
    // 当前文件
    const doc = st.tabs.find((t) => t.id === st.activeId);
    if (!doc) { closeCanvas(); return; }
    $('#canvas-file-icon').src = iconSrc(TYPE_ICONS[doc.type].name);
    $('#canvas-file-name').textContent = doc.path || doc.name;
    $('#canvas-file-name').title = doc.path || doc.name;
    renderToolbar(doc.type);
    // 切换前先保存上一个文档的编辑，避免丢失；同时清掉选区
    saveCanvasEdits();
    hideSelToolbar();
    clearXlsxRange();
    // 内容区：更新预览阶段白屏 + loading，其余正常渲染
    const content = $('#canvas-content');
    if (doc.updating) {
      content.innerHTML = `
        <div class="canvas-loading">
          <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
            <path d="M8 14C8.34071 14 8.67479 13.9716 9 13.917" stroke="#1F69E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 14C11.3137 14 14 11.3137 14 7.99996C14 4.6863 11.3137 2 8 2" stroke="url(#kdload0)" stroke-width="2" stroke-linejoin="round"/>
            <path d="M8 2C4.68629 2 2 4.6863 2 8C2 11.3137 4.68629 14 8 14" stroke="url(#kdload1)" stroke-width="2" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="kdload0" x1="8" y1="12" x2="8" y2="3" gradientUnits="userSpaceOnUse"><stop stop-color="#1F69E0"/><stop offset="1" stop-color="#1F69E0" stop-opacity="0.5"/></linearGradient>
              <linearGradient id="kdload1" x1="7.5" y1="14" x2="8" y2="3" gradientUnits="userSpaceOnUse"><stop stop-color="#0A6CFF" stop-opacity="0"/><stop offset="1" stop-color="#0A6CFF" stop-opacity="0.5"/></linearGradient>
            </defs>
          </svg>
          <span>正在加载预览...</span>
        </div>`;
      displayedDoc = doc;
      refreshEditbar();
      return;
    }
    content.innerHTML = doc.html;
    if (doc.type === 'pptx' && doc.pages) renderPpt(content, doc);
    bindContentInteractions(content);
    displayedDoc = doc;
    refreshEditbar();
  }

  // 把当前显示内容的编辑回写到 doc（docx/xlsx 存 innerHTML，pptx 存页数据）
  function saveCanvasEdits() {
    if (!displayedDoc) return;
    const content = $('#canvas-content');
    // 更新预览期间内容区是 loading 白屏，不能回写（否则文档内容被 loading 标记覆盖）
    if (displayedDoc.updating || content.querySelector('.canvas-loading')) return;
    if (displayedDoc.type === 'pptx' && displayedDoc.pages) {
      pptSavePage(content, displayedDoc);
    } else {
      // 提交未失焦的单元格 / 清掉选中态，再存回模板
      content.querySelectorAll('.cell[contenteditable="true"]').forEach((c) => { c.contentEditable = 'false'; });
      content.querySelectorAll('td.et-active').forEach((x) => x.classList.remove('et-active'));
      displayedDoc.html = content.innerHTML;
    }
  }

  // 演示：缩略图栏 + 当前页画布 + 页码，全部由 doc.pages / doc.cur 驱动
  function renderPpt(content, doc) {
    const rail = content.querySelector('.ppt-rail');
    const canvas = content.querySelector('.ppt-canvas');
    if (rail) rail.innerHTML = pptRailHtml(doc);
    if (canvas) canvas.innerHTML = pptPageHtml(doc.pages[doc.cur]);
    const note = content.querySelector('.ppt-note');
    if (note) note.textContent = doc.pages[doc.cur].note || '点击输入演讲者备注';
    const st = content.querySelector('.ppt-status .ds-item');
    if (st) st.textContent = '幻灯片 ' + (doc.cur + 1) + '/' + doc.pages.length;
  }

  /* ---------- 置顶工具栏：三大组件各一套（KDesign 图标 + Medium 28px 按钮） ---------- */
  // 按钮组定义：[图标名, title]，'|' 为分隔线，{sel:默认文案} 为下拉选择器
  const TOOLBARS = {
    docx: [
      ['arrow_revoke', '撤销'], ['arrow_recover', '重做'], '|',
      ['brush', '格式刷'], ['eraser', '清除格式'], '|',
      { sel: '宋体' }, { sel: '三号' }, '|',
      ['font_size_increase_wps', '增大字号'], ['font_size_reduce_wps', '减小字号'],
      ['bold_wps', '加粗'], ['italic', '倾斜'], ['underscore', '下划线'], ['strikethrough', '删除线'], '|',
      ['color_font_wps', '字体颜色'], ['color_paint_wps', '底纹颜色'], '|',
      ['align_left', '左对齐'], ['align_center', '居中'], ['align_right', '右对齐'], ['line_spacing', '行距'], '|',
      ['add_bullet', '项目符号'], ['add_item', '编号'], '|',
      ['pic', '插入图片'], ['text_frame', '文本框'], ['arrow_up_s', '收起工具栏'],
    ],
    pptx: [
      ['arrow_revoke', '撤销'], ['arrow_recover', '重做'], '|',
      ['brush', '格式刷'], '|',
      ['play_current_slide', '从头开始'], '|',
      { sel: '＋' }, { sel: '图片' }, { sel: '文本' }, '|',
      { sel: '字体' }, { sel: '字号' }, '|',
      ['font_size_increase_wps', '增大字号'], ['font_size_reduce_wps', '减小字号'],
      ['bold_wps', '加粗'], ['italic', '倾斜'], ['underscore', '下划线'], '|',
      ['color_font_wps', '字体颜色'], ['color_paint_wps', '形状填充'], '|',
      ['align_left', '左对齐'], ['align_center', '居中'], ['align_right', '右对齐'], ['arrow_up_s', '收起工具栏'],
    ],
    xlsx: [
      ['arrow_revoke', '撤销'], ['arrow_recover', '重做'], '|',
      ['brush', '格式刷'], ['eraser', '清除格式'], '|',
      { sel: '宋体' }, { sel: '14' }, '|',
      ['font_size_increase_wps', '增大字号'], ['font_size_reduce_wps', '减小字号'],
      ['bold_wps', '加粗'], ['italic', '倾斜'], ['underscore', '下划线'], ['strikethrough', '删除线'], '|',
      ['color_font_wps', '字体颜色'], ['color_paint_wps', '填充颜色'], '|',
      ['merge_cell', '合并居中'], { sel: '样式' }, '|',
      ['arrow_up_s', '收起工具栏'],
    ],
  };

  function renderToolbar(type) {
    const bar = $('#canvas-toolbar');
    bar.innerHTML = '';
    (TOOLBARS[type] || []).forEach((item) => {
      if (item === '|') { bar.appendChild(el('span', 'tb-sep')); return; }
      if (item.sel) {
        const s = el('button', 'tb-select');
        s.appendChild(el('span', 'tb-val', item.sel));
        s.appendChild(img('arrow_down_s', 12));
        s.title = item.sel;
        s.onclick = () => toast('原型演示：' + item.sel + ' 选择器暂未接入');
        bar.appendChild(s);
        return;
      }
      const b = el('button', 'tb-btn');
      b.appendChild(img(item[0], 16));
      b.title = item[1];
      b.onclick = () => b.classList.toggle('on');
      bar.appendChild(b);
    });
  }

  // 内容区交互：统一事件委托（切页/视图/页签/单元格编辑），只绑一次
  let contentBound = false;
  function bindContentInteractions(content) {
    if (contentBound) return;
    contentBound = true;

    content.addEventListener('click', (e) => {
      const doc = displayedDoc;
      if (!doc) return;
      // 拖拽框选刚结束的 click 不进入编辑
      if (suppressCellClick) { suppressCellClick = false; return; }
      // 演示：点缩略图切页（先存当前页编辑）
      const thumb = e.target.closest('.ppt-thumb-item');
      if (thumb && doc.pages) {
        pptSavePage(content, doc);
        doc.cur = +thumb.dataset.page;
        renderPpt(content, doc);
        return;
      }
      const seg = e.target.closest('.seg-item');
      if (seg) {
        content.querySelectorAll('.seg-item').forEach((x) => x.classList.remove('on'));
        seg.classList.add('on');
        return;
      }
      const tab = e.target.closest('.et-tab');
      if (tab) {
        content.querySelectorAll('.et-tab').forEach((x) => x.classList.remove('active'));
        tab.classList.add('active');
        return;
      }
      // 演示：点击文本框/形状整体 → 出悬浮工具栏（拖选文字仍走文字选区）
      if (doc.type === 'pptx') {
        const boxEl = e.target.closest('.ppt-canvas [contenteditable="true"]');
        if (boxEl) {
          const s0 = getSelection();
          if (!s0 || s0.isCollapsed) {
            clearBoxSel();
            boxSelEl = boxEl;
            boxEl.classList.add('box-sel');
            currentSel = { id: uid(), type: 'pptx', text: boxEl.innerText.trim() || '(空文本框)', doc, page: doc.cur != null ? doc.cur + 1 : 1 };
            showSelToolbar(boxEl.getBoundingClientRect());
            syncPopPill();
          }
        } else {
          clearBoxSel();
        }
      }
      // 表格：点单元格进入编辑（先清掉框选与工具栏）
      const cell = e.target.closest('td .cell');
      if (cell && doc.type === 'xlsx') {
        clearXlsxRange();
        hideSelToolbar();
        content.querySelectorAll('.cell[contenteditable="true"]').forEach((c) => { c.contentEditable = 'false'; });
        const td = cell.parentElement;
        content.querySelectorAll('td.et-active').forEach((x) => x.classList.remove('et-active'));
        td.classList.add('et-active');
        const letter = String.fromCharCode(64 + td.cellIndex);
        const namebox = content.querySelector('.et-namebox');
        if (namebox) namebox.textContent = letter + td.parentElement.rowIndex;
        cell.contentEditable = 'true';
        cell.focus();
        const r = document.createRange();
        r.selectNodeContents(cell);
        r.collapse(false);
        const s = getSelection();
        s.removeAllRanges();
        s.addRange(r);
      }
    });

    // 表格：mousedown 起拖拽框选连续单元格区域（编辑中的单元格不拦截，保证能置光标）
    content.addEventListener('mousedown', (e) => {
      const td = e.target.closest('.et-grid td');
      if (td && displayedDoc && displayedDoc.type === 'xlsx') {
        if (td.querySelector('.cell[contenteditable="true"]')) return;
        xlsxDrag = { anchor: td, moved: false };
        e.preventDefault();
      }
    });

    // 表格：编辑时同步公式栏
    content.addEventListener('input', (e) => {
      if (e.target.classList && e.target.classList.contains('cell')) {
        const bar = content.querySelector('.et-editbar');
        if (bar) bar.textContent = e.target.innerText;
      }
    });
    // 表格：失焦提交编辑
    content.addEventListener('focusout', (e) => {
      if (e.target.classList && e.target.classList.contains('cell')) {
        e.target.contentEditable = 'false';
        const bar = content.querySelector('.et-editbar');
        if (bar) bar.textContent = e.target.innerText;
      }
    });
    // 表格：回车提交而不是换行
    content.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('cell')) {
        e.preventDefault();
        e.target.blur();
      }
    });
  }

  /* ---------- 选区与悬浮工具栏 ---------- */
  let currentSel = null;        // { id, type, text, doc, range?, sheet? }
  let toolbarHold = false;      // 指针在工具栏内时，忽略选区折叠
  let xlsxDrag = null;          // { anchor, moved }
  let suppressCellClick = false;
  let lastSelRect = null;       // 选区位置，浮层定位用
  let selMarkEl = null;         // 浮层打开期间的选区高亮 mark
  let boxSelEl = null;          // 演示：整体选中的文本框
  let tipPillEl = null;         // hover 气泡当前绑定的 pill 元素

  function showSelToolbar(rect) {
    const bar = $('#sel-toolbar');
    renderSelToolbar(bar, currentSel ? currentSel.type : 'docx');
    bar.hidden = false;
    lastSelRect = rect;
    const w = bar.offsetWidth, h = bar.offsetHeight;
    let left = rect.left + rect.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, innerWidth - w - 8));
    let top = rect.top - h - 10;
    if (top < 8) top = rect.bottom + 10;
    bar.style.left = left + 'px';
    bar.style.top = top + 'px';
  }
  function hideSelToolbar() {
    $('#sel-toolbar').hidden = true;
    currentSel = null;
    clearBoxSel();
  }
  function clearBoxSel() {
    if (boxSelEl) boxSelEl.classList.remove('box-sel');
    boxSelEl = null;
  }
  function clearXlsxRange() {
    $('#canvas-content').querySelectorAll('td.et-range').forEach((x) => x.classList.remove('et-range'));
  }

  // 文字/演示：跟随原生选区
  function refreshTextSel() {
    if (toolbarHold || xlsxDrag) return;
    // AI 编辑浮层打开期间不动选区状态（高亮由 mark 维持）
    if (!$('#sel-popover').hidden) return;
    const s = getSelection();
    if (!s || !s.rangeCount || s.isCollapsed) {
      // 演示文本框整体选中态：光标在框内时保留工具栏与框选标记
      if (boxSelEl && s && s.anchorNode && boxSelEl.contains(s.anchorNode)) return;
      hideSelToolbar();
      return;
    }
    if (boxSelEl) clearBoxSel();
    const range = s.getRangeAt(0);
    if (!$('#canvas-content').contains(range.commonAncestorContainer)) { hideSelToolbar(); return; }
    const doc = displayedDoc;
    if (!doc || doc.type === 'xlsx') { hideSelToolbar(); return; }
    const text = s.toString().trim();
    if (!text) { hideSelToolbar(); return; }
    currentSel = { id: uid(), type: doc.type, text, doc, page: doc.type === 'pptx' && doc.cur != null ? doc.cur + 1 : null };
    showSelToolbar(range.getBoundingClientRect());
    syncPopPill();
  }

  // 表格：标记锚点到当前的矩形区域，返回区域地址
  function markXlsxRange(a, b) {
    clearXlsxRange();
    const r1 = a.parentElement.rowIndex, c1 = a.cellIndex;
    const r2 = b.parentElement.rowIndex, c2 = b.cellIndex;
    const rows = $('#canvas-content').querySelectorAll('.et-grid tbody tr');
    let cells = [];
    rows.forEach((tr) => {
      if (tr.rowIndex < Math.min(r1, r2) || tr.rowIndex > Math.max(r1, r2)) return;
      [...tr.children].forEach((td) => {
        if (td.tagName !== 'TD') return;
        if (td.cellIndex < Math.min(c1, c2) || td.cellIndex > Math.max(c1, c2)) return;
        td.classList.add('et-range');
        cells.push(td);
      });
    });
    const col = (i) => String.fromCharCode(64 + i);
    return col(Math.min(c1, c2)) + Math.min(r1, r2) + ':' + col(Math.max(c1, c2)) + Math.max(r1, r2);
  }

  function initSelection() {
    document.addEventListener('selectionchange', refreshTextSel);
    const bar = $('#sel-toolbar');
    bar.addEventListener('mousedown', (e) => { toolbarHold = true; e.preventDefault(); });
    document.addEventListener('mouseup', () => {
      toolbarHold = false;
      if (!xlsxDrag) return;
      const { anchor, moved } = xlsxDrag;
      xlsxDrag = null;
      if (!moved) return;               // 没拖动 → 交给 click 进编辑
      suppressCellClick = true;
      const cells = [...$('#canvas-content').querySelectorAll('td.et-range')];
      if (!cells.length) return;
      const text = cells.map((c) => c.innerText.trim()).filter(Boolean).join(' ');
      const range = markXlsxRange(anchor, cells[cells.length - 1]);
      const sheetTab = $('#canvas-content').querySelector('.et-tab.active');
      currentSel = { id: uid(), type: 'xlsx', text: text || '(空区域)', doc: displayedDoc, range, sheet: sheetTab ? sheetTab.textContent.trim() : '' };
      const f = cells[0].getBoundingClientRect();
      const l = cells[cells.length - 1].getBoundingClientRect();
      showSelToolbar({ left: f.left, top: f.top, width: l.right - f.left, bottom: l.bottom });
      syncPopPill();
    });
    document.addEventListener('mousemove', (e) => {
      if (!xlsxDrag) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const td = el && el.closest ? el.closest('.et-grid td') : null;
      if (!td || td === xlsxDrag.last) return;
      xlsxDrag.last = td;
      xlsxDrag.moved = true;
      markXlsxRange(xlsxDrag.anchor, td);
    });
    // 工具栏内按钮：占位提示与 AI 编辑（动态渲染，用委托）
    bar.addEventListener('click', (e) => {
      if (e.target.closest('[data-noop]')) { toast('原型演示：该按钮仅作展示'); return; }
      if (e.target.closest('.st-add')) { addSelDirect(); return; }
      if (e.target.closest('.st-ai')) {
        if (!currentSel) return;
        openSelPopover(bar.getBoundingClientRect());
      }
    });
    // 点浮层外（且不在选区工具栏上）关闭 AI 编辑浮层
    document.addEventListener('mousedown', (e) => {
      const pop = $('#sel-popover');
      if (!pop.hidden && !pop.contains(e.target) && !bar.contains(e.target)) closeSelPopover();
    });
    $('#sel-pop-send').onclick = popSend;
    $('#sel-pop-add').onclick = popAdd;
    $('#sel-pop-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); popAdd(); }
      else if (e.key === 'Enter') { e.preventDefault(); popSend(); }
    });
    // pill hover 详情：icon + 完整文件名 + 完整选区（≤200 字，表格带区域地址）
    document.addEventListener('mouseover', (e) => {
      const p = e.target.closest ? e.target.closest('.sel-pill') : null;
      if (!p) return;
      const sel = selById.get(p.dataset.sel) || p._sel;
      if (!sel) return;
      tipPillEl = p;
      const tip = $('#pill-tip');
      tip.innerHTML = '';
      // 1 完整文件名
      const row = el('div', 'pt-row');
      row.appendChild(img(TYPE_ICONS[sel.type].name, 16));
      row.appendChild(el('span', 'pt-name', sel.doc.name));
      tip.appendChild(row);
      // 2 文件路径（本地文档）
      if (sel.doc.path) tip.appendChild(el('div', 'pt-path', sel.doc.path));
      // 3 位置：演示页码 / 表格 sheet 名
      if (sel.type === 'pptx' && sel.page) tip.appendChild(el('div', 'pt-loc', '第 ' + sel.page + ' 页'));
      if (sel.type === 'xlsx' && sel.sheet) tip.appendChild(el('div', 'pt-loc', sel.sheet));
      tip.hidden = false;
      const r = p.getBoundingClientRect();
      tip.style.left = Math.max(8, Math.min(r.left, innerWidth - tip.offsetWidth - 8)) + 'px';
      tip.style.top = Math.max(8, r.top - tip.offsetHeight - 8) + 'px';
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest && e.target.closest('.sel-pill')) { $('#pill-tip').hidden = true; tipPillEl = null; }
    });
    // 主输入框：pill 删除后同步待发送状态；空内容复位 placeholder
    const comp = $('#chat-input');
    comp.addEventListener('input', () => {
      reconcilePending();
      if (!comp.innerText.trim() && !comp.querySelector('.sel-pill')) comp.innerHTML = '';
    });
  }

  /* ---------- 选区悬浮工具栏内容（按类型） ---------- */
  // docx：两行编辑按钮 + 底部整行 AI 入口；pptx：单行、AI 在首位；xlsx：仅 AI
  const SEL_TOOLBAR_ROWS = {
    docx: [
      [
        { sel: '宋体 (正文)' }, { sel: '小五' }, '|',
        ['font_size_increase_wps', '增大字号'], ['font_size_reduce_wps', '减小字号'],
      ],
      [
        ['bold_wps', '加粗'], ['italic', '倾斜'], ['underscore', '下划线'], '|',
        ['highlight', '突出显示'], ['color_font_wps', '字体颜色'], '|',
        ['line_spacing', '行距'], ['align_left', '对齐'], '|', ['brush', '格式刷'],
      ],
    ],
    pptx: [
      [
        ['bold_wps', '加粗'], ['italic', '倾斜'], ['underscore', '下划线'], '|',
        ['color_font_wps', '字体颜色'], ['color_paint_wps', '填充颜色'], '|',
        ['align_left', '对齐'], ['add_item', '列表'],
      ],
    ],
    xlsx: [],
  };

  function renderSelToolbar(bar, type) {
    bar.innerHTML = '';
    const mode = getSelMode();
    const rows = SEL_TOOLBAR_ROWS[type] || [];
    const stacked = type === 'docx';
    bar.className = 'sel-toolbar' + (stacked ? ' stacked' : ' inline');
    const ai = el('button', 'st-ai');
    ai.id = 'sel-ai';
    ai.appendChild(img('lingxi_logo_s', 18));
    ai.appendChild(el('span', '', 'AI 编辑'));
    const addBtn = mode === 'C' ? el('button', 'st-add') : null;
    if (addBtn) {
      addBtn.appendChild(img('lingxi_logo_s', 18));
      addBtn.appendChild(el('span', '', '添加到对话'));
    }
    if (!stacked) {
      bar.appendChild(ai);
      if (addBtn) bar.appendChild(addBtn);
    }
    rows.forEach((row) => {
      const r = el('div', 'st-row');
      row.forEach((item) => {
        if (item === '|') { r.appendChild(el('span', 'tb-sep')); return; }
        if (item.sel) {
          const s = el('button', 'tb-select');
          s.dataset.noop = '1';
          s.appendChild(el('span', 'tb-val', item.sel));
          s.appendChild(img('arrow_down_s', 12));
          s.title = item.sel;
          r.appendChild(s);
          return;
        }
        const b = el('button', 'tb-btn');
        b.dataset.noop = '1';
        b.appendChild(img(item[0], 16));
        b.title = item[1];
        r.appendChild(b);
      });
      bar.appendChild(r);
    });
    if (stacked) {
      if (addBtn) {
        const row = el('div', 'st-airow');
        row.append(ai, addBtn);
        bar.appendChild(row);
      } else bar.appendChild(ai);
    }
  }

  /* ---------- 选区 pill / AI 编辑浮层 / 混排发送 ---------- */
  const SEL_TYPE_TEXT = { docx: '选区', pptx: '选区', xlsx: '选区' };
  const selById = new Map();

  function makeSelPill(sel, opts) {
    const closable = !(opts && opts.closable === false);
    const p = el('span', 'sel-pill' + (closable ? '' : ' static'));
    p.contentEditable = 'false';
    p.dataset.sel = sel.id;
    p._sel = sel;
    p.appendChild(img(TYPE_ICONS[sel.type].name, 16));
    p.appendChild(el('span', 'sp-type', SEL_TYPE_TEXT[sel.type]));
    const brief = (sel.type === 'xlsx' && sel.range)
      ? sel.range
      : sel.text.slice(0, 12) + (sel.text.length > 12 ? '…' : '');
    p.appendChild(el('span', 'sp-text', brief));
    if (closable) {
      const x = el('button', 'sp-x');
      x.appendChild(img('symbol_cross_two', 12));
      x.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); };
      x.onclick = (e) => { e.stopPropagation(); p.remove(); $('#pill-tip').hidden = true; reconcilePending(); };
      p.appendChild(x);
    }
    // 点 pill：右侧打开/跳转到对应文件
    p.onclick = (e) => {
      if (e.target.closest('.sp-x')) return;
      e.stopPropagation();
      openCanvasTab(sel.doc);
    };
    return p;
  }

  function reconcilePending() {
    const comp = $('#chat-input');
    [...selById.keys()].forEach((id) => {
      if (!comp.querySelector('.sel-pill[data-sel="' + id + '"]')) selById.delete(id);
    });
    // 气泡绑定的 pill 已被移除时隐藏气泡（元素删除不会触发 mouseout）
    if (tipPillEl && !tipPillEl.isConnected) { $('#pill-tip').hidden = true; tipPillEl = null; }
  }

  function clearComposer() {
    $('#chat-input').innerHTML = '';
    selById.clear();
    $('#pill-tip').hidden = true;
    tipPillEl = null;
  }

  function insertSelIntoComposer(sel, instruction) {
    const comp = $('#chat-input');
    const pill = makeSelPill(sel);
    const ins = document.createTextNode(instruction || '');
    selById.set(sel.id, sel);
    const s = getSelection();
    let range = null;
    if (s && s.rangeCount && comp.contains(s.anchorNode)) range = s.getRangeAt(0);
    if (range && !range.collapsed === false || range) {
      try {
        range.deleteContents();
        range.insertNode(ins);
        range.insertNode(pill);
        range.setStartAfter(ins);
        range.collapse(true);
        s.removeAllRanges();
        s.addRange(range);
      } catch (err) { comp.appendChild(pill); comp.appendChild(ins); }
    } else {
      comp.appendChild(pill);
      comp.appendChild(ins);
    }
  }

  function composerSegments() {
    const segs = [];
    $('#chat-input').childNodes.forEach((n) => {
      if (n.nodeType === 3) { if (n.textContent) segs.push({ t: 'text', v: n.textContent }); return; }
      if (n.classList && n.classList.contains('sel-pill')) {
        const sel = selById.get(n.dataset.sel);
        if (sel) segs.push({ t: 'sel', sel });
        return;
      }
      const t = n.innerText;
      if (t) segs.push({ t: 'text', v: t });
    });
    return segs;
  }

  function renderUserMsg(segments) {
    const me = el('div', 'me');
    const box = el('div', 'user-msg');
    segments.forEach((sg) => {
      if (sg.t === 'text') box.appendChild(document.createTextNode(sg.v));
      else box.appendChild(makeSelPill(sg.sel, { closable: false }));
    });
    me.appendChild(box);
    $('#feed').appendChild(me);
    scrollBottom();
  }

  /* --- AI 编辑浮层 --- */
  function syncPopPill() {
    if ($('#sel-popover').hidden || !currentSel) return;
    const head = $('#sel-pop-pill');
    head.innerHTML = '';
    head.appendChild(makeSelPill(currentSel, { closable: false }));
  }
  // 文字选区：用 mark 维持高亮（浮层打开后原生 selection 会随焦点转移消失）
  function wrapSelMark() {
    unwrapSelMark();
    if (!currentSel || currentSel.type === 'xlsx') return;
    const s = getSelection();
    if (!s || !s.rangeCount || s.isCollapsed) return;
    try {
      const mark = document.createElement('mark');
      mark.className = 'sel-mark';
      mark.appendChild(s.getRangeAt(0).extractContents());
      s.getRangeAt(0).insertNode(mark);
      selMarkEl = mark;
    } catch (err) { selMarkEl = null; }
  }
  function unwrapSelMark() {
    if (selMarkEl && selMarkEl.parentNode) selMarkEl.replaceWith(...selMarkEl.childNodes);
    selMarkEl = null;
  }
  function openSelPopover(rect) {
    const pop = $('#sel-popover');
    syncPopPill();
    $('#sel-pop-input').value = '';
    // 方案 A：多行输入 + 添加/发送双按钮；方案 B/C：单行输入 + 勾 icon 发送并排
    const mode = getSelMode();
    const sendBtn = $('#sel-pop-send');
    if (mode === 'A') {
      pop.classList.remove('sp-compact');
      sendBtn.className = 'sp-send sp-send-text';
      sendBtn.textContent = '发送';
      $('#sel-pop-foot').appendChild(sendBtn);
      $('#sel-pop-add').style.display = '';
    } else {
      pop.classList.add('sp-compact');
      sendBtn.className = 'sp-send sp-send-icon';
      sendBtn.innerHTML = '<img src="assets/icons/symbol_tick.svg" width="16" height="16" alt="">';
      sendBtn.title = '发送';
      $('#sel-pop-row').appendChild(sendBtn);
      $('#sel-pop-add').style.display = 'none';
    }
    // 工具栏让位，选区高亮保留
    $('#sel-toolbar').hidden = true;
    wrapSelMark();
    pop.hidden = false;
    const anchor = lastSelRect || rect;
    const w = pop.offsetWidth, h = pop.offsetHeight;
    const left = Math.max(8, Math.min(anchor.left, innerWidth - w - 8));
    // 尽量不遮选区：先放选区下方，放不下放上方的外侧
    let top = anchor.bottom + 10;
    if (top + h > innerHeight - 8) top = Math.max(8, anchor.top - h - 10);
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    $('#sel-pop-input').focus();
  }
  function closeSelPopover(silent) {
    $('#sel-popover').hidden = true;
    $('#send-tip').hidden = true;
    unwrapSelMark();
    if (!silent) refreshTextSel();
  }

  // 方案 C：工具栏一键把选区加入输入框（无批注）；回复中也可添加，仅发送受限
  function addSelDirect() {
    if (!currentSel) return;
    const copy = Object.assign({}, currentSel, { id: uid(), instruction: '' });
    captureSelSnapshot(copy);
    hideSelToolbar();
    clearNativeSel();
    clearXlsxRange();
    insertSelIntoComposer(copy, '');
  }
  function clearNativeSel() { getSelection().removeAllRanges(); }

  function popSend() {
    if (running || !currentSel) return;
    const sel = Object.assign({}, currentSel);
    const instruction = $('#sel-pop-input').value.trim();
    sel.instruction = instruction;
    captureSelSnapshot(sel);
    closeSelPopover(true);
    clearNativeSel();
    hideSelToolbar();
    clearXlsxRange();
    const segs = [{ t: 'sel', sel }];
    if (instruction) segs.push({ t: 'text', v: instruction });
    runSelFlow(segs);
  }
  function popAdd() {
    if (!currentSel) return;
    const instruction = $('#sel-pop-input').value.trim();
    const copy = Object.assign({}, currentSel, { id: uid(), instruction });
    captureSelSnapshot(copy);
    closeSelPopover(true);
    clearNativeSel();
    hideSelToolbar();
    clearXlsxRange();
    insertSelIntoComposer(copy, instruction);
  }

  /* --- 带选区发送：编辑中反馈流程 --- */
  function refreshEditbar() {
    const bar = $('#canvas-editbar');
    const doc = displayedDoc;
    if (!doc || $('#canvas-panel').hidden) { bar.hidden = true; return; }
    if (doc.updating) { bar.hidden = true; }
    else if (doc.editing) { bar.hidden = false; $('#canvas-editbar-text').textContent = '本文档正在被灵犀编辑中，手动修改的内容可能丢失。'; }
    else bar.hidden = true;
  }

  /* ---------- DeepSeek 真实修改（仅文字内容） ---------- */
  const KEY_STORE = 'lingxi_deepseek_key';
  // 内部演示用默认 Key（点「填入默认 Key」写入输入框，保存后仅存本浏览器）
  const DEFAULT_KEY = 'sk-5e7798b55dd3411ab418b333a2b0508c';
  const getApiKey = () => localStorage.getItem(KEY_STORE) || '';
  // 选区交互方案：A 双按钮 / B 仅发送+hover提示 / C = B + 工具栏外置添加
  const SEL_MODE_STORE = 'lingxi_sel_mode';
  const getSelMode = () => localStorage.getItem(SEL_MODE_STORE) || 'A';
  const MODE_DESC = {
    A: '浮层内提供「添加到对话」与「发送」两个按钮。',
    B: '浮层仅保留「发送」；Ctrl+Enter 添加到对话；悬停发送按钮查看操作提示。',
    C: '在方案 B 基础上，悬浮工具栏增加「添加到对话」，一键把选区加入输入框。',
  };

  async function callDeepSeek(system, user) {
    const key = getApiKey();
    if (!key) return { error: 'nokey' };
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
        body: JSON.stringify({ model: 'deepseek-chat', temperature: 0.3, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }),
        signal: ctrl.signal,
      });
      if (!res.ok) return { error: 'HTTP ' + res.status };
      const j = await res.json();
      const t = ((j.choices || [])[0] || {}).message ? j.choices[0].message.content : '';
      return String(t || '').trim() ? { text: String(t).trim() } : { error: 'empty' };
    } catch (err) {
      return { error: String((err && err.message) || err) };
    } finally { clearTimeout(timer); }
  }

  const SYS_TEXT = '你是文档编辑助手。用户给你一段原文和修改要求。只输出修改后的文本本身：不要解释、不要加引号或代码块、不要 markdown 标记，保持原文语言与大致篇幅。';
  const SYS_GRID = '你是表格编辑助手。用户给你一组单元格（JSON，键为单元格地址）和修改要求。只输出修改后的 JSON：键保持不变、只改值；只输出 JSON 本身，不要代码块与解释。';

  // 发送/添加时固化修改目标：文字/演示转持久锚点，表格记单元格地址与原值
  function captureSelSnapshot(sel) {
    if (sel.type === 'xlsx') {
      if (sel.cells) return;
      sel.cells = [...$('#canvas-content').querySelectorAll('td.et-range')].map((td) => ({
        addr: String.fromCharCode(64 + td.cellIndex) + td.parentElement.rowIndex,
        v: td.innerText.trim(),
      })).filter((c) => c.v);
      return;
    }
    if (sel.anchorId) return;
    if (selMarkEl) {
      selMarkEl.dataset.anchor = sel.id;
      selMarkEl.classList.remove('sel-mark');
      selMarkEl.classList.add('sel-anchor');
      sel.anchorId = sel.id;
      selMarkEl = null;
    }
    if (sel.type === 'pptx' && boxSelEl) {
      sel.pptPage = displayedDoc && displayedDoc.cur != null ? displayedDoc.cur : 0;
      sel.pptField = boxSelEl.dataset.field || null;
    }
  }

  function editOneSel(sel) {
    if (sel.type === 'xlsx') {
      const payload = {};
      (sel.cells || []).forEach((c) => { payload[c.addr] = c.v; });
      const instr = sel.instruction || '校对并规范化这些单元格的文字与数字，保持数据含义不变';
      return callDeepSeek(SYS_GRID, '单元格：\n' + JSON.stringify(payload) + '\n\n修改要求：\n' + instr);
    }
    const instr = sel.instruction || '润色这段文字，保持原意与大致篇幅';
    return callDeepSeek(SYS_TEXT, '原文：\n' + sel.text + '\n\n修改要求：\n' + instr);
  }

  function applyAnchorIn(rootEl, selId, aiText) {
    const m = rootEl.querySelector('[data-anchor="' + selId + '"]');
    if (!m) return false;
    m.replaceWith(document.createTextNode(aiText));
    return true;
  }

  function findCellByAddr(rootEl, addr) {
    const mm = /^([A-Z]+)(\d+)$/.exec(addr || '');
    if (!mm) return null;
    let col = 0;
    for (const ch of mm[1]) col = col * 26 + (ch.charCodeAt(0) - 64);
    const row = +mm[2];
    const trs = rootEl.querySelectorAll('.et-grid tbody tr');
    for (const tr of trs) {
      if (tr.rowIndex !== row) continue;
      for (const td of tr.children) if (td.tagName === 'TD' && td.cellIndex === col) return td;
    }
    return null;
  }

  // 规则 B：选区内以 AI 为准；选区外的人工编辑经落盘保留
  async function applyAiResult(sel, res) {
    if (res.error) return 'fail';
    const doc = sel.doc;
    const live = displayedDoc === doc ? $('#canvas-content') : null;
    if (sel.type === 'xlsx') {
      let map = null;
      try { map = JSON.parse(res.text.replace(/^```(?:json)?/i, '').replace(/```\s*$/, '')); } catch (e) { return 'fail'; }
      if (!map || typeof map !== 'object') return 'fail';
      const rootEl = live || Object.assign(document.createElement('div'), { innerHTML: doc.html });
      let n = 0;
      (sel.cells || []).forEach((c) => {
        if (!(c.addr in map)) return;
        const td = findCellByAddr(rootEl, c.addr);
        if (!td) return;
        (td.querySelector('.cell') || td).textContent = String(map[c.addr]);
        n++;
      });
      if (!n) return 'skip';
      doc.html = rootEl.innerHTML;
      return 'ok';
    }
    if (sel.type === 'pptx') {
      if (live && sel.anchorId && applyAnchorIn(live, sel.anchorId, res.text)) {
        pptSavePage(live, doc);
        return 'ok';
      }
      if (sel.pptField != null && doc.pages && doc.pages[sel.pptPage]) {
        doc.pages[sel.pptPage][sel.pptField] = res.text;
        return 'ok';
      }
      for (const p of (doc.pages || [])) {
        for (const k of ['k', 't', 's', 'f', 'v', 'note']) {
          if (typeof p[k] === 'string' && p[k].includes(sel.text)) { p[k] = p[k].replace(sel.text, res.text); return 'ok'; }
        }
      }
      return 'skip';
    }
    const rootEl = live || Object.assign(document.createElement('div'), { innerHTML: doc.html });
    if (sel.anchorId && applyAnchorIn(rootEl, sel.anchorId, res.text)) {
      doc.html = rootEl.innerHTML;
      return 'ok';
    }
    const escO = escHtml(sel.text);
    if (doc.html.includes(escO)) { doc.html = doc.html.replace(escO, escHtml(res.text)); return 'ok'; }
    return 'skip';
  }

  async function runSelFlow(segments) {
    if (!currentId) {
      const first = segments.find((s) => s.t === 'text');
      const title = first ? first.v.slice(0, 20) : '局部编辑请求';
      sessions.unshift({ id: uid(), title: title || '局部编辑请求', messages: [] });
      currentId = sessions[0].id;
      $('#feed').innerHTML = '';
      renderMenu();
    }
    showView('chat');
    const session = currentSession();
    session.messages.push({ role: 'user', segments });
    renderUserMsg(segments);
    running = true;
    setSending(true);
    $('#status-text').textContent = '灵犀正在处理…';
    const affected = [];
    const selCount = segments.filter((s) => s.t === 'sel').length;
    segments.forEach((sg) => { if (sg.t === 'sel' && !affected.includes(sg.sel.doc)) affected.push(sg.sel.doc); });
    affected.forEach((d) => { d.editing = true; });
    refreshEditbar();

    // 与步骤流并行发起真实 AI 调用
    const sels = segments.filter((s) => s.t === 'sel').map((s) => s.sel);
    sels.forEach(captureSelSnapshot);
    sels.forEach((s) => {
      const m = $('#canvas-content').querySelector('[data-anchor="' + s.id + '"]');
      if (m) m.classList.add('sel-anchor-active');
    });
    const hasKey = !!getApiKey();
    const aiPromise = hasKey
      ? Promise.all(sels.map((sel) => editOneSel(sel).then((res) => ({ sel, res }))))
      : Promise.resolve(sels.map((sel) => ({ sel, res: { error: 'nokey' } })));

    // 与普通生成同构的一条回复：打字动效 → 步骤流 → 流式正文 → 操作栏
    const sh = renderAiShell();
    const typing = el('div', 'typing', '<span></span><span></span><span></span>');
    sh.block.appendChild(typing);
    scrollBottom();
    await wait(500);
    typing.remove();

    const steps = [
      { title: '解析选区', detail: `定位 ${selCount} 处选区及其上下文` },
      { title: '规划修改', detail: '按选区逐条组织修改方案' },
      { title: '修改内容', detail: '改写选中段落并校对' },
      { title: '保存文件', detail: '写回原文档' },
    ];
    const nodes = renderSteps(sh.detail, steps);
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].className = 'step-item running';
      nodes[i].querySelector('.st-ic').textContent = '◌';
      sh.headText.textContent = '正在执行：' + steps[i].title;
      await wait(1800 + Math.random() * 800);
      nodes[i].className = 'step-item done';
      nodes[i].querySelector('.st-ic').textContent = '✓';
    }
    sh.headText.textContent = `运行了 4 个命令，修改了 ${selCount} 处选区`;

    // 先落盘人工编辑，再应用 AI 结果（选区内以 AI 为准）
    saveCanvasEdits();
    const results = await aiPromise;
    let okN = 0, badN = 0;
    for (const r of results) {
      const st = await applyAiResult(r.sel, r.res);
      if (st === 'ok') okN++; else badN++;
    }
    // 清理处理期锚点高亮/残留锚点（含处理期间被切走、锚点已落进 doc.html 的文档）
    results.forEach(({ sel }) => {
      const root = displayedDoc === sel.doc ? $('#canvas-content') : null;
      if (root) {
        const m = root.querySelector('[data-anchor="' + sel.id + '"]');
        if (m) { m.classList.remove('sel-anchor-active', 'sel-anchor'); m.removeAttribute('data-anchor'); }
      } else if (sel.doc && sel.doc.html) {
        sel.doc.html = sel.doc.html
          .split(' data-anchor="' + sel.id + '"').join('')
          .split('sel-anchor-active ').join('')
          .split('class="sel-anchor"').join('');
      }
    });
    // 清理后把当前显示的干净 DOM 同步回文档数据，避免锚点残留进存储内容
    saveCanvasEdits();
    if (!hasKey) toast('未设置 DeepSeek API Key：侧栏「设置」中配置后可真实修改文档，本次按演示流程处理');
    else if (okN + badN) toast('AI 已修改 ' + okN + ' 处' + (badN ? '，' + badN + ' 处未应用（调用失败或定位不到）' : ''));

    // 文件更新预览阶段（输入框仍锁定）：内容区白屏 loading
    affected.forEach((d) => { d.editing = false; d.updating = true; });
    refreshEditbar();
    if (affected.includes(displayedDoc)) renderCanvas();
    await wait(2500);
    affected.forEach((d) => { d.updating = false; });
    refreshEditbar();
    if (affected.includes(displayedDoc)) renderCanvas();

    // 完成回复：只此一句 + 一套操作栏
    $('#status-text').textContent = '灵犀已就绪';
    const ans = '好的，已修改完成。';
    await typeText(sh.answer, ans);
    renderActions(sh.block, ans);
    session.messages.push({ role: 'ai', reply: { stepsHead: sh.headText.textContent, steps, answer: ans } });

    running = false;
    setSending(false);
    scrollBottom();
  }

  function sendComposer() {
    if (running) return;
    const segs = composerSegments();
    const hasSel = segs.some((s) => s.t === 'sel');
    const textOnly = segs.filter((s) => s.t === 'text').map((s) => s.v).join('').trim();
    if (!segs.length || (!hasSel && !textOnly)) return;
    clearComposer();
    if (!hasSel) { sendMessage(textOnly); return; }
    runSelFlow(segs);
  }

  /* ---------- 核心循环：发送 → mock 流式回复 ---------- */
  function startWithText(text) {
    newChat();
    sendMessage(text);
  }

  async function sendMessage(text) {
    text = (text || '').trim();
    if (!text || running) return;
    running = true;
    setSending(true);

    // 无会话则新建
    if (!currentId) {
      const s = { id: uid(), title: text.length > 20 ? text.slice(0, 20) + '…' : text, messages: [] };
      sessions.unshift(s);
      currentId = s.id;
      $('#feed').innerHTML = '';
      renderMenu();
    }
    showView('chat');

    const session = currentSession();
    session.messages.push({ role: 'user', text });
    renderUser(text);
    $('#home-input').value = '';
    autosize($('#home-input'));
    $('#status-text').textContent = '灵犀正在处理…';

    const reply = buildReply(text);
    const sh = renderAiShell();

    // 打字指示
    const typing = el('div', 'typing', '<span></span><span></span><span></span>');
    sh.block.appendChild(typing);
    scrollBottom();
    await wait(500);
    typing.remove();

    // 步骤流
    const nodes = renderSteps(sh.detail, reply.steps);
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].className = 'step-item running';
      nodes[i].querySelector('.st-ic').textContent = '◌';
      sh.headText.textContent = '正在执行：' + reply.steps[i].title;
      await wait(420 + Math.random() * 380);
      nodes[i].className = 'step-item done';
      nodes[i].querySelector('.st-ic').textContent = '✓';
    }
    sh.headText.textContent = reply.stepsHead;

    // 正文流式
    $('#status-text').textContent = '灵犀已就绪';
    await typeText(sh.answer, reply.answer);

    // 文档卡片：生成完成后出现，并自动在右侧分屏打开（位置：正文之后、推荐追问之前）
    if (reply.doc) {
      sh.block.insertBefore(docCard(reply.doc), sh.reco);
      scrollBottom();
      await wait(400);
      openCanvasTab(reply.doc);
    }

    renderActions(sh.block, reply.answer);
    renderReco(sh.reco, reply.reco);

    session.messages.push({ role: 'ai', reply });
    running = false;
    setSending(false);
    scrollBottom();
  }

  async function typeText(node, text) {
    for (let i = 0; i < text.length; i += 3) {
      node.textContent = text.slice(0, i + 3);
      scrollBottom();
      await wait(10);
    }
    node.textContent = text;
  }

  function setSending(v) {
    $$('.mic-btn').forEach((b) => { b.disabled = v; b.classList.toggle('listening', v); });
  }

  /* ---------- 会话管理 ---------- */
  function newChat() {
    if (running) { toast('任务进行中，请稍候'); return; }
    currentId = null;
    $('#feed').innerHTML = '';
    $('#status-text').textContent = '灵犀已就绪';
    showView('home');
    renderMenu();
    $('#home-input').focus();
  }

  function openSession(id) {
    if (running) { toast('任务进行中，请稍候'); return; }
    currentId = id;
    rebuildFeed();
    showView('chat');
    renderMenu();
  }

  // 种子会话：即时构造 session
  function openSeed(i) {
    if (running) { toast('任务进行中，请稍候'); return; }
    // 已打开过则直接切换
    const existed = sessions.find((s) => s.id === 'seed' + i);
    if (existed) { openSession(existed.id); return; }
    openedSeeds.add(i);
    const seed = SEEDS[i];
    const s = {
      id: 'seed' + i,
      title: seed.title,
      messages: [{ role: 'user', text: seed.user }, { role: 'ai', reply: seed }],
    };
    sessions.unshift(s);
    currentId = s.id;
    rebuildFeed();
    showView('chat');
    renderMenu();
  }

  function rebuildFeed() {
    const s = currentSession();
    const feed = $('#feed');
    feed.innerHTML = '';
    if (!s) return;
    s.messages.forEach((m) => {
      if (m.role === 'user') {
        if (m.segments) renderUserMsg(m.segments);
        else renderUser(m.text);
      } else {
        const sh = renderAiShell();
        sh.headText.textContent = m.reply.stepsHead;
        const nodes = renderSteps(sh.detail, m.reply.steps);
        nodes.forEach((n) => { n.className = 'step-item done'; n.querySelector('.st-ic').textContent = '✓'; });
        sh.answer.textContent = m.reply.answer;
        if (m.reply.doc) sh.block.insertBefore(docCard(m.reply.doc), sh.reco);
        renderActions(sh.block, m.reply.answer);
        if (m.reply.reco) renderReco(sh.reco, m.reply.reco);
      }
    });
    $('#chat-title').textContent = s.title;
    syncCanvas();
    scrollBottom();
  }

  /* ---------- 输入框 ---------- */
  function autosize(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 220) + 'px';
  }
  function bindInput(ta, sendName) {
    if (ta.tagName === 'TEXTAREA') {
      ta.addEventListener('input', () => autosize(ta));
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(ta.value); }
      });
      $(`.mic-btn[data-send="${sendName}"]`).onclick = () => sendMessage(ta.value);
    } else {
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendComposer(); }
      });
      $(`.mic-btn[data-send="${sendName}"]`).onclick = () => sendComposer();
    }
  }

  /* ---------- 初始化 ---------- */
  function init() {
    renderMenu();
    renderCards();
    initTabs();
    bindInput($('#home-input'), 'home');
    bindInput($('#chat-input'), 'chat');

    $('#btn-collapse').onclick = () => toast('原型演示：侧栏收起暂未接入');
    $('#btn-share').onclick = () => toast('原型演示：分享暂未接入');
    $('#btn-space').onclick = () => showView('space');
    $('#btn-back-chat').onclick = () => showView(currentId ? 'chat' : 'home');
    initSelection();
    $('#home-plus').onclick = () => toast('原型演示：附件上传暂未接入');

    // Canvas 面板按钮
    $('#btn-canvas-close').onclick = () => closeCanvas();
    $('#btn-canvas-expand').onclick = () => {
      $('.main').classList.toggle('canvas-full');
    };
    $('#btn-canvas-sidebar').onclick = () => {
      // 收起/展开左侧栏：Canvas 获得全部宽度
      $('.sidebar').hidden = !$('.sidebar').hidden;
      $('.window').classList.toggle('sidebar-collapsed');
    };
    $('#btn-canvas-share').onclick = () => toast('原型演示：文档分享暂未接入');
    $('#btn-canvas-download').onclick = () => toast('原型演示：文档下载暂未接入');
    $('#btn-canvas-more').onclick = () => toast('原型演示：更多操作暂未接入');
    $$('.exp-pill').forEach((b) => b.onclick = () => {
      const span = b.querySelector('span');
      span.textContent = span.textContent === '专家模式：开' ? '专家模式：关' : '专家模式：开';
    });
    $$('.pro-pill').forEach((b) => b.onclick = () => toast('原型演示：模式切换暂未接入'));
    $('#status-row').onclick = () => toast('原型演示：状态详情暂未接入');

    // DeepSeek API Key 设置
    $('#btn-settings').onclick = () => {
      $('#key-input').value = getApiKey();
      syncModeUI();
      $('#key-mask').hidden = false;
    };
    // 选区交互方案切换（立即生效）
    const seg = $('#sel-mode-seg');
    function syncModeUI() {
      const m = getSelMode();
      seg.querySelectorAll('.kd-segmented-item').forEach((b) => b.classList.toggle('is-active', b.dataset.mode === m));
      $('#sel-mode-hint').textContent = MODE_DESC[m];
    }
    seg.querySelectorAll('.kd-segmented-item').forEach((b) => {
      b.onclick = () => {
        localStorage.setItem(SEL_MODE_STORE, b.dataset.mode);
        syncModeUI();
      };
    });
    // 方案 B/C：hover 发送按钮出操作提示
    const sendTip = $('#send-tip');
    $('#sel-pop-send').addEventListener('mouseenter', () => {
      if (getSelMode() === 'A') return;
      sendTip.hidden = false;
      const r = $('#sel-pop-send').getBoundingClientRect();
      const w = sendTip.offsetWidth, h = sendTip.offsetHeight;
      sendTip.style.left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - 8)) + 'px';
      sendTip.style.top = (r.top - h - 10) + 'px';
    });
    $('#sel-pop-send').addEventListener('mouseleave', () => { sendTip.hidden = true; });
    $('#key-cancel').onclick = () => { $('#key-mask').hidden = true; };
    $('#key-default').onclick = () => { $('#key-input').value = DEFAULT_KEY; };
    $('#key-save').onclick = () => {
      const v = $('#key-input').value.trim();
      if (v) localStorage.setItem(KEY_STORE, v); else localStorage.removeItem(KEY_STORE);
      $('#key-mask').hidden = true;
      toast(v ? 'API Key 已保存' : 'API Key 已清除');
    };
    $('#key-mask').onclick = (e) => { if (e.target === $('#key-mask')) $('#key-mask').hidden = true; };

    // 默认打开演示会话（含文档/演示/表格三条生成记录）
    const demo = { id: 'demo', title: DEMO_SEED.title, messages: DEMO_SEED.messages };
    sessions.unshift(demo);
    currentId = demo.id;
    rebuildFeed();
    renderMenu();
    showView('chat');
  }

  init();
})();
