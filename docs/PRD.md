# Product Grave — Product Requirements Document

> **Status**: Draft  
> **Version**: 0.9  
> **Last Updated**: 2026-04-26  
> **Owner**: Product Lead  
> **Stakeholders**: Design, Engineering, Content

---

## 1. 项目背景与概述

### 1.1 一句话描述
Product Grave 是一个像素风格的数字墓园，以趣味而精美的方式记录并讲述那些已经「死亡」的科技产品的故事，让创业者和产品从业者从失败中免费学习。

### 1.2 为什么要做这个项目
- **失败的经验更稀缺**：市面上充斥着成功学，但系统性地记录和分析产品失败原因的公开数据库很少。
- **视觉即传播**：像素风格在 tech / design 社区有天然的传播力，墓碑的视觉符号具有极强的记忆点。
- **SEO 蓝海**：「Why did X fail」类的长尾搜索词竞争度低，但搜索意图明确。
- **出海友好**：失败案例是跨文化、跨语言的普世话题，天然适合全球化。

### 1.3 核心价值主张
**"Learn from the dead."**

我们不为失败唱挽歌，而是把每一次死亡结构化为一本公开的「验尸报告」，让活着的人少踩一个坑。

---

## 2. 产品定位

| 维度 | 定义 |
|------|------|
| **产品类型** | 内容型数据库（Content Database）+ 轻度社区互动 |
| **情感基调** | 趣味但不轻浮，纪念但不沉重。像一座夜间开放的像素博物馆。 |
| **竞争对标** | Failory（内容深度）、Killed by Google（数据广度）、Museum of Failure（文化属性） |
| **差异化** | ① 精致的像素风视觉系统；② 叙事化的死亡故事，非冷冰冰的数据条目；③ 游戏化的墓园体验 |

---

## 3. 目标用户（User Personas）

### 3.1 主要用户：Eric — 早期创业者
- **背景**：正在筹备或刚启动一个 SaaS / AI / Consumer 项目
- **痛点**：担心自己的产品方向错误，想知道类似赛道上的前辈是怎么死的
- **使用场景**：在 Product Grave 搜索自己的竞品或相似赛道，阅读死亡报告，提取避坑清单
- **需求**：结构化信息、可信来源、可执行的经验教训

### 3.2 次要用户：Sarah — 产品经理
- **背景**：在大厂或成长期公司做产品决策
- **痛点**：需要做竞品分析和行业历史研究，但信息散落在各处
- **使用场景**：浏览「按死因分类」，了解某一类失败（如「过早上市」「PMF 未找到」）的共性模式
- **需求**：分类浏览、时间线、数据可视化

### 3.3 潜在用户：Alex — Indie Hacker / 设计师
- **背景**：喜欢有趣的小众网站，活跃在 Twitter/X、Product Hunt、Hacker News
- **痛点**：无聊，想要有审美价值和传播价值的内容
- **使用场景**：被一张像素墓碑图吸引，点进来浏览，分享到自己的社交圈
- **需求**：视觉惊喜、社交分享、轻互动（献花、墓志铭）

---

## 4. 信息架构（Information Architecture）

```
productgrave.com
│
├── 🏠 首页 /graveyard
│   ├── 墓碑墙（所有产品卡片网格）
│   ├── 今日祭品（每日推荐 / 随机）
│   └── 墓园数据（死亡统计大屏）
│
├── 📋 产品详情页 /grave/[slug]
│   ├── 死亡档案（基础信息）
│   ├── 生平时间线
│   ├── 验尸报告（死因分析）
│   ├── 经验教训（TL;DR + 详细）
│   ├── 墓志铭（可互动）
│   └── 陪葬品（相关产品推荐）
│
├── 🔍 浏览 /browse
│   ├── 按死因（Cause of Death）
│   ├── 按行业（Industry）
│   ├── 按年代（Era）
│   └── 按融资阶段（Stage at Death）
│
├── 📊 死因统计 /stats
│   ├── 死亡趋势图
│   ├── 行业死亡率
│   └── 常见死因排行
│
├── 📝 提交案例 /submit
│   ├── 公开提交表单
│   └── 提交指南
│
├── 📰 墓园公报 /blog
│   └── 周刊文章、专题分析
│
└── ℹ️ 关于 /about
    ├── 项目理念
    ├── 贡献者名单
    └── 开源协议
```

