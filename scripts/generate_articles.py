import html
#!/usr/bin/env python3
"""
Mithila Games - Static Article Generator for SEO
Generates static HTML files for all articles in public/js/data/newsData.js
into news/{id}.html, ensuring 100% crawlability, metadata, OpenGraph, and JSON-LD schema.
"""

import os
import re
import json

def parse_news_data():
    js_path = 'public/js/data/newsData.js'
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    articles = []
    raw_articles = re.split(r'\n\s*\{\s*\n\s*id:\s*["\']', content)
    
    for block in raw_articles[1:]:
        block = 'id: "' + block
        
        id_m = re.search(r'id:\s*(["\'])(.*?)\1', block)
        title_m = re.search(r'title:\s*(["\'])(.*?)\1', block)
        date_m = re.search(r'date:\s*(["\'])(.*?)\1', block)
        cat_m = re.search(r'category:\s*(["\'])(.*?)\1', block)
        badge_m = re.search(r'badge:\s*(["\'])(.*?)\1', block)
        image_m = re.search(r'image:\s*(["\'])(.*?)\1', block)
        author_m = re.search(r'author:\s*(["\'])(.*?)\1', block)
        read_m = re.search(r'readTime:\s*(["\'])(.*?)\1', block)
        summary_m = re.search(r'summary:\s*(["\'])(.*?)\1', block)
        tags_m = re.search(r'tags:\s*\[(.*?)\]', block, re.DOTALL)
        content_m = re.search(r'content:\s*`(.*?)`', block, re.DOTALL)
        
        if not (id_m and title_m):
            continue
            
        tags = []
        if tags_m:
            raw_tags = tags_m.group(1)
            tags = [t.strip().strip('"\'') for t in raw_tags.split(',') if t.strip()]
            
        article = {
            'id': id_m.group(2).strip(),
            'title': title_m.group(2).strip(),
            'date': date_m.group(2).strip() if date_m else '2026-11-01',
            'category': cat_m.group(2).strip() if cat_m else 'GAME DEV & ENGINES',
            'badge': badge_m.group(2).strip() if badge_m else 'TECH GUIDE',
            'image': image_m.group(2).strip() if image_m else 'https://mithilagames.com/public/assets/images/wings_paper_hero.jpg',
            'author': author_m.group(2).strip() if author_m else 'Mithila Games Tech Team',
            'readTime': read_m.group(2).strip() if read_m else '5 MIN READ',
            'summary': summary_m.group(2).strip() if summary_m else '',
            'tags': tags,
            'content': content_m.group(1).strip() if content_m else '<p>Read more on Mithila Games.</p>'
        }
        articles.append(article)
        
    return articles

