import { validateProducts, validateMalls, validateSearchIndex } from './validation';
import sampleProducts from '@/data/samples/sample-products.json';
import sampleMalls from '@/data/samples/sample-malls.json';
import sampleSearchIndex from '@/data/samples/sample-search-index.json';

export function testDataValidation() {
  console.log('Testing data validation...\n');

  // Test product validation
  try {
    const validatedProducts = validateProducts(sampleProducts.products);
    console.log(`✅ Products validation passed: ${validatedProducts.length} products validated`);
  } catch (error) {
    console.error('❌ Products validation failed:', error instanceof Error ? error.message : error);
  }

  // Test mall validation
  try {
    const validatedMalls = validateMalls(sampleMalls.malls);
    console.log(`✅ Malls validation passed: ${validatedMalls.length} malls validated`);
  } catch (error) {
    console.error('❌ Malls validation failed:', error instanceof Error ? error.message : error);
  }

  // Test search index validation
  try {
    const validatedIndex = validateSearchIndex(sampleSearchIndex);
    console.log(`✅ Search index validation passed`);
  } catch (error) {
    console.error('❌ Search index validation failed:', error instanceof Error ? error.message : error);
  }

  console.log('\nValidation testing complete!');
}