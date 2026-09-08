import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion, useReducedMotion } from "./useReducedMotion.js";
import { CopyContact } from "./CopyContact.jsx";

const sections = [
  { id: "home", label: { zh: "首页", en: "HOME" } },
  { id: "skills", label: { zh: "技能", en: "SKILLS" } },
  { id: "projects", label: { zh: "作品", en: "PROJECTS" } },
  { id: "demo", label: { zh: "演示", en: "DEMO" } },
  { id: "links", label: { zh: "链接", en: "LINKS" } },
  { id: "contact", label: { zh: "联系", en: "CONTACT" } },
];

const skills = [
  {
    title: { zh: "数据开发", en: "DATA DEVELOPMENT" },
    accent: "lime",
    code: "01",
    items: [
      { name: "Hive", score: 90, detail: { zh: "数仓建模 / SQL 调优", en: "Warehouse modeling / SQL tuning" } },
      { name: "Spark", score: 92, detail: { zh: "分布式计算 / 流批一体", en: "Distributed compute / streaming" } },
      { name: "Inceptor", score: 80, detail: { zh: "MPP / 查询加速", en: "MPP / query acceleration" } },
      { name: { zh: "数据仓库建模", en: "Warehouse modeling" }, score: 88, detail: { zh: "维度建模 / 分层治理", en: "Dimensional modeling / governance" } },
      { name: { zh: "数据运维", en: "Data operations" }, score: 84, detail: { zh: "调度 / 监控 / 稳定性", en: "Scheduling / monitoring / reliability" } },
    ],
    tags: ["SQL", "ETL", "Scala", "PySpark", { zh: "调度", en: "Scheduling" }, { zh: "治理", en: "Governance" }],
  },
  {
    title: { zh: "AI 工具链", en: "AI TOOLCHAIN" },
    accent: "violet",
    code: "02",
    items: [
      { name: "TRAE", score: 88, detail: { zh: "智能补全 / IDE 编排", en: "AI completion / IDE orchestration" } },
      { name: "Claude Code", score: 90, detail: { zh: "代码理解 / 自动化执行", en: "Code reasoning / autonomous execution" } },
      { name: "Codex", score: 84, detail: { zh: "生成式协作 / 重构", en: "Generative pairing / refactoring" } },
      { name: "DeepSeek Harness", score: 86, detail: { zh: "大模型调度 / Prompt 工程", en: "LLM routing / prompt engineering" } },
      { name: { zh: "主流 Agent 编程工具", en: "Agent coding tools" }, score: 82, detail: { zh: "Agent 协同 / 工作流编排", en: "Agent collaboration / workflows" } },
    ],
    tags: ["Agent", "RAG", "MCP", "Prompt", { zh: "自动化", en: "Automation" }, { zh: "评测", en: "Evaluation" }],
  },
];

const projects = [
  {
    code: "01",
    title: { zh: "实时数仓平台", en: "REAL-TIME DATA WAREHOUSE" },
    description: { zh: "从采集、建模到指标服务，构建稳定可观测的数据底座。", en: "A reliable, observable data foundation from ingestion to serving." },
    tags: ["Spark", "Hive", "Inceptor", "Airflow", "Python"],
    accent: "lime",
  },
  {
    code: "02",
    title: { zh: "企业级 RAG 知识助手", en: "ENTERPRISE RAG ASSISTANT" },
    description: { zh: "把知识库、检索和 Agent 工作流串成可复用的智能工具。", en: "A reusable intelligent tool connecting knowledge, retrieval, and agents." },
    tags: ["Claude Code", "TRAE", "RAG", "DeepSeek", "Python"],
    accent: "violet",
  },
];

