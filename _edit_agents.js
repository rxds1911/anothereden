const fs = require('fs');
const path = 'C:/Users/xylt2/Documents/anothereden/AGENTS.md';
let content = fs.readFileSync(path, 'utf8');

// Replace the 8th rule to add 9th rule
const oldText = '8. **兼容性**';
const newText = '8. **兼容性**：项目在 Windows 环境下开发，路径使用反斜杠或正斜杠均可，但尽可能保持一致。\n9. **验证错误**：每次修改代码后，必须在浏览器中刷新页面确认没有控制台错误，确保改动不会引入新问题。';

if (content.includes(oldText)) {
  content = content.replace(oldText, newText);
  fs.writeFileSync(path, content, 'utf8');
  console.log('OK - 规则9已添加');
} else {
  console.log('未找到: ' + oldText);
  // Try to find similar pattern
  const lines = content.split('\n');
  lines.forEach((l, i) => { if (l.includes('兼容')) console.log('Line ' + (i+1) + ': ' + l); });
}
