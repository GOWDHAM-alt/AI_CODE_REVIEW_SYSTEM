const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY  // ✅ from .env
});

const reviewCode = async (code, language) => {
  const prompt = `
    You are an expert code reviewer. Review the following ${language} code and provide:
    
    1. **Overall Assessment** - Brief summary of the code quality
    2. **Bugs & Errors** - Any bugs or potential errors found
    3. **Code Quality** - Readability, naming conventions, structure
    4. **Performance** - Any performance issues or improvements
    5. **Security** - Any security vulnerabilities
    6. **Suggestions** - Specific improvements with corrected code examples
    
    Code to review:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Be specific, helpful and friendly in your review.
  `;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',  // best free model on Groq
    messages: [
      { 
        role: 'system', 
        content: 'You are an expert code reviewer who gives clear, helpful and detailed feedback.' 
      },
      { 
        role: 'user', 
        content: prompt 
      }
    ],
    max_tokens: 1500,
    temperature: 0.3   // lower = more focused and precise responses
  });

  return response.choices[0].message.content;
};

module.exports = { reviewCode };