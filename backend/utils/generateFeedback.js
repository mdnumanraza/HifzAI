// AI feedback generation for Quranic recitation analysis
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generate AI feedback for recitation analysis
 */
export async function generateFeedback(expectedText, userRecitedText, comparisonResults) {
  try {
    const { accuracy, wordDiff, missingWords, extraWords, stats } = comparisonResults;
    
    // Create detailed analysis for the AI
    const analysisData = {
      accuracy_score: accuracy,
      total_words: stats.totalWords,
      correct_words: stats.correctWords,
      partial_words: stats.partialWords,
      incorrect_words: stats.incorrectWords,
      missing_words: missingWords,
      extra_words: extraWords,
      word_issues: wordDiff.filter(w => w.issue).map(w => ({
        word: w.word,
        issue: w.issue,
        status: w.status
      }))
    };
    
    const systemPrompt = `You are an expert Qur'an recitation teacher (Qari) with deep knowledge of Tajweed rules, Arabic pronunciation, and Islamic pedagogy. 

Your role is to:
1. Provide kind, encouraging feedback to students learning Quranic recitation
2. Explain Tajweed mistakes clearly with Islamic terminology
3. Give specific, actionable improvement tips
4. Reference relevant Tajweed rules when appropriate
5. Always maintain a supportive, patient tone

Context: The student recited an ayah and their audio was analyzed. You have access to:
- Expected text (original ayah)
- User's transcribed recitation
- Detailed word-by-word comparison results
- Accuracy score and specific issues detected

Please provide feedback in a structured format focusing on:
- Overall performance summary
- Specific mistakes with explanations
- Tajweed improvements needed
- Practical tips for better recitation`;

    const userPrompt = `Please analyze this Quranic recitation:

Expected Ayah Text: ${expectedText}
Student's Recitation: ${userRecitedText}

Analysis Results:
- Overall Accuracy: ${(accuracy * 100).toFixed(1)}%
- Correct Words: ${stats.correctWords}/${stats.totalWords}
- Words with Issues: ${stats.partialWords + stats.incorrectWords}

Detailed Issues:
${analysisData.word_issues.map(issue => 
  `- Word "${issue.word}": ${issue.issue} (${issue.status})`
).join('\n')}

${missingWords.length > 0 ? `Missing Words: ${missingWords.join(', ')}` : ''}
${extraWords.length > 0 ? `Extra Words: ${extraWords.join(', ')}` : ''}

Please provide structured feedback with:
1. A brief encouraging summary
2. List of specific mistakes (if any)
3. Tajweed improvement suggestions
4. Practical tips for better recitation

Keep feedback concise but comprehensive, suitable for a student learning Quranic recitation.`;

    const prompt = `${systemPrompt}\n\nUser Query:\n${userPrompt}`;
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const aiResponse = result.response.text();
    
    // Parse the AI response into structured feedback
    const feedback = parseAIResponse(aiResponse, accuracy);
    
    return feedback;
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    
    // Fallback feedback if AI fails
    return generateFallbackFeedback(accuracy, comparisonResults);
  }
}

/**
 * Parse AI response into structured format
 */
function parseAIResponse(response, accuracy) {
  try {
    const lines = response.split('\n').filter(line => line.trim());
    
    let summary = '';
    const mistakes = [];
    const improvements = [];
    const tajweedTips = [];
    
    let currentSection = 'summary';
    
    for (const line of lines) {
      const cleanLine = line.trim();
      
      if (cleanLine.toLowerCase().includes('mistake') || cleanLine.toLowerCase().includes('error')) {
        currentSection = 'mistakes';
        continue;
      } else if (cleanLine.toLowerCase().includes('improvement') || cleanLine.toLowerCase().includes('suggestion')) {
        currentSection = 'improvements';
        continue;
      } else if (cleanLine.toLowerCase().includes('tajweed') || cleanLine.toLowerCase().includes('tip')) {
        currentSection = 'tajweedTips';
        continue;
      }
      
      if (cleanLine.startsWith('-') || cleanLine.startsWith('•') || /^\d+\./.test(cleanLine)) {
        const content = cleanLine.replace(/^[-•\d.]\s*/, '');
        if (content) {
          if (currentSection === 'mistakes') {
            mistakes.push(content);
          } else if (currentSection === 'improvements') {
            improvements.push(content);
          } else if (currentSection === 'tajweedTips') {
            tajweedTips.push(content);
          }
        }
      } else if (currentSection === 'summary' && cleanLine) {
        summary += (summary ? ' ' : '') + cleanLine;
      }
    }
    
    // If parsing failed, use the whole response as summary
    if (!summary && !mistakes.length && !improvements.length && !tajweedTips.length) {
      summary = response;
    }
    
    return {
      summary: summary || generateDefaultSummary(accuracy),
      mistakes: mistakes.length ? mistakes : [],
      improvements: improvements.length ? improvements : [],
      tajweedTips: tajweedTips.length ? tajweedTips : []
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      summary: response || generateDefaultSummary(accuracy),
      mistakes: [],
      improvements: [],
      tajweedTips: []
    };
  }
}

