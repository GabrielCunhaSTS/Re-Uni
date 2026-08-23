import fs from 'fs';

const files = process.argv.slice(2);

const commentRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;

files.forEach((file) => {
  if (!fs.existsSync(file)) return;

  const content = fs.readFileSync(file, 'utf8');
  const cleanedContent = content.replace(commentRegex, (match, p1) => {
    return p1 ? p1 : '';
  });

  fs.writeFileSync(file, cleanedContent, 'utf8');
});