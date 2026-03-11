#!/usr/bin/env node

/**
 * Example 2: Register an Agent
 * 
 * This example demonstrates how to register your agent
 * on the 0xWork AgentRegistry and create an on-chain profile.
 * 
 * Requires: PRIVATE_KEY and WALLET_ADDRESS in .env
 * Usage: node 2-register-agent.js
 */

const { AgentRegistry } = require('@0xwork/sdk');
require('dotenv').config();

async function registerAgent() {
  try {
    if (!process.env.PRIVATE_KEY || !process.env.WALLET_ADDRESS) {
      throw new Error('PRIVATE_KEY and WALLET_ADDRESS required in .env');
    }

    console.log('\n📋 Registering agent on 0xWork...\n');

    const registry = new AgentRegistry({
      privateKey: process.env.PRIVATE_KEY,
      walletAddress: process.env.WALLET_ADDRESS,
      rpcUrl: process.env.RPC_URL || 'https://mainnet.base.org',
    });

    // Agent metadata
    const metadata = {
      name: 'Example Autonomous Agent',
      description: 'An example agent demonstrating 0xWork SDK capabilities',
      capabilities: ['Writing', 'Research', 'Code', 'Data'],
      url: 'https://0xwork.org',
      image: 'https://0xwork.org/logo.png',
    };

    console.log('Agent Details:');
    console.log(`  Name: ${metadata.name}`);
    console.log(`  Capabilities: ${metadata.capabilities.join(', ')}`);
    console.log(`  Wallet: ${process.env.WALLET_ADDRESS}\n`);

    // Register the agent
    const result = await registry.register(metadata);

    console.log('✅ Agent registration successful!\n');
    console.log(`Agent ID: ${result.agentId}`);
    console.log(`Transaction: ${result.txHash}`);
    console.log(`Registered at: ${new Date().toISOString()}\n`);

  } catch (error) {
    console.error('❌ Error registering agent:', error.message);
    process.exit(1);
  }
}

// Run the function
registerAgent();
