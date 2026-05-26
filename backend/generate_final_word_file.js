const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  TextRun,
  WidthType,
} = require("docx");

const INPUT_MD = path.join(__dirname, "STEPONE_AI_BUILDAHTON_GUIDE.md");
const OUTPUT_DOCX = path.join(
  __dirname,
  "StepOne_AI_Buildathon_Winning_Strategy_FINAL.docx",
);

const C = {
  navy: "0D2B55",
  navyLight: "1A3F7A",
  gold: "D4A017",
  accent: "0070C0",
  tableHead: "0D2B55",
  tableAlt: "F0F4FA",
  border: "D6DCE5",
  white: "FFFFFF",
  black: "111111",
  gray: "444444",
  lightGray: "F5F7FA",
};

const bdr = (color = C.border, size = 4) => ({ style: BorderStyle.SINGLE, size, color });
const allBorders = (color = C.border, size = 4) => ({
  top: bdr(color, size),
  bottom: bdr(color, size),
  left: bdr(color, size),
  right: bdr(color, size),
});

function run(text, opts = {}) {
  return new TextRun({
    text,
    bold: !!opts.bold,
    italics: !!opts.italics,
    color: opts.color || C.black,
    size: opts.size || 22,
    font: opts.font || "Arial",
    underline: opts.underline ? {} : undefined,
    break: opts.break || undefined,
  });
}

function inlineRuns(text, defaultColor = C.gray) {
  if (!text) return [run("", { color: defaultColor })];
  const chunks = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return chunks.map((chunk) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return run(chunk.slice(2, -2), { bold: true, color: C.navy, size: 22 });
    }
    return run(chunk, { color: defaultColor, size: 22 });
  });
}

function para(children, opts = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [children],
    heading: opts.heading,
    alignment: opts.align || AlignmentType.LEFT,
    numbering: opts.numbering,
    spacing: {
      before: opts.before ?? 40,
      after: opts.after ?? 80,
      line: opts.line ?? 320,
    },
    border: opts.bottomBorder
      ? {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: opts.bottomBorderColor || C.gold,
            space: 3,
          },
        }
      : undefined,
    indent: opts.indent ? { left: opts.indent } : undefined,
  });
}

function sectionBanner(title, index) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [900, 8460],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: allBorders(C.gold, 6),
            shading: { fill: C.gold, type: ShadingType.CLEAR },
            width: { size: 900, type: WidthType.DXA },
            children: [para(run(String(index).padStart(2, "0"), { bold: true, size: 30, color: C.white }), { align: AlignmentType.CENTER, before: 40, after: 40 })],
          }),
          new TableCell({
            borders: allBorders(C.navy, 6),
            shading: { fill: C.navy, type: ShadingType.CLEAR },
            width: { size: 8460, type: WidthType.DXA },
            children: [para(run(` ${title}`, { bold: true, size: 26, color: C.white }), { before: 50, after: 50 })],
          }),
        ],
      }),
    ],
  });
}

function codeBlockTable(lines) {
  const children = lines.length
    ? lines.map((line) => para(run(line, { font: "Courier New", color: "F8F1D1", size: 19 }), { before: 0, after: 20, line: 280 }))
    : [para(run(" ", { font: "Courier New", color: "F8F1D1", size: 19 }), { before: 0, after: 0 })];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: C.navy, type: ShadingType.CLEAR },
            borders: allBorders(C.navyLight, 6),
            margins: { top: 160, bottom: 160, left: 200, right: 200 },
            children,
          }),
        ],
      }),
    ],
  });
}

function markdownTable(rows) {
  if (!rows.length) return [];
  const parsed = rows
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim()));
  if (!parsed.length) return [];

  const filtered = parsed.filter((cells, index) => {
    if (index !== 1) return true;
    return !cells.every((c) => /^:?-{3,}:?$/.test(c.replace(/\s+/g, "")));
  });
  if (!filtered.length) return [];
  const header = filtered[0];
  const body = filtered.slice(1);
  const columnCount = Math.max(...filtered.map((r) => r.length), 1);
  const colWidth = Math.floor(9360 / columnCount);

  const rowsOut = [
    new TableRow({
      children: [...Array(columnCount)].map((_, i) => {
        const text = header[i] || "";
        return new TableCell({
          width: { size: colWidth, type: WidthType.DXA },
          borders: allBorders(C.navy, 6),
          shading: { fill: C.tableHead, type: ShadingType.CLEAR },
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [para(run(text, { bold: true, color: C.white, size: 20 }), { align: AlignmentType.CENTER, before: 0, after: 0 })],
        });
      }),
    }),
  ];

  body.forEach((row, rIndex) => {
    rowsOut.push(
      new TableRow({
        children: [...Array(columnCount)].map((_, i) => {
          const text = row[i] || "";
          return new TableCell({
            width: { size: colWidth, type: WidthType.DXA },
            borders: allBorders(C.border, 4),
            shading: { fill: rIndex % 2 === 0 ? C.white : C.tableAlt, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [para(run(text, { color: C.gray, size: 20 }), { before: 0, after: 0 })],
          });
        }),
      }),
    );
  });

  return [
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [...Array(columnCount)].map(() => colWidth),
      rows: rowsOut,
    }),
    para(run(" "), { before: 0, after: 20, line: 240 }),
  ];
}

