import React, { useEffect, useState } from "react";
import { useTOC } from "../../hooks/useToc";
import { usePageInfo } from "../../hooks/usePageInfo";
import ReactMarkdown from 'react-markdown';

export function TOC() {
  const { toc, error } = useTOC();
  const pageInfo = usePageInfo();
  const [headings, setHeadings] = useState<any[]>([]);

  const handleClick = (heading: any) => {
    window.parent.postMessage({ action: "redirect", url: `#${heading.id}` }, "*");
  }

  useEffect(() => {
    if (!pageInfo?.htmlContent) {
      return;
    }
    const dom = document.createElement("body");
    dom.innerHTML = pageInfo?.htmlContent || '';
    const headings = dom.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const filteredHeadings: any = [];
    headings.forEach((headingsItem) => {
      if (headingsItem.id) {
        filteredHeadings.push(headingsItem);
      }
    })
    setHeadings(filteredHeadings);
  }, [pageInfo?.htmlContent])

  return <>
    {headings.length ? <>
      <h2>Table of Contents</h2>
      <ul>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a onClick={() => handleClick(heading)}>{heading.innerText}</a>
          </li>
        ))}
      </ul>
    </> : null}

    {toc && <>
      <h2>Smart TOC</h2>
      <div>
        <ReactMarkdown>{toc}</ReactMarkdown>
        {error && (
          <div className="rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}
      </div>
    </>}
  </>

}