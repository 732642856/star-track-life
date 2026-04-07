/**
 * 星轨人生 - macOS 桌面端增强模块
 * 
 * 功能：
 * 1. 检测桌面环境并初始化桌面端UI
 * 2. 小传内容分层次展示
 * 3. 侧边栏导航
 * 4. 章节可折叠
 */

(function() {
    'use strict';
    
    // ══════════════════════════════════════════════════════════════════════════
    // 配置
    // ══════════════════════════════════════════════════════════════════════════
    var DESKTOP_BREAKPOINT = 1025;
    var isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
    
    // 小传章节定义（用于分层次展示）
    var BIO_SECTIONS = [
        { id: 'basic', title: '基础设定', icon: '◉', keywords: ['基础设定', '一、基础设定', '标志性细节'] },
        { id: 'want-need', title: '欲望与需求', icon: '◈', keywords: ['欲望与需求', 'Want', '想要', '需要'] },
        { id: 'wound', title: '灵魂伤痕', icon: '◇', keywords: ['灵魂伤痕', '前史', '创伤', '幽灵'] },
        { id: 'paradox', title: '性格矛盾', icon: '◆', keywords: ['矛盾点', '性格', 'Paradox', '内在冲突'] },
        { id: 'function', title: '剧作功能', icon: '○', keywords: ['剧作功能', '社会关系', '戏剧功能'] },
        { id: 'behavior', title: '行为模式', icon: '●', keywords: ['行为模式', '台词风格', '说话方式'] },
        { id: 'arc', title: '人物弧光', icon: '◐', keywords: ['人物弧光', '成长弧', '变化轨迹'] },
        { id: 'supplement', title: '补充内容', icon: '◑', keywords: ['补充：', '补充：', '---'] }
    ];
    
    // ══════════════════════════════════════════════════════════════════════════
    // 桌面端初始化
    // ══════════════════════════════════════════════════════════════════════════
    
    function initDesktop() {
        if (!isDesktop) return;
        
        // 添加桌面端类名
        document.body.classList.add('desktop-mode');
        
        // 创建桌面端布局
        createDesktopLayout();
        
        // 初始化侧边栏
        initSidebar();
        
        console.log('[desktop] macOS 桌面端模式已启用');
    }
    
    /**
     * 创建桌面端布局结构
     */
    function createDesktopLayout() {
        var pageWrapper = document.querySelector('.page-wrapper');
        if (!pageWrapper) return;
        
        // 创建侧边栏
        var sidebar = document.createElement('aside');
        sidebar.className = 'desktop-sidebar';
        sidebar.innerHTML = '\
            <div class="sidebar-logo">\
                <span class="logo-text">星轨人生</span>\
            </div>\
            <nav class="sidebar-nav">\
                <div class="sidebar-nav-section">\
                    <div class="sidebar-nav-title">创作流程</div>\
                    <div class="sidebar-nav-item" data-step="1">\
                        <span class="nav-icon">①</span>\
                        <span class="nav-label">时代背景</span>\
                    </div>\
                    <div class="sidebar-nav-item" data-step="2">\
                        <span class="nav-icon">②</span>\
                        <span class="nav-label">基础信息</span>\
                    </div>\
                    <div class="sidebar-nav-item" data-step="3">\
                        <span class="nav-icon">③</span>\
                        <span class="nav-label">星盘匹配</span>\
                    </div>\
                    <div class="sidebar-nav-item" data-step="4">\
                        <span class="nav-icon">④</span>\
                        <span class="nav-label">属性细化</span>\
                    </div>\
                    <div class="sidebar-nav-item" data-step="5">\
                        <span class="nav-icon">⑤</span>\
                        <span class="nav-label">人物小传</span>\
                    </div>\
                </div>\
                <div class="sidebar-nav-section">\
                    <div class="sidebar-nav-title">角色管理</div>\
                    <div class="sidebar-nav-item" id="nav-saved-chars">\
                        <span class="nav-icon">📚</span>\
                        <span class="nav-label">已保存角色</span>\
                    </div>\
                    <div class="sidebar-nav-item" id="nav-compare">\
                        <span class="nav-icon">⚖️</span>\
                        <span class="nav-label">角色对比</span>\
                    </div>\
                </div>\
            </nav>\
            <div class="sidebar-footer">\
                <div class="lang-switcher-vertical">\
                    <button class="lang-btn active" data-lang="zh" onclick="switchLang(\'zh\')">简体</button>\
                    <button class="lang-btn" data-lang="zh-TW" onclick="switchLang(\'zh-TW\')">繁體</button>\
                    <button class="lang-btn" data-lang="en" onclick="switchLang(\'en\')">EN</button>\
                </div>\
            </div>\
        ';
        
        // 创建主内容容器
        var mainContent = document.createElement('div');
        mainContent.className = 'desktop-main';
        
        // 创建工具栏
        var toolbar = document.createElement('div');
        toolbar.className = 'desktop-toolbar';
        toolbar.innerHTML = '\
            <div class="toolbar-left">\
                <div class="toolbar-breadcrumb">\
                    <span id="breadcrumb-current">时代背景</span>\
                </div>\
            </div>\
            <div class="toolbar-right">\
                <button class="btn btn-small btn-outline" onclick="resetForm()">重新开始</button>\
            </div>\
        ';
        
        // 创建内容区
        var contentArea = document.createElement('div');
        contentArea.className = 'desktop-content';
        
        // 重组DOM结构
        var heroSection = pageWrapper.querySelector('.hero-section');
        var stepIndicator = pageWrapper.querySelector('.step-indicator');
        var mainContentOld = pageWrapper.querySelector('.main-content');
        var savedSection = document.getElementById('saved-characters-section');
        var compareBtnSection = document.getElementById('compare-btn-section');
        var footer = pageWrapper.querySelector('.main-footer');
        
        // 移动元素到新结构
        pageWrapper.insertBefore(sidebar, pageWrapper.firstChild);
        pageWrapper.appendChild(mainContent);
        
        mainContent.appendChild(toolbar);
        contentArea.appendChild(heroSection);
        contentArea.appendChild(stepIndicator);
        contentArea.appendChild(mainContentOld);
        
        if (savedSection) contentArea.appendChild(savedSection);
        if (compareBtnSection) contentArea.appendChild(compareBtnSection);
        if (footer) contentArea.appendChild(footer);
        
        mainContent.appendChild(contentArea);
        
        // 绑定侧边栏导航事件
        bindSidebarEvents();
    }
    
    /**
     * 绑定侧边栏导航事件
     */
    function bindSidebarEvents() {
        var navItems = document.querySelectorAll('.sidebar-nav-item[data-step]');
        navItems.forEach(function(item) {
            item.addEventListener('click', function() {
                var step = parseInt(item.dataset.step);
                if (typeof window.showStep === 'function') {
                    window.showStep(step);
                }
                updateSidebarActive(step);
            });
        });
        
        // 笔记本
        var notebookNav = document.getElementById('nav-notebook');
        if (notebookNav) {
            notebookNav.addEventListener('click', function() {
                if (typeof window.openNotebookPanel === 'function') {
                    window.openNotebookPanel();
                }
            });
        }
        
        // 已保存角色
        var savedCharsNav = document.getElementById('nav-saved-chars');
        if (savedCharsNav) {
            savedCharsNav.addEventListener('click', function() {
                var savedSection = document.getElementById('saved-characters-section');
                if (savedSection && savedSection.style.display !== 'none') {
                    savedSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        // 角色对比
        var compareNav = document.getElementById('nav-compare');
        if (compareNav) {
            compareNav.addEventListener('click', function() {
                if (typeof window.showCompare === 'function') {
                    window.showCompare();
                }
            });
        }
    }
    
    /**
     * 更新侧边栏激活状态
     */
    function updateSidebarActive(step) {
        var navItems = document.querySelectorAll('.sidebar-nav-item[data-step]');
        navItems.forEach(function(item) {
            var itemStep = parseInt(item.dataset.step);
            item.classList.toggle('active', itemStep === step);
        });
        
        // 更新面包屑
        var breadcrumb = document.getElementById('breadcrumb-current');
        if (breadcrumb) {
            var labels = ['时代背景', '基础信息', '星盘匹配', '属性细化', '人物小传'];
            breadcrumb.textContent = labels[step - 1] || '';
        }
    }
    
    /**
     * 初始化侧边栏
     */
    function initSidebar() {
        // 监听步骤变化
        var originalShowStep = window.showStep;
        window.showStep = function(step) {
            if (typeof originalShowStep === 'function') {
                originalShowStep(step);
            }
            updateSidebarActive(step);
        };
        
        // 初始激活状态
        updateSidebarActive(1);
    }
    
    // ══════════════════════════════════════════════════════════════════════════
    // 小传分层展示
    // ══════════════════════════════════════════════════════════════════════════
    
    /**
     * 解析小传内容并生成章节结构
     * @param {string} bio - 原始小传 Markdown 文本
     * @returns {Array} - 章节数组
     */
    function parseBioSections(bio) {
        if (!bio) return [];
        
        var sections = [];
        var lines = bio.split('\n');
        var currentSection = null;
        var currentContent = [];
        
        lines.forEach(function(line) {
            // 检测章节标题（## 开头）
            if (line.startsWith('## ')) {
                // 保存上一个章节
                if (currentSection) {
                    sections.push({
                        id: currentSection.id,
                        title: currentSection.title,
                        icon: currentSection.icon,
                        content: currentContent.join('\n').trim()
                    });
                }
                
                // 开始新章节
                var title = line.replace('## ', '').trim();
                var sectionDef = matchSection(title);
                currentSection = {
                    id: sectionDef.id,
                    title: sectionDef.title,
                    icon: sectionDef.icon,
                    rawTitle: title
                };
                currentContent = [];
            } else {
                currentContent.push(line);
            }
        });
        
        // 保存最后一个章节
        if (currentSection) {
            sections.push({
                id: currentSection.id,
                title: currentSection.title,
                icon: currentSection.icon,
                content: currentContent.join('\n').trim()
            });
        }
        
        return sections;
    }
    
    /**
     * 匹配章节定义
     */
    function matchSection(title) {
        for (var i = 0; i < BIO_SECTIONS.length; i++) {
            var section = BIO_SECTIONS[i];
            for (var j = 0; j < section.keywords.length; j++) {
                if (title.includes(section.keywords[j])) {
                    return section;
                }
            }
        }
        // 默认返回补充内容
        return BIO_SECTIONS[BIO_SECTIONS.length - 1];
    }
    
    /**
     * 渲染分层小传（桌面端）
     * @param {string} bio - 原始小传文本
     * @param {HTMLElement} container - 容器元素
     */
    function renderLayeredBio(bio, container) {
        if (!isDesktop) {
            // 非桌面端，使用原始渲染
            if (typeof window.renderMarkdown === 'function') {
                container.innerHTML = window.renderMarkdown(bio);
            }
            return;
        }
        
        var sections = parseBioSections(bio);
        
        // 创建双栏布局
        var wrapper = document.createElement('div');
        wrapper.className = 'bio-desktop-container';
        
        // 左侧导航
        var navPanel = document.createElement('div');
        navPanel.className = 'bio-nav-panel';
        navPanel.innerHTML = '\
            <div class="bio-nav-title">章节导航</div>\
            <div class="bio-nav-list"></div>\
        ';
        
        var navList = navPanel.querySelector('.bio-nav-list');
        sections.forEach(function(section, index) {
            var navItem = document.createElement('div');
            navItem.className = 'bio-nav-item' + (index === 0 ? ' active' : '');
            navItem.textContent = section.title;
            navItem.dataset.index = index;
            navItem.addEventListener('click', function() {
                // 滚动到对应章节
                var target = wrapper.querySelector('[data-section-index="' + index + '"]');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                // 更新导航激活状态
                navList.querySelectorAll('.bio-nav-item').forEach(function(item) {
                    item.classList.remove('active');
                });
                navItem.classList.add('active');
            });
            navList.appendChild(navItem);
        });
        
        // 右侧内容
        var contentPanel = document.createElement('div');
        contentPanel.className = 'bio-content-panel';
        
        // 首先添加标题行（如果有）
        var firstLine = bio.split('\n')[0];
        if (firstLine.startsWith('# ')) {
            var titleDiv = document.createElement('div');
            titleDiv.className = 'bio-main-title';
            titleDiv.innerHTML = typeof window.renderMarkdown === 'function' 
                ? window.renderMarkdown(firstLine) 
                : '<h1>' + firstLine.replace('# ', '') + '</h1>';
            contentPanel.appendChild(titleDiv);
        }
        
        // 添加各个章节
        sections.forEach(function(section, index) {
            var sectionDiv = document.createElement('div');
            sectionDiv.className = 'bio-section';
            sectionDiv.dataset.sectionIndex = index;
            
            // 章节头部
            var header = document.createElement('div');
            header.className = 'bio-section-header';
            header.innerHTML = '\
                <div class="bio-section-title">\
                    <span class="section-icon">' + section.icon + '</span>\
                    <span>' + section.title + '</span>\
                </div>\
                <span class="bio-section-toggle">▼</span>\
            ';
            
            // 章节内容
            var content = document.createElement('div');
            content.className = 'bio-section-content';
            content.innerHTML = typeof window.renderMarkdown === 'function' 
                ? window.renderMarkdown(section.content) 
                : '<p>' + section.content + '</p>';
            
            // 折叠功能
            header.addEventListener('click', function() {
                sectionDiv.classList.toggle('collapsed');
            });
            
            sectionDiv.appendChild(header);
            sectionDiv.appendChild(content);
            contentPanel.appendChild(sectionDiv);
        });
        
        wrapper.appendChild(navPanel);
        wrapper.appendChild(contentPanel);
        
        container.innerHTML = '';
        container.appendChild(wrapper);
    }
    
    // ══════════════════════════════════════════════════════════════════════════
    // 导出全局函数
    // ══════════════════════════════════════════════════════════════════════════
    
    window.DesktopEnhancer = {
        init: initDesktop,
        isDesktop: function() { return isDesktop; },
        parseBioSections: parseBioSections,
        renderLayeredBio: renderLayeredBio,
        updateSidebarActive: updateSidebarActive
    };
    
    // ══════════════════════════════════════════════════════════════════════════
    // 自动初始化
    // ══════════════════════════════════════════════════════════════════════════
    
    // 在 DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initDesktop, 100);
        });
    } else {
        setTimeout(initDesktop, 100);
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        var newIsDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
        if (newIsDesktop !== isDesktop) {
            isDesktop = newIsDesktop;
            if (isDesktop) {
                initDesktop();
            } else {
                document.body.classList.remove('desktop-mode');
                // 移除桌面端布局元素
                var sidebar = document.querySelector('.desktop-sidebar');
                if (sidebar) sidebar.remove();
            }
        }
    });
    
    // 拦截小传生成，使用分层渲染
    var originalGenerateFinalBio = window.generateFinalBio;
    window.generateFinalBio = function() {
        if (typeof originalGenerateFinalBio === 'function') {
            originalGenerateFinalBio();
        }
        
        // 在小传生成后，重新渲染为分层结构
        setTimeout(function() {
            var resultContent = document.getElementById('result-content');
            if (resultContent && window.currentCharacterBio && isDesktop) {
                renderLayeredBio(window.currentCharacterBio, resultContent);
            }
        }, 500);
    };
    
})();