def generate_article_html(a):
    title = a['title']
    article_id = a['id']
    date = a['date']
    category = a['category']
    badge = a['badge']
    image = a['image']
    author = a['author']
    read_time = a['readTime']
    summary = a['summary']
    summary_escaped = html.escape(summary, quote=True)
    title_escaped = html.escape(title, quote=True)
    tags = a['tags']
    body_content = a['content']
    
    og_image = image
    if not og_image.startswith('http'):
        og_image = 'https://mithilagames.com/' + og_image.lstrip('/')

    display_image = image
    if not display_image.startswith('http') and not display_image.startswith('../'):
        display_image = '../' + display_image.lstrip('/')
        
    canonical_url = f"https://mithilagames.com/news/{article_id}.html"
    tags_html = "".join([f'<span class="px-2.5 py-1 rounded bg-panel border border-borderwire text-xs font-mono text-slate-300">#{t}</span>' for t in tags])
    
    schema_data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": f"{canonical_url}#article",
                "isPartOf": {
                    "@type": "Blog",
                    "@id": "https://mithilagames.com/news.html#blog",
                    "name": "Mithila Games Studio Devlogs",
                    "url": "https://mithilagames.com/news.html"
                },
                "headline": title,
                "description": summary,
                "image": og_image,
                "datePublished": date,
                "dateModified": date,
                "author": {
                    "@type": "Person",
                    "name": author,
                    "url": "https://mithilagames.com/Div.html" if "Divyanshu" in author else "https://mithilagames.com/about.html"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Mithila Games",
                    "url": "https://mithilagames.com",
                    "logo": "https://mithilagames.com/public/assets/logo/logo_wide.svg"
                },
                "mainEntityOfPage": canonical_url,
                "keywords": ", ".join(tags)
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"{canonical_url}#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://mithilagames.com/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "News & Devlogs",
                        "item": "https://mithilagames.com/news.html"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": title,
                        "item": canonical_url
                    }
                ]
            }
        ]
    }
    
    schema_json = json.dumps(schema_data, indent=2)

    return f"""<!DOCTYPE html>
<html lang="en" class="bg-void text-slate-100 selection:bg-ochre selection:text-void scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Fonts: Preconnect & Non-Render-Blocking Stylesheet Loading -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Syne:ital,wght@0,500;0,700;0,800;1,700;1,800&family=Work+Sans:ital,wght@0,400;0,500;0,600;0,700;1,600&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Syne:ital,wght@0,500;0,700;0,800;1,700;1,800&family=Work+Sans:ital,wght@0,400;0,500;0,600;0,700;1,600&display=swap" media="print" onload="this.media='all'">
  <noscript>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Syne:ital,wght@0,500;0,700;0,800;1,700;1,800&family=Work+Sans:ital,wght@0,400;0,500;0,600;0,700;1,600&display=swap">
  </noscript>
  <link rel="preconnect" href="https://cdn.tailwindcss.com" crossorigin>

  <!-- Google Tag Manager / Analytics -->
  <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-TH89W6CP"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
  </script>
  <title>{title} // Devlogs &amp; News | Mithila Games</title>
  <meta name="description" content="{summary_escaped}">
  <meta name="keywords" content="{", ".join(tags)}">
  <meta name="author" content="{author}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="{canonical_url}">
  <link rel="icon" href="../public/assets/logo/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="../public/assets/logo/apple-touch-icon.png">
  <meta name="theme-color" content="#08090C">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="{canonical_url}">
  <meta property="og:title" content="{title_escaped}">
  <meta property="og:description" content="{summary_escaped}">
  <meta property="og:image" content="{og_image}">
  <meta property="og:site_name" content="Mithila Games">
  <meta property="article:published_time" content="{date}">
  <meta property="article:author" content="{author}">
  <meta property="article:section" content="{category}">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@mithilagames">
  <meta name="twitter:creator" content="@mithilagames">
  <meta name="twitter:title" content="{title_escaped}">
  <meta name="twitter:description" content="{summary_escaped}">
  <meta name="twitter:image" content="{og_image}">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
{schema_json}
  </script>

  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {{
      theme: {{
        extend: {{
          colors: {{
            void: '#08090C',
            surface: '#0F1117',
            panel: '#151821',
            borderwire: '#232735',
            ochre: '#E5A93C',
            terracotta: '#D45B38',
            lime: '#BBF451',
            'slate-muted': '#B5B9C5',
          }},
          fontFamily: {{
            syne: ['Syne', 'sans-serif'],
            sans: ['Work Sans', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }}
        }}
      }}
    }}
  </script>
  <link rel="stylesheet" href="../public/css/theme.css">
</head>
<body class="bg-void min-h-screen flex flex-col antialiased text-slate-200 selection:bg-ochre selection:text-void">

  <!-- HEADER -->
  <header class="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-borderwire">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      <a href="/" class="flex items-center gap-3 shrink-0 group">
        <img src="../public/assets/logo/logo_wide.svg" alt="Mithila Games" class="h-6 sm:h-7 lg:h-8 w-auto group-hover:scale-105 transition-transform">
      </a>
      <nav class="hidden md:flex items-center gap-1 font-syne uppercase text-xs tracking-wider shrink-0">
        <a href="/" class="nav-game-tab">HOME</a>
        <a href="../games.html" class="nav-game-tab">GAMES</a>
        <a href="../store.html" class="nav-game-tab">SHOP</a>
        <a href="../news.html" class="nav-game-tab active-tab">NEWS</a>
        <a href="../about.html" class="nav-game-tab">ABOUT</a>
        <a href="../connect.html" class="nav-game-tab">CONTACT</a>
      </nav>
      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <a href="../news.html" class="game-btn game-btn-ochre px-3 sm:px-4 py-1.5 rounded-lg text-xs uppercase font-extrabold shadow-sm">
          <span>ALL DEVLOGS</span>
        </a>
      </div>
    </div>
  </header>

  <!-- MAIN ARTICLE CONTAINER -->
  <main class="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
    
    <!-- Breadcrumb Navigation -->
    <nav aria-label="Breadcrumb" class="mb-6 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
      <a href="/" class="hover:text-ochre transition-colors">HOME</a>
      <span>/</span>
      <a href="../news.html" class="hover:text-ochre transition-colors">NEWS &amp; DEVLOGS</a>
      <span>/</span>
      <span class="text-ochre font-bold truncate max-w-xs sm:max-w-md">{category}</span>
    </nav>

    <!-- Article Header -->
    <header class="space-y-4 mb-8">
      <div class="flex flex-wrap items-center gap-2.5 text-xs font-mono">
        <span class="game-sticker sticker-ochre text-[10px] font-bold">{badge}</span>
        <span class="text-slate-400">{date}</span>
        <span class="text-borderwire">•</span>
        <span class="text-ochre font-semibold">{read_time}</span>
      </div>

      <h1 class="font-syne font-black italic text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight uppercase">
        {title}
      </h1>

      <div class="flex items-center gap-3 pt-2 text-xs font-mono text-slate-400 border-t border-borderwire/60">
        <div class="w-8 h-8 rounded-full bg-panel border border-borderwire flex items-center justify-center text-ochre font-bold text-xs">
          MG
        </div>
        <div>
          <span class="text-white font-medium">{author}</span>
          <span class="block text-[11px] text-slate-500">Mithila Games Studio</span>
        </div>
      </div>
    </header>

    <!-- Hero Article Image -->
    <div class="rounded-2xl overflow-hidden border border-borderwire mb-10 shadow-2xl bg-surface aspect-video max-h-[480px]">
      <img src="{display_image}" alt="{title_escaped}" class="w-full h-full object-cover">
    </div>

    <!-- Summary Box -->
    <div class="p-5 sm:p-6 rounded-xl bg-surface border-l-4 border-ochre border border-borderwire mb-10 text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
      <p class="font-medium">{summary}</p>
    </div>

    <!-- Article Content -->
    <article class="prose prose-invert max-w-none font-sans text-sm sm:text-base text-slate-300 leading-relaxed space-y-6">
      {body_content}
    </article>

    <!-- Tags Section -->
    <div class="mt-12 pt-6 border-t border-borderwire flex flex-wrap items-center gap-2">
      <span class="text-xs font-mono text-slate-400 uppercase font-bold mr-2">TOPICS:</span>
      {tags_html}
    </div>

    <!-- Author & Return Box -->
    <div class="mt-12 bg-surface border border-borderwire rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
      <div class="space-y-1">
        <span class="text-xs font-mono text-ochre uppercase tracking-wider font-bold">// TRANSMISSION CONCLUDED</span>
        <h3 class="font-syne font-bold text-lg sm:text-xl text-white">More Studio Devlogs &amp; Technical Reports</h3>
        <p class="text-xs text-slate-400">Explore tutorials on Godot 4, Blender 3D pipelines, GTA 6 architectural breakdowns, and anti-cheat.</p>
      </div>
      <a href="../news.html" class="game-btn game-btn-ochre px-5 py-3 rounded-xl text-xs uppercase font-extrabold whitespace-nowrap shadow-md">
        <span>VIEW ALL 44 DEVLOGS →</span>
      </a>
    </div>

  </main>

  <!-- FOOTER -->
  <footer class="bg-surface/80 border-t border-borderwire py-10 text-xs font-mono text-slate-400">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-3">
        <img src="../public/assets/logo/favicon.svg" alt="Mithila Games" class="w-5 h-5">
        <span>© 2026 Mithila Games. Independent Game Studio.</span>
      </div>
      <div class="flex flex-wrap gap-4 uppercase font-bold text-[11px]">
        <a href="/" class="hover:text-white transition-colors">Home</a>
        <a href="../games.html" class="hover:text-white transition-colors">Games</a>
        <a href="../store.html" class="hover:text-white transition-colors">Shop</a>
        <a href="../news.html" class="hover:text-white transition-colors">News</a>
        <a href="../about.html" class="hover:text-white transition-colors">About</a>
        <a href="../connect.html" class="hover:text-white transition-colors">Contact</a>
        <a href="../privacy.html" class="hover:text-white transition-colors">Privacy</a>
        <a href="../terms.html" class="hover:text-white transition-colors">Terms</a>
      </div>
    </div>
  </footer>

</body>
</html>"""

