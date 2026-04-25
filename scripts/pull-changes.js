import { execSync } from 'child_process';

console.log('Pulling latest changes from main branch...');

try {
  const result = execSync('git pull origin main', { encoding: 'utf-8', cwd: '/vercel/share/v0-project' });
  console.log(result);
  console.log('Successfully pulled changes!');
} catch (error) {
  console.error('Error pulling changes:', error.message);
  process.exit(1);
}
