export const profanityFilter = (text: string): string => {
  // Simple regex-based profanity filter
  // This is a placeholder list; in a real app, use a comprehensive library or API
  const badWords = [
    'damn', 'hell', 'crap', 'ass', 'bitch', 'bastard', 'fuck', 'shit'
    // Add Hindi profanity here if needed
  ];
  
  let filteredText = text;
  badWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filteredText = filteredText.replace(regex, '****');
  });
  
  return filteredText;
};
