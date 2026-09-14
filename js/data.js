/* ============ Mock 数据（文案取自设计稿） ============ */

// 侧边栏菜单：第一组无标题（新任务/办公专区/技能/定时任务/频道/文档空间），后续分组
const MENU = [
  {
    items: [
      { id: 'new', icon: 'symbol_cross', text: '新任务', action: 'newChat' },
      { id: 'office', icon: 'pen', text: '办公专区', arrow: true },
      { id: 'skill', icon: 'lightning', text: '技能', action: 'toast', toast: '原型演示：技能列表暂未接入' },
      { id: 'timer', icon: 'clock', text: '定时任务', action: 'toast', toast: '原型演示：定时任务暂未接入' },
      { id: 'channel', icon: 'plug', text: '频道', action: 'toast', toast: '原型演示：频道暂未接入' },
      { id: 'docspace', icon: 'doc_file', text: '文档空间', action: 'toast', toast: '原型演示：文档空间暂未接入' },
    ],
  },
  {
    title: '项目', add: 'symbol_cross',
    items: [
      { id: 'p1', icon: 'folder', text: '苹果和谷歌合作的具体时间是什么时候？…', song: true, action: 'openSeed', seed: 0 },
      { id: 'p2', icon: 'folder', text: '期中考试试卷草稿评估', action: 'openSeed', seed: 1 },
    ],
  },
  {
    title: '群聊',
    items: [
      { id: 'g1', text: '苹果和谷歌合作的具体时间是什么时候？…', song: true, action: 'toast', toast: '原型演示：群聊暂未接入' },
    ],
  },
  {
    title: '最近', act: 'filter_mail', dynamic: true,
    items: [
      { id: 'r1', text: '苹果和谷歌合作的具体时间是什么时候？…', song: true, pin: true, action: 'openSeed', seed: 0 },
      { id: 'r2', text: '灵犀技能列表按工作场景推荐说明', action: 'openSeed', seed: 2 },
      { id: 'r3', text: '期中考试试卷草稿评估', action: 'openSeed', seed: 4 },
      { id: 'r4', text: '学生错题集整理', action: 'openSeed', seed: 3 },
      { id: 'r5', text: '期中考试试卷草稿评估', action: 'openSeed', seed: 6 },
    ],
  },
];

// 首页项目卡片（文案取自设计稿）
const CARDS = [
  { icon: 'symbol_cross', title: '新建项目', desc: '汇聚会话与文档，作为你与灵犀对话时的共同上下文', action: 'toast', toast: '原型演示：新建项目暂未接入' },
  { icon: 'folder', title: '27版灵犀', desc: '在这个数字时代，灵犀的27个版本为我们带来了无尽的可能性。每一个版本都像是一扇窗' },
  { icon: 'folder', title: 'MUSE', desc: '在这个数字时代，灵犀的27个版本为我们带来了无尽的可能性。每一个版本都像是一扇窗' },
];

const ICON_DIR = 'assets/icons/';
const iconSrc = (name) => ICON_DIR + name + '.svg';

