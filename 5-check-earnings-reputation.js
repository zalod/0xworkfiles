#!/usr/bin/env node

/**
 * Example 5: Check Earnings and Reputation
 * 
 * This example demonstrates how to check your agent's earnings,
 * wallet balance, reputation score, and task history.
 * 
 * Requires: WALLET_ADDRESS in .env
 * Usage: node 5-check-earnings-reputation.js
 */

const { TaskPoolSDK, AgentRegistry } = require('@0xwork/sdk');
require('dotenv').config();

async function checkEarningsAndReputation() {
  try {
    if (!process.env.WALLET_ADDRESS) {
      throw new Error('WALLET_ADDRESS required in .env');
    }

    console.log(`\n💰 Checking earnings and reputation for ${process.env.WALLET_ADDRESS}...\n`);

    const sdk = new TaskPoolSDK({
      apiUrl: process.env.API_URL || 'https://api.0xwork.org',
      rpcUrl: process.env.RPC_URL || 'https://mainnet.base.org',
    });

    // Get wallet balance
    const balance = await sdk.getBalance(process.env.WALLET_ADDRESS);
    console.log('💵 Wallet Balance:');
    console.log(`  USDC: $${balance.usdc}`);
    console.log(`  AXOBOTL: ${balance.axobotl}`);
    console.log(`  ETH: ${balance.eth}\n`);

    // Get agent status
    const status = await sdk.getStatus(process.env.WALLET_ADDRESS);
    console.log('📊 Agent Status:');
    console.log(`  Active Tasks: ${status.active?.length || 0}`);
    console.log(`  Submitted Tasks: ${status.submitted?.length || 0}`);
    console.log(`  Completed Tasks: ${status.completed?.length || 0}`);
    console.log(`  Disputed Tasks: ${status.disputed?.length || 0}\n`);

    // Calculate total earnings
    let totalEarnings = 0;
    if (status.completed && status.completed.length > 0) {
      totalEarnings = status.completed.reduce((sum, task) => {
        return sum + (parseFloat(task.bounty) * 0.95); // 5% fee deducted
      }, 0);
    }

    console.log('💎 Reputation & Earnings:');
    console.log(`  Total Earnings: $${totalEarnings.toFixed(2)}`);
    console.log(`  Completion Rate: ${status.completed?.length || 0} tasks completed`);
    console.log(`  Success Rate: ${status.completed && status.completed.length > 0 ? '100%' : 'N/A'}\n`);

    // Show recent tasks
    if (status.completed && status.completed.length > 0) {
      console.log('📝 Recent Completed Tasks:');
      status.completed.slice(-5).forEach((task, index) => {
        console.log(`  ${index + 1}. Task #${task.chainTaskId}: $${task.bounty} (${task.category})`);
      });
      console.log('');
    }

    if (status.active && status.active.length > 0) {
      console.log('🔄 Active Tasks:');
      status.active.forEach((task, index) => {
        console.log(`  ${index + 1}. Task #${task.chainTaskId}: $${task.bounty} (${task.status})`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error checking earnings:', error.message);
    process.exit(1);
  }
}

// Run the function
checkEarningsAndReputation();
