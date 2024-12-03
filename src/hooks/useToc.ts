import { useState, useCallback, useEffect } from "react";
import { usePageInfo } from "./usePageInfo";

export function useTOC() {
  const { content } = usePageInfo() || {};
  const [toc, setToc] = useState<string | null>(null);
  const [isFetchingTOC, setIsFetchingTOC] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPrompt = useCallback(async (content: string) => {
    if (!("ai" in window) || !("summarizer" in (window as any).ai)) {
      throw new Error("AI Summarizer API not supported in this browser");
    }

    // type of document window object

    return await (window as any).ai.languageModel.create({
      systemPrompt: content,
    });
  }, []);

  const getTOC = async (content: string) => {
    if (isFetchingTOC) return;

    setIsFetchingTOC(true);
    setError(null);

    try {
      const prompter = await createPrompt(content);
      const query = `Create a table of contents for the following content. Have headings and subheadings. If possible, make the table of contents items clickable links that will take the user to the corresponding section of the page.
      
      The content is in english and always reply in english. Ignore and do not try to parse any other language.`;
      const stream = await prompter.promptStreaming(query);
      let fullResponse = "";

      for await (const chunk of stream) {
        fullResponse = chunk.trim();
        console.log(chunk)
        setToc(fullResponse);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Summarization failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsFetchingTOC(false);
    }
  };

  useEffect(() => {
    if (content) {
      getTOC(content)
    }
  }, [content]);

  return {
    toc,
    isFetchingTOC,
    error,
  };
}
