"""
Builds the one-page résumé PDF: public/resume/Jb-Yashvi-Resume.pdf (and a copy at the
project root). Edit the text below and run:

    python3 scripts/resume.py            # or: python3 scripts/resume.py out.pdf to preview elsewhere

Needs ReportLab (pip install reportlab). Times on A4, 40pt side margins; the portfolio's
My journey (src/data/journey.ts) copies the Experience bullets word for word, so change both.
Text in <b>…</b> is set in bold; everything else is plain text.
"""

from pathlib import Path
from shutil import copyfile
from xml.sax.saxutils import escape

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Frame, HRFlowable, Paragraph
from reportlab.pdfgen.canvas import Canvas

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/resume/Jb-Yashvi-Resume.pdf'

NAME = 'Jb Yashvi'
HEADLINE = 'Product Designer'
PLACE = 'Jaipur, India | +91 8949741873 | '
EMAIL = 'jbieyashvi011@gmail.com'
LINKEDIN = ('LinkedIn', 'https://www.linkedin.com/in/jb-yashvi/')
PORTFOLIO = ('Portfolio', 'https://jb-yashvi-portfolio.vercel.app/')

SUMMARY = (
    'Product Designer focused on enterprise workflows, dashboards, and web and mobile products. Owns design from '
    'problem definition and user flows through high-fidelity UI, prototyping, developer <b>handoff and implementation '
    'reviews</b>. Brings experience in procurement and logistics, reusable design systems, client collaboration and '
    'AI-assisted prototyping.'
)

# each entry: the bold heading, the italic line under it, an optional note, then the bullets
EXPERIENCE = [
    ('Heizen (Gamma Opengig Work Pvt Ltd) | May 2025 - Oct 2026', 'Senior Product Designer | Remote',
     '<b>Promoted in May 2026</b> after joining as Product Designer in May 2025.', [
        'Owned <b>end-to-end web and mobile product design</b>, translating business requirements into user flows, '
        'information architecture, high-fidelity UI and developer-ready designs.',
        'Simplified a client workflow by <b>reducing steps and clarifying information hierarchy</b>; refined the design '
        'through internal team testing to make tasks easier to follow.',
        'Built <b>reusable components</b> and standardized tables, forms and status patterns to support consistent '
        'experiences and clearer design handoff.',
        'Guided <b>client design reviews</b> with alternative solutions and explicit trade-offs; incorporated feedback to '
        'align design decisions with business needs.',
        'Used AI-assisted tools to explore <b>workflow edge cases</b> and build interactive prototypes for client reviews '
        'and engineering discussions.',
        'Partnered with developers through <b>handoff and implementation reviews</b> to resolve usability issues and '
        'maintain design intent.',
    ]),
    ('Sneaco | Part-time | Oct 2024 - Mar 2025', 'Founding Product Designer | Jaipur', None, [
        '<b>Interviewed hostel students and adults</b> about laundry routines, spending and service needs to inform a '
        'one-day laundry and ironing service.',
        'Defined the initial <b>visual language and reusable UI patterns</b>; collaborated with founders and developers on '
        'interactive prototypes and implementation-ready designs.',
    ]),
    ('Urban Culture | May 2024 - Jul 2024', 'UI/UX Design Intern', None, [
        'Refined admin-panel experiences with a focus on usability, information hierarchy and visual consistency.',
    ]),
    ('POLO | Oct 2023 - Dec 2023', 'Product Design Intern', None, [
        'Supported the Senior Product Designer with high-fidelity UI screens and interactive prototypes.',
    ]),
]

SKILLS = [
    ('Product design:', 'User research, user flows, information architecture, <b>interaction design</b>, visual design, '
     'responsive design, <b>prototyping</b>, <b>design systems</b>, developer handoff'),
    ('Tools:', '<b>Figma</b>, FigJam, Framer, Adobe Illustrator, Adobe XD, Sketch'),
    ('AI and technical:', 'AI-assisted prototyping, Claude, ChatGPT, Codex, Claude Code, HTML/CSS fundamentals'),
]

EDUCATION = ('Malaviya National Institute of Technology Jaipur | 2025', 'Bachelor of Architecture (B.Arch) | Jaipur, India')

# styles; spaceBefore is the gap above each block (Frame adds it unless the block is first)
body = ParagraphStyle('body', fontName='Times-Roman', fontSize=10, leading=12)
name = ParagraphStyle('name', fontName='Times-Roman', fontSize=24, leading=28, alignment=1)
headline = ParagraphStyle('headline', parent=body, fontName='Times-Bold', alignment=1, spaceBefore=2)
centred = ParagraphStyle('centred', parent=body, alignment=1)
section = ParagraphStyle('section', fontName='Times-Bold', fontSize=12, leading=14, spaceBefore=8)
head = ParagraphStyle('head', parent=body, fontName='Times-Bold', spaceBefore=4)
sub = ParagraphStyle('sub', parent=body, fontName='Times-Italic', spaceBefore=3)
bullet = ParagraphStyle('bullet', parent=body, leftIndent=18, bulletIndent=0, spaceBefore=1)


def p(text, style, before=None):
    para = Paragraph(text, style)
    if before is not None:
        para.style = ParagraphStyle(style.name + str(before), parent=style, spaceBefore=before)
    return para


def link(label, href):
    return f'<a href="{href}" color="#1155cc"><u>{escape(label)}</u></a>'


def title(text):
    return [p(escape(text), section), HRFlowable(width='100%', thickness=0.8, color='black', spaceBefore=1, spaceAfter=2)]


def story():
    out = [
        p(escape(NAME), name),
        p(escape(HEADLINE), headline),
        p(escape(PLACE) + escape(EMAIL), centred, 2),
        p(link(*LINKEDIN) + ' | ' + link(*PORTFOLIO), centred, 2),
    ]
    out += title('Summary') + [p(SUMMARY, body)]
    out += title('Experience')
    for i, (first, second, note, points) in enumerate(EXPERIENCE):
        out.append(p(escape(first), head, 0 if i == 0 else None))
        out.append(p(escape(second), sub))
        if note:
            out.append(p(f'<i>{note}</i>', sub))
        out += [Paragraph(b, bullet, bulletText='●') for b in points]
    out += title('Skills') + [p(f'<b>{escape(k)}</b> {v}', body, 0 if i == 0 else 3) for i, (k, v) in enumerate(SKILLS)]
    out += title('Education') + [p(escape(EDUCATION[0]), head, 0), p(escape(EDUCATION[1]), sub)]
    return out


def build(path=OUT):
    width, height = A4
    c = Canvas(str(path), pagesize=A4, pageCompression=1)
    c.setTitle('Jb-Yashvi-Product-Designer-Resume')
    c.setAuthor('Jb Yashvi')
    frame = Frame(40, 36, width - 80, height - 72, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
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
