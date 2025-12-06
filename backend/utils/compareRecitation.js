// Text comparison engine for Quranic recitation analysis
// Handles word-level comparison, tajweed detection, and accuracy scoring

/**
 * Normalize Arabic text for comparison
 */
function normalizeArabicText(text) {
  if (!text) return '';
  
  return text
    // Remove diacritics (tashkeel)
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
    // Normalize alef variants
    .replace(/[أإآ]/g, 'ا')
    // Normalize teh marbuta
    .replace(/ة/g, 'ه')
    // Remove extra spaces and trim
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split Arabic text into words while preserving structure
 */
function splitIntoWords(text) {
  if (!text) return [];
  
  return text
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map((word, index) => ({
      text: word,
      normalized: normalizeArabicText(word),
      position: index
    }));
}

/**
 * Calculate similarity between two words using Levenshtein distance
 */
function calculateWordSimilarity(word1, word2) {
  if (!word1 || !word2) return 0;
  
  const s1 = word1.toLowerCase();
  const s2 = word2.toLowerCase();
  
  if (s1 === s2) return 1;
  
  const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
  
  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,     // deletion
        matrix[j][i - 1] + 1,     // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }
  
  const maxLength = Math.max(s1.length, s2.length);
  return maxLength > 0 ? 1 - (matrix[s2.length][s1.length] / maxLength) : 1;
}

/**
 * Detect potential tajweed issues
 */
function detectTajweedIssues(expectedWord, userWord) {
  const issues = [];
  
  // Check for elongation (madd) issues
  if (expectedWord.includes('ا') && !userWord.includes('ا')) {
    issues.push('missing_elongation');
  }
  
  // Check for emphatic letters
  const emphaticLetters = ['ص', 'ض', 'ط', 'ظ', 'ق', 'خ', 'غ', 'ع', 'ر'];
  for (const letter of emphaticLetters) {
    if (expectedWord.includes(letter) && !userWord.includes(letter)) {
      issues.push('emphatic_letter_missing');
      break;
    }
  }
  
  // Check for common difficult combinations
  const difficultCombinations = ['نم', 'نب', 'نك', 'نت', 'نط'];
  for (const combo of difficultCombinations) {
    if (expectedWord.includes(combo)) {
      if (!userWord.includes(combo)) {
        issues.push('ikhfa_idgham_issue');
      }
      break;
    }
  }
  
  return issues;
}

/**
 * Compare user recitation with expected text
 */
export function compareRecitation(expectedText, userRecitedText) {
  try {
    const expectedWords = splitIntoWords(expectedText);
    const userWords = splitIntoWords(userRecitedText);
    
    const wordDiff = [];
    const missingWords = [];
    const extraWords = [];
    
    let correctWords = 0;
    let partialWords = 0;
    
    // Create alignment between expected and user words
    let userIndex = 0;
    
    for (let expectedIndex = 0; expectedIndex < expectedWords.length; expectedIndex++) {
      const expectedWord = expectedWords[expectedIndex];
      
      if (userIndex >= userWords.length) {
        // Missing word
        missingWords.push(expectedWord.text);
        wordDiff.push({
          word: expectedWord.text,
          status: 'missing',
          issue: 'word_not_recited',
          position: expectedIndex
        });
        continue;
      }
      
      const userWord = userWords[userIndex];
      const similarity = calculateWordSimilarity(expectedWord.normalized, userWord.normalized);
      
      if (similarity >= 0.9) {
        // Exact or very close match
        correctWords++;
        wordDiff.push({
          word: expectedWord.text,
          status: 'correct',
          issue: null,
          position: expectedIndex
        });
        userIndex++;
      } else if (similarity >= 0.6) {
        // Partial match
        partialWords++;
        const tajweedIssues = detectTajweedIssues(expectedWord.normalized, userWord.normalized);
        wordDiff.push({
          word: expectedWord.text,
          status: 'partial',
          issue: tajweedIssues.length > 0 ? tajweedIssues[0] : 'pronunciation_issue',
          position: expectedIndex
        });
        userIndex++;
      } else {
        // Check if user skipped this word or said something else
        let found = false;
        
        // Look ahead in user words for a better match
        for (let lookAhead = userIndex + 1; lookAhead < Math.min(userIndex + 3, userWords.length); lookAhead++) {
          const futureUserWord = userWords[lookAhead];
          const futureSimilarity = calculateWordSimilarity(expectedWord.normalized, futureUserWord.normalized);
          
          if (futureSimilarity >= 0.8) {
            // Found match ahead, mark current user word as extra
            extraWords.push(userWords[userIndex].text);
            userIndex++;
            
            correctWords++;
            wordDiff.push({
              word: expectedWord.text,
              status: 'correct',
              issue: null,
              position: expectedIndex
            });
            found = true;
            userIndex = lookAhead + 1;
            break;
          }
        }
        
        if (!found) {
          // Incorrect word
          wordDiff.push({
            word: expectedWord.text,
            status: 'incorrect',
            issue: 'wrong_word_recited',
            position: expectedIndex
          });
          userIndex++;
        }
      }
    }
    
    // Handle any remaining user words as extra
    while (userIndex < userWords.length) {
      extraWords.push(userWords[userIndex].text);
      userIndex++;
    }
    
    // Calculate weighted accuracy score
    const totalWords = expectedWords.length;
    const accuracy = totalWords > 0 ? (correctWords + (partialWords * 0.5)) / totalWords : 0;
    
    return {
      accuracy: Math.round(accuracy * 100) / 100, // Round to 2 decimal places
      wordDiff,
      missingWords,
      extraWords,
      stats: {
        totalWords,
        correctWords,
        partialWords,
        incorrectWords: totalWords - correctWords - partialWords,
        extraWordsCount: extraWords.length
      }
    };
  } catch (error) {
    console.error('Error in compareRecitation:', error);
    return {
      accuracy: 0,
      wordDiff: [],
      missingWords: [],
      extraWords: [],
      error: error.message
    };
  }
}