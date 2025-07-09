import * as fs from 'fs';
import * as path from 'path';
import { Product, SearchIndex } from '@/src/types';

/**
 * Extract Korean consonants from a string
 */
function extractConsonants(text: string): string {
  const consonants = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 
    'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ];
  
  const result: string[] = [];
  
  for (const char of text) {
    const code = char.charCodeAt(0);
    
    // Check if it's a Korean syllable
    if (code >= 0xAC00 && code <= 0xD7A3) {
      // Extract initial consonant
      const initial = Math.floor((code - 0xAC00) / 588);
      result.push(consonants[initial]);
    }
  }
  
  return result.join('');
}

/**
 * Tokenize text for indexing
 */
function tokenize(text: string): string[] {
  // Convert to lowercase
  const lower = text.toLowerCase();
  
  // Split by spaces and special characters
  const tokens = lower.split(/[\s\-_,./\\()\[\]{}!@#$%^&*+=|<>?~`]+/);
  
  // Filter out empty tokens and duplicates
  return Array.from(new Set(tokens.filter(token => token.length > 0)));
}

async function buildSearchIndex() {
  console.log('🔍 Building search index...\n');
  
  const productsPath = path.join(process.cwd(), 'data', 'products', 'all-products.json');
  const outputPath = path.join(process.cwd(), 'data', 'search-index.json');
  
  // Read all products
  if (!fs.existsSync(productsPath)) {
    console.error('❌ all-products.json not found. Run generate-json first.');
    return;
  }
  
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  const products: Product[] = productsData.products;
  
  console.log(`Indexing ${products.length} products...`);
  
  // Build indexes
  const keywordIndex: Record<string, string[]> = {};
  const consonantIndex: Record<string, string[]> = {};
  
  products.forEach((product, index) => {
    if (index % 1000 === 0) {
      console.log(`  Processed ${index}/${products.length} products...`);
    }
    
    // Extract keywords from various fields
    const textToIndex = [
      product.name,
      product.mall_name,
      ...product.categories,
      product.search_text || ''
    ].join(' ');
    
    // Tokenize and index
    const tokens = tokenize(textToIndex);
    tokens.forEach(token => {
      if (!keywordIndex[token]) {
        keywordIndex[token] = [];
      }
      if (!keywordIndex[token].includes(product.id)) {
        keywordIndex[token].push(product.id);
      }
    });
    
    // Korean consonant indexing
    const koreanText = product.name + ' ' + product.categories.join(' ');
    const consonants = extractConsonants(koreanText);
    
    if (consonants.length >= 2) {
      // Index 2-character and 3-character consonant combinations
      for (let i = 0; i <= consonants.length - 2; i++) {
        const twoChar = consonants.substr(i, 2);
        if (!consonantIndex[twoChar]) {
          consonantIndex[twoChar] = [];
        }
        if (!consonantIndex[twoChar].includes(product.id)) {
          consonantIndex[twoChar].push(product.id);
        }
        
        if (i <= consonants.length - 3) {
          const threeChar = consonants.substr(i, 3);
          if (!consonantIndex[threeChar]) {
            consonantIndex[threeChar] = [];
          }
          if (!consonantIndex[threeChar].includes(product.id)) {
            consonantIndex[threeChar].push(product.id);
          }
        }
      }
    }
  });
  
  // Create search index
  const searchIndex: SearchIndex = {
    version: '1.0',
    created_at: new Date().toISOString(),
    index: keywordIndex,
    consonant_index: consonantIndex
  };
  
  // Save index
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));
  
  // Stats
  const keywordCount = Object.keys(keywordIndex).length;
  const consonantCount = Object.keys(consonantIndex).length;
  
  console.log('\n✅ Search index built successfully!');
  console.log(`  Keywords indexed: ${keywordCount}`);
  console.log(`  Consonant patterns: ${consonantCount}`);
  console.log(`  Index size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
  
  // Save a smaller sample index for development
  const sampleIndex: SearchIndex = {
    version: '1.0',
    created_at: new Date().toISOString(),
    index: Object.fromEntries(
      Object.entries(keywordIndex).slice(0, 100)
    ),
    consonant_index: Object.fromEntries(
      Object.entries(consonantIndex).slice(0, 50)
    )
  };
  
  const samplePath = path.join(process.cwd(), 'data', 'search-index-sample.json');
  fs.writeFileSync(samplePath, JSON.stringify(sampleIndex, null, 2));
  
  console.log('\n✨ Search index generation complete!');
}

// Run if called directly
if (require.main === module) {
  buildSearchIndex().catch(console.error);
}

export default buildSearchIndex;