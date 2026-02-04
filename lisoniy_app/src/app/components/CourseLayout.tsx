import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { cn } from "@/lib/utils";

interface Theme {
  id: string;
  title: string;
  slug: string;
  filePath?: string;
}

interface CourseLayoutProps {
  courseTitle: string;
  themes: Theme[];
  markdownContent?: string;
  markdownFilePath?: string;
}

export function CourseLayout({ courseTitle, themes, markdownContent, markdownFilePath }: CourseLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headings, setHeadings] = useState<Array<{ id: string, title: string, level: number }>>([]);
  const [fetchedContent, setFetchedContent] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get current theme
  const currentThemeSlug = new URLSearchParams(location.search).get('theme');
  const currentTheme = themes.find(t => t.slug === currentThemeSlug) || themes[0];

  // Determine text source
  const validFilePath = currentTheme?.filePath || markdownFilePath;

  // Fetch markdown content if path is provided
  useEffect(() => {
    if (validFilePath) {
      setFetchedContent(""); // Reset content while fetching
      fetch(validFilePath)
        .then(res => {
          if (!res.ok) throw new Error("File not found");
          return res.text()
        })
        .then(text => setFetchedContent(text))
        .catch(err => {
          console.error("Failed to fetch markdown:", err);
          setFetchedContent("# Error loading content\n\nCould not load the requested content.");
        });
    }
  }, [validFilePath]);

  const finalContent = fetchedContent || markdownContent || "";

  // Extract headings from markdown content
  useEffect(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const extractedHeadings: Array<{ id: string, title: string, level: number }> = [];
    let match;

    while ((match = headingRegex.exec(finalContent)) !== null) {
      const level = match[1].length;
      const title = match[2];
      const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      extractedHeadings.push({ id, title, level });
    }

    setHeadings(extractedHeadings);
  }, [finalContent]);

  // Get current theme index
  const currentThemeIndex = themes.findIndex(t => t.slug === currentThemeSlug);
  const previousTheme = currentThemeIndex > 0 ? themes[currentThemeIndex - 1] : null;
  const nextTheme = currentThemeIndex < themes.length - 1 ? themes[currentThemeIndex + 1] : null;

  // Smooth scroll to element
  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const codeContent = String(children).replace(/\n$/, '');

    const handleCopy = () => {
      navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (!inline && match) {
      return (
        <div className="relative group my-6 overflow-hidden rounded-lg border border-border bg-[#0d1117]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-[#161b22]">
            <span className="text-xs font-mono text-muted-foreground">{match[1]}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-white/10 text-muted-foreground hover:text-white"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <div className="p-4 overflow-x-auto">
            <code className={className} {...props}>
              {children}
            </code>
          </div>
        </div>
      );
    }

    return (
      <code className={cn("px-1.5 py-0.5 rounded-md bg-muted font-mono text-sm text-primary", className)} {...props}>
        {children}
      </code>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Themes Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/dashboard/learn')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kurslarga qaytish</span>
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {themes.map((theme) => {
              const isActive = theme.slug === currentThemeSlug;
              return (
                <Link key={theme.id} to={`?theme=${theme.slug}`}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start px-4 py-3 h-auto text-sm font-normal text-left whitespace-normal",
                      isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-medium"
                        : "hover:bg-muted"
                    )}
                  >
                    <span className="line-clamp-2">{theme.title}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile Themes Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border flex flex-col shadow-2xl animate-in slide-in-from-left">
            <div className="flex h-16 items-center justify-between border-b border-border px-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="font-bold text-foreground">Lisoniy</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-1">
                {themes.map((theme) => {
                  const isActive = theme.slug === currentThemeSlug;
                  return (
                    <Link key={theme.id} to={`?theme=${theme.slug}`} onClick={() => setSidebarOpen(false)}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start px-4 py-3 h-auto text-sm font-normal text-left whitespace-normal",
                          isActive
                            ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-medium"
                            : "hover:bg-muted"
                        )}
                      >
                        <span className="line-clamp-2">{theme.title}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </ScrollArea>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Mobile Header */}
        <div className="flex md:hidden h-14 items-center border-b border-border px-4 bg-card/50 backdrop-blur">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="-ml-2">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold ml-2 truncate">{courseTitle}</span>
        </div>

        {/* Content + TOC */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              <article className="prose prose-slate dark:prose-invert max-w-none 
                prose-headings:scroll-mt-24 
                prose-h1:text-4xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:mb-8
                prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-base prose-p:leading-7 prose-p:text-muted-foreground prose-p:mb-6
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:mb-2 prose-li:text-muted-foreground
                prose-strong:font-semibold prose-strong:text-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
                prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-border
              ">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ node, ...props }) => <h1 id={String(props.children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} {...props} />,
                    h2: ({ node, ...props }) => <h2 id={String(props.children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} {...props} />,
                    h3: ({ node, ...props }) => <h3 id={String(props.children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} {...props} />,
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-8 rounded-lg border border-border bg-card shadow-sm">
                        <table className="w-full text-sm text-left" {...props} />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-muted/50 border-b border-border" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                      <tbody className="divide-y divide-border" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                      <tr className="bg-card hover:bg-muted/50 transition-colors" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th className="px-6 py-4 font-semibold text-foreground uppercase tracking-wider text-xs whitespace-nowrap" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap" {...props} />
                    ),
                    // @ts-ignore
                    code: CodeBlock,
                    a: ({ node, ...props }) => (
                      <a
                        className="text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                  }}
                >
                  {finalContent}
                </ReactMarkdown>
              </article>

              {/* Navigation Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-16 pt-8 border-t border-border">
                {previousTheme ? (
                  <Link to={`?theme=${previousTheme.slug}`} className="col-start-1">
                    <Button variant="outline" className="w-full h-auto py-4 px-6 justify-between group hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div className="text-left">
                          <div className="text-xs text-muted-foreground mb-1">Oldingi mavzu</div>
                          <div className="font-medium line-clamp-1">{previousTheme.title}</div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                ) : <div />}

                {nextTheme ? (
                  <Link to={`?theme=${nextTheme.slug}`} className="col-start-2">
                    <Button variant="outline" className="w-full h-auto py-4 px-6 justify-between group hover:border-primary/50 transition-colors">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Keyingi mavzu</div>
                        <div className="font-medium line-clamp-1">{nextTheme.title}</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Button>
                  </Link>
                ) : <div />}
              </div>
            </div>

            {/* Footer Spacer */}
            <div className="h-12"></div>
          </main>

          {/* Table of Contents - Desktop */}
          <aside className="hidden xl:block w-72 border-l border-border bg-card/30 overflow-y-auto min-w-[18rem]">
            <div className="sticky top-0 p-6">
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <Menu className="h-4 w-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">Mundarija</h3>
              </div>
              <nav className="space-y-1 relative">
                {/* Visual guideline line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-[3px]" />

                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={cn(
                      "block py-2 text-sm transition-all duration-200 border-l-2 relative pl-4",
                      "hover:text-foreground hover:border-muted-foreground/50",
                      // Indentation based on headers level
                      heading.level === 1 ? "font-medium text-foreground border-transparent" :
                        heading.level === 2 ? "text-muted-foreground border-transparent ml-2" :
                          "text-muted-foreground/70 border-transparent ml-4 text-xs"
                    )}
                    onClick={(e) => handleTocClick(e, heading.id)}
                  >
                    {heading.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}