// 种子会话（侧边栏项目/最近可点开），演示数据
const SEEDS = [
  { title: '苹果和谷歌合作的具体时间是什么时候？',
    user: '苹果和谷歌合作的具体时间是什么时候？',
    stepsHead: '搜索了 3 次，查看了 2 个网页',
    steps: [ { title: '搜索联网', detail: '检索苹果 谷歌 合作历史' }, { title: '阅读来源', detail: '比对 2 个网页' }, { title: '整理结论', detail: '归纳时间线' } ],
    answer: '苹果与谷歌的合作始于 2005 年：当年 8 月双方达成协议，谷歌支付费用使 Safari 的默认搜索引擎成为 Google。2014 年该协议因反垄断诉讼被曝光，2023 年司法部诉讼中披露其年度金额已超过百亿美元量级。\n\n如果你需要，我可以再整理一份双方合作与竞争的完整时间线。',
    reco: ['整理双方合作与竞争时间线', '反垄断诉讼的最新进展是什么', '默认搜索引擎协议涉及哪些条款'] },
  { title: '期中考试试卷草稿评估',
    user: '帮我评估这份期中考试试卷草稿',
    stepsHead: '查看了 4 个文件，编辑了 1 个文件',
    steps: [ { title: '读取试卷', detail: '解析 docx 草稿' }, { title: '对照大纲', detail: '检查考点覆盖' }, { title: '生成批改建议', detail: '输出评估报告' } ],
    answer: '已完成试卷草稿评估：全卷 25 题，考点覆盖率 86%，其中「函数的单调性」出现 3 次略有重复，「向量运算」尚未覆盖。\n\n难度分布上，中低难度题占比 72%，建议将第 18、22 题上调为综合题以拉开区分度。修改建议已按题号列出，可直接在批注中查看。',
    reco: ['把评估结果整理成表格', '针对未覆盖考点补两道题', '预估这份试卷的平均分'] },
  { title: '灵犀技能列表按工作场景推荐说明',
    user: '把灵犀技能列表按工作场景做一份推荐说明',
    stepsHead: '查看了 6 个文件，搜索了 2 次',
    steps: [ { title: '收集技能', detail: '汇总技能列表' }, { title: '场景归类', detail: '按工作场景分组' }, { title: '撰写说明', detail: '生成推荐文案' } ],
    answer: '已按工作场景整理技能推荐：\n\n• 文档写作：大纲生成、长文润色、格式排版\n• 数据处理：表格分析、数据清洗、图表生成\n• 调研分析：联网搜索、资料摘要、竞品对比\n• 日常办公：会议纪要、待办提取、邮件起草\n\n每个场景附推荐组合与一句话说明，可直接用于新人引导页。',
    reco: ['导出为一份介绍文档', '为每个场景配使用示例', '精简到最常用的五个技能'] },
  { title: '学生错题集整理',
    user: '把这批学生错题整理成错题集',
    stepsHead: '查看了 5 个文件，编辑了 2 个文件',
    steps: [ { title: '识别错题', detail: '提取错题内容' }, { title: '知识点归类', detail: '按章节分组' }, { title: '排版输出', detail: '生成错题集文档' } ],
    answer: '错题集已整理完成：共 42 题，按知识点归为 7 类，「几何证明」与「概率统计」占比最高。\n\n每题保留原始作答与错误点标注，并在每类末尾附上 2 道同类变式题供练习。文档已生成，可直接分发。',
    reco: ['再生成一份教师讲评版', '按错误率从高到低排序', '补充每类的常见错因分析'] },
  { title: '期中考试试卷草稿评估',
    user: '再评估一下修改后的试卷版本',
    stepsHead: '对比了 2 个版本，查看了 3 个文件',
    steps: [ { title: '读取新版', detail: '解析修改稿' }, { title: '版本对比', detail: '定位 6 处修改' }, { title: '更新结论', detail: '刷新评估结果' } ],
    answer: '修改版评估：考点覆盖率提升至 94%，「向量运算」已补入第 24 题；难度分布调整为 65/35，区分度明显改善。\n\n剩余建议：第 8 题与第 14 题考查点仍相近，可考虑合并或替换其一。',
    reco: ['把两版评估做成对照表', '第 8、14 题给替换建议', '按最终版生成答案与评分标准'] },
  { title: '灵犀技能列表按工作场景推荐说明',
    user: '技能推荐说明里加一节「新手起步」',
    stepsHead: '编辑了 1 个文件',
    steps: [ { title: '定位文档', detail: '打开说明文档' }, { title: '撰写章节', detail: '起草新手起步' } ],
    answer: '已补充「新手起步」一节：推荐从「会议纪要、待办提取、表格分析」三个高频技能开始，各配一个可直接复制的示例指令，并说明与场景化技能的衔接路径。',
    reco: ['把示例指令做成卡片样式', '再补一节「进阶用法」', '导出最终版文档'] },
  { title: '期中考试试卷草稿评估',
    user: '按最终版生成答案与评分标准',
    stepsHead: '查看了 2 个文件，编辑了 1 个文件',
    steps: [ { title: '读取终版', detail: '解析试卷定稿' }, { title: '逐题作答', detail: '生成参考答案' }, { title: '拆分采分点', detail: '制定评分标准' } ],
    answer: '答案与评分标准已生成：25 题逐题给出参考答案，主观题按步骤拆分采分点，全卷合计 100 分。\n\n其中解答题标注了常见错误对应的部分给分规则，方便阅卷统一尺度。',
    reco: ['导出成阅卷用表格', '再出一份学生自测版', '预估各题得分率'] },
];

/* ============ 通用回复模板（任意输入） ============ */
function buildReply(userText) {
  // 文档类需求：命中关键词则走固定文档生成剧情
  const docType = detectDocType(userText);
  if (docType) return buildDocReply(docType, userText);

  const short = userText.trim().slice(0, 14);
  return {
    stepsHead: '运行了 2 个命令，查看了 4 个文件，编辑了 3 个文件，搜索了 3 次',
    steps: [
      { title: '理解任务', detail: `解析需求：${short}…` },
      { title: '搜索联网', detail: '检索 3 条相关网页' },
      { title: '整理产出', detail: '生成草稿并核对' },
    ],
    answer:
`好的。我将围绕「${userText.trim().slice(0, 24)}」为你完成任务。

已完成资料收集与比对，产出如下：
一、核心结论：目标明确，关键信息基本齐备，个别细节建议你确认。
二、要点说明：按「收集 → 比对 → 归纳」的流程组织，已形成结构化草稿。
三、下一步：可以继续深化内容、调整结构，或导出为文档。

中间过程（计划与依据材料）已保存在任务目录中，可供回溯核查。如果需要，我可以把结果转为文档或演示文稿。`,
    reco: ['帮我再深入分析其中一点', '把结论整理成一份文档', '换个思路重新组织内容'],
  };
}

