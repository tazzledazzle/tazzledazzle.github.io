function stripForWordCount(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>[\s\S]*?<\/[^>]+>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_~`>[\]()!-]/g, " ");
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function calculateReadTime(body: string, wpm = 225): number {
  const words = countWords(stripForWordCount(body));
  return Math.max(1, Math.ceil(words / wpm));
}
