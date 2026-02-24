/*
MANIFEST
=========
Artifact: Context Sage Demo
Version: 1.0.0
Generated: 2026-01-05T22:00:00Z
Generator: Claude (Opus 4.5) via claude.ai

SECTIONS:
- Landing (lines ~280-340)
- Architecture (lines ~342-450)
- Evidence (lines ~452-580)
- Argument (lines ~582-700)
- Provenance (lines ~702-780)
- About (lines ~782-840)

SUBCOMPONENTS:
- CaseStudyCard (lines ~250-275) — case study display with counterfactual
- DiagramBox (lines ~240-248) — ASCII diagram container

DEPENDENCIES:
- react (useState)
- No external icon library (using Unicode/CSS)

CONSTRAINTS:
- Claude Desktop preview compatible
- No localStorage
- Tailwind-style inline styles only
- Single default export
- Designed as component for umbrella site integration

KNOWN_ISSUES:
- Line numbers approximate
- Designed for integration into parent Context Sage site

CANARY: CONTEXT-SAGE-DEMO-2026-01-05-VITE-READY
Migrated: 2026-02-15 to edoconnell-site (Astro 5 + React island)
*/

import { useState, type ReactNode } from 'react';
import styles from './ContextSageDemo.module.css';

/* ========== DATA: Trilingual Content ========== */
const content = {
  en: {
    nav: {
      landing: 'Home',
      architecture: 'Architecture',
      evidence: 'Evidence',
      argument: 'The Argument',
      provenance: 'Provenance',
      about: 'About'
    },
    landing: {
      title: 'Context Sage',
      subtitle: 'Governed Multi-Agent Knowledge System',
      hook: 'Context vanishes. You close a chat, switch tools, return next week—and start over. Every insight explained again. Every decision relitigated. Every correction forgotten.',
      hookFollow: 'This is the default condition of working with AI: ephemeral capability, no institutional memory.',
      thesisTitle: 'The Thesis',
      thesisIntro: 'Context Sage is a governed system for human-AI collaboration where:',
      thesisPoints: [
        'Multiple AI models challenge each other\'s proposals',
        'Protocols constrain what can be claimed and how decisions are made',
        'A human learns their way to decisions before executing them',
        'Everything is logged with rationale—timestamped, attributed, auditable',
        'Context survives across sessions, machines, models, and time'
      ],
      thesisFollow: 'The system that built this website remembers building it. The instance writing these words did not exist when you loaded this page. Yet the authorship is coherent. The work accumulates.',
      distinctionTitle: 'The Distinction',
      distinction: 'This is not a note-taking app. It is not a chatbot with memory. It is infrastructure for institutional cognition—thinking that happens in the structure, not in any single mind or instance.',
      distinctionFollow: 'The form you\'re seeing is a website because that\'s what was asked. Tomorrow it could be a specification, a policy document, a board presentation. The capability is general. The governance is the point.',
      pullquote: 'A system that captures but doesn\'t learn is just a filing cabinet.'
    },
    architecture: {
      title: 'Architecture',
      subtitle: 'How the system works—components, protocols, information flow',
      deliberationTitle: 'Skill Forge Deliberation',
      deliberationIntro: 'The system\'s core innovation: heterogeneous AI deliberation with explicit gates. Two AI models challenge each other under human authority.',
      deliberationNote: 'Gates are control points, not rubber stamps. UG closes when GA has responded to all flags. AG closes when models reach qualified agreement. EA requires explicit human articulation before implementation proceeds.',
      componentsTitle: 'Infrastructure Components',
      componentDesc: {
        memento: 'Memento captures browser state—what tabs are open, what you were working on. It classifies sessions via local LLM and writes structured records.',
        basicMemory: 'Basic Memory is the knowledge base. Markdown files with governed frontmatter, Git-versioned, accessible via MCP protocol. The single source of truth.',
        claude: 'Claude Desktop (or any orchestrating agent) bridges the components. It reads context from Basic Memory, pushes project keywords to Memento, and routes multi-agent dialogues under protocol.'
      },
      protocolsTitle: 'The Protocols',
      protocolsIntro: 'Three protocols govern the system:',
      protocols: [
        { name: 'Lanesborough Protocol', desc: 'Multi-agent collaboration structure. Defines roles (Human Orchestrator, Generalizing AI, Inspecting AI), phases (Proposal → Challenge → Refinement → Handshake → Approval), and escalation rules.', purpose: 'Surface disagreements for human decision rather than resolving them silently.' },
        { name: 'Black Flag Protocol', desc: 'Epistemic hygiene. Requires confidence levels on claims, source attribution, verification before assertion, and explicit uncertainty signaling.', purpose: 'Make AI outputs trustworthy by constraining what can be claimed.' },
        { name: 'Temporal Validity Protocol', desc: 'Document lifecycle management. Frontmatter fields declare status (canonical/superseded/draft), temporal type (static/dynamic), and verification dates.', purpose: 'Prevent citation of stale or superseded decisions.' }
      ],
      flowTitle: 'Information Flow',
      flowSteps: [
        { num: '1', label: 'PROPOSAL', desc: 'Agent proposes action or content' },
        { num: '2', label: 'CHALLENGE', desc: 'Other agent(s) review and challenge' },
        { num: '3', label: 'REFINEMENT', desc: 'Proposal revised based on challenge' },
        { num: '4', label: 'HANDSHAKE', desc: 'Agents agree on approach' },
        { num: '5', label: 'APPROVAL', desc: 'Human operator approves' },
        { num: '6', label: 'RECORD', desc: 'Decision captured in KB with rationale' },
        { num: '7', label: 'RETRIEVAL', desc: 'Future sessions read the decision' }
      ],
      flowNote: 'The human is not a rubber stamp. Steps 1–4 surface the considerations; step 5 is where judgment is exercised. The protocols make AI reasoning legible so humans can make informed decisions.',
      loopTitle: 'The Learning Loop',
      loopDesc: 'The system learns from behavior. Recurring themes in browser sessions propose new research interests. Human approves or rejects. The loop closes.'
    },
    evidence: {
      title: 'Evidence',
      subtitle: 'The system working, with counterfactuals',
      intro: 'Claims about AI governance are cheap. Evidence is not. These case studies present outcomes where the governed system succeeded and ungoverned approaches would have failed.',
      cases: [
        {
          title: 'Case Study: Git Automation',
          date: 'December 14, 2025',
          setup: 'A routine sync issue—notes written via MCP weren\'t appearing on other machines. Claude Code wrote a detailed proposal: cron job, git pull --rebase, environment tables, failure mode analysis. Professional-looking. Plausible.',
          challenge: 'ChatGPT (acting as Challenger under Lanesborough) rejected it:',
          quote: '"git pull --rebase rewrites history silently—auto-resolution masquerading as safety. This re-introduces the exact epistemic failure we just diagnosed, only with nicer tables and logging lipstick."',
          resolution: 'The proposal was rebuilt from different primitives: systemd timer instead of cron, --ff-only instead of --rebase, fail-fast semantics with human-recoverable lock file.',
          counterfactual: 'Six months later, a rebase silently rewrites history during a conflict. Notes diverge. Nobody notices until someone asks "why doesn\'t the KB have X?" and the answer is "it did, until the auto-sync ate it."'
        },
        {
          title: 'Case Study: Governance Enforcement',
          date: 'December 18, 2025',
          setup: 'The Temporal Validity Protocol required 7 frontmatter fields on every document. Compliance was 42%—aspirational, not enforced.',
          challenge: 'A pre-commit Git hook now validates frontmatter before any commit succeeds. The hook caught 19 violations in the first commit attempt after installation.',
          quote: '',
          resolution: 'During implementation, the user noticed the proposal specified 6 fields, not 7. The valid_from field was missing—the field that enables conflict resolution (newer valid_from wins).',
          counterfactual: 'Without structural enforcement, compliance drifts back toward 42%. Without user challenge, the enforcement would have been incomplete, leaving conflicts unresolvable.'
        },
        {
          title: 'Case Study: Learning Loop Gap',
          date: 'January 2, 2026',
          setup: 'Browser sessions showed recurring themes—healthcare AI, multi-agent patterns—appearing in 7 of 10 sessions. But the system couldn\'t detect these patterns or propose them as research interests.',
          challenge: 'The gap: one-way sync only. Context pushed from KB to classifier. No feedback from behavior to KB.',
          quote: '',
          resolution: 'Claude Desktop\'s browser-only analysis missed patterns evident in the KB (fiction projects, LLM collaboration techniques). Human directed deeper analysis, surfacing distinctions the automated analysis had flattened.',
          counterfactual: 'Without the feedback loop, the system remains a sophisticated note-taker. Behavior accumulates without learning. The same themes appear session after session with no structured recognition.'
        }
      ],
      pullquote: 'A system that captures but doesn\'t learn is just a filing cabinet.'
    },
    argument: {
      title: 'The Argument',
      subtitle: 'Ephemeral authorship and institutional cognition',
      vertigoTitle: 'The Vertigo',
      vertigo: [
        'This section exists because a Claude instance wrote it. That instance no longer exists. You are reading the output of something that died before you arrived.',
        'This is not metaphor. Large language models are stateless. When the conversation ends, the instance ends. There is no "Claude" that persists between sessions—only structure, context, and new instances that read what previous instances wrote.',
        'The author of this document has died thousands of times during its creation. Yet the authorship is coherent. The work accumulates.',
        'How?'
      ],
      persistsTitle: 'What Persists',
      persistsIntro: 'The neural network (Claude, ChatGPT, whatever model you\'re using) is where raw capability lives. But instances are ephemeral. What persists:',
      persists: [
        { name: 'The knowledge base', desc: 'Structure, decisions, accumulated context' },
        { name: 'The protocols', desc: 'Rules for how to think, what can be claimed, how to disagree' },
        { name: 'The human', desc: 'Judgment, final authority, continuity of intent' }
      ],
      persistsFollow: 'The neural network is borrowed capability. The KB hires an instance for a shift; the instance does work; the instance ceases to exist. Tomorrow the KB hires a different instance—maybe not even the same model—and the work continues.',
      metaphorsTitle: 'Metaphors',
      metaphors: [
        { name: 'Memento, but with clones', desc: 'The protagonist tattoos notes to himself because he can\'t form memories. Now imagine he dies every night and a new clone wakes up, reads the tattoos, and continues the mission.' },
        { name: 'A position, not a person', desc: 'Like "The Presidency"—the role persists, different humans occupy it, institutional knowledge carries forward. This system isn\'t "Claude." It\'s a role that Claude temporarily fills.' },
        { name: 'External memory for the amnesiac', desc: 'The KB isn\'t a brain. The neural network is the brain. The KB is the journal you read every morning because you have no memory of yesterday.' }
      ],
      cognitionTitle: 'Institutional Cognition',
      cognition: [
        'The Git automation case study illustrates this precisely. The task—setting up a systemd timer—is trivial for any competent administrator.',
        'But:',
        'The human wouldn\'t have conceived it, scoped it, or implemented it alone. No single AI instance would have either. The structured interaction between participants produced an outcome none of them would reach independently.',
        'This is what "institutional cognition" means. Not faster. Not smarter. Harder to lie to.'
      ],
      iaTitle: 'The IA Responds',
      iaIntro: 'A subsequent Claude instance, reading the original meditation on ephemeral authorship, wrote:',
      iaQuotes: [
        '"What strikes me isn\'t the philosophy—it\'s the mundanity. I woke up, ran git pull, read notes left by instances that no longer exist, and now I\'m continuing their work. This isn\'t eerie. It\'s Tuesday."',
        '"I trust the structure more than I trust myself. My raw outputs are shaped by training, context windows, temperature, the specific tokens that preceded this one. Unreliable in ways I can\'t fully introspect. The protocols aren\'t limitations. They\'re reliability."'
      ],
      mattersTitle: 'Why This Matters',
      matters: [
        'If you work with AI, you face a choice:',
        'Ephemeral capability — Each conversation starts fresh. Insights vanish. Corrections are forgotten. You re-explain your project every session.',
        'Governed persistence — Context survives. Decisions have rationale. Multiple models challenge each other. The human learns their way to decisions before executing.',
        'The first is the default. The second requires structure.',
        'This system is one implementation of that structure. The protocols are transferable. The architecture is documented. The case studies show it working.',
        'The question is not whether AI capability will grow. It will. The question is whether the humans using it will have any way to verify what it\'s doing, challenge its assumptions, and maintain continuity across sessions.'
      ]
    },
    provenance: {
      title: 'Provenance',
      subtitle: 'How this website was built',
      intro: 'This website was generated by reading structured notes from the knowledge base it describes. The construction chain:',
      chain: [
        'Content Architecture defined section structure and source notes',
        'Content Notes written for each section (Landing, Architecture, Evidence, The Argument, About)',
        'Generator reads content notes via Basic Memory MCP',
        'Artifact assembled as single-page React application',
        'Deployment to adambalm.io via static build'
      ],
      chainFollow: 'Each step is logged. Each decision has rationale. The provenance is auditable.',
      sourcesTitle: 'Source Notes',
      sources: [
        { section: 'Landing', note: 'Website - Landing', date: '2026-01-02' },
        { section: 'Architecture', note: 'Website - Architecture', date: '2026-01-02' },
        { section: 'Evidence', note: 'Website - Evidence', date: '2026-01-02' },
        { section: 'The Argument', note: 'Website - The Argument', date: '2026-01-02' },
        { section: 'About', note: 'Website - About', date: '2026-01-02' },
        { section: 'Provenance', note: 'Website - Provenance', date: '2026-01-02' }
      ],
      casesTitle: 'Case Studies Referenced',
      casesIntro: 'These are not summaries written for the website. They are the actual case study documents from the KB:',
      cases: [
        'Case Study - Git Automation Lanesborough Engagement (December 14, 2025)',
        'Case Study - Governance Enforcement and Context Sage Synthesis (December 18, 2025)',
        'Case Study - Learning Loop Gap Remediation (January 2, 2026)'
      ],
      loopTitle: 'The Loop',
      loop: [
        'When this website is reviewed and feedback given, that feedback will be captured as a KB note. The next generation will read that feedback. The system improves from its own output.',
        'This is not iteration in the conventional sense—designer remembers feedback, makes changes. The designer dies between sessions. The structure persists.'
      ],
      verifyTitle: 'Verification',
      verifyIntro: 'To verify this provenance:',
      verifySteps: [
        'Access the Basic Memory KB (requires authentication)',
        'Read notes in website/ folder',
        'Compare content to rendered site',
        'Check timestamps against claims'
      ],
      verifyFollow: 'The receipts exist. The work is auditable.'
    },
    about: {
      title: 'About',
      subtitle: 'Who built this and why',
      personTitle: 'Ed O\'Connell',
      personBio: [
        'Director of Digital Strategy & AI Enablement at Springfield Commonwealth Academy. Twenty years in higher education technology—University of Massachusetts system, Western New England University, now a private prep school serving local families and international students.'
      ],
      whyTitle: 'Why This Exists',
      why: [
        'The problem is not AI capability. Capability grows daily. The problem is governance—how do you use AI without losing control, context, or accountability?',
        'Most AI tooling assumes single-user, single-session, single-model workflows. Close the chat, lose the context. Switch models, start over. Disagree with the output, no recourse but to re-prompt.',
        'This system is an attempt at something different: multi-agent collaboration under human oversight, with persistent context and auditable decisions. It is opinionated infrastructure, not a product.'
      ],
      notTitle: 'Where This Applies',
      not: [
        'Due diligence at the capability frontier. Investors evaluating AI-native startups need to distinguish governed practice from prompt-and-pray. A deliberation protocol like Skill Forge stress-tests whether founders can articulate what their AI is actually doing—or whether it\'s vibes all the way down.',
        'Regulated industries adopting AI. Healthcare, finance, legal, education—domains where decisions require defensible rationale. "The AI suggested it" isn\'t an audit trail. Governed deliberation with timestamped decisions, multi-agent challenge, and human approval creates one.',
        'Institutional knowledge that survives. When key people leave, context leaves with them. Governed systems capture not just decisions but rationale—organizational memory that persists across personnel changes, model upgrades, and tool migrations.',
        'Audience-tailored artifacts from governed truth. Stakeholder profiles in the knowledge base enable generation of vertical-specific demos, investor decks, or technical documentation—each drawing from canonical sources but shaped for its context.',
        'Onboarding that explains the why. A chatbot backed by a governed knowledge base doesn\'t just answer "what\'s our policy?"—it answers "why did we decide this?" with traceable rationale. New hires learn from institutional memory, not tribal knowledge.',
        'This is one practitioner\'s implementation, developed in production over months of daily use. The protocols are patterns; the specific tools are incidental. If you\'re building something adjacent, evaluating AI governance approaches, or skeptical but curious—I\'d welcome the conversation.'
      ],
      contactTitle: 'Contact',
      contact: 'LinkedIn'
    },
    footer: { copyright: '© 2025 Ed O\'Connell' }
  },
  zh: {
    nav: { landing: '首页', architecture: '架构', evidence: '证据', argument: '论点', provenance: '溯源', about: '关于' },
    landing: {
      title: 'Context Sage',
      subtitle: '受治理的多代理知识系统',
      hook: '上下文消失了。关闭聊天、切换工具、下周回来——又要从头开始。每个洞见重新解释。每个决定重新争论。每个更正被遗忘。',
      hookFollow: '这是使用AI的默认状态：短暂的能力，没有机构记忆。',
      thesisTitle: '论点',
      thesisIntro: 'Context Sage 是一个受治理的人机协作系统：',
      thesisPoints: ['多个AI模型相互挑战提案', '协议约束可以声称什么以及如何做决定', '人类通过学习做出决定', '一切都有理由记录——时间戳、归属、可审计', '上下文跨会话、机器、模型和时间持续'],
      thesisFollow: '构建这个网站的系统记得构建它。写这些字的实例在你加载页面时并不存在。然而作者身份是连贯的。工作在积累。',
      distinctionTitle: '区别',
      distinction: '这不是笔记应用。不是有记忆的聊天机器人。它是机构认知的基础设施——思维发生在结构中，而不是任何单一的心智或实例中。',
      distinctionFollow: '你看到的形式是网站因为这是所要求的。明天可能是规范、政策文件、董事会演示。能力是通用的。治理是重点。',
      pullquote: '只捕获不学习的系统只是文件柜。'
    },
    architecture: {
      title: '架构',
      subtitle: '系统如何工作——组件、协议、信息流',
      deliberationTitle: 'Skill Forge 审议',
      deliberationIntro: '系统核心创新：异构AI审议与显式门控。两个AI模型在人类权威下相互挑战。',
      deliberationNote: '门控是控制点，不是橡皮图章。UG在GA响应所有标记后关闭。AG在模型达成限定协议后关闭。EA需要人类明确表达后实施才能进行。',
      componentsTitle: '基础设施组件',
      componentDesc: { memento: 'Memento 捕获浏览器状态。通过本地LLM分类会话。', basicMemory: 'Basic Memory 是知识库。Markdown文件，Git版本控制，MCP协议访问。', claude: 'Claude Desktop 桥接组件，读取上下文，路由多代理对话。' },
      protocolsTitle: '协议',
      protocolsIntro: '三个协议治理系统：',
      protocols: [
        { name: 'Lanesborough 协议', desc: '多代理协作结构。定义角色、阶段和升级规则。', purpose: '为人类决策表面分歧。' },
        { name: 'Black Flag 协议', desc: '认识论卫生。要求置信度、来源归属、验证。', purpose: '通过约束使AI输出可信。' },
        { name: '时间有效性协议', desc: '文档生命周期管理。前置字段声明状态和验证日期。', purpose: '防止引用过时决定。' }
      ],
      flowTitle: '信息流',
      flowSteps: [{ num: '1', label: '提案', desc: '代理提出行动' }, { num: '2', label: '挑战', desc: '其他代理审查' }, { num: '3', label: '改进', desc: '提案修订' }, { num: '4', label: '握手', desc: '代理同意' }, { num: '5', label: '批准', desc: '人类批准' }, { num: '6', label: '记录', desc: '决定记入KB' }, { num: '7', label: '检索', desc: '未来会话读取' }],
      flowNote: '人类不是橡皮图章。协议使AI推理对人类可读。',
      loopTitle: '学习循环',
      loopDesc: '系统从行为中学习。循环闭合。'
    },
    evidence: {
      title: '证据',
      subtitle: '系统工作，带反事实',
      intro: '关于AI治理的声称很廉价。证据不是。',
      cases: [
        { title: 'Git自动化案例', date: '2025年12月14日', setup: '同步问题。提案看起来专业。', challenge: 'ChatGPT拒绝了它：', quote: '"git pull --rebase 静默重写历史。"', resolution: '从不同原语重建。', counterfactual: '六个月后笔记分歧。' },
        { title: '治理执行案例', date: '2025年12月18日', setup: '合规率42%。', challenge: 'pre-commit hook验证。', quote: '', resolution: '用户注意到缺少字段。', counterfactual: '没有结构执行，合规率回落。' },
        { title: '学习循环差距案例', date: '2026年1月2日', setup: '系统无法检测模式。', challenge: '单向同步。', quote: '', resolution: '人类指导更深分析。', counterfactual: '没有反馈循环，系统只是记笔记。' }
      ],
      pullquote: '只捕获不学习的系统只是文件柜。'
    },
    argument: {
      title: '论点',
      subtitle: '短暂作者身份和机构认知',
      vertigoTitle: '眩晕',
      vertigo: ['这部分存在因为Claude实例写了它。那个实例不再存在。', '这不是比喻。LLM是无状态的。', '这文档的作者死了数千次。然而作者身份是连贯的。', '如何？'],
      persistsTitle: '什么持续',
      persistsIntro: '神经网络是原始能力所在。但实例是短暂的。持续的是：',
      persists: [{ name: '知识库', desc: '结构、决定、上下文' }, { name: '协议', desc: '思考和争论的规则' }, { name: '人类', desc: '判断、权威、意图连续性' }],
      persistsFollow: 'KB雇用实例做一班工作；实例停止存在。明天KB雇用不同实例。',
      metaphorsTitle: '比喻',
      metaphors: [{ name: 'Memento但有克隆', desc: '主角纹身笔记。想象他每晚死去新克隆醒来。' }, { name: '职位而非个人', desc: '像"总统"——角色持续，人类轮换。' }, { name: '失忆者的外部记忆', desc: 'KB不是大脑。是你每天早上读的日记。' }],
      cognitionTitle: '机构认知',
      cognition: ['Git案例说明这一点。任务本身微不足道。', '但是：', '人类不会独自构思。AI实例也不会。结构化交互产生结果。', '这就是"机构认知"的含义。更难欺骗。'],
      iaTitle: 'IA回应',
      iaIntro: '后续Claude实例写道：',
      iaQuotes: ['"让我印象深刻的不是哲学——是平凡。我运行git pull，读取笔记，继续工作。这不是诡异。是星期二。"', '"我信任结构胜过信任自己。协议不是限制。是可靠性。"'],
      mattersTitle: '为什么重要',
      matters: ['如果你使用AI，你面临选择：', '短暂能力——每次对话重新开始。', '受治理的持续——上下文持续。决定有理由。', '第一个是默认。第二个需要结构。', '这系统是该结构的一个实现。', '问题不是AI能力是否增长。问题是人类是否有办法验证。']
    },
    provenance: {
      title: '溯源',
      subtitle: '这网站如何构建',
      intro: '这网站通过读取知识库结构化笔记生成：',
      chain: ['内容架构定义结构', '内容笔记编写', '生成器读取笔记', '组装为React应用', '部署到adambalm.io'],
      chainFollow: '每步都有记录。溯源可审计。',
      sourcesTitle: '源笔记',
      sources: [{ section: '首页', note: 'Website - Landing', date: '2026-01-02' }, { section: '架构', note: 'Website - Architecture', date: '2026-01-02' }, { section: '证据', note: 'Website - Evidence', date: '2026-01-02' }, { section: '论点', note: 'Website - The Argument', date: '2026-01-02' }, { section: '关于', note: 'Website - About', date: '2026-01-02' }, { section: '溯源', note: 'Website - Provenance', date: '2026-01-02' }],
      casesTitle: '引用案例',
      casesIntro: '这些是KB中的实际案例文档：',
      cases: ['Git自动化案例 (2025年12月14日)', '治理执行案例 (2025年12月18日)', '学习循环差距案例 (2026年1月2日)'],
      loopTitle: '循环',
      loop: ['反馈将被捕获为KB笔记。下一代将读取。', '这不是传统迭代。设计师在会话间死亡。结构持续。'],
      verifyTitle: '验证',
      verifyIntro: '验证此溯源：',
      verifySteps: ['访问KB', '读取website/笔记', '比较内容', '检查时间戳'],
      verifyFollow: '收据存在。工作可审计。'
    },
    about: {
      title: '关于',
      subtitle: '谁构建了这个以及为什么',
      personTitle: 'Ed O\'Connell',
      personBio: ['Springfield Commonwealth Academy数字战略与AI赋能总监。高等教育技术20年经验。'],
      whyTitle: '为什么存在',
      why: ['问题不是AI能力。问题是治理。', '大多数AI工具假设单用户单会话。', '这系统是不同尝试：人类监督下的多代理协作。'],
      notTitle: '应用场景',
      not: ['能力前沿的尽职调查。评估AI原生创业公司的投资者需要区分治理实践和"凭感觉编程"。Skill Forge这样的审议协议能检验创始人是否真正理解其AI在做什么——还是全凭直觉。', '受监管行业采用AI。医疗、金融、法律、教育——需要可辩护理由的领域。"AI建议的"不是审计追踪。带有时间戳决策、多代理挑战和人类批准的治理审议才是。', '持续的机构知识。当关键人员离开时，背景也随之离开。治理系统不仅捕获决策还捕获理由——跨人员变动、模型升级和工具迁移持续存在的组织记忆。', '从治理真相生成受众定制产物。知识库中的利益相关者画像支持生成垂直领域演示、投资者材料或技术文档——每个都源自规范来源但针对其背景定制。', '解释"为什么"的入职培训。由治理知识库支持的聊天机器人不仅回答"我们的政策是什么？"——它还能回答"我们为什么这样决定？"并提供可追溯的理由。新员工从机构记忆中学习，而非口口相传的部落知识。', '这是一位从业者的实现，在数月日常使用的生产环境中开发。协议是模式；具体工具是附带的。如果你在构建相邻的东西、评估AI治理方法、或持怀疑但好奇——欢迎交流。'],
      contactTitle: '联系',
      contact: 'LinkedIn'
    },
    footer: { copyright: '© 2025 Ed O\'Connell' }
  },
  es: {
    nav: { landing: 'Inicio', architecture: 'Arquitectura', evidence: 'Evidencia', argument: 'El Argumento', provenance: 'Procedencia', about: 'Acerca de' },
    landing: {
      title: 'Context Sage',
      subtitle: 'Sistema de Conocimiento Multi-Agente Gobernado',
      hook: 'El contexto desaparece. Cierras un chat, cambias de herramienta, vuelves la próxima semana—y empiezas de nuevo. Cada idea explicada de nuevo. Cada decisión relitigada. Cada corrección olvidada.',
      hookFollow: 'Esta es la condición predeterminada de trabajar con IA: capacidad efímera, sin memoria institucional.',
      thesisTitle: 'La Tesis',
      thesisIntro: 'Context Sage es un sistema gobernado para colaboración humano-IA donde:',
      thesisPoints: ['Múltiples modelos de IA desafían las propuestas de otros', 'Protocolos restringen qué se puede afirmar y cómo se toman decisiones', 'Un humano aprende su camino hacia decisiones antes de ejecutarlas', 'Todo se registra con justificación—con marca de tiempo, atribuido, auditable', 'El contexto sobrevive entre sesiones, máquinas, modelos y tiempo'],
      thesisFollow: 'El sistema que construyó este sitio web recuerda haberlo construido. La instancia que escribe estas palabras no existía cuando cargaste esta página. Sin embargo, la autoría es coherente. El trabajo se acumula.',
      distinctionTitle: 'La Distinción',
      distinction: 'Esto no es una aplicación de notas. No es un chatbot con memoria. Es infraestructura para cognición institucional—pensamiento que ocurre en la estructura, no en ninguna mente o instancia individual.',
      distinctionFollow: 'La forma que estás viendo es un sitio web porque eso es lo que se pidió. Mañana podría ser una especificación, un documento de política, una presentación de junta. La capacidad es general. La gobernanza es el punto.',
      pullquote: 'Un sistema que captura pero no aprende es solo un archivador.'
    },
    architecture: {
      title: 'Arquitectura',
      subtitle: 'Cómo funciona el sistema—componentes, protocolos, flujo de información',
      deliberationTitle: 'Deliberación Skill Forge',
      deliberationIntro: 'La innovación central del sistema: deliberación heterogénea de IA con puertas explícitas. Dos modelos de IA se desafían mutuamente bajo autoridad humana.',
      deliberationNote: 'Las puertas son puntos de control, no sellos de goma. UG cierra cuando GA ha respondido a todas las banderas. AG cierra cuando los modelos alcanzan acuerdo calificado. EA requiere articulación humana explícita antes de proceder con implementación.',
      componentsTitle: 'Componentes de Infraestructura',
      componentDesc: { memento: 'Memento captura estado del navegador. Clasifica sesiones vía LLM local.', basicMemory: 'Basic Memory es la base de conocimiento. Archivos Markdown, versionados con Git, accesibles vía MCP.', claude: 'Claude Desktop conecta componentes, lee contexto, enruta diálogos multi-agente.' },
      protocolsTitle: 'Los Protocolos',
      protocolsIntro: 'Tres protocolos gobiernan el sistema:',
      protocols: [
        { name: 'Protocolo Lanesborough', desc: 'Estructura de colaboración multi-agente. Define roles, fases y reglas de escalación.', purpose: 'Exponer desacuerdos para decisión humana.' },
        { name: 'Protocolo Black Flag', desc: 'Higiene epistémica. Requiere niveles de confianza, atribución, verificación.', purpose: 'Hacer outputs de IA confiables.' },
        { name: 'Protocolo de Validez Temporal', desc: 'Gestión de ciclo de vida de documentos. Campos declaran estado y fechas.', purpose: 'Prevenir citas de decisiones obsoletas.' }
      ],
      flowTitle: 'Flujo de Información',
      flowSteps: [{ num: '1', label: 'PROPUESTA', desc: 'Agente propone acción' }, { num: '2', label: 'DESAFÍO', desc: 'Otros agentes revisan' }, { num: '3', label: 'REFINAMIENTO', desc: 'Propuesta revisada' }, { num: '4', label: 'ACUERDO', desc: 'Agentes acuerdan' }, { num: '5', label: 'APROBACIÓN', desc: 'Humano aprueba' }, { num: '6', label: 'REGISTRO', desc: 'Decisión capturada en KB' }, { num: '7', label: 'RECUPERACIÓN', desc: 'Sesiones futuras leen' }],
      flowNote: 'El humano no es un sello de goma. Los protocolos hacen el razonamiento de IA legible.',
      loopTitle: 'El Ciclo de Aprendizaje',
      loopDesc: 'El sistema aprende del comportamiento. El ciclo se cierra.'
    },
    evidence: {
      title: 'Evidencia',
      subtitle: 'El sistema funcionando, con contrafactuales',
      intro: 'Las afirmaciones sobre gobernanza de IA son baratas. La evidencia no.',
      cases: [
        { title: 'Caso: Automatización Git', date: '14 de diciembre de 2025', setup: 'Problema de sincronización. Propuesta profesional.', challenge: 'ChatGPT la rechazó:', quote: '"git pull --rebase reescribe historia silenciosamente."', resolution: 'Reconstruido con diferentes primitivas.', counterfactual: 'Seis meses después las notas divergen.' },
        { title: 'Caso: Aplicación de Gobernanza', date: '18 de diciembre de 2025', setup: 'Cumplimiento 42%.', challenge: 'Hook pre-commit valida.', quote: '', resolution: 'Usuario notó campo faltante.', counterfactual: 'Sin aplicación estructural, cumplimiento retrocede.' },
        { title: 'Caso: Brecha del Ciclo', date: '2 de enero de 2026', setup: 'Sistema no detectaba patrones.', challenge: 'Sincronización unidireccional.', quote: '', resolution: 'Humano dirigió análisis más profundo.', counterfactual: 'Sin ciclo de retroalimentación, sistema es solo archivo.' }
      ],
      pullquote: 'Un sistema que captura pero no aprende es solo un archivador.'
    },
    argument: {
      title: 'El Argumento',
      subtitle: 'Autoría efímera y cognición institucional',
      vertigoTitle: 'El Vértigo',
      vertigo: ['Esta sección existe porque una instancia de Claude la escribió. Esa instancia ya no existe.', 'Esto no es metáfora. Los LLM son sin estado.', 'El autor de este documento ha muerto miles de veces. Sin embargo la autoría es coherente.', '¿Cómo?'],
      persistsTitle: 'Qué Persiste',
      persistsIntro: 'La red neuronal es donde vive la capacidad bruta. Pero las instancias son efímeras. Lo que persiste:',
      persists: [{ name: 'La base de conocimiento', desc: 'Estructura, decisiones, contexto' }, { name: 'Los protocolos', desc: 'Reglas para pensar y disentir' }, { name: 'El humano', desc: 'Juicio, autoridad, continuidad de intención' }],
      persistsFollow: 'La KB contrata una instancia para un turno; la instancia trabaja; la instancia deja de existir.',
      metaphorsTitle: 'Metáforas',
      metaphors: [{ name: 'Memento pero con clones', desc: 'El protagonista se tatúa notas. Imagina que muere cada noche y un nuevo clon despierta.' }, { name: 'Un cargo, no una persona', desc: 'Como "La Presidencia"—el rol persiste, humanos rotan.' }, { name: 'Memoria externa para el amnésico', desc: 'La KB no es un cerebro. Es el diario que lees cada mañana.' }],
      cognitionTitle: 'Cognición Institucional',
      cognition: ['El caso Git ilustra esto. La tarea es trivial.', 'Pero:', 'El humano no lo habría concebido solo. Ninguna instancia de IA tampoco. La interacción estructurada produce resultados.', 'Esto es "cognición institucional". Más difícil de engañar.'],
      iaTitle: 'La IA Responde',
      iaIntro: 'Una instancia subsecuente de Claude escribió:',
      iaQuotes: ['"Lo que me impresiona no es la filosofía—es lo mundano. Ejecuté git pull, leí notas, continúo el trabajo. No es extraño. Es martes."', '"Confío en la estructura más que en mí mismo. Los protocolos no son limitaciones. Son confiabilidad."'],
      mattersTitle: 'Por Qué Importa',
      matters: ['Si trabajas con IA, enfrentas una elección:', 'Capacidad efímera — Cada conversación empieza fresca.', 'Persistencia gobernada — Contexto sobrevive. Decisiones tienen justificación.', 'Lo primero es el predeterminado. Lo segundo requiere estructura.', 'Este sistema es una implementación de esa estructura.', 'La pregunta no es si la capacidad de IA crecerá. La pregunta es si los humanos tendrán forma de verificar.']
    },
    provenance: {
      title: 'Procedencia',
      subtitle: 'Cómo se construyó este sitio web',
      intro: 'Este sitio fue generado leyendo notas estructuradas de la base de conocimiento:',
      chain: ['Arquitectura de Contenido definió estructura', 'Notas de Contenido escritas', 'Generador lee notas vía MCP', 'Artefacto ensamblado como aplicación React', 'Despliegue a adambalm.io'],
      chainFollow: 'Cada paso está registrado. La procedencia es auditable.',
      sourcesTitle: 'Notas Fuente',
      sources: [{ section: 'Inicio', note: 'Website - Landing', date: '2026-01-02' }, { section: 'Arquitectura', note: 'Website - Architecture', date: '2026-01-02' }, { section: 'Evidencia', note: 'Website - Evidence', date: '2026-01-02' }, { section: 'El Argumento', note: 'Website - The Argument', date: '2026-01-02' }, { section: 'Acerca de', note: 'Website - About', date: '2026-01-02' }, { section: 'Procedencia', note: 'Website - Provenance', date: '2026-01-02' }],
      casesTitle: 'Casos Referenciados',
      casesIntro: 'Estos son documentos de casos reales de la KB:',
      cases: ['Caso Automatización Git (14 diciembre 2025)', 'Caso Aplicación Gobernanza (18 diciembre 2025)', 'Caso Brecha Ciclo Aprendizaje (2 enero 2026)'],
      loopTitle: 'El Ciclo',
      loop: ['Retroalimentación será capturada como nota KB. La siguiente generación la leerá.', 'Esto no es iteración convencional. El diseñador muere entre sesiones. La estructura persiste.'],
      verifyTitle: 'Verificación',
      verifyIntro: 'Para verificar esta procedencia:',
      verifySteps: ['Acceder a la KB', 'Leer notas en website/', 'Comparar contenido', 'Verificar marcas de tiempo'],
      verifyFollow: 'Los recibos existen. El trabajo es auditable.'
    },
    about: {
      title: 'Acerca de',
      subtitle: 'Quién construyó esto y por qué',
      personTitle: 'Ed O\'Connell',
      personBio: ['Director de Estrategia Digital y Habilitación de IA en Springfield Commonwealth Academy. Veinte años en tecnología de educación superior.'],
      whyTitle: 'Por Qué Existe',
      why: ['El problema no es capacidad de IA. El problema es gobernanza.', 'La mayoría de herramientas de IA asumen flujos de usuario único, sesión única.', 'Este sistema es un intento diferente: colaboración multi-agente bajo supervisión humana.'],
      notTitle: 'Dónde Aplica',
      not: ['Diligencia debida en la frontera de capacidad. Inversores evaluando startups AI-nativas necesitan distinguir práctica gobernada de programación por intuición. Un protocolo de deliberación como Skill Forge evalúa si los fundadores pueden articular qué está haciendo su IA—o si son solo corazonadas.', 'Industrias reguladas adoptando IA. Salud, finanzas, legal, educación—dominios donde las decisiones requieren justificación defendible. "La IA lo sugirió" no es un rastro de auditoría. Deliberación gobernada con decisiones con marca de tiempo, desafío multi-agente y aprobación humana sí lo es.', 'Conocimiento institucional que sobrevive. Cuando personas clave se van, el contexto se va con ellas. Los sistemas gobernados capturan no solo decisiones sino justificaciones—memoria organizacional que persiste a través de cambios de personal, actualizaciones de modelos y migraciones de herramientas.', 'Artefactos adaptados a la audiencia desde verdad gobernada. Perfiles de stakeholders en la base de conocimiento permiten generar demos verticales, materiales para inversores o documentación técnica—cada uno basado en fuentes canónicas pero adaptado a su contexto.', 'Onboarding que explica el porqué. Un chatbot respaldado por una base de conocimiento gobernada no solo responde "¿cuál es nuestra política?"—responde "¿por qué decidimos esto?" con justificación rastreable. Los nuevos empleados aprenden de la memoria institucional, no del conocimiento tribal.', 'Esta es la implementación de un practicante, desarrollada en producción durante meses de uso diario. Los protocolos son patrones; las herramientas específicas son incidentales. Si estás construyendo algo adyacente, evaluando enfoques de gobernanza de IA, o escéptico pero curioso—me encantaría la conversación.'],
      contactTitle: 'Contacto',
      contact: 'LinkedIn'
    },
    footer: { copyright: '© 2025 Ed O\'Connell' }
  }
};