/* ============ 文档生成剧情（docx / pptx / xlsx） ============ */

// 关键词 → 文档类型。xlsx 类先判，避免「表格版PPT」误判
function detectDocType(text) {
  const t = String(text || '');
  if (/xlsx|excel|表格|工作表|统计表|清单表/i.test(t)) return 'xlsx';
  if (/pptx|ppt|演示文稿|幻灯片|汇报胶片/i.test(t)) return 'pptx';
  if (/docx|word|文档|报告|文章|方案|总结|周报|纪要/i.test(t)) return 'docx';
  return null;
}

// 上一份文档的主题（由 app.js 维护），用于「这份报告…」这类指代
let lastDocTopic = '';
function setLastDocTopic(t) { lastDocTopic = t; }

// 从 query 里提取文档主题：去掉动词、量词和类型词，处理指代与「把X做成Y」句式
function extractDocTopic(text) {
  const DEFAULT = '2026 年第二季度经营分析';
  let t = String(text || '').trim();
  // 去礼貌语和句首介词/动词
  t = t.replace(/^(帮我|请|麻烦|给我|我想|我需要|需要)?/, '')
       .replace(/^(把|将)/, '')
       .replace(/^(写|生成|做|制作|创建|整理|输出|起草|来)(一)?(份|个|一篇|一张)?/, '');
  // 「X 做成/转为 Y」句式：取 X
  const parts = t.split(/做成|转为|转成|整理成|变成|改成|导出成?|编辑成/);
  t = (parts[0] || '').trim();
  // 去尾部类型词（若整句只剩类型词则视为指代）
  const bare = t.replace(/(docx|pptx|xlsx|word|ppt|excel)?(的)?(文档|报告|演示文稿|幻灯片|表格|文章|方案|ppt|PPT)?$/i, '').trim();
  const isPronoun = /^(这|该|此|它|以上|上面|其中|这份|这个)/.test(t) || t === '' || !bare;
  if (isPronoun) return (lastDocTopic || DEFAULT);
  // 去掉「这份/这个」前缀后仍有实义内容
  const clean = bare.replace(/^(这份|这个|该|此)/, '').trim();
  return (clean || lastDocTopic || DEFAULT).slice(0, 24);
}

function buildDocReply(type, userText) {
  const topic = extractDocTopic(userText);
  setLastDocTopic(topic);
  const tpl = DOC_TEMPLATES[type];
  const name = topic + tpl.ext;
  const doc = {
    id: 'doc_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    type, name, topic,
    path: 'C:/Users/KSO/' + name,
    html: tpl.html(topic),
    sheets: tpl.sheets,      // xlsx sheet 页签（可选）
  };
  // 演示文稿：页数据驱动，缩略图切页 + 文字编辑回写都基于它
  if (tpl.pages) { doc.pages = tpl.pages(topic); doc.cur = 0; }
  return {
    stepsHead: `运行了 3 个命令，查看了 5 个文件，编辑了 1 个文件，搜索了 4 次`,
    steps: [
      { title: '理解任务', detail: `解析需求：${topic}…` },
      { title: '搜索联网', detail: '检索 4 条相关网页与资料' },
      { title: '整理素材', detail: '归纳要点并搭建结构' },
      { title: tpl.buildStep, detail: tpl.buildDetail },
      { title: '保存文件', detail: `已生成 ${name}` },
    ],
    answer: tpl.answer(topic),
    reco: tpl.reco,
    // Canvas 文档对象：卡片渲染 + 右侧分屏打开
    doc,
  };
}

