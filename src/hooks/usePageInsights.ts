import { useState, useCallback, useEffect } from "react";
import { usePageInfo } from "./usePageInfo";

export function usePageInsights() {
  const { content } = usePageInfo() || {};
  const [insights, setInsights] = useState<string | null>(null);
  const [isFetchingInsights, setIsFetchingInsights] = useState(false);
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

  const getPageInsights = async (content: string) => {
    if (isFetchingInsights) return;

    setIsFetchingInsights(true);
    setError(null);

    try {
      const prompter = await createPrompt(content);
      const query = `Infer and tell get me the following information of the page: read time, sentiment and content language. Keep it short and to the point as a key value pair. Give me one word comma separated outputs. Separate by --.

      Make it look pretty and readable and keep it to the point with only the answer.
      
      Output in markdown format. The content is in english and always reply in english. Ignore and do not try to parse any other language`;
      const stream = await prompter.promptStreaming(query);
      let fullResponse = "";

      for await (const chunk of stream) {
        fullResponse = chunk.trim();
        setInsights(fullResponse);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Summarization failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsFetchingInsights(false);
    }
  };

  useEffect(() => {
    if (content) {
      getPageInsights(content)
    }
  }, [content]);

  return {
    insights,
    isFetchingInsights,
    error,
  };
}