const copy = {
  zh: {
    brand: "Kinetic Terminal",
    kicker: "> echo 'Hello, World!'",
    name: "ZSZ",
    identity: "数据开发 × AI 爱好者",
    identityEn: "Data Engineer × AI Enthusiast",
    tagline: "用数据构建可靠价值，以工程化思维迎接智能浪潮。",
    taglineEn: "Building value with data, delivering intelligence with engineering.",
    contact: "联系我",
    resume: "下载简历",
    resumeHint: "PDF 简历准备中，可通过下方联系方式与我交流。",
    pageTitle: "ZSZ｜数据开发 × AI 探索",
    backToTop: "返回顶部",
    switchLanguage: "Switch to English",
    sectionNavigation: "章节导航",
    capabilitySignal: "能力信号",
    copyAction: "复制",
    copyPending: "复制中…",
    copyDone: "已复制",
    copyRetry: "重试",
    copyPendingMessage: "正在复制微信号…",
    copySuccess: "微信号已复制",
    copyError: "复制未成功，请重试或手动复制微信号。",
    copyStatus: "复制状态",
    copyDismiss: "关闭复制提示",
    emailLabel: "邮箱",
    wechatLabel: "微信",
    locationLabel: "所在地",
    previewPlaceholder: "项目封面待补充",
    demoImageAlt: "数据看板演示占位图",
    particleImageAlt: "流动的数据粒子",
    codeLabel: "动态代码展示",
    footerMotto: "数据驱动价值 · AI 激发可能",
    running: "系统在线",
    live: "实时流",
    scroll: "滚动探索",
    skillsTitle: "技能矩阵",
    skillsSub: "CAPABILITIES OVERVIEW",
    projectsTitle: "项目作品",
    projectsSub: "SELECTED WORKS",
    demoTitle: "演示中心",
    demoSub: "LIVE DEMO",
    linksTitle: "外链入口",
    linksSub: "MORE TO EXPLORE",
    contactTitle: "保持联系",
    contactSub: "LET'S CONNECT",
    coming: "待补充 / COMING SOON",
    details: "详情待补充",
    focus: "当前聚焦",
    hoverHint: "悬停或点击技能查看细节",
    demoName: "数据流实时监控与智能告警演示",
    demoDescription: "展示从数据接入到指标服务的完整链路，以及智能告警如何协助定位异常。",
    play: "播放演示",
    pause: "暂停演示",
    github: "GitHub",
    blog: "技术博客",
    placeholderLink: "占位链接 / Coming Soon",
    location: "中国 · 上海",
    email: "hello@yourname.dev",
    wechat: "your_wechat_id",
    built: "用心构建 · 持续迭代",
    available: "开放合作 / 期待交流",
    throughput: "吞吐",
    latency: "延迟",
    uptime: "在线时长",
    demoBullets: ["实时数据链路可视化", "智能异常检测与告警", "指标服务与任务监控", "历史回溯与定位分析"],
    focusTags: ["数据仓库", "实时计算", "数据治理", "Agent 协作", "RAG", "智能体", "可视化"],
  },
  en: {
    brand: "Kinetic Terminal",
    kicker: "> echo 'Hello, World!'",
    name: "ZSZ",
    identity: "DATA ENGINEER × AI ENTHUSIAST",
    identityEn: "Data Engineer × AI Enthusiast",
    tagline: "Building value with data, delivering intelligence with engineering.",
    taglineEn: "Reliable data foundations. Practical AI exploration.",
    contact: "GET IN TOUCH",
    resume: "DOWNLOAD RESUME",
    resumeHint: "The PDF resume is being prepared. Contact details are available below.",
    pageTitle: "ZSZ | Data Engineering × AI Exploration",
    backToTop: "Back to top",
    switchLanguage: "切换到中文",
    sectionNavigation: "Section navigation",
    capabilitySignal: "capability signal",
    copyAction: "COPY",
    copyPending: "COPYING…",
    copyDone: "COPIED",
    copyRetry: "RETRY",
    copyPendingMessage: "Copying WeChat ID…",
    copySuccess: "WeChat ID copied",
    copyError: "Could not copy. Please retry or copy the WeChat ID manually.",
    copyStatus: "Copy status",
    copyDismiss: "Dismiss copy notification",
    emailLabel: "EMAIL",
    wechatLabel: "WECHAT",
    locationLabel: "LOCATION",
    previewPlaceholder: "PROJECT VISUAL PLACEHOLDER",
    demoImageAlt: "Data dashboard demo placeholder",
    particleImageAlt: "Luminous streaming data particles",
    codeLabel: "Animated code stream",
    footerMotto: "DATA IS THE NEW OIL · AI IS THE ENGINE",
    running: "SYSTEM ONLINE",
    live: "LIVE STREAM",
    scroll: "SCROLL TO EXPLORE",
    skillsTitle: "SKILLS MATRIX",
    skillsSub: "CAPABILITIES OVERVIEW",
    projectsTitle: "PROJECTS",
    projectsSub: "SELECTED WORKS",
    demoTitle: "DEMO CENTER",
    demoSub: "LIVE DEMO",
    linksTitle: "LINKS",
    linksSub: "MORE TO EXPLORE",
    contactTitle: "LET'S CONNECT",
    contactSub: "KEEP IN TOUCH",
    coming: "COMING SOON",
    details: "DETAILS COMING SOON",
    focus: "FOCUS",
    hoverHint: "HOVER OR SELECT A SKILL FOR DETAILS",
    demoName: "Real-time Data Stream & Smart Alerts",
    demoDescription: "A look at the full path from ingestion to serving, and how AI helps locate anomalies.",
    play: "PLAY DEMO",
    pause: "PAUSE DEMO",
    github: "GitHub",
    blog: "TECH BLOG",
    placeholderLink: "PLACEHOLDER / COMING SOON",
    location: "SHANGHAI, CHINA",
    email: "hello@yourname.dev",
    wechat: "your_wechat_id",
    built: "BUILT WITH CARE · ITERATING DAILY",
    available: "OPEN TO WORK / COLLABORATION",
    throughput: "THROUGHPUT",
    latency: "LATENCY",
    uptime: "UPTIME",
    demoBullets: ["Real-time data pipeline visibility", "Smart anomaly detection & alerts", "Metric serving & task monitoring", "History replay & root-cause analysis"],
    focusTags: ["DATA WAREHOUSE", "STREAMING", "GOVERNANCE", "AGENT PAIRING", "RAG", "AUTOMATION", "VISUALIZATION"],
  },
};

