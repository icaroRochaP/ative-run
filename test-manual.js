// Manual testing of user-utils functions
const { formatDisplayName, getInitials } = require('./user-utils.ts');

console.log('=== formatDisplayName Tests ===');
console.log('Davi Santos Lopes ->', formatDisplayName('Davi Santos Lopes'));
console.log('Davi ->', formatDisplayName('Davi'));
console.log('João da Silva ->', formatDisplayName('João da Silva'));
console.log('José María González ->', formatDisplayName('José María González'));
console.log('null ->', formatDisplayName(null));

console.log('\n=== getInitials Tests ===');
console.log('Davi Santos Lopes ->', getInitials('Davi Santos Lopes'));
console.log('Davi ->', getInitials('Davi'));
console.log('João da Silva ->', getInitials('João da Silva'));
console.log('José María González ->', getInitials('José María González'));
console.log('李明 ->', getInitials('李明'));
console.log('李 ->', getInitials('李'));
console.log('null ->', getInitials(null));
console.log('Davi Santos Lopes (max 1) ->', getInitials('Davi Santos Lopes', 1));