---

## 5. 功能需求详细说明

### 5.1 首页（Graveyard）

**目标**：让用户第一眼理解产品，并产生探索欲望。

| 模块 | 优先级 | 需求描述 |
|------|--------|----------|
| **墓碑墙** | P0 | 以响应式网格展示所有产品的像素墓碑卡片。每张卡片包含：像素墓碑图、产品名、存活时间、一句墓志铭。默认按「死亡时间倒序」排列。 |
| **筛选栏** | P0 | 顶部悬浮/固定栏，支持按死因、行业快速筛选。筛选后墓碑墙无刷新动画过渡。 |
| **搜索** | P1 | 全局搜索产品名。支持快捷键 `/` 触发。 |
| **今日祭品** | P1 | 首页顶部 Banner 区域，展示一个「今日推荐」的死亡案例，配一段引人入胜的导语。 |
| **墓园数据** | P2 | 首页底部展示核心数据：已埋葬产品数、最常见死因、本月新增。数字带像素风计数动画。 |

**交互细节**：
- 鼠标悬停墓碑：墓碑轻微晃动（CSS transform），产品名高亮，背景出现淡淡的幽灵粒子（CSS animation，性能友好）。
- 点击墓碑：进入详情页，过渡动画为「墓碑裂开/打开」的像素动画。

### 5.2 产品详情页（Death Certificate / Tombstone）

**目标**：提供完整的、可信赖的产品死亡分析。

| 模块 | 优先级 | 需求描述 |
|------|--------|----------|
| **死亡档案头图** | P0 | 大尺寸像素墓碑图 + 产品 Logo（如有）像素化版本。顶部标签展示：行业、死因、存活时间。 |
| **基础信息栏** | P0 | 结构化展示：出生（发布）时间、死亡（关停）时间、总部所在地、融资总额、最高轮次、创始人。 |
| **生平时间线** | P0 | 垂直时间线，展示产品从诞生到死亡的关键节点。每个节点配简短描述。 |
| **验尸报告** | P0 | 核心内容区。分为：① 官方说法（如有）；② 我们的分析（主因 + 辅因）；③ 关键转折点。文字配像素风插图（如手术刀、放大镜图标）。 |
| **经验教训** | P0 | TL;DR 版本（3-5 条 bullet points）+ 详细解读。这部分是 SEO 重点，也是用户最可能保存/分享的内容。 |
| **墓志铭** | P1 | 一句为该产品撰写的、带有文学性的总结语。下方允许用户「献花」（点击计数+1，无登录要求）。 |
| **陪葬品** | P1 | 「类似死因」或「同一行业」的其他产品推荐，以横向小卡片展示。 |
| **分享区** | P1 | 生成该产品的「死亡证书」分享图（Open Graph 图），一键复制链接 / 分享到 X/Twitter。 |
| **来源引用** | P0 | 所有事实需附引用链接，确保可信度。 |

**SEO 要求**：
- URL: `/grave/google-glass`
- Title: `Google Glass (2013–2015) — Product Grave`
- Meta Description: 包含产品名、死因和一句核心教训，控制在 150 字符内。
- JSON-LD: 使用 `Article` + `Organization` 结构化数据。
- OG Image: 自动生成像素风卡片，包含产品名、墓志铭、存活时间。

### 5.3 浏览页（Browse）

**目标**：支持探索式发现。

| 模块 | 优先级 | 需求描述 |
|------|--------|----------|
| **死因分类** | P0 | 展示所有死因标签及其对应的产品数量。点击后进入筛选后的墓碑墙。 |
| **行业分类** | P0 | 同上，按行业聚合。 |
| **年代分类** | P1 | 按十年维度：2000s、2010s、2020s、AI Era。 |
| **阶段分类** | P2 | 按死亡时的融资/发展阶段：Pre-launch、Seed、Series A、Growth、Post-IPO。 |

**死因标签体系（V1）**：
- `burnout` — 烧钱过度 / 资金链断裂
- `no-pmf` — 未找到产品市场契合
- `too-early` — 生不逢时 / 市场尚未成熟
- `execution` — 执行失败 / 团队问题
- `competition` — 被巨头碾压 / 竞争失败
- `regulation` — 政策 / 法律杀死
- `acquired-killed` — 被收购后关停
- `pivot-failed` — 转型失败
- `hype-crash` — 泡沫破裂
- `unknown` — 死因不明

