const fs = require('fs');
const path = require('path');

const dirs = ['app', 'components', 'lib', 'contexts', 'hooks', 'scripts', 'types'];

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.match(/\.(ts|tsx|js|jsx|mjs)$/)) {
                results.push(file);
            }
        }
    });
    return results;
}

const basePath = __dirname;
const files = [];
dirs.forEach(d => files.push(...walk(path.join(basePath, d))));

const rootFiles = ['middleware.ts', 'next.config.ts', 'tailwind.config.ts', 'prisma.config.ts'].map(f => path.join(basePath, f));
rootFiles.forEach(f => {
    if (fs.existsSync(f)) files.push(f);
});

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');

    content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');

    content = content.replace(/\/\*[\s\S]*?\*\//g, '');

    content = content.replace(/^\s*\/\/.*$/gm, '');

    content = content.replace(/(?<!:)\s*\/\/ [^\n]*/g, '');

    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    fs.writeFileSync(f, content, 'utf8');
});

console.log('Cleaned ' + files.length + ' files');
