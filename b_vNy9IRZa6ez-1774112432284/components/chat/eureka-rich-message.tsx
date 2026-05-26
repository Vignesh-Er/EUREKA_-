"use client"

import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

type EurekaRichMessageProps = {
  role: "user" | "assistant"
  content: string
}

export function EurekaRichMessage({ role, content }: EurekaRichMessageProps) {
  if (role === "user") {
    return <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
  }

  return (
    <div className="eureka-ai-rich">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          a: (props) => (
            <a
              {...props}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