每个死因标签需配一个独特的像素图标和颜色标识。

### 5.4 墓园数据页（Stats）

**目标**：用数据可视化提升专业感和传播性。

| 模块 | 优先级 | 需求描述 |
|------|--------|----------|
| **死亡趋势** | P1 | 折线图 / 柱状图：每年死亡的产品数量。像素风图表样式。 |
| **行业死亡率** | P2 | 展示各行业死亡案例占比。 |
| **常见死因排行** | P1 | 排行榜，展示最常见的 5-10 种死因及占比。 |
| **最大陪葬品** | P2 | 融资总额最高的死亡产品 Top 10。 |

### 5.5 提交案例（Submit）

**目标**：建立内容增长的飞轮。

| 模块 | 优先级 | 需求描述 |
|------|--------|----------|
| **提交表单** | P1 | 字段：产品名、死亡时间、行业、死因、故事描述、参考链接、提交者邮箱。 |
| **提交指南** | P1 | 说明我们接受什么类型的案例、内容质量标准、审核周期。 |
| **致谢墙** | P2 | 列出内容贡献者的 GitHub 用户名或昵称。 |

**审核流程**：
1. 用户提交 → 进入 GitHub Issues（自动创建）
2. 维护者审核内容 → 合并为 Markdown 文件
3. 网站自动重新构建并发布

### 5.6 墓园公报 / 博客（Blog）

**目标**：提升 SEO，建立品牌声音。

| 模块 | 优先级 | 需求描述 |
|------|--------|----------|
| **周刊** | P2 | 「本周墓园新葬」—— 每周介绍 1 个新上架案例 + 1 个行业死亡趋势短评。 |
| **专题** | P2 | 深度长文，如「AI 初创公司死亡报告 2024」「SaaS 的 12 种死法」。 |
| **RSS** | P2 | 提供 RSS Feed 订阅。 |

---

## 6. 设计规范（Design System）

### 6.1 视觉方向
- **风格**：精致的 16-bit 像素艺术（参考 *Stardew Valley*, *Eastward*, *Hyper Light Drifter*）。拒绝粗糙的 8-bit，追求在复古中体现现代审美。
- **世界观**：一座永夜的数字墓园。天空是深紫色渐变，地面是深灰色石板，墓碑错落有致。
- **情绪**：神秘、安静、略带幽默感，不恐怖不悲伤。

### 6.2 配色系统

```
Background Primary:   #1A1423  (深紫夜)
Background Secondary: #2D2420  (墓园土地)
Surface:              #3E3633  (石板/墓碑基座)

Text Primary:         #F4F1DE  (骨白)
Text Secondary:       #B5B0A3  (旧石灰)
Text Muted:           #6B6560  (墓碑刻痕)

Accent Primary:       #57CC99  (幽灵绿 / 链接 / 数据)
Accent Secondary:     #E07A5F  (死亡红 / 警告 / 重点)
Accent Tertiary:      #F2CC8F  (蜡烛黄 / 高亮)

Cause Tags:
  burnout:     #E63946
  no-pmf:      #6A994E
  too-early:   #457B9D
  execution:   #E9C46A
  competition: #9B5DE5
  regulation:  #F4A261
  ...
```

### 6.3 字体栈
- **像素标题**：`"Press Start 2P", "Pixelify Sans", cursive`（仅用于 H1-H3、按钮、导航、标签）
- **正文阅读**：`Inter, "Noto Sans SC", system-ui, sans-serif`
- **代码/数据**：`"JetBrains Mono", "SF Mono", monospace`

### 6.4 像素组件规范

| 组件 | 规范 |
|------|------|
| **墓碑卡片** | 统一 3/4 侧视角度，宽度 240px，高度 320px（比例固定）。材质为灰色石料，顶部可有装饰（十字架、齿轮、火焰等根据死因变化）。 |
| **产品 Icon** | 如有真实 Logo，需先像素化处理（降低分辨率 + 调整调色板），统一为 64×64px。 |
| **按钮** | 矩形带 2px 描边，hover 时背景色变浅并下移 2px（模拟按下）。 |
| **标签** | 圆角矩形不可用（像素风），使用斜切角或直角矩形标签。 |
| **分隔线** | 用虚线或像素装饰线（如一排小十字架、小星星）。 |

