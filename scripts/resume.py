"""
Builds the one-page résumé PDF: public/resume/Jb-Yashvi-Resume.pdf (and a copy at the
project root). Edit the text below and run:

    python3 scripts/resume.py            # or: python3 scripts/resume.py out.pdf to preview elsewhere

Needs ReportLab (pip install reportlab). Helvetica on A4, 46pt side margins; the portfolio's
My journey (src/data/journey.ts) copies the Experience bullets word for word, so change both.
"""

from pathlib import Path
from shutil import copyfile
from xml.sax.saxutils import escape

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Frame, Paragraph, Table, TableStyle
from reportlab.pdfgen.canvas import Canvas

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/resume/Jb-Yashvi-Resume.pdf'

NAME = 'Jb Yashvi'
HEADLINE = 'PRODUCT DESIGNER'
PHONE = '8949741873'
EMAIL = 'jbieyashvi011@gmail.com'
LINKEDIN = ('LinkedIn', 'https://www.linkedin.com/in/jb-yashvi/')
PORTFOLIO = ('Portfolio', 'https://jb-yashvi-portfolio.vercel.app/')

SUMMARY = (
    'Product Designer focused on web and mobile products, enterprise workflows, dashboards, and design systems. '
    'Experienced in end-to-end design, from user flows and interaction design to high-fidelity UI, developer handoff, and '
    'implementation reviews. Uses AI-assisted tools to explore ideas and build interactive prototypes.'
)

# each entry: the bold heading lines as (left, right) pairs, then the bullets
EXPERIENCE = [
    ([('Heizen (Gamma Opengig Work Pvt Ltd)', 'Remote'),
      ('Senior Product Designer', 'May 2026 – Oct 2026'),
      ('Product Designer', 'May 2025 – Apr 2026')], [
        'Led end-to-end product design across web and mobile products, translating complex business requirements into '
        'user flows, information architecture, high-fidelity UI, prototypes, and developer-ready designs.',
        'Redesigned navigation, information hierarchy, and decision points across procurement and logistics workflows to '
        'make complex tasks easier to follow.',
        'Built reusable components and standardized tables, forms, and status patterns to support consistent interfaces '
        'across products.',
        'Used AI-assisted tools to explore workflow edge cases and build interactive prototypes for design reviews and '
        'developer discussions.',
        'Presented alternative design solutions to clients, explained trade-offs, and gathered feedback to refine the '
        'preferred approach.',
    ]),
    ([('Founding Product Designer', 'Oct 2024 – Mar 2025'),
      ('Sneaco · Part-time', 'Jaipur')], [
        'Interviewed hostel students and unmarried adults about their laundry routines, spending, and service needs to '
        'inform product design for a startup offering one-day laundry and ironing services.',
        'Established the initial visual language and reusable UI patterns to support consistent design across features.',
        'Collaborated directly with founders and developers to translate early product requirements into interactive '
        'prototypes and implementation-ready designs.',
    ]),
    ([('UI/UX Design Intern', 'May 2024 – Jul 2024'),
      ('Urban Culture', '')], [
        'Designed and refined admin-panel experiences with a focus on usability, information hierarchy, and visual '
        'consistency.',
    ]),
    ([('Product Design Intern', 'Oct 2023 – Dec 2023'),
      ('POLO', '')], [
        'Supported the Senior Product Designer in creating high-fidelity UI screens and interactive prototypes.',
    ]),
]

EDUCATION = [
    ('Bachelor of Architecture (B.Arch)', '2025'),
    ('Malaviya National Institute of Technology Jaipur (MNIT Jaipur)', 'Jaipur, India'),
]

SKILLS = [
    ('Product Design', 'User Research, User Flows, Information Architecture, Wireframing, Interaction Design, Visual '
     'Design, UI Design, Responsive Design, Prototyping, Design Systems, Developer Handoff'),
    ('Tools', 'Figma, FigJam, Framer, Adobe Illustrator, Adobe XD, Sketch'),
    ('AI & Prototyping', 'Claude, ChatGPT, Codex, Claude Code'),
    ('Technical', 'HTML/CSS fundamentals, AI-assisted code prototyping'),
]

# styles; spaceBefore is the gap above each block (Frame adds it unless the block is first)
body = ParagraphStyle('body', fontName='Helvetica', fontSize=9.3, leading=12.3)
name = ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=22, leading=25)
headline = ParagraphStyle('headline', fontName='Helvetica-Bold', fontSize=11, leading=14, spaceBefore=6)
section = ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=10, leading=13, spaceBefore=12)
role = ParagraphStyle('role', fontName='Helvetica-Bold', fontSize=9.5, leading=12.5)
right = ParagraphStyle('right', parent=role, alignment=2)
bullet = ParagraphStyle('bullet', parent=body, leftIndent=10, firstLineIndent=-8, spaceBefore=3)

WIDTH = A4[0] - 92


def p(text, style, before=None):
    para = Paragraph(text, style)
    if before is not None:
        para.style = ParagraphStyle(style.name + str(before), parent=style, spaceBefore=before)
    return para


def link(label, href):
    return f'<a href="{href}" color="black">{escape(label)}</a>'


def heading(lines, before):
    """bold lines with the left text flush left and the right text (dates, place) flush right"""
    t = Table([[p(escape(l), role), p(escape(r), right)] for l, r in lines], colWidths=[WIDTH * 0.7, WIDTH * 0.3])
    t.setStyle(TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                           ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0)]))
    t.spaceBefore = before
    return t


def story():
    out = [
        p(escape(NAME), name),
        p(' | '.join([escape(PHONE), link(EMAIL, f'mailto:{EMAIL}'), link(*LINKEDIN), link(*PORTFOLIO)]), body, 4),
        p(escape(HEADLINE), headline),
        p(escape(SUMMARY), body, 4),
        p('WORK EXPERIENCE', section),
    ]
    for i, (lines, points) in enumerate(EXPERIENCE):
        out.append(heading(lines, 5 if i == 0 else 8))
        out += [p('• ' + escape(b), bullet) for b in points]
    out += [p('EDUCATION', section), heading(EDUCATION, 5)]
    out.append(p('SKILLS', section))
    out += [p(f'• <b>{escape(k)}</b> | {escape(v)}', bullet) for k, v in SKILLS]
    return out


def build(path=OUT):
    width, height = A4
    c = Canvas(str(path), pagesize=A4, pageCompression=1)
    c.setTitle('Jb Yashvi - Product Designer Resume')
    c.setAuthor('Jb Yashvi')
    frame = Frame(46, 38, WIDTH, height - 76, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    flow = story()
    frame.addFromList(flow, c)
    if flow:
        raise SystemExit(f'résumé runs past one page: {len(flow)} blocks left over')
    c.save()
    if path == OUT:
        copyfile(path, ROOT / 'Jb-Yashvi-Resume.pdf')


if __name__ == '__main__':
    import sys
    out = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else OUT
    build(out)
    print(f'wrote {out}')
