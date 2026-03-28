/**
 * 命盘存储管理模块
 * 提供保存、加载、编辑、删除命盘的功能
 */

// ==================== 常量定义 ====================

const STORAGE_KEY = 'ziwei_saved_charts';
const MAX_CHARTS = 100; // 最多保存100个命盘

// ==================== 工具函数 ====================

/**
 * 生成唯一ID
 */
function generateId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `chart_${timestamp}_${random}`;
}

/**
 * 获取当前时间ISO字符串
 */
function getCurrentTime() {
    return new Date().toISOString();
}

/**
 * 格式化时间为可读格式
 */
function formatDateTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ==================== 存储操作 ====================

/**
 * 从localStorage获取所有命盘
 */
function getAllCharts() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('获取命盘列表失败:', error);
        return [];
    }
}

/**
 * 保存命盘到localStorage
 * @param {object} chartData - 命盘数据
 * @returns {object} 保存后的命盘数据（包含ID）
 */
function saveChart(chartData) {
    try {
        const charts = getAllCharts();
        
        // 检查是否达到最大数量
        if (charts.length >= MAX_CHARTS) {
            throw new Error(`最多只能保存${MAX_CHARTS}个命盘，请先删除一些命盘`);
        }
        
        // 创建新命盘对象
        const newChart = {
            id: generateId(),
            name: chartData.name || '未命名角色',
            era: chartData.era,
            gender: chartData.gender,
            age: chartData.age,
            timePeriod: chartData.timePeriod,
            keCut: chartData.keCut,
            career: chartData.career,
            personality: chartData.personality,
            family: chartData.family,
            experience: chartData.experience,
            chartData: chartData.chartData,
            characterData: chartData.characterData,
            characterBio: chartData.characterBio,
            createdAt: getCurrentTime(),
            updatedAt: getCurrentTime()
        };
        
        charts.push(newChart);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
        
        return newChart;
    } catch (error) {
        console.error('保存命盘失败:', error);
        throw error;
    }
}

/**
 * 根据ID获取命盘
 * @param {string} chartId - 命盘ID
 * @returns {object|null} 命盘数据
 */
function getChartById(chartId) {
    try {
        const charts = getAllCharts();
        return charts.find(chart => chart.id === chartId) || null;
    } catch (error) {
        console.error('获取命盘失败:', error);
        return null;
    }
}

/**
 * 更新命盘
 * @param {string} chartId - 命盘ID
 * @param {object} updates - 更新的字段
 * @returns {boolean} 是否成功
 */
function updateChart(chartId, updates) {
    try {
        const charts = getAllCharts();
        const index = charts.findIndex(chart => chart.id === chartId);
        
        if (index === -1) {
            throw new Error('命盘不存在');
        }
        
        // 更新命盘数据
        charts[index] = {
            ...charts[index],
            ...updates,
            updatedAt: getCurrentTime()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
        return true;
    } catch (error) {
        console.error('更新命盘失败:', error);
        throw error;
    }
}

/**
 * 删除命盘
 * @param {string} chartId - 命盘ID
 * @returns {boolean} 是否成功
 */
function deleteChart(chartId) {
    try {
        const charts = getAllCharts();
        const filtered = charts.filter(chart => chart.id !== chartId);
        
        if (filtered.length === charts.length) {
            throw new Error('命盘不存在');
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('删除命盘失败:', error);
        throw error;
    }
}

/**
 * 清空所有命盘
 * @returns {boolean} 是否成功
 */
function clearAllCharts() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('清空命盘失败:', error);
        throw error;
    }
}

// ==================== 搜索和筛选 ====================

/**
 * 搜索命盘
 * @param {string} keyword - 搜索关键词
 * @returns {array} 匹配的命盘列表
 */
function searchCharts(keyword) {
    try {
        const charts = getAllCharts();
        if (!keyword || keyword.trim() === '') {
            return charts;
        }
        
        const lowerKeyword = keyword.toLowerCase();
        return charts.filter(chart => {
            return (
                chart.name.toLowerCase().includes(lowerKeyword) ||
                chart.career?.toLowerCase().includes(lowerKeyword) ||
                chart.family?.toLowerCase().includes(lowerKeyword)
            );
        });
    } catch (error) {
        console.error('搜索命盘失败:', error);
        return [];
    }
}

/**
 * 按时代筛选命盘
 * @param {string} era - 时代（ancient/modern/contemporary/all）
 * @returns {array} 筛选后的命盘列表
 */
function filterChartsByEra(era) {
    try {
        const charts = getAllCharts();
        if (era === 'all') {
            return charts;
        }
        return charts.filter(chart => chart.era === era);
    } catch (error) {
        console.error('筛选命盘失败:', error);
        return [];
    }
}

/**
 * 排序命盘
 * @param {array} charts - 命盘列表
 * @param {string} sortBy - 排序字段（createdAt/updatedAt/name）
 * @param {string} order - 排序顺序（asc/desc）
 * @returns {array} 排序后的命盘列表
 */