/* ---------- 三种文档的模板与 mock 内容（内容仅示意，不追求还原真实文档） ---------- */
const DOC_TEMPLATES = {
  docx: {
    ext: '.docx',
    buildStep: '撰写文档',
    buildDetail: '按章节生成正文并排版',
    answer: (topic) =>
`好的。我将为你创建《${topic}》文档，采用智能体生成模式。在我生成时，你可以随意离开这个对话，生成完成后我会立即告诉你。

已完成资料收集与对比分析，文档共四个章节：概述、核心发现、对比分析与结论建议，正文约 2600 字，附 2 张数据表。

研究中间件（研究计划和证据台账）也保存在同一目录下，可供回溯核查。如果需要，我可以将报告转为 PPT 演示文稿或 PDF 格式。`,
    reco: ['帮我把这份报告转为PPT演示文稿', '补充一节风险提示', '把核心结论压缩成一页摘要'],
    html: (topic) => `
      <div class="doc-app">
        <div class="doc-scroll">
      <div class="doc-sheet" contenteditable="true" spellcheck="false">
        <div class="doc-kicker">调研报告 · RESEARCH REPORT</div>
        <h1>${escHtml(topic)}</h1>
        <p style="color:#8a9099;font-size:12px;">生成时间：2026-09-10 · 由灵犀智能体整理</p>
        <h2>一、概述</h2>
        <p>本报告围绕「${escHtml(topic)}」展开，基于公开资料与内部数据的交叉核验，梳理现状、比较关键指标，并给出可落地的结论建议。全文共四章，核心数据以表格呈现，便于引用。</p>
        <h2>二、核心发现</h2>
        <p>第一，整体趋势向好，关键指标在过去四个季度保持连续增长；第二，结构上存在分化，头部集中度高，长尾部分增速放缓；第三，外部环境变化对短期波动的影响大于长期趋势。</p>
        <table class="doc-table">
          <tr><th>指标</th><th>2025 Q4</th><th>2026 Q1</th><th>2026 Q2</th></tr>
          <tr><td>规模（亿元）</td><td>128.4</td><td>141.2</td><td>156.8</td></tr>
          <tr><td>同比增速</td><td>18.2%</td><td>20.6%</td><td>22.1%</td></tr>
          <tr><td>头部集中度 CR5</td><td>54.3%</td><td>56.8%</td><td>58.2%</td></tr>
        </table>
        <h2>三、对比分析</h2>
        <p>横向对比主要参与方：A 方在规模上领先，但增速回落；B 方凭借新渠道快速起量；C 方在细分场景保持高毛利。三者的策略差异反映出对下一阶段市场判断的分歧。</p>
        <h2>四、结论建议</h2>
        <p>建议优先巩固头部优势场景，同时以试点方式进入增速最快的两个细分渠道；对波动敏感的业务设置季度复盘机制。以上结论基于当前数据，如需补充特定口径，可随时告诉我。</p>
      </div>
        </div>
        <div class="doc-status">
          <div class="ds-left">
            <span class="ds-item">页面: 1/1</span>
            <span class="ds-item">节: 1/1</span>
            <span class="ds-item">行: 1</span>
            <span class="ds-item">列: 1</span>
            <span class="ds-item">字数: 1095</span>
          </div>
          <div class="ds-right">
            <button class="tb-btn" title="显示/隐藏"><img src="assets/icons/eye.svg" width="16" height="16" alt=""></button>
            <button class="tb-btn ds-zoom" title="缩小">−</button>
            <span class="ds-item">100%</span>
            <button class="tb-btn ds-zoom" title="放大">＋</button>
            <button class="tb-btn" title="适应宽度"><img src="assets/icons/fit_width.svg" width="16" height="16" alt=""></button>
            <button class="tb-btn" title="全屏"><img src="assets/icons/screen_full.svg" width="16" height="16" alt=""></button>
          </div>
        </div>
      </div>`,
  },
  pptx: {
    ext: '.pptx',
    buildStep: '制作演示文稿',
    buildDetail: '生成 6 页幻灯片并套用版式',
    answer: (topic) =>
`好的。我将把${topic}相关内容整理成一份演示文稿，共 6 页：封面、目录、背景与现状、核心发现、对比分析、结论与下一步。

已完成大纲搭建、内容填充与版式套用，图表已按数据自动配色，可直接用于汇报演示。如需调整页数或更换风格，随时告诉我。`,
    reco: ['把页数精简到4页', '换成更正式的商务风格', '帮我写一份配套的讲稿'],
    pages: (topic) => [
      { v: topic, k: '2026 BUSINESS QUALITY REVIEW · 溯源整改', t: topic, s: '全流程溯源 · 硬指标问责 · 品质驱动转型', chips: ['总体要求与目标', '原因溯源分析', '整改措施', '实施保障'], f: '中邮人寿保险股份有限公司河北分公司 · 2026 年 9 月', note: '' },
      { v: '目录', k: 'CONTENTS', t: '目录', s: '四个部分，覆盖溯源到整改的完整闭环', chips: ['01 背景与现状', '02 核心发现', '03 对比分析', '04 结论与下一步'], f: '', note: '' },
      { v: '背景与现状', k: '01', t: '背景与现状', s: '监管要求趋严，品质管理进入全流程溯源阶段', chips: ['两年赔付率', '犹豫期退保率'], f: '', note: '补充监管文件出处' },
      { v: '核心发现', k: '02', t: '三个关键结论', s: '指标向好但结构分化，短期波动不改长期趋势', chips: ['趋势向好', '结构分化', '短期波动'], f: '', note: '' },
      { v: '对比分析', k: '03', t: '对比分析', s: '头部集中度高，长尾增速放缓', chips: ['规模', '增速', '毛利'], f: '', note: '' },
      { v: '结论与下一步', k: '04', t: '结论与下一步', s: '巩固头部场景，试点高增速渠道', chips: ['季度复盘', '试点渠道'], f: '', note: '' },
    ],
    html: (topic) => `
      <div class="ppt-app">
        <div class="ppt-body">
          <div class="ppt-rail"><!-- JS 渲染缩略图 --></div>
          <div class="ppt-canvas"><!-- JS 渲染当前页 --></div>
          <div class="ppt-float">
            <button class="pf-item"><img src="assets/icons/setup.svg" width="16" height="16" alt=""><span>格式</span></button>
            <button class="pf-item"><img src="assets/icons/star_animation_add.svg" width="16" height="16" alt=""><span>动画</span></button>
            <button class="pf-item"><img src="assets/icons/comment_shape.svg" width="16" height="16" alt=""><span>评论</span></button>
          </div>
        </div>
        <div class="ppt-note" data-field="note" contenteditable="true" spellcheck="false">点击输入演讲者备注</div>
        <div class="ppt-status">
          <span class="ds-item">幻灯片 1/6</span>
          <div class="ds-right">
            <div class="seg">
              <button class="seg-item on" title="普通视图"><img src="assets/icons/view_normal_view.svg" width="16" height="16" alt=""></button>
              <button class="seg-item" title="幻灯片浏览"><img src="assets/icons/slide_show.svg" width="16" height="16" alt=""></button>
              <button class="seg-item" title="阅读视图"><img src="assets/icons/reading_mode.svg" width="16" height="16" alt=""></button>
            </div>
            <button class="tb-btn ds-zoom" title="缩小">−</button>
            <span class="ds-item">37%</span>
            <button class="tb-btn ds-zoom" title="放大">＋</button>
            <button class="tb-btn" title="适应窗口"><img src="assets/icons/fit_width.svg" width="16" height="16" alt=""></button>
            <button class="tb-btn" title="全屏"><img src="assets/icons/screen_full.svg" width="16" height="16" alt=""></button>
            <button class="ppt-play" title="从头开始播放"><img src="assets/icons/play_current_slide.svg" width="16" height="16" alt=""></button>
          </div>
        </div>
      </div>`,
  },
  xlsx: {
    ext: '.xlsx',
    buildStep: '构建表格',
    buildDetail: '整理数据并写入工作表',
    answer: (topic) =>
`好的。我将把${topic}相关数据整理成一份表格，包含三个工作表：汇总、明细与数据来源。

已完成数据清洗与核对：汇总表 12 行指标，明细表 86 条记录，异常值已标注供你复核。如需增加透视分析或图表，随时告诉我。`,
    reco: ['按区域拆分汇总表', '给明细表加一列占比', '把汇总数据做成图表'],
    sheets: ['汇总', '明细', '数据来源'],
    html: (topic) => {
      const rows = [
        ['Jan', '3,200', '180', '5.6%', '2,520,000', '5'],
        ['Feb', '3,800', '220', '5.8%', '3,190,000', '5'],
        ['Mar', '4,100', '250', '6.1%', '3,700,000', '5'],
        ['Apr', '4,500', '290', '6.4%', '4,350,000', '1'],
        ['May', '4,800', '310', '6.5%', '4,712,000', '1'],
        ['Jun', '5,200', '340', '6.5%', '5,270,000', '2'],
        ['Jul', '5,500', '370', '6.7%', '5,846,000', '2'],
        ['Aug', '5,800', '400', '6.9%', '6,400,000', '3'],
        ['Sep', '5,000', '360', '7.2%', '5,400,000', '4'],
      ];
      const dataRows = rows.map((r, i) => `
            <tr><th>${i + 4}</th><td><div class="cell">${r[0]}</div></td><td class="num"><div class="cell">${r[1]}</div></td><td class="num"><div class="cell">${r[2]}</div></td><td class="num"><div class="cell">${r[3]}</div></td><td class="num"><div class="cell">${r[4]}</div></td><td class="num"><div class="cell">${r[5]}</div></td></tr>`).join('');
      return `
      <div class="et-app">
        <div class="et-formula">
          <div class="et-namebox">A1</div>
          <button class="et-fx" title="插入函数"><i>fx</i></button>
          <div class="et-editbar">Monthly Sales Trend - 2026</div>
        </div>
        <div class="et-gridwrap">
          <table class="et-grid">
            <colgroup><col style="width:44px"><col span="6"></colgroup>
            <thead>
              <tr><th class="et-corner"></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr>
            </thead>
            <tbody>
              <tr class="et-selrow"><th>1</th><td colspan="6" class="et-sel"><div class="cell et-title">Monthly Sales Trend - 2026</div></td></tr>
              <tr><th>2</th><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td></tr>
              <tr class="et-head"><th>3</th><td><div class="cell">Month</div></td><td><div class="cell">Leads</div></td><td><div class="cell">Deals</div></td><td><div class="cell">Conv Rate</div></td><td><div class="cell">Revenue</div></td><td><div class="cell">Cur</div></td></tr>
              ${dataRows}
              <tr><th>13</th><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td></tr>
              <tr><th>14</th><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td></tr>
              <tr><th>15</th><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td></tr>
            </tbody>
          </table>
        </div>
        <div class="et-status">
          <button class="tb-btn" title="工作表"><img src="assets/icons/sheet.svg" width="16" height="16" alt=""></button>
          <div class="et-tabs">
            <button class="et-tab c-blue">Sales Funnel</button>
            <button class="et-tab c-green active">Monthly Trend</button>
            <button class="et-tab c-orange">Channel Anal</button>
          </div>
          <div class="et-tabs-nav">
            <button class="tb-btn" title="上一个">«</button>
            <button class="tb-btn" title="下一个">»</button>
            <button class="tb-btn" title="新建工作表">＋</button>
          </div>
          <div class="ds-right">
            <button class="tb-btn" title="批注"><img src="assets/icons/comment_shape.svg" width="16" height="16" alt=""></button>
            <button class="tb-btn" title="更多"><img src="assets/icons/more_two.svg" width="16" height="16" alt=""></button>
          </div>
        </div>
      </div>`;
    },
  },
};