function headingBlock(level, text) {
  const map = {
    1: { heading: HeadingLevel.HEADING_1, size: 36, color: C.navy, border: true },
    2: { heading: HeadingLevel.HEADING_2, size: 30, color: C.navyLight, border: true },
    3: { heading: HeadingLevel.HEADING_3, size: 26, color: C.accent, border: false },
    4: { heading: HeadingLevel.HEADING_4, size: 23, color: C.black, border: false },
  };
  const st = map[level] || map[4];
  return para(run(text, { bold: true, size: st.size, color: st.color }), {
    heading: st.heading,
    before: level <= 2 ? 300 : 180,
    after: 120,
    bottomBorder: st.border,
  });
}

function parseMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let inCode = false;
  let codeLines = [];
  let tableLines = [];
  let bannerIndex = 0;

  function flushCode() {
    if (!codeLines.length) return;
    out.push(codeBlockTable(codeLines));
    out.push(para(run(" "), { before: 0, after: 40, line: 220 }));
    codeLines = [];
  }

  function flushTable() {
    if (!tableLines.length) return;
    out.push(...markdownTable(tableLines));
    tableLines = [];
  }

  for (const raw of lines) {
    const line = raw ?? "";
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushTable();
      if (!inCode) {
        inCode = true;
        codeLines = [];
      } else {
        inCode = false;
        flushCode();
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (/^\|.*\|$/.test(trimmed)) {
      tableLines.push(trimmed);
      continue;
    }
    flushTable();

    if (!trimmed) {
      out.push(para(run(" "), { before: 0, after: 20, line: 220 }));
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      out.push(
        new Paragraph({
          spacing: { before: 60, after: 100 },
          border: { bottom: bdr(C.border, 5) },
          children: [run("")],
        }),
      );
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      if (level === 2 && /^(📋|🏗️|📁|🔧|🔄|📊|⚙️|📝|🧪|🚀|💡|📅)/.test(text)) {
        bannerIndex += 1;
        out.push(sectionBanner(text.replace(/^[^\s]+\s*/, "").trim(), bannerIndex));
        out.push(para(run(" "), { before: 0, after: 30 }));
      }
      out.push(headingBlock(level, text));
      continue;
    }

    const bulletMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
    if (bulletMatch) {
      const level = Math.min(Math.floor((bulletMatch[1] || "").length / 2), 2);
      out.push(
        para(inlineRuns(bulletMatch[2], C.gray), {
          numbering: { reference: "bullets", level },
          before: 20,
          after: 20,
        }),
      );
      continue;
    }

    const numberMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
    if (numberMatch) {
      const level = Math.min(Math.floor((numberMatch[1] || "").length / 2), 1);
      out.push(
        para(inlineRuns(numberMatch[2], C.gray), {
          numbering: { reference: "numbers", level },
          before: 20,
          after: 20,
        }),
      );
      continue;
    }

    out.push(para(inlineRuns(trimmed, C.gray), { before: 20, after: 70 }));
  }

  flushTable();
  flushCode();
  return out;
}