function localize(value, lang) {
  return typeof value === "string" ? value : value[lang];
}

function ExternalIcon({ type }) {
  const source = type === "github"
    ? "https://cdn.simpleicons.org/github/ffffff"
    : "https://cdn.simpleicons.org/medium/ffffff";

  return (
    <img
      className="external-icon"
      src={source}
      alt=""
      aria-hidden="true"
      onError={(event) => { event.currentTarget.style.display = "none"; }}
    />
  );
}

function SectionHeader({ index, title, sub, id }) {
  return (
    <div className="section-header">
      <div className="section-index">{index}</div>
      <div>
        <h2 id={`${id}-title`}>{title}</h2>
        <span>{sub}</span>
      </div>
      <div className="section-rule" />
      <div className="section-code">// {sub}</div>
    </div>
  );
}

function SkillRow({ item, id, lang, visible, onFocusSkill }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = expanded || hovered;
  return (
    <div className="skill-entry" onPointerEnter={(event) => { if (event.pointerType === "mouse") { setHovered(true); onFocusSkill(); } }} onPointerLeave={() => setHovered(false)}>
      <button type="button" className="skill-row" aria-expanded={open} aria-controls={`${id}-detail`} onFocus={onFocusSkill} onClick={() => { setHovered(false); setExpanded((current) => !current); }}>
        <span className="skill-name">{localize(item.name, lang)}</span>
        <span className="skill-bar"><span className="skill-bar-fill" style={{ width: visible ? `${item.score}%` : "0%" }} /></span>
        <span className="skill-score">{item.score}%</span>
      </button>
      <p id={`${id}-detail`} className={`skill-detail ${expanded ? "skill-detail--expanded" : "skill-detail--preview"}`} hidden={!open}>{localize(item.detail, lang)}</p>
    </div>
  );
}

function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = max > 0 ? window.scrollY / max : 0;
      if (ref.current) ref.current.style.transform = `scaleY(${Math.min(1, Math.max(0.1, fraction))})`;
    };
    const schedule = () => { if (frame === null) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}