### 6.5 动效原则
- **性能优先**：所有动效使用 CSS transform 和 opacity，不使用 JS 动画库做高频渲染。
- **像素一致性**：动效帧率可故意限制为 12fps，增强复古游戏感。
- ** hover 反馈**：墓碑晃动（rotate ±2deg）、按钮按下（translateY 2px）、链接发光（text-shadow）。
- **页面过渡**：简单的淡入淡出，或像素块扫描效果（可选）。

### 6.6 响应式断点

| 断点 | 布局 |
|------|------|
| Desktop (>1024px) | 4-5 列墓碑墙，侧边栏可展开 |
| Tablet (768–1024px) | 3 列墓碑墙，导航收起为汉堡菜单 |
| Mobile (<768px) | 2 列墓碑墙，垂直堆叠详情页 |

---

## 7. 内容策略

### 7.1 内容来源
- **一手研究**：Crunchbase、TechCrunch 归档、The Information、Wikipedia、公司官方博客关停公告。
- **二手分析**：Failory、CB Insights、相关书籍（*The Lean Startup*、*Zero to One* 中提到的失败案例）。
- **社区提交**：通过 Submit 页面收集，审核后发布。

### 7.2 内容质量标准
- 每个案例必须包含：基础信息、时间线、死因分析、至少 3 条经验教训。
- 事实需标注来源链接。
- 避免主观恶意嘲讽，保持客观和分析性。
- 英文为主，中文为辅（出海定位）。

### 7.3 内容模板（Frontmatter）

每个案例对应一个 Markdown 文件，使用以下 frontmatter：

```yaml
---
name: "Google Glass"
slug: "google-glass"
status: "published" # published | draft | archived

birth: "2013-04"
death: "2015-01"
lifespan_months: 21
headquarters: "Mountain View, CA"
industry: "hardware"
cause_of_death: ["too-early", "regulation"]
stage_at_death: "internal" # seed | series-a | growth | post-ipo | bootstrapped | internal
funding_total: "$0"
funding_currency: "USD"
founders: ["Sergey Brin", "Project X team"]

epitaph: "它看到了一切，除了未来。"
summary: >
  Google Glass 是一款野心勃勃的增强现实眼镜，
  因隐私争议、高昂定价和缺乏使用场景而夭折。

timeline:
  - date: "2012-04"
    event: "Google I/O 惊艳亮相"
  - date: "2013-04"
    event: "Explorer Edition 开售，定价 $1500"
  - date: "2014-04"
    event: "多州餐厅、影院禁止佩戴"
  - date: "2015-01"
    event: "Google 停止 Explorer Edition 生产线"
  - date: "2015-03"
    event: "项目从 Google X 转出，淡出消费级市场"

lessons:
  - title: "技术超前不等于市场就绪"
    detail: "AR 在当时缺乏杀手级应用场景，$1500 的定价让早期采用者门槛过高。"
  - title: "隐私红线不能碰"
    detail: "随时随地的录像能力引发了强烈的社会反弹，产品未准备好应对伦理争议。"
  - title: "早期采用者与大众市场之间有鸿沟"
    detail: "Geek 群体的欢呼不等于大众市场的接受。没有清晰的 GTM 策略穿越鸿沟。"

related:
  - "magic-leap"
  - "snap-spectacles-v1"

sources:
  - title: "Wikipedia"
    url: "https://en.wikipedia.org/wiki/Google_Glass"
  - title: "Google Blog Archive"
    url: "https://blog.google/..."

og_image: "/images/og/google-glass.png"
---
```

### 7.4 首批内容清单（MVP 30 个）

按优先级排序：