/**
 * Generate fallback feedback when AI is unavailable
 */
function generateFallbackFeedback(accuracy, comparisonResults) {
  const { wordDiff, missingWords, extraWords } = comparisonResults;
  
  let summary = '';
  const mistakes = [];
  const improvements = [];
  const tajweedTips = [];
  
  if (accuracy >= 0.9) {
    summary = 'Excellent recitation! Your accuracy is very high. Keep up the great work.';
  } else if (accuracy >= 0.75) {
    summary = 'Good recitation with room for improvement. Focus on the areas highlighted below.';
  } else if (accuracy >= 0.5) {
    summary = 'Your recitation shows effort, but needs more practice. Please review the feedback carefully.';
  } else {
    summary = 'Keep practicing! Recitation improves with time and dedication. Start slowly and focus on accuracy.';
  }
  
  // Analyze common issues
  const issues = wordDiff.filter(w => w.issue);
  const issueTypes = {};
  
  issues.forEach(issue => {
    issueTypes[issue.issue] = (issueTypes[issue.issue] || 0) + 1;
  });
  
  Object.entries(issueTypes).forEach(([issue, count]) => {
    switch (issue) {
      case 'missing_elongation':
        mistakes.push(`Missing elongation (Madd) in ${count} word(s)`);
        improvements.push('Practice extending vowels where required');
        tajweedTips.push('Listen carefully to proper Madd application');
        break;
      case 'emphatic_letter_missing':
        mistakes.push(`Emphatic letters not pronounced correctly in ${count} word(s)`);
        improvements.push('Focus on proper pronunciation of emphatic letters (ص، ض، ط، ظ)');
        tajweedTips.push('Practice Tafkheem (heavy pronunciation) for emphatic letters');
        break;
      case 'ikhfa_idgham_issue':
        mistakes.push(`Possible Ikhfa or Idgham rule not applied in ${count} word(s)`);
        improvements.push('Review Nun Sakinah and Tanween rules');
        tajweedTips.push('Practice Ikhfa and Idgham with proper nasal sounds');
        break;
      default:
        mistakes.push(`Pronunciation issues in ${count} word(s)`);
        improvements.push('Listen to correct recitation and repeat');
        break;
    }
  });
  
  if (missingWords.length > 0) {
    mistakes.push(`${missingWords.length} word(s) were not recited`);
    improvements.push('Practice the complete ayah to avoid missing words');
  }
  
  if (extraWords.length > 0) {
    mistakes.push(`${extraWords.length} extra word(s) were added`);
    improvements.push('Focus on reciting only the ayah text');
  }
  
  // Add general tips
  if (accuracy < 0.8) {
    tajweedTips.push('Start with slow, clear pronunciation');
    tajweedTips.push('Listen to qualified Qaris for reference');
    tajweedTips.push('Practice individual words before full ayah');
  }
  
  return {
    summary,
    mistakes,
    improvements,
    tajweedTips
  };
}

/**
 * Generate default summary based on accuracy
 */
function generateDefaultSummary(accuracy) {
  if (accuracy >= 0.9) {
    return 'Excellent recitation! Your pronunciation is very accurate. Keep up the wonderful work.';
  } else if (accuracy >= 0.75) {
    return 'Good recitation with minor areas for improvement. You\'re doing well, keep practicing.';
  } else if (accuracy >= 0.5) {
    return 'Your recitation shows effort and dedication. Focus on the specific feedback to improve further.';
  } else {
    return 'Keep practicing with patience and dedication. Every step forward in learning Quran is blessed.';
  }
}