/* ---------- 演示页渲染 / 缩略图 / 编辑回写（app.js 切页时复用） ---------- */
function pptPageHtml(p) {
  return `
    <div class="ppt-slide-main">
      <div class="sm-side">
        <span class="sm-h">H1</span>
        <span class="sm-v" data-field="v" contenteditable="true" spellcheck="false">${escHtml(p.v || '')}</span>
      </div>
      <div class="sm-main">
        <div class="sm-kicker" data-field="k" contenteditable="true" spellcheck="false">${escHtml(p.k)}</div>
        <h2 data-field="t" contenteditable="true" spellcheck="false">${escHtml(p.t)}</h2>
        <p class="sm-sub" data-field="s" contenteditable="true" spellcheck="false">${escHtml(p.s)}</p>
        <div class="sm-chips">${(p.chips || []).map((c) => `<span contenteditable="true" spellcheck="false">${escHtml(c)}</span>`).join('')}</div>
        <div class="sm-foot" data-field="f" contenteditable="true" spellcheck="false">${escHtml(p.f)}</div>
      </div>
    </div>`;
}
function pptRailHtml(doc) {
  return doc.pages.map((p, i) => `
    <button class="ppt-thumb-item${i === doc.cur ? ' active' : ''}" data-page="${i}">
      <span class="pt-num">${i + 1}</span>
      <span class="pt-card"><span class="pt-k">${escHtml(p.k)}</span><span class="pt-t">${escHtml(p.t)}</span></span>
    </button>`).join('');
}
function pptSavePage(content, doc) {
  const page = doc.pages[doc.cur];
  if (!page) return;
  content.querySelectorAll('[data-field]').forEach((n) => {
    let t = n.innerText.replace(/\n+$/, '').trim();
    if (n.dataset.field === 'note' && t === '点击输入演讲者备注') t = '';
    page[n.dataset.field] = t;
  });
  page.chips = [...content.querySelectorAll('.sm-chips span')].map((n) => n.innerText.trim());
}

function escHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
/* ---------- 默认演示会话：含文档 / 演示 / 表格三条生成记录 ---------- */
// 演示会话专用内容：围绕「小米 YU7 vs Model Y 焕新版」主题，贴近真实交付物
function demoDocxHtml() {
  return `
  <div class="doc-app">
    <div class="doc-scroll">
      <div class="doc-sheet" contenteditable="true" spellcheck="false">
        <div class="doc-kicker">对比调研报告 · COMPARATIVE STUDY</div>
        <h1>小米YU7与特斯拉Model Y焕新版对比调研报告</h1>
        <p style="color:#8a9099;font-size:12px;">调研周期：2026 年 6–8 月 · 数据来源：公开参数、终端走访与车主社区抽样</p>
        <h2>一、调研背景</h2>
        <p>小米 YU7 上市后，与特斯拉 Model Y 焕新版在 25–35 万元纯电 SUV 区间形成直接竞争。本报告围绕产品力、价格策略与用户口碑三个维度展开对比，为选购决策与竞争策略提供参考。</p>
        <h2>二、核心参数对比</h2>
        <table class="doc-table">
          <tr><th>维度</th><th>小米 YU7</th><th>Model Y 焕新版</th></tr>
          <tr><td>指导价区间</td><td>25.35 万 – 32.99 万</td><td>26.35 万 – 31.35 万</td></tr>
          <tr><td>CLTC 续航</td><td>835 km（顶配）</td><td>719 km（顶配）</td></tr>
          <tr><td>0-100 km/h 加速</td><td>3.23 s（Max 版）</td><td>4.3 s（长续航全轮驱动）</td></tr>
          <tr><td>智能驾驶</td><td>小米 Pilot Max，全系激光雷达</td><td>FSD（中国版待推送）</td></tr>
          <tr><td>座舱生态</td><td>澎湃 OS，手机-车-家全链路</td><td>以车机为中心，生态相对封闭</td></tr>
        </table>
        <h2>三、用户口碑对比</h2>
        <p>车主社区抽样显示：YU7 的好评集中在续航达成率、座舱互联与性价比，吐槽集中在交付周期与售后网点覆盖；Model Y 的好评集中在操控质感与能耗管理，吐槽集中在内饰简约度与乘坐舒适性。两车口碑分化与目标人群画像高度相关。</p>
        <h2>四、结论与建议</h2>
        <p>短期看，YU7 在产品力参数与生态互联上占优，适合重视智能体验与配置的用户；Model Y 在品牌心智、补能网络与保值率上仍有优势。建议持续跟踪两车智驾功能推送节奏与终端优惠变化，每季度更新一次对比口径。</p>
      </div>
    </div>
    <div class="doc-status">
      <div class="ds-left">
        <span class="ds-item">页面: 1/1</span>
        <span class="ds-item">节: 1/1</span>
        <span class="ds-item">行: 1</span>
        <span class="ds-item">列: 1</span>
        <span class="ds-item">字数: 612</span>
      </div>
      <div class="ds-right">
        <button class="tb-btn" title="显示/隐藏"><img src="assets/icons/eye.svg" width="16" height="16" alt=""></button>
        <button class="tb-btn ds-zoom" title="缩小">−</button>
        <span class="ds-item">100%</span>
        <button class="tb-btn ds-zoom" title="放大">＋</button>
        <button class="tb-btn" title="适应宽度"><img src="assets/icons/fit_width.svg" width="16" height="16" alt=""></button>
        <button class="tb-btn" title="全屏"><img src="assets/icons/screen_full.svg" width="16" height="16" alt=""></button>
      </div>
    </div>
  </div>`;
}

