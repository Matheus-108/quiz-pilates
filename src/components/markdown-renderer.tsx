import React from 'react';

// This is a simplified markdown renderer.
// It supports: ## H2, ### H3, * list items, **bold**, and paragraphs.
const MarkdownRenderer = ({ content }: { content: string }) => {
  const htmlContent = content
    .split('\n')
    .map(line => {
      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Headings
      if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
      if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
      // List items
      if (line.startsWith('* ')) return `<li>${line.substring(2)}</li>`;
      // Paragraphs
      if (line.trim() === '') return ''; // Return empty string for blank lines
      return `<p>${line}</p>`;
    })
    .join('')
    // Wrap consecutive <li>s in <ul>
    .replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');

  return (
    <div
      className="prose-sm sm:prose-base max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-xl prose-h3:font-bold prose-h3:mt-4 prose-h3:mb-2 prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2 prose-p:text-foreground/90 prose-p:mb-4 prose-strong:font-bold"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;
