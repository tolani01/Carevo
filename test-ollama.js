// Test script to verify Ollama installation and models
const fetch = require('node-fetch');

async function testOllama() {
  console.log('🔍 Testing Ollama installation...\n');
  
  try {
    // Test 1: Check if Ollama service is running
    console.log('1. Checking Ollama service...');
    const healthResponse = await fetch('http://localhost:11434/api/tags');
    
    if (healthResponse.ok) {
      console.log('✅ Ollama service is running');
      
      // Test 2: List available models
      console.log('\n2. Checking available models...');
      const models = await healthResponse.json();
      console.log('Available models:', models.models?.map(m => m.name) || 'No models found');
      
      // Test 3: Test AI search endpoint
      console.log('\n3. Testing AI search endpoint...');
      const searchResponse = await fetch('http://localhost:3000/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'lab results',
          context: { userRole: 'healthcare-provider' }
        })
      });
      
      if (searchResponse.ok) {
        const result = await searchResponse.json();
        console.log('✅ AI search is working!');
        console.log('Result:', JSON.stringify(result, null, 2));
      } else {
        console.log('❌ AI search failed:', await searchResponse.text());
      }
      
    } else {
      console.log('❌ Ollama service is not running');
      console.log('Please run: ollama serve');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n📋 Setup Instructions:');
    console.log('1. Install Ollama: https://ollama.ai/download');
    console.log('2. Run: ollama pull tinyllama');
    console.log('3. Run: ollama serve');
    console.log('4. Run this test again: node test-ollama.js');
  }
}

testOllama();
