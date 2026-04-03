/**
 * 紫微斗数v2增强模块
 * 集成人物小传生成器和命盘保存功能
 */

// ==================== 加载人物小传生成器 ====================

// 这个文件需要在 app-v2.js 之后加载
// 前提条件：character-bio-generator.js 和 chart-storage.js 必须先加载

// ==================== 人物小传生成（替换原命盘解读）====================

/**
 * 生成完整的人物小传（编剧级别）
 * @param {object} chartData - 命盘数据
 * @param {object} characterData - 人物基本信息
 * @returns {string} Markdown格式的人物小传
 */
function generateCharacterBio(chartData, characterData) {
    // 检查是否有人物小传生成器
    if (typeof window.CharacterBioGenerator === 'undefined') {
        console.warn('人物小传生成器未加载，使用简化版本');
        return generateSimplifiedBio(chartData, characterData);
    }

    try {
        // 构建人物配置
        const profile = {
            name: characterData.name || '角色名称',
            gender: characterData.gender,
            age: characterData.age,
            career: characterData.career,
            familyBackground: characterData.familyBackground,
            lifeExperience: characterData.lifeExperience
        };

        // 调用人物小传生成器
        const bio = window.CharacterBioGenerator.generateBio(chartData, profile);

        // 统计字数
        const wordCount = bio.replace(/\s/g, '').length;
        const bioWithWordCount = `${bio}\n\n---\n\n**字数统计：${wordCount}字**`;

        return bioWithWordCount;
    } catch (error) {
        console.error('生成人物小传失败:', error);
        return generateSimplifiedBio(chartData, characterData);
    }
}

/**
 * 生成简化版人物小传（备用方案）
 */
function generateSimplifiedBio(chartData, characterData) {
    const eraNames = {
        ancient: '古代',
        modern: '近代',
        contemporary: '现代'
    };

    const he = characterData.gender === 'male' ? '他' : '她';

    let bio = `# ${characterData.name || '角色名称'}小传\n\n`;
    bio += `## 一、基础设定\n\n`;
    bio += `**标签：** ${characterData.age}，${characterData.gender === 'male' ? '男性' : '女性'}，`;
    bio += `${eraNames[characterData.era]}出身的${characterData.career}\n\n`;
    bio += `**时代背景：** ${eraNames[characterData.era]}\n\n`;
    bio += `**时间：** ${characterData.timePeriod}${characterData.keCut}\n\n`;
    bio += `**职业：** ${characterData.career}\n\n`;
    bio += `**家庭背景：** ${characterData.familyBackground}\n\n`;
    bio += `**人生经历：** ${characterData.lifeExperience}\n\n`;

    bio += `## 二、性格特点\n\n`;
    bio += `${he}是一个${characterData.traits?.personality || '性格鲜明'}的人。\n`;
    bio += `在${eraNames[characterData.era]}这个时代背景下，${he}展现出了独特的${characterData.traits?.eraCharacteristic || '时代特征'}。\n\n`;

    bio += `## 三、人生时间线\n\n`;
    if (characterData.timeline && Array.isArray(characterData.timeline)) {
        characterData.timeline.forEach(event => {
            bio += `**${event.age}岁：** ${event.desc}\n\n`;
        });
    }

    bio += `## 四、命盘信息\n\n`;
    bio += `此命盘为${eraNames[characterData.era]}时代的人物，`;
    bio += `出生时间为${characterData.timePeriod}${characterData.keCut}。\n\n`;
    bio += `命盘格局：${chartData?.pattern || '未知'}\n\n`;

    // 统计字数
    const wordCount = bio.replace(/\s/g, '').length;
    bio += `---\n\n**字数统计：${wordCount}字**`;

    return bio;
}

// ==================== 命盘保存功能 ====================

/**
 * 保存当前命盘
 */
function saveCurrentChart() {
    if (!appState.chartData || !appState.characterData) {
        alert('请先生成命盘');
        return;
    }

    if (typeof window.ChartStorage === 'undefined') {
        alert('命盘存储模块未加载');
        return;
    }

    try {
        // 获取角色名
        const characterName = prompt('请输入角色名（留空则使用默认名称）：', '未命名角色');
        if (characterName === null) return; // 用户取消

        // 构建保存数据
        const chartToSave = {
            name: characterName.trim() || '未命名角色',
            era: appState.selectedEra,
            gender: appState.userInfo.gender,
            age: appState.userInfo.age,
            timePeriod: appState.userInfo.timePeriod,
            keCut: appState.userInfo.keCut,
            career: appState.selectedOptions.career,
            personality: appState.selectedOptions.personality,
            family: appState.selectedOptions.family,
            experience: appState.selectedOptions.experience,
            chartData: appState.chartData,
            characterData: appState.characterData,
            characterBio: appState.enhancedBio
        };

        // 保存命盘
        const savedChart = window.ChartStorage.saveChart(chartToSave);

        alert('命盘已保存！角色名：' + savedChart.name);

        // 更新保存状态
        appState.savedChartId = savedChart.id;

        // 更新UI
        updateSaveButtonState(true);
    } catch (error) {
        console.error('保存命盘失败:', error);
        alert('保存失败: ' + error.message);
    }
}