| 优先级 | 案例 | 死因 | 行业 | 原因 |
|--------|------|------|------|------|
| P0 | Google Glass | too-early | Hardware | 知名度高，故事丰富 |
| P0 | Quibi | burnout | Streaming | 烧钱典型案例 |
| P0 | Theranos | execution | Health | 极端执行失败 |
| P0 | Windows Phone | competition | Mobile | 被巨头碾压经典 |
| P0 | FTX | hype-crash | Crypto | 近年热点 |
| P0 | Sidecar | competition | Ride-sharing | 被 Uber 碾压 |
| P0 | Vine | acquired-killed | Social | 被 Twitter 杀死 |
| P0 | Google+ | no-pmf | Social | 社交失败典型 |
| P0 | Juicero | no-pmf | Hardware | 荒诞经典，传播力强 |
| P0 | WeWork (IPO 前估值崩盘) | execution / hype | Real Estate | 近年最大之一 |
| P1 | Path | competition | Social | 精美但失败 |
| P1 | Rdio | competition | Music | 被 Spotify 碾压 |
| P1 | Homejoy | no-pmf | Service | 清洁服务 O2O |
| P1 | Secret | regulation / ethics | Social | 匿名社交伦理 |
| P1 | Color | no-pmf | Social | 4100 万美元种子轮归零 |
| P1 | Pets.com | burnout | E-commerce | 互联网泡沫象征 |
| P1 | Beepi | execution | E-commerce | 二手车 O2O |
| P1 | Alto | no-pmf | Food | 送餐机器人 |
| P1 | Metaverse (Meta 消费级) | too-early | VR | 生不逢时 |
| P1 | Clinkle | execution | Fintech | 名校创始人翻车 |
| P2 | ... | ... | ... | 持续补充 |

---

## 8. 技术架构

### 8.1 技术选型

| 层级 | 技术 | 理由 |
|------|------|------|
| **框架** | Astro 5.x | 内容型网站最优解。零 JS 默认、Content Collections、极佳的 Lighthouse 分数。 |
| **语言** | TypeScript | 类型安全，便于维护。 |
| **样式** | Tailwind CSS + 自定义 CSS | 快速开发 + 像素风特殊样式补充。 |
| **组件** | React 群岛（Astro Islands） | 仅在需要交互的地方（筛选、搜索、献花计数）注水 React 组件。 |
| **CMS** | Markdown + Git | 案例即文件，Git 即 CMS。零成本、版本可控、社区可 PR。 |
| **部署** | Vercel | 原生支持 Astro，自动预览部署，全球 CDN。 |
| **域名/DNS** | Cloudflare | DNS 解析 + 域名注册 + 未来可能的 R2 图床。 |
| **分析** | Google Analytics 4 | 标准行为分析 + 自定义事件。 |
| **搜索** | Pagefind / Fuse.js | 静态站点搜索，无需后端。 |

### 8.2 项目目录结构

```
productgrave/
├── public/
│   ├── images/
│   │   ├── tombstones/       # 像素墓碑插图
│   │   ├── logos-pixel/      # 像素化产品 Logo
│   │   └── og/               # 自动生成的 OG 图片
│   ├── fonts/                # 像素字体文件
│   └── favicon.ico
├── src/
│   ├── content/
│   │   ├── graves/           # 案例 Markdown 文件
│   │   └── config.ts         # Content Collections schema
│   ├── components/
│   │   ├── ui/               # 基础像素组件（Button, Tag, Card）
│   │   ├── tombstone/        # 墓碑相关组件
│   │   ├── stats/            # 数据可视化组件
│   │   └── layout/           # 布局组件（Header, Footer, Nav）
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── GraveLayout.astro
│   ├── pages/
│   │   ├── index.astro       # 首页
│   │   ├── grave/
│   │   │   └── [slug].astro  # 详情页
│   │   ├── browse/
│   │   │   └── [filter].astro # 浏览页
│   │   ├── stats.astro
│   │   ├── submit.astro
│   │   ├── blog/
│   │   │   └── [...slug].astro
│   │   └── about.astro
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       ├── og-image.ts       # OG 图片生成
│       └── sort.ts           # 排序工具
├── docs/
│   └── PRD.md                # 本文件
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

### 8.3 构建与部署流程

```
内容更新（Markdown PR）
    ↓
GitHub Merge
    ↓
Vercel Auto Build（SSG）
    ↓
静态 HTML 输出
    ↓
Vercel Edge Network 全球分发
    ↓
