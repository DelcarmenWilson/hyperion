import json5 from "json5";
import { emojify } from "node-emoji";

const jsonMarkdownSanitize = (markdown: string): string => {
  markdown = emojify(markdown);
  markdown.replace(/:([^\s:]*):/g, "");
  markdown.replace(/\\([^tn])/g, "$1");
  markdown.replace(/\\t/g, "\t");
  markdown.replace(/\\n/g, "\n");
  markdown.replace(/^(?:-|\*|\+|•)\s+/gm, "- ");
  markdown.replace(/\*\*(.*?):\*\*/g, "$1:");
  markdown.replace(/^-\s+\*\*(.*?)\*\*:?/gm, "- $1:");
  markdown.replace(/^(\d+\.)\s+\*\*(.*?)\*\*:?/gm, "$1 $2:");
  return markdown;
};

 const sanitizeJson = (json: string): string => {
  return json.replace(
    /^(?:.*\n)*?^```json\n([\s\S]*?)^```\n?(?:.*\n?)*$/gm,
    "$1"
  );
};

const extractJson = (jsonText: string) => {
  const sanitizedJson = sanitizeJson(jsonText);
  const startIndex = sanitizedJson.indexOf("[");
  const endIndex = sanitizedJson.lastIndexOf("]") + 1;
  const jsonString = sanitizedJson.substring(startIndex, endIndex);
  return jsonString.replace(/"/g, '"').replace(/"/g, '"');
};

export const parseJson = (markdown: string) => {  
  const jsonText = jsonMarkdownSanitize(markdown);
  const extractedJson = extractJson(jsonText);

  return json5.parse(extractedJson);
};
