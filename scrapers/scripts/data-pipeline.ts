#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import runAllScrapers from './run-all';
import generateJson from './generate-json';
import buildSearchIndex from './build-search-index';

async function runDataPipeline() {
  console.log('🚀 Starting data pipeline...\n');
  const startTime = Date.now();
  
  try {
    // Step 1: Run all scrapers
    console.log('📊 Step 1/4: Running scrapers...');
    await runAllScrapers();
    
    // Step 2: Generate JSON files
    console.log('\n📊 Step 2/4: Generating JSON files...');
    await generateJson();
    
    // Step 3: Build search index
    console.log('\n📊 Step 3/4: Building search index...');
    await buildSearchIndex();
    
    // Step 4: Git automation (if enabled)
    if (process.env.AUTO_COMMIT === 'true') {
      console.log('\n📊 Step 4/4: Committing to Git...');
      await gitCommit();
    } else {
      console.log('\n📊 Step 4/4: Skipping Git commit (AUTO_COMMIT not set)');
    }
    
    const totalTime = (Date.now() - startTime) / 1000 / 60;
    console.log(`\n✨ Pipeline complete in ${totalTime.toFixed(2)} minutes!`);
    
  } catch (error) {
    console.error('\n❌ Pipeline failed:', error);
    process.exit(1);
  }
}

async function gitCommit() {
  try {
    // Check if there are changes
    const status = execSync('git status --porcelain data/', { encoding: 'utf-8' });
    
    if (!status.trim()) {
      console.log('No changes to commit');
      return;
    }
    
    // Add data files
    execSync('git add data/');
    
    // Commit with timestamp
    const timestamp = new Date().toISOString();
    const message = `Update: Product data ${timestamp}`;
    execSync(`git commit -m "${message}"`);
    
    console.log('✅ Changes committed');
    
    // Push if AUTO_PUSH is enabled
    if (process.env.AUTO_PUSH === 'true') {
      console.log('Pushing to remote...');
      execSync('git push');
      console.log('✅ Pushed to remote');
    }
    
  } catch (error) {
    console.error('Git automation failed:', error);
    throw error;
  }
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
K-Mall Aggregator Data Pipeline

Usage: npm run pipeline [options]

Options:
  --scrape-only     Run only the scraping step
  --generate-only   Run only JSON generation
  --index-only      Run only search index building
  --no-commit       Skip Git commit even if AUTO_COMMIT is set
  
Environment variables:
  AUTO_COMMIT=true  Automatically commit changes to Git
  AUTO_PUSH=true    Automatically push to remote (requires AUTO_COMMIT)
    `);
    process.exit(0);
  }
  
  // Handle individual steps
  if (args.includes('--scrape-only')) {
    runAllScrapers().catch(console.error);
  } else if (args.includes('--generate-only')) {
    generateJson().catch(console.error);
  } else if (args.includes('--index-only')) {
    buildSearchIndex().catch(console.error);
  } else {
    // Run full pipeline
    if (args.includes('--no-commit')) {
      process.env.AUTO_COMMIT = 'false';
    }
    runDataPipeline().catch(console.error);
  }
}

export default runDataPipeline;