export function App() {
  const reducedMotion = useReducedMotion();
  const [lang, setLang] = useState("zh");
  const [showResumeNotice, setShowResumeNotice] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [visibleSections, setVisibleSections] = useState(new Set(["home"]));
  const [focusSkill, setFocusSkill] = useState("01-0");
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(16);
  const [streamIndex, setStreamIndex] = useState(0);
  const terminalRef = useRef(null);
  const tiltTargetRef = useRef({ x: 0, y: 0 });
  const tiltCurrentRef = useRef({ x: 0, y: 0 });
  const tiltFrameRef = useRef(null);
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = t.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.pageTitle);
  }, [lang, t.pageTitle]);

  const streamReadouts = useMemo(() => [
    { label: t.throughput, value: "1.2k r/s" },
    { label: t.latency, value: "38ms" },
    { label: t.uptime, value: "12d 08:34:21" },
  ], [lang, t.throughput, t.latency, t.uptime]);

  useEffect(() => {
    const revealAll = () => setVisibleSections(new Set(sections.map((section) => section.id)));
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealAll();
      return undefined;
    }

    try {
      const observer = new IntersectionObserver((entries) => {
        setVisibleSections((current) => {
          const next = new Set(current);
          entries.forEach((entry) => {
            if (entry.isIntersecting) next.add(entry.target.dataset.section);
          });
          return next;
        });
      }, { threshold: 0.01, rootMargin: "0px 0px -12% 0px" });

      document.querySelectorAll("[data-section]").forEach((section) => observer.observe(section));
      return () => observer.disconnect();
    } catch (error) {
      revealAll();
      return undefined;
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    try {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.dataset.section);
      }, { threshold: [0.18, 0.45, 0.7], rootMargin: "-15% 0px -55% 0px" });

      document.querySelectorAll("[data-section]").forEach((section) => observer.observe(section));
      return () => observer.disconnect();
    } catch (error) {
      return undefined;
    }
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setInterval(() => setStreamIndex((current) => (current + 1) % streamReadouts.length), 1800);
    return () => window.clearInterval(timer);
  }, [streamReadouts.length, reducedMotion]);

  useEffect(() => {
    if (!isPlaying || reducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setVideoProgress((current) => current >= 100 ? 0 : current + 1.2);
    }, 120);
    return () => window.clearInterval(timer);
  }, [isPlaying, reducedMotion]);

  useEffect(() => {
    if (!reducedMotion) return;
    if (tiltFrameRef.current) window.cancelAnimationFrame(tiltFrameRef.current);
    tiltFrameRef.current = null;
    tiltTargetRef.current = { x: 0, y: 0 };
    tiltCurrentRef.current = { x: 0, y: 0 };
    if (terminalRef.current) terminalRef.current.style.transform = "none";
    setIsPlaying(false);
  }, [reducedMotion]);

  useEffect(() => () => {
    if (tiltFrameRef.current) window.cancelAnimationFrame(tiltFrameRef.current);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth", block: "start" });
  };

  const animateTerminalTilt = () => {
    const element = terminalRef.current;
    if (!element || prefersReducedMotion()) {
      if (element) element.style.transform = "none";
      tiltFrameRef.current = null;
      return;
    }

    const current = tiltCurrentRef.current;
    const target = tiltTargetRef.current;
    current.x += (target.x - current.x) * 0.16;
    current.y += (target.y - current.y) * 0.16;
    element.style.transform = `perspective(1200px) rotateX(${current.y.toFixed(3)}deg) rotateY(${current.x.toFixed(3)}deg) translateZ(0)`;

    if (Math.abs(target.x - current.x) > 0.02 || Math.abs(target.y - current.y) > 0.02) {
      tiltFrameRef.current = window.requestAnimationFrame(animateTerminalTilt);
    } else {
      current.x = target.x;
      current.y = target.y;
      element.style.transform = `perspective(1200px) rotateX(${target.y}deg) rotateY(${target.x}deg) translateZ(0)`;
      tiltFrameRef.current = null;
    }
  };

  const handleTerminalMove = (event) => {
    if (event.pointerType === "touch" || prefersReducedMotion()) return;
    const bounds = terminalRef.current?.getBoundingClientRect();
    if (!bounds) return;
    if (!bounds.width || !bounds.height) return;
    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
    tiltTargetRef.current = { x: x * 7, y: y * -7 };
    if (!tiltFrameRef.current) tiltFrameRef.current = window.requestAnimationFrame(animateTerminalTilt);
  };

  const resetTerminalTilt = () => {
    if (prefersReducedMotion()) return;
    tiltTargetRef.current = { x: 0, y: 0 };
    if (!tiltFrameRef.current) tiltFrameRef.current = window.requestAnimationFrame(animateTerminalTilt);
  };

  return (
    <main className="site-shell">
      <div className="noise-layer" aria-hidden="true" />
      <ScrollProgress />

      <header className="topbar">
        <button className="brand-lockup" onClick={() => scrollTo("home")} aria-label={t.backToTop}>
          <span className="brand-mark" aria-hidden="true"><img className="z-spin" src="/favicon.svg" alt="" /></span>
          <span>
            <strong>{t.brand}</strong>
            <small>DATA · CODE · INTELLIGENCE</small>
          </span>
        </button>
        <div className="topbar-status">
          <span className="status-dot" /> {t.running}
          <span className="topbar-divider">/</span>
          <span className="status-pulse">{t.live}</span>
        </div>
        <button className="language-toggle" onClick={() => setLang((current) => current === "zh" ? "en" : "zh")} aria-label={t.switchLanguage}>
          <span lang="zh-CN" className={lang === "zh" ? "is-active" : ""}>中</span>
          <span className="toggle-divider">/</span>
          <span lang="en" className={lang === "en" ? "is-active" : ""}>EN</span>
        </button>
      </header>

      <aside className="section-nav" aria-label={t.sectionNavigation}>
        <div className="nav-line" />
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`nav-item ${activeSection === section.id ? "is-active" : ""}`}
            onClick={() => scrollTo(section.id)}
          >
            <span className="nav-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="nav-label">{localize(section.label, lang)}</span>
          </button>
        ))}
        <div className="nav-scroll-label">{t.scroll}<br /><span>↓</span></div>
      </aside>

      <section id="home" data-section="home" className="hero section-wrap">
        <div className="hero-copy reveal-on-scroll is-visible">
          <span className="hero-kicker">{t.kicker}</span>
          <h1>{t.name}<span className="cursor-block" aria-hidden="true" /></h1>
          <div className="hero-identity">
            <span>{t.identity}</span>
            <small>{t.identityEn}</small>
          </div>
          <div className="accent-rule" />
          <p className="hero-tagline">{t.tagline}</p>
          <p className="hero-tagline hero-tagline--en">{t.taglineEn}</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => scrollTo("contact")}>
              <span className="button-prompt">&gt;_</span>
              {t.contact}
              <span className="button-arrow" aria-hidden="true">→</span>
            </button>
            <button className="secondary-button" type="button" onClick={() => setShowResumeNotice(true)} title={t.resumeHint} aria-describedby={showResumeNotice ? "resume-status" : undefined}>
              {t.resume}
              <span className="button-arrow" aria-hidden="true">↓</span>
            </button>
          </div>
          <p id="resume-status" className="resume-notice" role="status">{showResumeNotice ? t.resumeHint : ""}</p>
          <div className="hero-meta">
            <span><b className="meta-symbol">@</b> {t.location}</span>
            <span><b className="meta-symbol">↗</b> {t.available}</span>
            <span><b className="meta-symbol">UTC+8</b> <span className="hero-time">09:42:18</span></span>
          </div>
        </div>

        <div
          ref={terminalRef}
          className="terminal-card-wrap reveal-on-scroll is-visible"
          onPointerMove={handleTerminalMove}
          onPointerLeave={resetTerminalTilt}
        >
          <div className="terminal-card">
            <div className="terminal-bar">
              <span className="window-dots"><i /><i /><i /></span>
              <span>terminal@kinetic:~ /home/engineer</span>
              <span className="terminal-live"><span className="status-dot" /> {t.live}</span>
            </div>
            <div className="terminal-body">
              <div className="code-stream" aria-label={t.codeLabel}>
                {[
                  "import data as d",
                  "import ai",
                  "class DataEngineer:",
                  "  def __init__(self):",
                  '    self.mission = "Make data work smarter"',
                  "  def build(self):",
                  "    while True:",
                  "      ingest → clean → model → serve",
                  "      yield insight",
                ].map((line, index) => (
                  <div key={line} className={`code-line ${index === 8 ? "code-line--active" : ""}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>{line}
                  </div>
                ))}
                <div className="code-prompt"><span>$</span> signal@terminal:~ {""}<i className="typing-cursor" /></div>
              </div>
              <div className="particle-window">
                <img src="/assets/particle-stream.png" alt={t.particleImageAlt} />
                <div className="particle-labels"><span>DATA PARTICLES</span><span>LIVE TELEMETRY</span></div>
              </div>
            </div>
            <div className="terminal-footer">
              <span>MODE: STREAM</span>
              <span>BATCH: 256</span>
              <span>{streamReadouts[streamIndex].label}: <b>{streamReadouts[streamIndex].value}</b></span>
            </div>
          </div>
          <div className="terminal-video-controls">
            <button onClick={() => setIsPlaying((current) => !current)} aria-label={isPlaying ? t.pause : t.play}>
              <span className="control-state">{isPlaying ? "||" : ">"}</span>
            </button>
            <div className="control-track"><span style={{ width: `${videoProgress}%` }} /></div>
            <span className="control-time">00:{String(Math.round(videoProgress * 0.6)).padStart(2, "0")} / 01:24</span>
          </div>
        </div>

        <button className="scroll-cue" onClick={() => scrollTo("skills")}>
          <span>{t.scroll}</span><b>↓</b>
        </button>
      </section>

      <section id="skills" data-section="skills" className={`content-section section-wrap ${visibleSections.has("skills") ? "is-visible" : ""}`}>
        <SectionHeader id="skills" index="01" title={t.skillsTitle} sub={t.skillsSub} />
        <div className="skills-note"><span className="status-dot" /> {t.hoverHint} <span className="note-code">// INTERACTIVE DATA</span></div>
        <div className="skills-grid">
          {skills.map((group) => (
            <article className={`skill-panel skill-panel--${group.accent}`} key={group.code}>
              <div className="skill-panel-head">
                <span className="skill-code">{group.code}</span>
                <div>
                  <h3>{localize(group.title, lang)}</h3>
                  <span>{group.accent === "lime" ? "DATA / ENGINEERING" : "AI / TOOLCHAIN"}</span>
                </div>
                <span className="panel-live">{t.live}</span>
              </div>
              <div className="skill-panel-body">
                <div className="skill-list">
                  {group.items.map((item, index) => (
                    <SkillRow key={`${group.code}-${index}`} id={`skill-${group.code}-${index}`} item={item} lang={lang} visible={visibleSections.has("skills")} onFocusSkill={() => setFocusSkill(`${group.code}-${index}`)} />
                  ))}
                </div>
                <div className="skill-dial" aria-label={`${localize(group.title, lang)} ${t.capabilitySignal}`}>
                  <div className="dial-ring dial-ring--outer" />
                  <div className="dial-ring dial-ring--middle" />
                  <div className="dial-core"><span>{group.accent === "lime" ? "DATA" : "AI"}</span><b>{focusSkill === `${group.code}-0` || focusSkill === `${group.code}-3` ? "96" : "88"}</b></div>
                  <span className="dial-axis dial-axis--top">{group.accent === "lime" ? "MODEL" : "AGENT"}</span>
                  <span className="dial-axis dial-axis--right">{group.accent === "lime" ? "ETL" : "RAG"}</span>
                  <span className="dial-axis dial-axis--bottom">{group.accent === "lime" ? "OPS" : "MCP"}</span>
                  <span className="dial-axis dial-axis--left">{group.accent === "lime" ? "SQL" : "LLM"}</span>
                </div>
              </div>
              <div className="skill-tags">{group.tags.map((tag) => <span key={localize(tag, "en")}>{localize(tag, lang)}</span>)}</div>
            </article>
          ))}
        </div>
        <div className="signal-strip">
          <span className="signal-strip-label">{t.focus}</span>
          {t.focusTags.map((tag) => <span key={tag}>{tag}</span>)}
          <span className="signal-strip-cursor">+</span>
        </div>
      </section>

      <section id="projects" data-section="projects" className={`content-section section-wrap ${visibleSections.has("projects") ? "is-visible" : ""}`}>
        <SectionHeader id="projects" index="02" title={t.projectsTitle} sub={t.projectsSub} />
        <div className="projects-grid">
          {projects.map((project) => (
            <article className={`project-card project-card--${project.accent}`} key={project.code}>
              <div className="project-card-top"><span>{project.code}</span><b>{t.coming}</b></div>
              <div className="project-preview" aria-label={t.coming}>
                <div className="preview-grid" aria-hidden="true" />
                <div className="preview-center"><span className="preview-bracket">[ ]</span><strong>{t.coming}</strong><small>{t.previewPlaceholder}</small></div>
                <span className="preview-corner">{project.accent === "lime" ? "DATA / 01" : "AI / 02"}</span>
              </div>
              <div className="project-info">
                <h3>{localize(project.title, lang)}</h3>
                <p>{localize(project.description, lang)}</p>
                <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <button className="project-link" type="button" disabled>
                {t.details} <span aria-hidden="true">…</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="demo" data-section="demo" className={`content-section section-wrap ${visibleSections.has("demo") ? "is-visible" : ""}`}>
        <SectionHeader id="demo" index="03" title={t.demoTitle} sub={t.demoSub} />
        <div className="demo-layout">
          <div className="demo-player">
            <img src="/assets/demo-dashboard.png" alt={t.demoImageAlt} loading="lazy" decoding="async" />
            <div className="demo-overlay"><span className="demo-status"><span className="status-dot" /> {t.live}</span><span>00:00 / 01:24</span></div>
            <button className={`demo-play ${isPlaying ? "is-playing" : ""}`} onClick={() => setIsPlaying((current) => !current)} aria-label={isPlaying ? t.pause : t.play}>
              <span>{isPlaying ? "||" : ">"}</span>
            </button>
            <div className="demo-progress"><span style={{ width: `${videoProgress}%` }} /></div>
          </div>
          <div className="demo-copy">
            <span className="demo-eyebrow">01 / TOOL DEMO / LIVE</span>
            <h3>{t.demoName}</h3>
            <p>{t.demoDescription}</p>
            <ul>
              {t.demoBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
            <button className="text-button" onClick={() => setIsPlaying((current) => !current)}>{isPlaying ? t.pause : t.play} <span>→</span></button>
          </div>
        </div>
      </section>

      <section id="links" data-section="links" className={`content-section section-wrap ${visibleSections.has("links") ? "is-visible" : ""}`}>
        <SectionHeader id="links" index="04" title={t.linksTitle} sub={t.linksSub} />
        <div className="links-grid">
          <a className="external-link-card external-link-card--violet" href="https://github.com/yourname" target="_blank" rel="noreferrer">
            <ExternalIcon type="github" />
            <span><strong>{t.github}</strong><small>{t.placeholderLink}</small><em>github.com/yourname</em></span>
            <b>↗</b>
          </a>
          <a className="external-link-card external-link-card--lime" href="https://yourname.dev/blog" target="_blank" rel="noreferrer">
            <ExternalIcon type="blog" />
            <span><strong>{t.blog}</strong><small>{t.placeholderLink}</small><em>yourname.dev/blog</em></span>
            <b>↗</b>
          </a>
        </div>
      </section>

      <section id="contact" data-section="contact" className={`content-section content-section--last section-wrap ${visibleSections.has("contact") ? "is-visible" : ""}`}>
        <SectionHeader id="contact" index="05" title={t.contactTitle} sub={t.contactSub} />
        <div className="contact-grid">
          <a href={`mailto:${t.email}`} className="contact-item"><span className="contact-label">{t.emailLabel}</span><strong>{t.email}</strong><span className="contact-action">↗</span></a>
          <CopyContact value={t.wechat} messages={t} />
          <div className="contact-item"><span className="contact-label">{t.locationLabel}</span><strong>{t.location}</strong><span className="contact-action">UTC+8</span></div>
        </div>
      </section>

      <footer className="footer">
        <span>© 2025 {t.name} · {t.built}</span>
        <span>{t.footerMotto}</span>
        <button onClick={() => scrollTo("home")}>{t.backToTop} ↑</button>
      </footer>
    </main>
  );
}