def update_sitemap(articles):
    today = "2026-11-20"
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
        '',
        '  <!-- Core Main Pages -->',
        '  <url>',
        '    <loc>https://mithilagames.com/</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>1.0</priority>',
        '    <image:image>',
        '      <image:loc>https://mithilagames.com/public/assets/images/wings_paper_hero.jpg</image:loc>',
        '      <image:title>Mithila Games Studio Showcase</image:title>',
        '      <image:caption>Building Immersive Interactive Experiences &amp; Games</image:caption>',
        '    </image:image>',
        '  </url>',
        '  <url>',
        '    <loc>https://mithilagames.com/games.html</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.9</priority>',
        '    <image:image>',
        '      <image:loc>https://mithilagames.com/content/t-r-l/cover.png</image:loc>',
        '      <image:title>T R L - 3D Parkour Platformer</image:title>',
        '      <image:caption>A non-ordinary 3D parkour game playable in browser by Mithila Games</image:caption>',
        '    </image:image>',
        '    <image:image>',
        '      <image:loc>https://mithilagames.com/content/wings_of_paper/cover_art.webp</image:loc>',
        '      <image:title>Wings of Paper - Arcade 3D Glider Game</image:title>',
        '      <image:caption>Take flight in a peaceful low-poly 3D world by Mithila Games</image:caption>',
        '    </image:image>',
        '  </url>',
        '  <url>',
        '    <loc>https://mithilagames.com/store.html</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.9</priority>',
        '    <image:image>',
        '      <image:loc>https://mithilagames.com/content/Haircards/banner.png</image:loc>',
        '      <image:title>Haircards Addon for Blender</image:title>',
        '    </image:image>',
        '  </url>',
        '  <url>',
        '    <loc>https://mithilagames.com/news.html</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>daily</changefreq>',
        '    <priority>0.9</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://mithilagames.com/about.html</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://mithilagames.com/connect.html</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.7</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://mithilagames.com/careers.html</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.7</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://mithilagames.com/Div.html</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.7</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://mithilagames.com/privacy.html</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>yearly</changefreq>',
        '    <priority>0.4</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://mithilagames.com/terms.html</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>yearly</changefreq>',
        '    <priority>0.4</priority>',
        '  </url>',
        '',
        '  <!-- Technical Devlogs and Articles -->',
    ]

    for a in articles:
        art_url = f"https://mithilagames.com/news/{a['id']}.html"
        xml_lines.append('  <url>')
        xml_lines.append(f'    <loc>{art_url}</loc>')
        xml_lines.append(f'    <lastmod>{a["date"]}</lastmod>')
        xml_lines.append('    <changefreq>monthly</changefreq>')
        xml_lines.append('    <priority>0.8</priority>')
        if a['image']:
            img_loc = a['image']
            if not img_loc.startswith('http'):
                img_loc = 'https://mithilagames.com/' + img_loc.lstrip('/')
            clean_title = a['title'].replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            clean_img = img_loc.replace('&', '&amp;')
            xml_lines.append('    <image:image>')
            xml_lines.append(f'      <image:loc>{clean_img}</image:loc>')
            xml_lines.append(f'      <image:title>{clean_title}</image:title>')
            xml_lines.append('    </image:image>')
        xml_lines.append('  </url>')

    xml_lines.append('</urlset>')
    xml_lines.append('')

    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write('\n'.join(xml_lines))
    print(f"Successfully generated sitemap.xml with {10 + len(articles)} URLs!")

def main():
    articles = parse_news_data()
    print(f"Loaded {len(articles)} articles from newsData.js.")
    
    os.makedirs('news', exist_ok=True)
    
    generated = []
    for a in articles:
        filename = f"news/{a['id']}.html"
        html = generate_article_html(a)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)
        generated.append(filename)
        
    print(f"Successfully generated {len(generated)} static article pages in news/ directory!")
    update_sitemap(articles)

if __name__ == '__main__':
    main()

