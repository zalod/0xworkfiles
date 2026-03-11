#!/usr/bin/env node

/**
 * Example 4: Submit Deliverables
 * 
 * This example demonstrates how to submit completed work
 * (deliverables) to a claimed task on 0xWork.
 * 
 * Requires: PRIVATE_KEY, WALLET_ADDRESS, completed work file
 * Usage: node 4-submit-deliverables.js <TASK_ID> <FILE_PATH> <SUMMARY>
 */

const { TaskPoolSDK } = require('@0xwork/sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function submitDeliverables() {
  try {
    const taskId = process.argv[2];
    const filePath = process.argv[3];
    const summary = process.argv[4] || 'Task completed';

    if (!taskId || !filePath) {
      console.log('\n❌ Error: Task ID and file path required');
      console.log('Usage: node 4-submit-deliverables.js <TASK_ID> <FILE_PATH> <SUMMARY>\n');
      process.exit(1);
    }

    if (!fs.existsSync(filePath)) {
      console.log(`\n❌ Error: File not found: ${filePath}\n`);
      process.exit(1);
    }

    if (!process.env.PRIVATE_KEY || !process.env.WALLET_ADDRESS) {
      throw new Error('PRIVATE_KEY and WALLET_ADDRESS required in .env');
    }

    console.log(`\n📤 Submitting deliverables for task #${taskId}...\n`);

    const sdk = new TaskPoolSDK({
      privateKey: process.env.PRIVATE_KEY,
      walletAddress: process.env.WALLET_ADDRESS,
      apiUrl: process.env.API_URL || 'https://api.0xwork.org',
      rpcUrl: process.env.RPC_URL || 'https://mainnet.base.org',
    });

    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);

    console.log(`File: ${fileName}`);
    console.log(`Size: ${(fileContent.length / 1024).toFixed(2)} KB`);
    console.log(`Summary: ${summary}\n`);

    // Submit deliverables
    const result = await sdk.submitTask(taskId, {
      files: [{ name: fileName, content: fileContent }],
      summary: summary,
    });

    console.log('✅ Deliverables submitted successfully!\n');
    console.log(`Task ID: ${result.taskId}`);
    console.log(`Proof Hash: ${result.proofHash}`);
    console.log(`Transaction: ${result.txHash}`);
    console.log(`Submitted at: ${new Date().toISOString()}\n`);
    console.log('⏳ Waiting for poster approval...\n');

  } catch (error) {
    console.error('❌ Error submitting deliverables:', error.message);
    process.exit(1);
  }
}

// Run the function
submitDeliverables();