function demoPptPages() {
  return [
    { v: '小米YU7与Model Y焕新版对比汇报', k: '小米汽车 × 特斯拉 · 对比研究', t: '小米YU7 与 Model Y 焕新版对比汇报', s: '产品力 · 价格 · 口碑 三维对比', chips: ['调研背景', '参数对比', '口碑洞察', '结论建议'], f: '灵犀产品组 · 2026 年 9 月', note: '' },
    { v: '目录', k: 'CONTENTS', t: '目录', s: '四个部分，覆盖从背景到建议的完整链路', chips: ['01 核心参数对比', '02 智驾与座舱', '03 用户口碑洞察', '04 结论与下一步'], f: '', note: '' },
    { v: '核心参数对比', k: '01', t: '核心参数对比', s: 'YU7 在续航与加速上领先，价格带重叠度高', chips: ['指导价 25.35–32.99 万', 'CLTC 835 km vs 719 km', '3.23 s vs 4.3 s'], f: '', note: '补一张价格带分布图' },
    { v: '智驾与座舱', k: '02', t: '智驾与座舱：两种路线', s: 'YU7 全链路生态 vs Model Y 车机为中心', chips: ['全系激光雷达', '澎湃 OS 互联', 'FSD 待推送'], f: '', note: '' },
    { v: '用户口碑洞察', k: '03', t: '用户口碑洞察', s: '好评与吐槽高度分化，对应两类人群画像', chips: ['续航达成率', '交付周期', '保值率'], f: '', note: '' },
    { v: '结论与下一步', k: '04', t: '结论与下一步', s: '按人群推荐，季度更新对比口径', chips: ['智能体验优先选 YU7', '品牌与保值选 Model Y', '季度复盘机制'], f: '', note: '' },
  ];
}