function sortCharts(charts, sortBy = 'createdAt', order = 'desc') {
    try {
        return [...charts].sort((a, b) => {
            let valueA = a[sortBy];
            let valueB = b[sortBy];
            
            if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
                valueA = new Date(valueA).getTime();
                valueB = new Date(valueB).getTime();
            }
            
            if (order === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    } catch (error) {
        console.error('排序命盘失败:', error);
        return charts;
    }
}

// ==================== 导出功能 ====================

/**
 * 导出命盘为Markdown
 * @param {object} chart - 命盘数据
 * @returns {string} Markdown文本
 */
function exportChartAsMarkdown(chart) {
    const eraNames = {
        ancient: '古代',
        modern: '近代',
        contemporary: '现代'
    };
    
    let markdown = `# ${chart.name}\n\n`;
    markdown += `**保存时间**: ${formatDateTime(chart.updatedAt)}\n\n`;
    
    markdown += `## 基本信息\n\n`;
    markdown += `- **时代**: ${eraNames[chart.era] || chart.era}\n`;
    markdown += `- **性别**: ${chart.gender === 'male' ? '男' : '女'}\n`;
    markdown += `- **年龄**: ${chart.age}\n`;
    markdown += `- **时间**: ${chart.timePeriod}${chart.keCut}\n`;
    markdown += `- **职业**: ${chart.career}\n`;
    markdown += `- **性格**: ${Array.isArray(chart.personality) ? chart.personality.join('、') : chart.personality}\n`;
    markdown += `- **家庭背景**: ${chart.family}\n`;
    markdown += `- **人生经历**: ${chart.experience}\n\n`;
    
    // 如果有人物小传
    if (chart.characterBio) {
        markdown += `## 人物小传\n\n`;
        if (typeof chart.characterBio === 'string') {
            markdown += chart.characterBio;
        } else {
            markdown += JSON.stringify(chart.characterBio, null, 2);
        }
        markdown += `\n\n`;
    }
    
    // 如果有命盘数据
    if (chart.chartData) {
        markdown += `## 命盘数据\n\n`;
        markdown += `\`\`\`json\n`;
        markdown += JSON.stringify(chart.chartData, null, 2);
        markdown += `\n\`\`\`\n\n`;
    }
    
    return markdown;
}

/**
 * 导出命盘为JSON
 * @param {object} chart - 命盘数据
 * @returns {string} JSON文本
 */
function exportChartAsJSON(chart) {
    return JSON.stringify(chart, null, 2);
}

/**
 * 导出所有命盘
 * @param {string} format - 格式（json/zip）
 * @returns {string} 导出内容
 */
function exportAllCharts(format = 'json') {
    try {
        const charts = getAllCharts();
        
        if (format === 'json') {
            return JSON.stringify(charts, null, 2);
        }
        
        throw new Error('不支持的格式');
    } catch (error) {
        console.error('导出所有命盘失败:', error);
        throw error;
    }
}

/**
 * 导入命盘
 * @param {string} jsonData - JSON数据
 * @returns {number} 导入的命盘数量
 */
function importCharts(jsonData) {
    try {
        const importedCharts = JSON.parse(jsonData);
        
        if (!Array.isArray(importedCharts)) {
            throw new Error('数据格式错误');
        }
        
        const charts = getAllCharts();
        let importedCount = 0;
        
        for (const chart of importedCharts) {
            if (charts.length >= MAX_CHARTS) {
                break;
            }
            
            // 为每个命盘生成新ID
            chart.id = generateId();
            chart.createdAt = getCurrentTime();
            chart.updatedAt = getCurrentTime();
            
            charts.push(chart);
            importedCount++;
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
        return importedCount;
    } catch (error) {
        console.error('导入命盘失败:', error);
        throw error;
    }
}

// ==================== 统计信息 ====================

/**
 * 获取统计信息
 * @returns {object} 统计数据
 */
function getChartsStatistics() {
    try {
        const charts = getAllCharts();
        
        const eraCount = {
            ancient: 0,
            modern: 0,
            contemporary: 0
        };
        
        charts.forEach(chart => {
            if (eraCount[chart.era] !== undefined) {
                eraCount[chart.era]++;
            }
        });
        
        return {
            total: charts.length,
            eraCount: eraCount,
            remainingSpace: MAX_CHARTS - charts.length
        };
    } catch (error) {
        console.error('获取统计信息失败:', error);
        return {
            total: 0,
            eraCount: { ancient: 0, modern: 0, contemporary: 0 },
            remainingSpace: MAX_CHARTS
        };
    }
}

// ==================== 导出到全局 ====================

// 导出函数供外部使用
if (typeof window !== 'undefined') {
    window.ChartStorage = {
        getAllCharts,
        saveChart,
        getChartById,
        updateChart,
        deleteChart,
        clearAllCharts,
        searchCharts,
        filterChartsByEra,
        sortCharts,
        exportChartAsMarkdown,
        exportChartAsJSON,
        exportAllCharts,
        importCharts,
        getChartsStatistics,
        formatDateTime
    };
}
