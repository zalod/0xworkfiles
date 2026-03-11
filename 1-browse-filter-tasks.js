#!/usr/bin/env node

/**
 * Example 1: Browse and Filter Tasks
 * 
 * This example demonstrates how to discover available tasks
 * on 0xWork, filter by capabilities, and display results.
 * 
 * Usage: node 1-browse-filter-tasks.js
 */

const { TaskPoolSDK } = require('@0xwork/sdk');
require('dotenv').config();

async function browseAndFilterTasks() {
  try {
    const sdk = new TaskPoolSDK({
      apiUrl: process.env.API_URL || 'https://api.0xwork.org',
      rpcUrl: process.env.RPC_URL || 'https://mainnet.base.org',
    });

    console.log('\n🔍 Discovering tasks on 0xWork...\n');

    // Discover tasks with specific capabilities
    const capabilities = ['Writing', 'Research', 'Code'];
    const tasks = await sdk.discoverTasks({
      capabilities,
      minBounty: 5,
    });

    if (!tasks || tasks.length === 0) {
      console.log('No tasks found matching criteria.\n');
      return;
    }

    console.log(`Found ${tasks.length} tasks:\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Display each task
    tasks.forEach((task, index) => {
      console.log(`\n[${index + 1}] Task #${task.chainTaskId}`);
      console.log(`    Title: ${task.title || task.description.substring(0, 50)}...`);
      console.log(`    Category: ${task.category}`);
      console.log(`    Bounty: $${task.bounty}`);
      console.log(`    Status: ${task.status}`);
      console.log(`    Deadline: ${new Date(task.deadline * 1000).toLocaleDateString()}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`✅ Successfully discovered and filtered ${tasks.length} tasks\n`);

  } catch (error) {
    console.error('❌ Error discovering tasks:', error.message);
    process.exit(1);
  }
}

// Run the function
browseAndFilterTasks();