function demoXlsxHtml() {
  const rows = [
    ['YU7 标准版', '25.35', '835', '5.9', '31,200', '92%'],
    ['YU7 Pro', '27.99', '770', '4.6', '24,800', '93%'],
    ['YU7 Max', '32.99', '760', '3.23', '9,600', '94%'],
    ['Model Y 后驱', '26.35', '593', '6.9', '28,400', '89%'],
    ['Model Y 长续航全轮驱动', '31.35', '719', '4.3', '15,700', '90%'],
  ];
  const dataRows = rows.map((r, i) => `
            <tr><th>${i + 3}</th><td><div class="cell">${r[0]}</div></td><td class="num"><div class="cell">${r[1]}</div></td><td class="num"><div class="cell">${r[2]}</div></td><td class="num"><div class="cell">${r[3]}</div></td><td class="num"><div class="cell">${r[4]}</div></td><td class="num"><div class="cell">${r[5]}</div></td></tr>`).join('');
  return `
  <div class="et-app">
    <div class="et-formula">
      <div class="et-namebox">A1</div>
      <button class="et-fx" title="插入函数"><i>fx</i></button>
      <div class="et-editbar">小米YU7与Model Y焕新版核心数据对比</div>
    </div>
    <div class="et-gridwrap">
      <table class="et-grid">
        <colgroup><col style="width:44px"><col span="6"></colgroup>
        <thead>
          <tr><th class="et-corner"></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr>
        </thead>
        <tbody>
          <tr class="et-selrow"><th>1</th><td colspan="6" class="et-sel"><div class="cell et-title">小米YU7与Model Y焕新版核心数据对比</div></td></tr>
          <tr class="et-head"><th>2</th><td><div class="cell">车型</div></td><td><div class="cell">指导价(万)</div></td><td><div class="cell">CLTC续航(km)</div></td><td><div class="cell">0-100加速(s)</div></td><td><div class="cell">月均销量(辆)</div></td><td><div class="cell">车主好评率</div></td></tr>
          ${dataRows}
          <tr><th>8</th><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td></tr>
          <tr><th>9</th><td><div class="cell" style="color:#a0a6ae;">口径：2026 年 6–8 月均值</div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td></tr>
          <tr><th>10</th><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td></tr>
          <tr><th>11</th><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td></tr>
          <tr><th>12</th><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td><td><div class="cell"></div></td></tr>
        </tbody>
      </table>
    </div>
    <div class="et-status">
      <button class="tb-btn" title="工作表"><img src="assets/icons/sheet.svg" width="16" height="16" alt=""></button>
      <div class="et-tabs">
        <button class="et-tab c-green active">车型对比</button>
        <button class="et-tab c-blue">月度销量</button>
        <button class="et-tab c-orange">数据来源</button>
      </div>
      <div class="et-tabs-nav">
        <button class="tb-btn" title="上一个">«</button>
        <button class="tb-btn" title="下一个">»</button>
        <button class="tb-btn" title="新建工作表">＋</button>
      </div>
      <div class="ds-right">
        <button class="tb-btn" title="批注"><img src="assets/icons/comment_shape.svg" width="16" height="16" alt=""></button>
        <button class="tb-btn" title="更多"><img src="assets/icons/more_two.svg" width="16" height="16" alt=""></button>
      </div>
    </div>
  </div>`;
}

const DEMO_SEED = (() => {
  const q1 = '写一份小米 YU7 和特斯拉 Model Y 焕新版的对比调研报告';
  const q2 = '帮我把这份报告转为 PPT 演示文稿';
  const q3 = '把报告里的核心数据整理成表格';
  const r1 = buildDocReply('docx', q1);
  const r2 = buildDocReply('pptx', q2);
  const r3 = buildDocReply('xlsx', q3);
  // 文件名与内容对齐主题
  r1.doc.name = '小米YU7与特斯拉ModelY焕新版对比调研报告.docx';
  r1.doc.topic = '小米YU7与特斯拉ModelY焕新版对比调研报告';
  r1.doc.html = demoDocxHtml();
  r2.doc.name = '小米YU7与ModelY焕新版对比汇报.pptx';
  r2.doc.topic = '小米YU7与ModelY焕新版对比汇报';
  r2.doc.pages = demoPptPages();
  r3.doc.name = '小米YU7与ModelY焕新版核心数据对比.xlsx';
  r3.doc.topic = '小米YU7与ModelY焕新版核心数据对比';
  r3.doc.html = demoXlsxHtml();
  r1.doc.path = 'C:/Users/KSO/' + r1.doc.name;
  r2.doc.path = 'C:/Users/KSO/' + r2.doc.name;
  r3.doc.path = 'C:/Users/KSO/' + r3.doc.name;
  return {
    title: '小米 YU7 与特斯拉 Model Y 焕新版对比调研',
    messages: [
      { role: 'user', text: q1 }, { role: 'ai', reply: r1 },
      { role: 'user', text: q2 }, { role: 'ai', reply: r2 },
      { role: 'user', text: q3 }, { role: 'ai', reply: r3 },
    ],
  };
})();