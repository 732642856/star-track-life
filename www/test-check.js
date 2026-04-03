// 简单的测试脚本 - 模拟浏览器环境测试
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('紫微斗数人物小传生成器 - 自动测试');
console.log('========================================\n');

// 检查文件是否存在
function checkFile(filePath) {
    const fullPath = path.join(__dirname, filePath);
    return fs.existsSync(fullPath) ? '✅' : '❌';
}

console.log('文件检查:');
console.log(`  character-20-questions.js: ${checkFile('character-20-questions.js')}`);
console.log(`  character-bio-enhanced-generator.js: ${checkFile('character-bio-enhanced-generator.js')}`);
console.log(`  writing-resources.js: ${checkFile('writing-resources.js')}`);
console.log(`  index-v2.html: ${checkFile('index-v2.html')}`);
console.log(`  test-auto.html: ${checkFile('test-auto.html')}`);
console.log('\n');

// 读取文件并检查关键内容
function checkFileContent(filePath, keyword) {
    const fullPath = path.join(__dirname, filePath);
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        return content.includes(keyword);
    } catch (error) {
        return false;
    }
}

console.log('内容检查:');
console.log(`  writing-resources.js 包含爽点桥段: ${checkFileContent('writing-resources.js', 'SUANGQIAO_BRIDGES') ? '✅' : '❌'}`);
console.log(`  writing-resources.js 包含悬念手法: ${checkFileContent('writing-resources.js', 'SUSPENSE_TECHNIQUES') ? '✅' : '❌'}`);
console.log(`  writing-resources.js 包含WRITING_RESOURCES对象: ${checkFileContent('writing-resources.js', 'WRITING_RESOURCES') ? '✅' : '❌'}`);
console.log(`  character-20-questions.js 包含20问: ${checkFileContent('character-20-questions.js', 'CHARACTER_20_QUESTIONS') ? '✅' : '❌'}`);
console.log(`  character-bio-enhanced-generator.js 包含增强生成器: ${checkFileContent('character-bio-enhanced-generator.js', 'generateEnhancedCharacterBio') ? '✅' : '❌'}`);
console.log(`  index-v2.html 引入新脚本: ${checkFileContent('index-v2.html', 'character-20-questions.js') ? '✅' : '❌'}`);
console.log('\n');

// 检查爽点桥段数量
function countBridges() {
    const fullPath = path.join(__dirname, 'writing-resources.js');
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const matches = content.match(/id:\s*['"]sq\d+['"]/gi);
        return matches ? matches.length : 0;
    } catch (error) {
        return 0;
    }
}

console.log(`爽点桥段数量: ${countBridges()} (预期: 54)\n`);

// 检查悬念手法数量
function countSuspense() {
    const fullPath = path.join(__dirname, 'writing-resources.js');
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const matches = content.match(/id:\s*['"]xs\d+['"]/gi);
        return matches ? matches.length : 0;
    } catch (error) {
        return 0;
    }
}

console.log(`悬念手法数量: ${countSuspense()} (预期: 63)\n`);

// 检查20问数量
function count20Questions() {
    const fullPath = path.join(__dirname, 'character-20-questions.js');
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        // 查找 CHARACTER_20_QUESTIONS 数组
        const match = content.match(/const CHARACTER_20_QUESTIONS = \[([\s\S]*?)\];/);
        if (match) {
            // 计算数组中的对象数量（每个对象都有一个 id: 'qX'）
            const matches = match[1].match(/id:\s*['"]q\d+['"]/gi);
            return matches ? matches.length : 0;
        }
        return 0;
    } catch (error) {
        return 0;
    }
}

console.log(`20问数量: ${count20Questions()} (预期: 20)\n`);

// 检查编剧维度
function checkScreenwritingDimensions() {
    const fullPath = path.join(__dirname, 'character-bio-enhanced-generator.js');
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const dimensions = [
            '内在动机',
            '灵魂创伤',
            '恐惧',
            '价值观冲突',
            '外部冲突',
            '谎言',
            '真理',
            '人物弧光'
        ];

        let allPresent = true;
        let missing = [];

        for (const dim of dimensions) {
            if (!content.includes(dim)) {
                allPresent = false;
                missing.push(dim);
            }
        }

        return { allPresent, missing };
    } catch (error) {
        return { allPresent: false, missing: ['无法读取文件'] };
    }
}

const dimensionCheck = checkScreenwritingDimensions();
console.log('编剧维度检查:');
console.log(`  所有维度都存在: ${dimensionCheck.allPresent ? '✅' : '❌'}`);
if (!dimensionCheck.allPresent) {
    console.log(`  缺失的维度: ${dimensionCheck.missing.join(', ')}`);
}
console.log('\n');

console.log('========================================');
console.log('测试总结:');
console.log('========================================\n');

let passedTests = 0;
let totalTests = 0;

// 计算通过率
const checks = [
    checkFile('character-20-questions.js') === '✅',
    checkFile('character-bio-enhanced-generator.js') === '✅',
    checkFile('writing-resources.js') === '✅',
    checkFile('index-v2.html') === '✅',
    checkFileContent('writing-resources.js', 'SUANGQIAO_BRIDGES'),
    checkFileContent('writing-resources.js', 'SUSPENSE_TECHNIQUES'),
    checkFileContent('writing-resources.js', 'WRITING_RESOURCES'),
    checkFileContent('character-20-questions.js', 'CHARACTER_20_QUESTIONS'),
    checkFileContent('character-bio-enhanced-generator.js', 'generateEnhancedCharacterBio'),
    checkFileContent('index-v2.html', 'character-20-questions.js'),
    countBridges() >= 50,
    countSuspense() >= 60,
    count20Questions() >= 19,
    dimensionCheck.allPresent
];

totalTests = checks.length;
passedTests = checks.filter(c => c).length;

console.log(`总测试数: ${totalTests}`);
console.log(`通过: ${passedTests}`);
console.log(`失败: ${totalTests - passedTests}`);
console.log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！');
    console.log('\n下一步:');
    console.log('1. 打开 test-auto.html 在浏览器中查看详细测试结果');
    console.log('2. 点击 "🚀 运行所有测试" 按钮');
    console.log('3. 查看生成的人物小传是否符合预期');
    console.log('4. 点击 "🔄 对比不同主星" 和 "🌍 对比不同时代" 验证差异化效果');
} else {
    console.log('⚠️ 部分测试失败，请检查文件内容');
}

console.log('\n========================================\n');