/**
 * 更新保存按钮状态
 */
function updateSaveButtonState(isSaved) {
    const saveBtn = document.getElementById('saveChartBtn');
    if (!saveBtn) return;

    if (isSaved) {
        saveBtn.innerHTML = '✅ 已保存';
        saveBtn.classList.remove('btn-primary');
        saveBtn.classList.add('btn-success');
        saveBtn.onclick = function() {
            alert('命盘已保存');
        };
    } else {
        saveBtn.innerHTML = '💾 保存命盘';
        saveBtn.classList.remove('btn-success');
        saveBtn.classList.add('btn-primary');
        saveBtn.onclick = saveCurrentChart;
    }
}

/**
 * 修改角色名
 */
function renameChart() {
    if (!appState.savedChartId) {
        alert('请先保存命盘');
        return;
    }

    try {
        const chart = window.ChartStorage.getChartById(appState.savedChartId);
        if (!chart) {
            alert('命盘不存在');
            return;
        }

        const newName = prompt('请输入新的角色名：', chart.name);
        if (newName === null || newName.trim() === '') return;

        window.ChartStorage.updateChart(appState.savedChartId, { name: newName.trim() });

        alert('角色名已更新');

        // 更新显示
        const nameDisplay = document.getElementById('chartNameDisplay');
        if (nameDisplay) {
            nameDisplay.textContent = newName.trim();
        }
    } catch (error) {
        console.error('更新角色名失败:', error);
        alert('更新失败: ' + error.message);
    }
}

// ==================== 导出功能增强 ====================

/**
 * 导出人物小传为Markdown
 */
function exportCharacterBio() {
    if (!appState.enhancedBio) {
        alert('请先生成命盘');
        return;
    }

    try {
        const bio = typeof appState.enhancedBio === 'string'
            ? appState.enhancedBio
            : generateSimplifiedBio(appState.chartData, appState.characterData);

        const blob = new Blob([bio], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // 使用角色名或默认名
        const fileName = appState.characterData?.name || '紫微斗数人物小传';
        a.download = `${fileName}.md`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败: ' + error.message);
    }
}

/**
 * 导出完整命盘数据为JSON
 */
function exportFullChart() {
    if (!appState.chartData || !appState.characterData) {
        alert('请先生成命盘');
        return;
    }

    try {
        const exportData = {
            characterName: appState.characterData.name || '未命名角色',
            era: appState.selectedEra,
            userInfo: appState.userInfo,
            selectedOptions: appState.selectedOptions,
            chartData: appState.chartData,
            characterData: appState.characterData,
            characterBio: appState.enhancedBio,
            exportTime: new Date().toISOString()
        };

        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const fileName = appState.characterData?.name || '紫微斗数命盘';
        a.download = `${fileName}_full.json`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败: ' + error.message);
    }
}

// ==================== UI更新 ====================

/**
 * 更新结果区域，添加保存和导出按钮
 */
function enhanceResultUI() {
    const resultSection = document.querySelector('.step-6 .step-content');
    if (!resultSection) return;

    // 检查是否已经添加过
    if (document.getElementById('enhancedActions')) return;

    // 创建增强操作栏
    const actionsDiv = document.createElement('div');
    actionsDiv.id = 'enhancedActions';
    actionsDiv.className = 'enhanced-actions';
    actionsDiv.style.marginTop = '30px';
    actionsDiv.style.padding = '20px';
    actionsDiv.style.background = '#F5F5F5';
    actionsDiv.style.borderRadius = '8px';

    actionsDiv.innerHTML = `
        <h3 style="margin-bottom: 16px; color: #1A1A1A;">操作</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button id="saveChartBtn" class="btn btn-primary" onclick="saveCurrentChart()">
                💾 保存命盘
            </button>
            <button id="renameBtn" class="btn btn-outline" onclick="renameChart()" style="display: none;">
                ✏️ 修改角色名
            </button>
            <button class="btn btn-outline" onclick="exportCharacterBio()">
                📄 导出小传
            </button>
            <button class="btn btn-outline" onclick="exportFullChart()">
                📦 导出完整数据
            </button>
            <button class="btn btn-outline" onclick="window.location.href='saved-charts.html'">
                📋 查看已保存
            </button>
        </div>
    `;

    resultSection.appendChild(actionsDiv);
}

// ==================== 初始化 ====================

/**
 * 初始化增强功能
 */
function initializeEnhancedFeatures() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEnhancedFeatures);
        return;
    }

    // 检查依赖模块
    if (typeof window.ChartStorage === 'undefined') {
        console.warn('ChartStorage 未加载，保存功能将不可用');
    }

    if (typeof window.CharacterBioGenerator === 'undefined') {
        console.warn('CharacterBioGenerator 未加载，将使用简化版人物小传');
    }

    console.log('紫微斗数v2增强功能已初始化');
}

// 自动初始化
initializeEnhancedFeatures();

// ==================== 导出到全局 ====================

// 导出增强功能供外部使用
if (typeof window !== 'undefined') {
    window.ZiweiV2Enhanced = {
        generateCharacterBio,
        saveCurrentChart,
        renameChart,
        exportCharacterBio,
        exportFullChart,
        enhanceResultUI
    };
}