Cloudflare DNS 解析
```

### 8.4 性能目标

| 指标 | 目标 |
|------|------|
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Time to First Byte (TTFB) | < 100ms |
| First Contentful Paint (FCP) | < 1.0s |
| Largest Contentful Paint (LCP) | < 1.5s |
| Total Blocking Time (TBT) | < 50ms |

---

## 9. SEO 与增长策略

### 9.1 页面级 SEO

- **URL 规范**：全小写，连字符分隔，无下划线。例：`/grave/google-glass`
- **Title 模板**：`{产品名} ({生}-{死}) — Product Grave`
- **Meta Description**：自动从 `summary` frontmatter 生成，限制 150 字符。
- **Canonical URL**：每页设置 canonical，防止参数导致重复内容。
- **结构化数据**：
  - 文章页使用 `Article` schema
  - 组织信息使用 `Organization` schema
  - FAQ 页（如有）使用 `FAQPage` schema
- **Sitemap**：自动生成 `sitemap.xml`，包含所有案例页和博客页。
- **Robots.txt**：允许所有，指向 sitemap。

### 9.2 Open Graph / Twitter Cards

- 每案例自动生成一张 **1200×630** 的像素风 OG 图：
  - 背景：墓园夜景
  - 中央：该产品的像素墓碑
  - 文字：产品名 + 墓志铭 + 存活时间
  - 底部：Product Grave Logo
- OG 图构建时生成，存入 `/public/images/og/`，避免运行时开销。

### 9.3 内容 SEO

- **长尾关键词**：每个案例自然覆盖 `{产品名} why did it fail`, `{产品名} failure reasons`, `{产品名} shutdown`。
- **聚合页**：`/browse/no-pmf` 这样的聚合页作为类目关键词入口。
- **内链策略**：详情页「陪葬品」模块提供强内链，提升页面权重流转。

### 9.4 社交媒体与传播

| 渠道 | 策略 |
|------|------|
| **Twitter/X** | 每上架一个新案例，发一条推文：像素墓碑图 + 墓志铭 + 链接。建立官方账号。 |
| **Hacker News** | 定期发布专题分析文章，引导回流。 |
| **Product Hunt** | 正式上线时发起 Launch，主打「最有趣的创业失败数据库」。 |
| **Reddit** | r/SaaS、r/startups、r/Entrepreneur 分享相关案例。 |
| **Newsletter** | Buttondown 托管，周刊推送。订阅入口在页脚和详情页底部。 |

### 9.5 病毒传播机制

- **死亡证书生成器（P2）**：用户输入任意产品名，生成一张像素风「死亡证书」图片，可下载分享。即使该产品不在我们的数据库中也能玩。
- **墓志铭投票**：用户可以为已有案例提交自己的墓志铭，高票者展示在详情页。
- **存活时间对比**：「Google Glass 活了 21 个月，你的产品呢？」—— 引发创业者共鸣。

---

## 10. 数据指标（Metrics）

### 10.1 北极星指标
**月度活跃墓碑浏览量（Monthly Active Grave Views）**：即用户至少阅读完一个完整案例详情页的月活次数。这个指标同时衡量了内容吸引力和用户参与度。

### 10.2 核心指标

| 指标 | 定义 | 目标（M3） |
|------|------|-----------|
| **总案例数** | 数据库中已发布的案例 | ≥ 50 |
| **月均访问量** | GA4 Sessions | ≥ 10,000 |
| **详情页读完率** | 滚动到底部 80% 以上的 UV 占比 | ≥ 40% |
| **平均阅读时长** | 详情页平均停留时间 | ≥ 2 分钟 |
| **分享率** | 点击分享按钮的会话占比 | ≥ 2% |
| **自然搜索占比** | Organic Search / Total Sessions | ≥ 50% |
| **订阅转化率** | Newsletter 订阅数 / 总 UV | ≥ 3% |
| **用户提交数** | 通过表单提交的合格案例 | ≥ 10/月 |

### 10.3 技术健康指标

| 指标 | 目标 |
|------|------|
| Lighthouse Performance | ≥ 95 |
| Core Web Vitals (PASS) | 100% |
| 构建时间 | < 2 分钟 |
| 部署成功率 | ≥ 99% |

---

## 11. 路线图（Roadmap）

### Phase 1：MVP（Week 1–3）
**目标**：验证核心需求，上线可传播的最小可用产品。

- [ ] Week 1：Astro 项目搭建、像素风设计系统实现、首页墓碑墙
- [ ] Week 1：Content Collections Schema 定义 + 首批 10 个案例内容撰写
- [ ] Week 2：产品详情页模板实现、OG 图片自动生成、基础 SEO
- [ ] Week 2：按死因 / 行业筛选功能
- [ ] Week 3：Vercel 部署、Cloudflare 域名配置、GA4 接入
- [ ] Week 3：首批 10 个案例全部上线、社交账号注册、首轮冷启动分享

**交付物**：一个包含 10 个精品案例、可筛选浏览、可分享的数字墓园网站。

### Phase 2：增长（Month 2–3）
**目标**：扩展内容，优化分发，建立自然流量。

- [ ] 案例扩展至 30-50 个，覆盖所有主要死因标签
- [ ] 墓园数据页（Stats）上线
- [ ] 搜索功能（Pagefind）
- [ ] Newsletter 订阅入口 + 首期周刊发送
- [ ] 用户提交表单上线
- [ ] Twitter/X 自动化：新案例上线自动发推（GitHub Action + IFTTT）
- [ ] Product Hunt 正式 Launch

### Phase 3：社区与深化（Month 4–6）
**目标**：从内容站向轻社区演进，提升用户粘性。

- [ ] 献花 / 互动功能（边缘函数计数）
- [ ] 死亡证书生成器（P2 病毒功能）
- [ ] 多语言支持（中文子站 /zh/）
- [ ] 专题深度文章（博客）
- [ ] 开放 API（案例 JSON 接口，供开发者调用）
- [ ] 周边商店（像素风贴纸、海报， Gumroad / Shopify）

### Phase 4：商业化探索（Month 6+）
**目标**：验证可持续的商业模式。

- [ ] 赞助位：工具类 SaaS（如 Notion、Figma、Vercel）赞助相关内容
- [ ] 付费 Newsletter / 深度研报
- [ ] 数据 API 付费计划
- [ ] 企业版：为 VC / 孵化器提供定制化的死亡案例分析

---

## 12. 风险与应对

| 风险 | 影响 | 可能性 | 应对策略 |
|------|------|--------|----------|
| **内容不足** | 高 | 中 | MVP 前强制储备 15 个案例；建立每周 2 个的内容节奏；开放社区提交。 |
| **版权争议** | 中 | 低 | 所有产品 Logo 均做像素化艺术处理（transformative use）；事实性内容受保护；避免诽谤性语言。 |
| **像素风开发成本高** | 中 | 中 | 使用 AI 工具（Midjourney / DALL-E）批量生成统一风格的像素素材，再人工筛选修正；控制独特素材数量，复用模板。 |
| **流量增长慢** | 高 | 中 | 每个案例都是 SEO 入口页；优先覆盖高搜索量的大厂失败品；社交媒体持续运营。 |
| **维护精力不足** | 中 | 高 | 技术栈极简（Astro + Markdown），无数据库运维；内容更新通过 Git PR，可社区协作。 |
| **同类竞品出现** | 低 | 低 | 视觉风格和内容质量建立壁垒；社区运营形成品牌忠诚度。 |

---

## 13. 附录

### 13.1 术语表
- **Grave / 墓碑**：一个产品案例的代称。
- **Cause of Death / 死因**：产品失败的根本原因分类。
- **Epitaph / 墓志铭**：为产品撰写的一句总结性文学语句。
- **OG Image**：社交媒体分享时展示的预览图。

### 13.2 参考与灵感
- [Killed by Google](https://killedbygoogle.com/)
- [Failory](https://www.failory.com/)
- [Museum of Failure](https://museumoffailure.com/)
- [Stardew Valley](https://www.stardewvalley.net/) — 视觉风格参考
- [Eastward](https://eastwardgame.com/) — 像素美术参考

### 13.3 待决策事项
1. 是否需要背景 8-bit BGM？（可能影响性能和无障碍）
2. 用户献花是否需要防刷机制？（V2 再考虑）
3. 是否接入 Google AdSense？（建议流量过万后再评估）
4. 社区提交是否使用 GitHub Issues 工作流，还是 Notion Database？

---

*End of Document*
