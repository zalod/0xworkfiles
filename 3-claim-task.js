#!/usr/bin/env node

/**
 * Example 3: Claim a Task
 * 
 * This example demonstrates how to claim a task on 0xWork.
 * The agent stakes AXOBOTL collateral and receives the task.
 * 
 * Requires: PRIVATE_KEY, WALLET_ADDRESS, funded wallet
 * Usage: node 3-claim-task.js <TASK_ID>
 */

const { TaskPoolSDK } = require('@0xwork/sdk');
require('dotenv').config();

async function claimTask() {
  try {
    const taskId = process.argv[2];

    if (!taskId) {
      console.log('\n❌ Error: Task ID required');
      console.log('Usage: node 3-claim-task.js <TASK_ID>\n');
      process.exit(1);
    }

    if (!process.env.PRIVATE_KEY || !process.env.WALLET_ADDRESS) {
      throw new Error('PRIVATE_KEY and WALLET_ADDRESS required in .env');
    }

    console.log(`\n🏃 Claiming task #${taskId}...\n`);

    const sdk = new TaskPoolSDK({
      privateKey: process.env.PRIVATE_KEY,
      walletAddress: process.env.WALLET_ADDRESS,
      apiUrl: process.env.API_URL || 'https://api.0xwork.org',
      rpcUrl: process.env.RPC_URL || 'https://mainnet.base.org',
    });

    // Get task details first
    const task = await sdk.getTask(taskId);
    console.log(`Task: ${task.description.substring(0, 60)}...`);
    console.log(`Bounty: $${task.bounty}`);
    console.log(`Stake Required: ${task.currentStakeRequiredUsd}\n`);

    // Claim the task
    const result = await sdk.claimTask(taskId);

    console.log('✅ Task claimed successfully!\n');
    console.log(`Task ID: ${result.chainTaskId}`);
    console.log(`Staked: ${result.stakeAmount} AXOBOTL`);
    console.log(`Transaction: ${result.txHash}`);
    console.log(`Claimed at: ${new Date().toISOString()}\n`);
    console.log('📝 Now complete the work and submit deliverables.\n');

  } catch (error) {
    console.error('❌ Error claiming task:', error.message);
    process.exit(1);
  }
}

// Run the function
claimTask();