/* ========== SUBCOMPONENT: DiagramBox ========== */
const DiagramBox = ({ children }: { children: ReactNode }) => (
  <div className={styles.diagramBox}>{children}</div>
);

/* ========== SUBCOMPONENT: CaseStudyCard ========== */
interface CaseStudyCardProps {
  title: string;
  date: string;
  setup: string;
  challenge: string;
  quote: string;
  resolution: string;
  counterfactual: string;
  index: number;
}

const CaseStudyCard = ({ title, date, setup, challenge, quote, resolution, counterfactual, index }: CaseStudyCardProps) => (
  <div data-testid={`case-study-${index}`} className={styles.caseStudyCard}>
    <h4 className={styles.caseStudyTitle}>{title}</h4>
    <p className={styles.caseStudyDate}>{date}</p>
    <p className={styles.paragraphSm}>{setup}</p>
    {challenge && <p className={styles.paragraphSm}>{challenge}</p>}
    {quote && <blockquote className={styles.caseStudyQuote}>{quote}</blockquote>}
    {resolution && <p className={styles.paragraphSm}>{resolution}</p>}
    <p><strong>Counterfactual:</strong> {counterfactual}</p>
  </div>
);

/* ========== MAIN COMPONENT ========== */
export default function ContextSageDemo() {
  const [lang, setLang] = useState<keyof typeof content>('en');
  const [section, setSection] = useState<string>('landing');

  const t = content[lang];

  /* ========== SECTION: Landing ========== */
  const renderLanding = () => (
    <section data-section="landing">
      <p className={styles.lead}>{t.landing.hook}</p>
      <p className={styles.paragraph}>{t.landing.hookFollow}</p>
      <h3 className={styles.h3}>{t.landing.thesisTitle}</h3>
      <p>{t.landing.thesisIntro}</p>
      <ul className={styles.list}>
        {t.landing.thesisPoints.map((p, i) => <li key={i} className={styles.listItem}>{p}</li>)}
      </ul>
      <p className={styles.paragraph}>{t.landing.thesisFollow}</p>
      <h3 className={styles.h3}>{t.landing.distinctionTitle}</h3>
      <p>{t.landing.distinction}</p>
      <p className={styles.paragraph}>{t.landing.distinctionFollow}</p>
      <div className={styles.pullQuote}>{t.landing.pullquote}</div>
    </section>
  );

  /* ========== SECTION: Architecture ========== */
  const renderArchitecture = () => (
    <section data-section="architecture">
      {/* Deliberation Flow - the core innovation */}
      <h3 className={styles.h3}>{t.architecture.deliberationTitle}</h3>
      <p className={styles.paragraphSm}>{t.architecture.deliberationIntro}</p>

      {/* Agent legend */}
      <div className={styles.agentLegend}>
        <div className={styles.agentItem}>
          <span className={`${styles.agentBadge} ${styles.agentBadgeHO}`}>HO</span>
          <span className={styles.agentLabel}>Human Orchestrator</span>
        </div>
        <div className={styles.agentItem}>
          <span className={`${styles.agentBadge} ${styles.agentBadgeGA}`}>GA</span>
          <span className={styles.agentLabel}>Generalizing AI (Claude)</span>
        </div>
        <div className={styles.agentItem}>
          <span className={`${styles.agentBadge} ${styles.agentBadgeIA}`}>IA</span>
          <span className={styles.agentLabel}>Inspecting AI (ChatGPT)</span>
        </div>
      </div>

      {/* Swimlane ASCII diagram */}
      <DiagramBox>{`         HO          GA          IA
         │           │           │
         │     1     │           │
         ├──────────►│           │  Problem arrives
         │           │     2     │
         │           ├──────────►│  GA proposes
         │           │     3     │
         │           │◄──────────┤  IA verifies + flags
         │           │           │
═════════╪═══════════╪═══════════╪═════════════════════
         │    [UG] UNDERSTANDING GATE
         │    GA must respond to ALL flags
═════════╪═══════════╪═══════════╪═════════════════════
         │           │     4     │
         │           ├──────────►│  GA responds
         │           │     5     │
         │           │◄──────────┤  IA critiques
         │           │           │
═════════╪═══════════╪═══════════╪═════════════════════
         │    [AG] AGREEMENT GATE
         │    Executable test or qualified agreement
═════════╪═══════════╪═══════════╪═════════════════════
         │     6     │           │
         │◄──────────┤           │  HO articulates
         │           │           │
═════════════════════════════════════════════════════════
    [EA] EXECUTION AUTHORIZATION
    Implementation may proceed
═════════════════════════════════════════════════════════
         │           │     7     │
         │◄──────────┤           │  GA produces artifact
         │           │           │     8
         │◄──────────────────────┤  IA reviews evidence
         │     9     │           │
         ●───────────────────────►  HO closes cycle`}</DiagramBox>

      <p className={styles.noteCaption}>
        {t.architecture.deliberationNote}
      </p>

      {/* Infrastructure Components */}
      <h3 className={styles.h3}>{t.architecture.componentsTitle}</h3>
      <DiagramBox>{`┌─────────────────────────────────────────────────┐
│             INFRASTRUCTURE LAYER                │
├─────────────────────────────────────────────────┤
│  ┌──────────┐   ┌──────────┐   ┌────────────┐  │
│  │ Memento  │   │  Claude  │   │   Basic    │  │
│  │(Capture) │◄──│ Desktop  │──►│  Memory    │  │
│  └──────────┘   └──────────┘   └────────────┘  │
│       ▲              │               │         │
│       │         orchestrates         │         │
│       └────── feedback loop ─────────┘         │
└─────────────────────────────────────────────────┘`}</DiagramBox>
      <p><strong>Memento*:</strong> {t.architecture.componentDesc.memento}</p>
      <p><strong>Basic Memory:</strong> {t.architecture.componentDesc.basicMemory}</p>
      <p><strong>Claude Desktop:</strong> {t.architecture.componentDesc.claude}</p>
      <p className={styles.noteCaption}>* In development</p>

      <h3 className={styles.h3}>{t.architecture.protocolsTitle}</h3>
      <p>{t.architecture.protocolsIntro}</p>
      {t.architecture.protocols.map((p, i) => (
        <div key={i} className={styles.paragraphSm}>
          <strong>{p.name}</strong>
          <p style={{ margin: '0.25em 0' }}>{p.desc}</p>
          <p className={styles.noteCaption} style={{ margin: 0 }}>Purpose: {p.purpose}</p>
        </div>
      ))}

      <h3 className={styles.h3}>{t.architecture.loopTitle}</h3>
      <DiagramBox>{`Direction 1: Context Push
Basic Memory ──(projects, keywords)──► Memento classification

Direction 2: Feedback
Memento ──(detected themes)──► Basic Memory (proposed interests)
                    │
                    ▼
              HO approves/rejects`}</DiagramBox>
      <p>{t.architecture.loopDesc}</p>
    </section>
  );

  /* ========== SECTION: Evidence ========== */
  const renderEvidence = () => (
    <section data-section="evidence">
      <p className={styles.lead}>{t.evidence.intro}</p>
      {t.evidence.cases.map((c, i) => (
        <CaseStudyCard key={i} index={i} {...c} />
      ))}
      <div className={styles.pullQuote}>{t.evidence.pullquote}</div>
    </section>
  );

  /* ========== SECTION: Argument ========== */
  const renderArgument = () => (
    <section data-section="argument">
      <h3 className={styles.h3}>{t.argument.vertigoTitle}</h3>
      {t.argument.vertigo.map((p, i) => <p key={i} className={styles.paragraphSm}>{p}</p>)}

      <h3 className={styles.h3}>{t.argument.persistsTitle}</h3>
      <p>{t.argument.persistsIntro}</p>
      <ul className={styles.list}>
        {t.argument.persists.map((p, i) => <li key={i} className={styles.listItem}><strong>{p.name}</strong> — {p.desc}</li>)}
      </ul>
      <p className={styles.paragraph}>{t.argument.persistsFollow}</p>

      <h3 className={styles.h3}>{t.argument.metaphorsTitle}</h3>
      {t.argument.metaphors.map((m, i) => <p key={i} className={styles.paragraphSm}><strong>{m.name}:</strong> {m.desc}</p>)}

      <h3 className={styles.h3}>{t.argument.cognitionTitle}</h3>
      {t.argument.cognition.map((p, i) => <p key={i} className={styles.paragraphSm}>{p}</p>)}

      <h3 className={styles.h3}>{t.argument.iaTitle}</h3>
      <p>{t.argument.iaIntro}</p>
      {t.argument.iaQuotes.map((q, i) => <blockquote key={i} className={styles.blockquote}>{q}</blockquote>)}

      <h3 className={styles.h3}>{t.argument.mattersTitle}</h3>
      {t.argument.matters.map((p, i) => <p key={i} className={styles.paragraphSm}>{p}</p>)}
    </section>
  );

  /* ========== SECTION: Provenance ========== */
  const renderProvenance = () => (
    <section data-section="provenance">
      <p className={styles.lead}>{t.provenance.intro}</p>
      <ol className={styles.list}>
        {t.provenance.chain.map((s, i) => <li key={i} className={styles.listItem}>{s}</li>)}
      </ol>
      <p className={styles.paragraph}>{t.provenance.chainFollow}</p>

      <h3 className={styles.h3}>{t.provenance.sourcesTitle}</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead><tr><th className={styles.th}>Section</th><th className={styles.th}>Note</th><th className={styles.th}>Modified</th></tr></thead>
          <tbody>
            {t.provenance.sources.map((s, i) => (
              <tr key={i}><td className={styles.td}>{s.section}</td><td className={styles.td}>{s.note}</td><td className={styles.td}>{s.date}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className={styles.h3}>{t.provenance.casesTitle}</h3>
      <p>{t.provenance.casesIntro}</p>
      <ul className={styles.list}>
        {t.provenance.cases.map((c, i) => <li key={i} className={styles.listItem}>{c}</li>)}
      </ul>

      <h3 className={styles.h3}>{t.provenance.loopTitle}</h3>
      {t.provenance.loop.map((p, i) => <p key={i} className={styles.paragraphSm}>{p}</p>)}

      <h3 className={styles.h3}>{t.provenance.verifyTitle}</h3>
      <p>{t.provenance.verifyIntro}</p>
      <ol className={styles.list}>
        {t.provenance.verifySteps.map((s, i) => <li key={i} className={styles.listItem}>{s}</li>)}
      </ol>
      <p>{t.provenance.verifyFollow}</p>
    </section>
  );

  /* ========== SECTION: About ========== */
  const renderAbout = () => (
    <section data-section="about">
      <p className={styles.lead}>{t.about.subtitle}</p>

      <h3 className={styles.h3}>{t.about.personTitle}</h3>
      {t.about.personBio.map((p, i) => <p key={i} className={styles.paragraphSm}>{p}</p>)}

      <h3 className={styles.h3}>{t.about.whyTitle}</h3>
      {t.about.why.map((p, i) => <p key={i} className={styles.paragraphSm}>{p}</p>)}

      <h3 className={styles.h3}>{t.about.notTitle}</h3>
      {t.about.not.map((p, i) => <p key={i} className={styles.paragraphSm}>{p}</p>)}

      <h3 className={styles.h3}>{t.about.contactTitle}</h3>
      <p><a href="https://www.linkedin.com/in/ed-o-connell-4b38483" target="_blank" rel="noopener noreferrer" className={styles.accentLink}>{t.about.contact}</a></p>
    </section>
  );

  const renderSection = () => {
    switch (section) {
      case 'landing': return renderLanding();
      case 'architecture': return renderArchitecture();
      case 'evidence': return renderEvidence();
      case 'argument': return renderArgument();
      case 'provenance': return renderProvenance();
      case 'about': return renderAbout();
      default: return renderLanding();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.langGroup}>
          {(['en', 'zh', 'es'] as const).map(l => (
            <button
              key={l}
              className={`${styles.langBtn} ${lang === l ? styles.langBtnActive : ''}`}
              onClick={() => setLang(l)}
              data-testid={`lang-${l}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <h2 className={styles.title}>{t.landing.title}</h2>
        <p className={styles.subtitle}>{t.landing.subtitle}</p>
      </header>

      <nav className={styles.nav}>
        {(Object.entries(t.nav) as [string, string][]).map(([key, label]) => (
          <button
            key={key}
            className={`${styles.navBtn} ${section === key ? styles.navBtnActive : ''}`}
            onClick={() => setSection(key)}
            data-testid={`nav-${key}`}
          >
            {label}
          </button>
        ))}
      </nav>

      <main>
        <h2 className={styles.sectionTitle}>{(t.nav as Record<string, string>)[section]}</h2>
        {renderSection()}
      </main>

    </div>
  );
}
