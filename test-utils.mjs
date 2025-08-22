#!/usr/bin/env node

// Quick test script for user-utils functions
import { formatDisplayName, getInitials } from './lib/user-utils.js';

console.log('Testing formatDisplayName:');
console.log('Davi Santos Lopes ->', formatDisplayName('Davi Santos Lopes'));
console.log('Davi ->', formatDisplayName('Davi'));
console.log('  davi   lopes   ->', formatDisplayName('  davi   lopes   '));
console.log('null ->', formatDisplayName(null));
console.log('undefined ->', formatDisplayName(undefined));
console.log('\'\' ->', formatDisplayName(''));

console.log('\nTesting getInitials:');
console.log('Davi Santos Lopes ->', getInitials('Davi Santos Lopes'));
console.log('Davi ->', getInitials('Davi'));
console.log('null ->', getInitials(null));
console.log('undefined ->', getInitials(undefined));