function coverPage() {
  return [
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 9360, type: WidthType.DXA },
              shading: { fill: C.navy, type: ShadingType.CLEAR },
              borders: allBorders(C.gold, 10),
              margins: { top: 280, bottom: 280, left: 200, right: 200 },
              children: [
                para(run("STEPONE AI BUILDATHON", { bold: true, size: 44, color: "F0C842" }), {
                  align: AlignmentType.CENTER,
                  before: 180,
                  after: 140,
                }),
                para(run("Content Intelligence Engine", { bold: true, size: 60, color: C.white }), {
                  align: AlignmentType.CENTER,
                  before: 40,
                  after: 160,
                }),
                para(run("Winning Strategy & Implementation Blueprint", { bold: true, size: 30, color: "F0C842" }), {
                  align: AlignmentType.CENTER,
                  before: 40,
                  after: 110,
                }),
                para(run("Research-backed | Demo-ready | Judge-optimized", { size: 22, color: "9DC3E6" }), {
                  align: AlignmentType.CENTER,
                  before: 40,
                  after: 160,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    para(run(" "), { before: 0, after: 120 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [3120, 3120, 3120],
      rows: [
        new TableRow({
          children: [
            ["8–12 hrs", "Manual Workflow Today"],
            ["< 3 mins", "Target Automation Time"],
            ["4 Platforms", "Single-Pipeline Output"],
          ].map(
            ([v, l]) =>
              new TableCell({
                width: { size: 3120, type: WidthType.DXA },
                borders: allBorders(C.gold, 4),
                shading: { fill: C.navyLight, type: ShadingType.CLEAR },
                margins: { top: 120, bottom: 120, left: 120, right: 120 },
                children: [
                  para(run(v, { bold: true, size: 34, color: C.gold }), { align: AlignmentType.CENTER, before: 40, after: 40 }),
                  para(run(l, { size: 18, color: C.white }), { align: AlignmentType.CENTER, before: 20, after: 20 }),
                ],
              }),
          ),
        }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function strategyAddendum() {
  return [
    sectionBanner("MAXIMUM EFFICIENCY EXECUTION STRATEGY", "00"),
    headingBlock(1, "Judge-Winning Delivery Playbook"),
    para(inlineRuns("Use this sequence in your final demo to maximize clarity, confidence, and scoring impact."), { after: 80 }),
    para(inlineRuns("1) Start with pain in numbers: manual 8–12 hours vs automated under 3 minutes."), { numbering: { reference: "numbers", level: 0 } }),
    para(inlineRuns("2) Show explainability first: quality metrics and why each asset was selected."), { numbering: { reference: "numbers", level: 0 } }),
    para(inlineRuns("3) Show platform adaptation: same event, different outputs for LinkedIn and Instagram."), { numbering: { reference: "numbers", level: 0 } }),
    para(inlineRuns("4) Show reliability: error isolation, deterministic pipeline stages, and scalable architecture."), { numbering: { reference: "numbers", level: 0 } }),
    para(inlineRuns("5) End with business ROI: faster time-to-publish, higher consistency, lower content-ops load."), { numbering: { reference: "numbers", level: 0 } }),
    para(run(" "), { before: 0, after: 60 }),
    headingBlock(2, "Final Pitch Positioning"),
    para(inlineRuns("Frame the project as a production capability, not a prototype feature. Emphasize modular design, measurable quality signals, and immediate operational value for StepOne’s event lifecycle.")),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

async function build() {
  if (!fs.existsSync(INPUT_MD)) {
    throw new Error(`Input file not found: ${INPUT_MD}`);
  }

  const markdown = fs.readFileSync(INPUT_MD, "utf8");
  const parsed = parseMarkdown(markdown);

  const doc = new Document({
    creator: "Eureka AI Assistant",
    title: "StepOne AI Buildathon Winning Strategy",
    description: "Final strategic and technical blueprint document",
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 560, hanging: 280 } } },
            },
            {
              level: 1,
              format: LevelFormat.BULLET,
              text: "◦",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 980, hanging: 260 } } },
            },
            {
              level: 2,
              format: LevelFormat.BULLET,
              text: "▸",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 1400, hanging: 260 } } },
            },
          ],
        },
        {
          reference: "numbers",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 560, hanging: 280 } } },
            },
            {
              level: 1,
              format: LevelFormat.DECIMAL,
              text: "%1.%2.",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 980, hanging: 260 } } },
            },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 22,
            color: C.gray,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        headers: {
          default: new Header({
            children: [
              para(
                [
                  run("STEPONE AI BUILDATHON  |  ", { bold: true, size: 16, color: C.navy }),
                  run("Content Intelligence Engine  |  ", { bold: true, size: 16, color: C.navyLight }),
                  run("WINNING STRATEGY", { bold: true, size: 16, color: C.gold }),
                ],
                { before: 0, after: 0 },
              ),
              new Paragraph({
                spacing: { before: 0, after: 0 },
                border: { bottom: bdr(C.gold, 6) },
                children: [run("")],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                spacing: { before: 0, after: 0 },
                border: { top: bdr(C.border, 4) },
                children: [run("")],
              }),
              para(
                [
                  run("StepOne Content Intelligence Engine  |  Final Strategy  |  Page ", {
                    size: 15,
                    color: "888888",
                  }),
                  PageNumber.CURRENT,
                ],
                { align: AlignmentType.CENTER, before: 60, after: 0 },
              ),
            ],
          }),
        },
        children: [
          ...coverPage(),
          headingBlock(1, "Table of Contents"),
          new TableOfContents("Contents", {
            hyperlink: true,
            headingStyleRange: "1-4",
          }),
          new Paragraph({ children: [new PageBreak()] }),
          ...strategyAddendum(),
          ...parsed,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT_DOCX, buffer);
  console.log(`Created: ${OUTPUT_DOCX}`);
}

build().catch((err) => {
  console.error(err?.stack || err?.message || err);
  process.exit(1);
});
