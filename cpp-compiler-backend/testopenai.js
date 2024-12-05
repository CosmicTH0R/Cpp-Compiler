const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: 'Your_Api_key_here',
});

async function testAI() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello, AI!' }],
    });
    console.log(response);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testAI();
