/**
 * 星轨人生 · Star Track Life
 * UI 三语言文案层 · UI i18n Text Layer
 *
 * 使用方式：
 *   UI_TEXT[CURRENT_LANG].xxx  或  tUI('key.subkey')
 *
 * 语言键：'zh' | 'zh-TW' | 'en'
 */

const UI_TEXT = {

    // ── 简体中文 ──────────────────────────────────────────────────
    zh: {
        // 导航 / 顶部
        appName: '星轨人生',
        appSlogan: '艺术创作者的人物塑造工具',

        // 语言切换
        langSwitch: { zh: '简体', 'zh-TW': '繁體', en: 'EN' },

        // 主英雄区
        heroTitle: '星轨人生',
        heroSubtitle: '艺术创作者的人物塑造工具',
        heroDesc: '基于紫微斗数学术体系 · 576盘精细排盘系统',

        // 表单区
        formTitle: '创建角色',
        labelGender: '性别',
        labelBirthYear: '出生年',
        labelBirthMonth: '出生月',
        labelBirthDay: '出生日',
        labelBirthHour: '出生时辰',
        labelEra: '时代背景',
        labelOccupation: '职业方向',
        labelName: '角色名称（选填）',
        placeholderName: '为这个角色起个名字…',
        genderMale: '男',
        genderFemale: '女',
        btnGenerate: '生成命盘传记',
        btnReset: '重新开始',
        btnSave: '保存角色',
        btnExport: '导出',
        btnCopy: '复制文本',

        // 结果区
        resultTitle: '命盘传记',
        sectionChart: '命盘格局',
        sectionBio: '角色小传',
        sectionPalaces: '十二宫解读',
        sectionStars: '主星分析',
        sectionSihua: '四化落宫',
        sectionDaxian: '大限推演',

        // 宫位标签（备用，主数据来自 PALACES_I18N）
        palaceLabel: '宫',

        // 时辰选项
        shichen: ['子时 (23-01)', '丑时 (01-03)', '寅时 (03-05)', '卯时 (05-07)',
                  '辰时 (07-09)', '巳时 (09-11)', '午时 (11-13)', '未时 (13-15)',
                  '申时 (15-17)', '酉时 (17-19)', '戌时 (19-21)', '亥时 (21-23)'],

        // 已保存角色
        savedTitle: '已保存的角色',
        savedEmpty: '暂无保存的角色',
        btnCompare: '对比选中的角色',
        compareTitle: '角色对比',
        btnCloseCompare: '关闭',

        // 加载 / 错误
        loading: '正在排盘，请稍候…',
        errorRequired: '请填写完整出生信息',
        errorGenerate: '生成失败，请重试',

        // 页脚
        footerText: '星轨人生 · 艺术创作者的人物塑造工具 · 基于紫微斗数学术体系',
        footerCopyright: '© 2026 星轨人生',

        // 步骤指示器
        stepLabel: ['时代背景', '基础信息', '星盘匹配', '8属性细化', '人物小传'],

        // 步骤1：时代背景
        step1Title: '选择时代背景',
        step1Subtitle: '你的角色生活在哪个时代？这将决定社会背景和人物命运',
        eraAncientTitle: '古代', eraAncientDesc: '明清以前',
        eraAncientTags: ['科举制度', '宗法社会', '等级森严'],
        eraModernTitle: '近代', eraModernDesc: '1840-1949',
        eraModernTags: ['变革动荡', '西学东渐', '救亡图存'],
        eraContemporaryTitle: '现代', eraContemporaryDesc: '1949年至今',
        eraContemporaryTags: ['科技时代', '价值多元', '全球视野'],

        // 步骤2：基础信息
        step2Title: '基础信息',
        step2Subtitle: '根据紫微斗数十二宫位逻辑收集角色基础信息',
        labelCharName: '角色名字【命宫·本命】',
        placeholderCharName: '请输入角色名字（如：李明远）',
        labelGenderFull: '性别【命宫·阴阳】',
        genderMaleDesc: '阳刚、主动、进取',
        genderFemaleDesc: '阴柔、内敛、温和',
        labelAge: '年龄【命宫·大运阶段】',
        ageYouthTitle: '青年', ageYouthDesc: '18-30岁，起步探索期',
        ageMiddleTitle: '中年', ageMiddleDesc: '30-50岁，成熟巅峰期',
        ageSeniorTitle: '老年', ageSeniorDesc: '50岁以上，智慧沉淀期',
        labelProfession: '职业【官禄宫】',
        profPoliticalTitle: '政界', profPoliticalDesc: '官员、政治家、公务员',
        profBusinessTitle: '商界', profBusinessDesc: '企业家、商人、创业者',
        profCulturalTitle: '文教', profCulturalDesc: '学者、教师、艺术家',
        profMilitaryTitle: '军警', profMilitaryDesc: '军人、警察、保安',
        profTechnicalTitle: '技术', profTechnicalDesc: '工程师、医生、律师',
        profOtherTitle: '其他', profOtherDesc: '自由职业、学生、退休',
        labelFamily: '家庭背景【田宅宫】',
        familyWealthyTitle: '富贵', familyWealthyDesc: '世家大族，权势显赫',
        familyMiddleTitle: '小康', familyMiddleDesc: '中产之家，生活无忧',
        familyPoorTitle: '贫寒', familyPoorDesc: '家境清贫，自力更生',
        familyDeclineTitle: '家道中落', familyDeclineDesc: '昔日富贵，如今落魄',
        labelSocial: '社会阶层【命宫·地位】',
        socialUpperTitle: '上层', socialUpperDesc: '权贵、名流、富豪',
        socialMiddleTitle: '中层', socialMiddleDesc: '知识分子、白领、小企业主',
        socialLowerTitle: '下层', socialLowerDesc: '工人、农民、底层',
        labelParents: '父母关系【父母宫】',
        parentsHarmoniousTitle: '和睦', parentsHarmoniousDesc: '关系融洽，家庭温暖',
        parentsStrainedTitle: '紧张', parentsStrainedDesc: '经常争吵，关系紧张',
        parentsBrokenTitle: '破裂', parentsBrokenDesc: '离异、失联、家庭破碎',
        parentsLossTitle: '丧亲', parentsLossDesc: '父母双亡或单亲',
        labelSiblings: '兄弟朋友关系【兄弟宫】',
        siblingsCloseTitle: '亲密', siblingsCloseDesc: '手足情深，朋友众多',
        siblingsConflictTitle: '冲突', siblingsConflictDesc: '兄弟阋墙，朋友背叛',
        siblingsSupportTitle: '扶持', siblingsSupportDesc: '互相帮助，共同进步',
        siblingsAloneTitle: '孤独', siblingsAloneDesc: '独来独往，缺少朋友',

        // 步骤3：星盘匹配
        step3Title: '星盘匹配',
        step3Subtitle: '根据基础信息匹配到适合的主星盘，并选择细分类型',
        labelMainStar: '主星',
        labelMingPalace: '命宫',
        labelEraShort: '时代',
        labelMatchScore: '匹配度',
        labelSubPatternSelect: '选择细分星盘（基于四化心理动机）',
        btnConfirmSubPattern: '确认进入8属性细化',

        // 步骤4：8属性细化
        step4Title: '8属性细化',
        step4Subtitle: '完善角色的8个核心维度',
        btnGenerateBio: '生成人物小传',

        // 步骤5：人物小传
        step5Title: '人物小传',
        step5Subtitle: '生成完整的人物小传',
        btnSaveChar: '保存角色',
        btnCompareChar: '对比角色',
        btnCopyBio: '复制小传',
        btnRestart: '重新开始',

        // 公共按钮
        btnNext: '下一步',
        btnBack: '返回',
        btnConfirmBasicInfo: '确认并匹配星盘',
        heroSubtitleMeta: '紫微斗数 × 编剧理论 × 星盘精细排盘',
        heroMetaStars: '14颗主星',
        heroMetaBio: '12维小传',
        heroMetaPrecision: '精准塑造',

        // Toast / 验证提示
        toastSelectEra: '请选择一个时代背景',
        toastSelectGender: '请选择性别',
        toastSelectAge: '请选择年龄段',
        toastSelectProfession: '请选择职业',
        toastSelectFamily: '请选择家庭背景',
        toastSelectSocial: '请选择社会地位',
        toastSelectParents: '请选择父母关系',
        toastSelectSiblings: '请选择手足关系',
        toastFinishChartMatch: '请先完成星盘匹配',
        toastSelectSihua: '请选择四化类型',
        toastAttrsPartial: (n) => '💡 ' + n + ' 项未选择，对应内容将以模糊风格呈现',
        toastGenerateError: (msg) => '生成出错，请重试（' + msg + '）',
        toastSavedFull: '最多只能保存10个角色，请先删除一些',
        toastSavedSuccess: (name, n) => '「' + name + '」已保存 (' + n + '/10)',
        toastNoBio: '请先生成人物小传',
        toastCopied: '已复制到剪贴板',
        toastCopyFail: '复制失败，请手动长按选择',
        toastDeleted: (name) => '「' + name + '」已删除',
        toastDeleteConfirm: (name) => '再次点击「删除」确认删除「' + name + '」',
        toastMinCompare: '请至少选择2个角色进行对比',
        toastMaxCompare: '最多对比3个角色',
        toastFillName: '请填写角色名字',

        // 四化类型名称（英文/繁体用）
        sihuaTypeName: { '化禄型': '化禄型', '化权型': '化权型', '化科型': '化科型', '化忌型': '化忌型' },
        btnView: '查看',
        btnDelete: '删除',

        // 对比面板
        cmpToggleLabel: '相性评分 & 戏剧分析',
        cmpToggleHint: '点击展开',
        cmpSectionRelation: '四化类型',
        cmpSectionDrama: '戏剧关系',
        cmpSectionContext: '背景处境',
        cmpCharLabel: '角色',
    },

    // ── 繁體中文 ──────────────────────────────────────────────────
    'zh-TW': {
        appName: '星軌人生',
        appSlogan: '藝術創作者的人物塑造工具',

        langSwitch: { zh: '简体', 'zh-TW': '繁體', en: 'EN' },

        heroTitle: '星軌人生',
        heroSubtitle: '藝術創作者的人物塑造工具',
        heroDesc: '基於紫微斗數學術體系 · 576盤精細排盤系統',

        formTitle: '創建角色',
        labelGender: '性別',
        labelBirthYear: '出生年',
        labelBirthMonth: '出生月',
        labelBirthDay: '出生日',
        labelBirthHour: '出生時辰',
        labelEra: '時代背景',
        labelOccupation: '職業方向',
        labelName: '角色名稱（選填）',
        placeholderName: '為這個角色起個名字…',
        genderMale: '男',
        genderFemale: '女',
        btnGenerate: '生成命盤傳記',
        btnReset: '重新開始',
        btnSave: '儲存角色',
        btnExport: '匯出',
        btnCopy: '複製文字',

        resultTitle: '命盤傳記',
        sectionChart: '命盤格局',
        sectionBio: '角色小傳',
        sectionPalaces: '十二宮解讀',
        sectionStars: '主星分析',
        sectionSihua: '四化落宮',
        sectionDaxian: '大限推演',

        palaceLabel: '宮',

        shichen: ['子時 (23-01)', '丑時 (01-03)', '寅時 (03-05)', '卯時 (05-07)',
                  '辰時 (07-09)', '巳時 (09-11)', '午時 (11-13)', '未時 (13-15)',
                  '申時 (15-17)', '酉時 (17-19)', '戌時 (19-21)', '亥時 (21-23)'],

        savedTitle: '已儲存的角色',
        savedEmpty: '暫無儲存的角色',
        btnCompare: '對比選中的角色',
        compareTitle: '角色對比',
        btnCloseCompare: '關閉',

        loading: '正在排盤，請稍候…',
        errorRequired: '請填寫完整出生資訊',
        errorGenerate: '生成失敗，請重試',

        footerText: '星軌人生 · 藝術創作者的人物塑造工具 · 基於紫微斗數學術體系',
        footerCopyright: '© 2026 Star Track Life',

        stepLabel: ['時代背景', '基礎資訊', '星盤匹配', '8屬性細化', '人物小傳'],

        step1Title: '選擇時代背景',
        step1Subtitle: '你的角色生活在哪個時代？這將決定社會背景和人物命運',
        eraAncientTitle: '古代', eraAncientDesc: '明清以前',
        eraAncientTags: ['科舉制度', '宗法社會', '等級森嚴'],
        eraModernTitle: '近代', eraModernDesc: '1840-1949',
        eraModernTags: ['變革動盪', '西學東漸', '救亡圖存'],
        eraContemporaryTitle: '現代', eraContemporaryDesc: '1949年至今',
        eraContemporaryTags: ['科技時代', '價值多元', '全球視野'],

        step2Title: '基礎資訊',
        step2Subtitle: '根據紫微斗數十二宮位邏輯收集角色基礎資訊',
        labelCharName: '角色名字【命宮·本命】',
        placeholderCharName: '請輸入角色名字（如：李明遠）',
        labelGenderFull: '性別【命宮·陰陽】',
        genderMaleDesc: '陽剛、主動、進取',
        genderFemaleDesc: '陰柔、內斂、溫和',
        labelAge: '年齡【命宮·大運階段】',
        ageYouthTitle: '青年', ageYouthDesc: '18-30歲，起步探索期',
        ageMiddleTitle: '中年', ageMiddleDesc: '30-50歲，成熟巔峰期',
        ageSeniorTitle: '老年', ageSeniorDesc: '50歲以上，智慧沉澱期',
        labelProfession: '職業【官祿宮】',
        profPoliticalTitle: '政界', profPoliticalDesc: '官員、政治家、公務員',
        profBusinessTitle: '商界', profBusinessDesc: '企業家、商人、創業者',
        profCulturalTitle: '文教', profCulturalDesc: '學者、教師、藝術家',
        profMilitaryTitle: '軍警', profMilitaryDesc: '軍人、警察、保安',
        profTechnicalTitle: '技術', profTechnicalDesc: '工程師、醫生、律師',
        profOtherTitle: '其他', profOtherDesc: '自由職業、學生、退休',
        labelFamily: '家庭背景【田宅宮】',
        familyWealthyTitle: '富貴', familyWealthyDesc: '世家大族，權勢顯赫',
        familyMiddleTitle: '小康', familyMiddleDesc: '中產之家，生活無憂',
        familyPoorTitle: '貧寒', familyPoorDesc: '家境清貧，自力更生',
        familyDeclineTitle: '家道中落', familyDeclineDesc: '昔日富貴，如今落魄',
        labelSocial: '社會階層【命宮·地位】',
        socialUpperTitle: '上層', socialUpperDesc: '權貴、名流、富豪',
        socialMiddleTitle: '中層', socialMiddleDesc: '知識分子、白領、小企業主',
        socialLowerTitle: '下層', socialLowerDesc: '工人、農民、底層',
        labelParents: '父母關係【父母宮】',
        parentsHarmoniousTitle: '和睦', parentsHarmoniousDesc: '關係融洽，家庭溫暖',
        parentsStrainedTitle: '緊張', parentsStrainedDesc: '經常爭吵，關係緊張',
        parentsBrokenTitle: '破裂', parentsBrokenDesc: '離異、失聯、家庭破碎',
        parentsLossTitle: '喪親', parentsLossDesc: '父母雙亡或單親',
        labelSiblings: '兄弟朋友關係【兄弟宮】',
        siblingsCloseTitle: '親密', siblingsCloseDesc: '手足情深，朋友眾多',
        siblingsConflictTitle: '衝突', siblingsConflictDesc: '兄弟鬩牆，朋友背叛',
        siblingsSupportTitle: '扶持', siblingsSupportDesc: '互相幫助，共同進步',
        siblingsAloneTitle: '孤獨', siblingsAloneDesc: '獨來獨往，缺少朋友',

        step3Title: '星盤匹配',
        step3Subtitle: '根據基礎資訊匹配到適合的主星盤，並選擇細分類型',
        labelMainStar: '主星',
        labelMingPalace: '命宮',
        labelEraShort: '時代',
        labelMatchScore: '匹配度',
        labelSubPatternSelect: '選擇細分星盤（基於四化心理動機）',
        btnConfirmSubPattern: '確認進入8屬性細化',

        step4Title: '8屬性細化',
        step4Subtitle: '完善角色的8個核心維度',
        btnGenerateBio: '生成人物小傳',

        step5Title: '人物小傳',
        step5Subtitle: '生成完整的人物小傳',
        btnSaveChar: '儲存角色',
        btnCompareChar: '對比角色',
        btnCopyBio: '複製小傳',
        btnRestart: '重新開始',

        btnNext: '下一步',
        btnBack: '返回',
        btnConfirmBasicInfo: '確認並匹配星盤',
        heroSubtitleMeta: '紫微斗數 × 編劇理論 × 星盤精細排盤',
        heroMetaStars: '14顆主星',
        heroMetaBio: '12維小傳',
        heroMetaPrecision: '精準塑造',

        // Toast / 驗證提示
        toastSelectEra: '請選擇一個時代背景',
        toastSelectGender: '請選擇性別',
        toastSelectAge: '請選擇年齡段',
        toastSelectProfession: '請選擇職業',
        toastSelectFamily: '請選擇家庭背景',
        toastSelectSocial: '請選擇社會地位',
        toastSelectParents: '請選擇父母關係',
        toastSelectSiblings: '請選擇手足關係',
        toastFinishChartMatch: '請先完成星盤匹配',
        toastSelectSihua: '請選擇四化類型',
        toastAttrsPartial: (n) => '💡 ' + n + ' 項未選擇，對應內容將以模糊風格呈現',
        toastGenerateError: (msg) => '生成出錯，請重試（' + msg + '）',
        toastSavedFull: '最多只能儲存10個角色，請先刪除一些',
        toastSavedSuccess: (name, n) => '「' + name + '」已儲存 (' + n + '/10)',
        toastNoBio: '請先生成人物小傳',
        toastCopied: '已複製到剪貼板',
        toastCopyFail: '複製失敗，請手動長按選擇',
        toastDeleted: (name) => '「' + name + '」已刪除',
        toastDeleteConfirm: (name) => '再次點擊「刪除」確認刪除「' + name + '」',
        toastMinCompare: '請至少選擇2個角色進行對比',
        toastMaxCompare: '最多對比3個角色',
        toastFillName: '請填寫角色名字',

        // 四化類型名稱
        sihuaTypeName: { '化禄型': '化祿型', '化权型': '化權型', '化科型': '化科型', '化忌型': '化忌型' },
        btnView: '查看',
        btnDelete: '刪除',

        // 對比面板
        cmpToggleLabel: '相性評分 & 戲劇分析',
        cmpToggleHint: '點擊展開',
        cmpSectionRelation: '四化類型',
        cmpSectionDrama: '戲劇關係',
        cmpSectionContext: '背景處境',
        cmpCharLabel: '角色',
    },

    // ── English ───────────────────────────────────────────────────
    en: {
        appName: 'Star Track Life',
        appSlogan: 'Character Design Tool for Writers & Storytellers',

        langSwitch: { zh: '简体', 'zh-TW': '繁體', en: 'EN' },

        heroTitle: 'Star Track Life',
        heroSubtitle: 'Character Design Tool for Writers & Storytellers',
        heroDesc: 'Powered by the Zi Wei Dou Shu System · 576-Chart Precision Engine',

        formTitle: 'Create a Character',
        labelGender: 'Gender',
        labelBirthYear: 'Birth Year',
        labelBirthMonth: 'Birth Month',
        labelBirthDay: 'Birth Day',
        labelBirthHour: 'Birth Hour',
        labelEra: 'Era',
        labelOccupation: 'Occupation',
        labelName: 'Character Name (optional)',
        placeholderName: 'Give this character a name…',
        genderMale: 'Male',
        genderFemale: 'Female',
        btnGenerate: 'Generate Chart & Biography',
        btnReset: 'Start Over',
        btnSave: 'Save Character',
        btnExport: 'Export',
        btnCopy: 'Copy Text',

        resultTitle: 'Destiny Chart & Biography',
        sectionChart: 'Chart Pattern',
        sectionBio: 'Character Biography',
        sectionPalaces: 'Twelve Palaces',
        sectionStars: 'Major Stars',
        sectionSihua: 'Four Transformations',
        sectionDaxian: 'Major Periods',

        palaceLabel: 'Palace',

        shichen: ['Zi (23:00–01:00)', 'Chou (01:00–03:00)', 'Yin (03:00–05:00)', 'Mao (05:00–07:00)',
                  'Chen (07:00–09:00)', 'Si (09:00–11:00)', 'Wu (11:00–13:00)', 'Wei (13:00–15:00)',
                  'Shen (15:00–17:00)', 'You (17:00–19:00)', 'Xu (19:00–21:00)', 'Hai (21:00–23:00)'],

        savedTitle: 'Saved Characters',
        savedEmpty: 'No saved characters yet',
        btnCompare: 'Compare Selected',
        compareTitle: 'Character Comparison',
        btnCloseCompare: 'Close',

        loading: 'Calculating chart, please wait…',
        errorRequired: 'Please fill in all birth details',
        errorGenerate: 'Generation failed, please try again',

        footerText: 'Star Track Life · Character Design for Writers · Powered by Zi Wei Dou Shu',
        footerCopyright: '© 2026 Star Track Life',

        stepLabel: ['Era', 'Profile', 'Chart Match', 'Refine', 'Biography'],

        step1Title: 'Choose an Era',
        step1Subtitle: 'Which era does your character live in? This shapes the social backdrop and destiny arc.',
        eraAncientTitle: 'Ancient', eraAncientDesc: 'Before 1840',
        eraAncientTags: ['Imperial Exams', 'Clan Society', 'Rigid Hierarchy'],
        eraModernTitle: 'Modern', eraModernDesc: '1840–1949',
        eraModernTags: ['Revolution', 'East Meets West', 'National Crisis'],
        eraContemporaryTitle: 'Contemporary', eraContemporaryDesc: '1949–Present',
        eraContemporaryTags: ['Tech Age', 'Plural Values', 'Global Vision'],

        step2Title: 'Basic Profile',
        step2Subtitle: 'Collect core character info guided by the Twelve Palaces of Zi Wei Dou Shu.',
        labelCharName: 'Character Name【Ming Palace · Self】',
        placeholderCharName: 'Enter a name for this character…',
        labelGenderFull: 'Gender【Ming Palace · Yin/Yang】',
        genderMaleDesc: 'Yang, assertive, driven',
        genderFemaleDesc: 'Yin, reserved, gentle',
        labelAge: 'Age【Ming Palace · Major Period】',
        ageYouthTitle: 'Young Adult', ageYouthDesc: '18–30, exploration phase',
        ageMiddleTitle: 'Middle-aged', ageMiddleDesc: '30–50, peak phase',
        ageSeniorTitle: 'Senior', ageSeniorDesc: '50+, wisdom phase',
        labelProfession: 'Occupation【Career Palace】',
        profPoliticalTitle: 'Politics', profPoliticalDesc: 'Official, politician, civil servant',
        profBusinessTitle: 'Business', profBusinessDesc: 'Entrepreneur, merchant, founder',
        profCulturalTitle: 'Culture & Education', profCulturalDesc: 'Scholar, teacher, artist',
        profMilitaryTitle: 'Military & Police', profMilitaryDesc: 'Soldier, officer, guard',
        profTechnicalTitle: 'Technical', profTechnicalDesc: 'Engineer, doctor, lawyer',
        profOtherTitle: 'Other', profOtherDesc: 'Freelancer, student, retired',
        labelFamily: 'Family Background【Property Palace】',
        familyWealthyTitle: 'Affluent', familyWealthyDesc: 'Old money, powerful lineage',
        familyMiddleTitle: 'Comfortable', familyMiddleDesc: 'Middle class, stable',
        familyPoorTitle: 'Humble', familyPoorDesc: 'Low income, self-reliant',
        familyDeclineTitle: 'Fallen Fortune', familyDeclineDesc: 'Once wealthy, now in decline',
        labelSocial: 'Social Class【Ming Palace · Status】',
        socialUpperTitle: 'Upper Class', socialUpperDesc: 'Elite, celebrities, wealthy',
        socialMiddleTitle: 'Middle Class', socialMiddleDesc: 'Professionals, white-collar',
        socialLowerTitle: 'Lower Class', socialLowerDesc: 'Workers, farmers, underclass',
        labelParents: 'Parental Relationship【Parents Palace】',
        parentsHarmoniousTitle: 'Harmonious', parentsHarmoniousDesc: 'Warm and loving home',
        parentsStrainedTitle: 'Strained', parentsStrainedDesc: 'Frequent conflict, tension',
        parentsBrokenTitle: 'Broken', parentsBrokenDesc: 'Divorced, estranged, shattered',
        parentsLossTitle: 'Bereaved', parentsLossDesc: 'Orphaned or single-parent',
        labelSiblings: 'Siblings & Friends【Siblings Palace】',
        siblingsCloseTitle: 'Close', siblingsCloseDesc: 'Deep bonds, many friends',
        siblingsConflictTitle: 'Conflict', siblingsConflictDesc: 'Rivalry, betrayal',
        siblingsSupportTitle: 'Supportive', siblingsSupportDesc: 'Mutual help and growth',
        siblingsAloneTitle: 'Isolated', siblingsAloneDesc: 'Lone wolf, few connections',

        step3Title: 'Chart Match',
        step3Subtitle: 'Match a chart based on your profile and pick a sub-type.',
        labelMainStar: 'Main Star',
        labelMingPalace: 'Ming Palace',
        labelEraShort: 'Era',
        labelMatchScore: 'Match',
        labelSubPatternSelect: 'Choose a sub-type (based on the Four Transformations)',
        btnConfirmSubPattern: 'Confirm & Refine Attributes',

        step4Title: 'Refine Attributes',
        step4Subtitle: 'Define 8 core character dimensions.',
        btnGenerateBio: 'Generate Biography',

        step5Title: 'Character Biography',
        step5Subtitle: 'Full character biography generated.',
        btnSaveChar: 'Save Character',
        btnCompareChar: 'Compare',
        btnCopyBio: 'Copy Bio',
        btnRestart: 'Start Over',

        btnNext: 'Next',
        btnBack: 'Back',
        btnConfirmBasicInfo: 'Confirm & Match Chart',
        heroSubtitleMeta: 'Zi Wei Dou Shu × Screenwriting Theory × Precision Chart Engine',
        heroMetaStars: '14 Major Stars',
        heroMetaBio: '12-Module Bio',
        heroMetaPrecision: 'Precision Design',

        // Toast / validation messages
        toastSelectEra: 'Please choose an era',
        toastSelectGender: 'Please select a gender',
        toastSelectAge: 'Please select an age group',
        toastSelectProfession: 'Please select an occupation',
        toastSelectFamily: 'Please select a family background',
        toastSelectSocial: 'Please select a social class',
        toastSelectParents: 'Please select a parental relationship',
        toastSelectSiblings: 'Please select a sibling/friend dynamic',
        toastFinishChartMatch: 'Please complete the chart match first',
        toastSelectSihua: 'Please select a transformation type',
        toastAttrsPartial: (n) => '💡 ' + n + ' attribute(s) unset — those sections will be rendered in outline style',
        toastGenerateError: (msg) => 'Generation failed, please try again (' + msg + ')',
        toastSavedFull: 'You can save up to 10 characters. Please delete one first.',
        toastSavedSuccess: (name, n) => '"' + name + '" saved (' + n + '/10)',
        toastNoBio: 'Please generate a biography first',
        toastCopied: 'Copied to clipboard',
        toastCopyFail: 'Copy failed — please select and copy manually',
        toastDeleted: (name) => '"' + name + '" deleted',
        toastDeleteConfirm: (name) => 'Tap Delete again to confirm deleting "' + name + '"',
        toastMinCompare: 'Please select at least 2 characters to compare',
        toastMaxCompare: 'You can compare up to 3 characters at a time',
        toastFillName: 'Please enter a character name',

        // Sihua type display names
        sihuaTypeName: { '化禄型': 'Lu (Prosperity)', '化权型': 'Quan (Authority)', '化科型': 'Ke (Wisdom)', '化忌型': 'Ji (Obstruction)' },
        btnView: 'View',
        btnDelete: 'Delete',

        // Compare panel
        cmpToggleLabel: 'Compatibility & Drama Analysis',
        cmpToggleHint: 'click to expand',
        cmpSectionRelation: 'Transformation Type',
        cmpSectionDrama: 'Dramatic Dynamic',
        cmpSectionContext: 'Context Note',
        cmpCharLabel: 'Character',
    }
};

/**
 * 取 UI 文案的便捷函数
 * @param {string} key - 点分隔路径，如 'btnGenerate' 或 'langSwitch.zh'
 * @returns {string}
 */
function tUI(key) {
    const lang = (typeof CURRENT_LANG !== 'undefined') ? CURRENT_LANG : 'zh';
    const parts = key.split('.');
    let val = UI_TEXT[lang] || UI_TEXT['zh'];
    for (const p of parts) {
        if (val == null) break;
        val = val[p];
    }
    // 降级到简体中文
    if (val == null) {
        val = UI_TEXT['zh'];
        for (const p of parts) {
            if (val == null) break;
            val = val[p];
        }
    }
    return val || key;
}

/** 用当前语言刷新所有带 data-i18n 属性的 DOM 元素 */
function applyI18nToDOM() {
    const lang = (typeof CURRENT_LANG !== 'undefined') ? CURRENT_LANG : 'zh';
    const texts = UI_TEXT[lang] || UI_TEXT['zh'];

    // 工具函数：支持点分路径 + 数组索引
    function resolve(key) {
        const parts = key.split('.');
        let val = texts;
        for (const p of parts) {
            if (val == null) break;
            val = val[p];
        }
        if (val == null) {
            val = UI_TEXT['zh'];
            for (const p of parts) {
                if (val == null) break;
                val = val[p];
            }
        }
        return (val != null && typeof val !== 'object' && typeof val !== 'function') ? val : null;
    }

    // data-i18n → textContent (input/textarea → placeholder)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = resolve(key);
        if (val !== null) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = val;
            } else {
                el.textContent = val;
            }
        }
    });

    // data-i18n-placeholder → placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const val = resolve(key);
        if (val !== null) el.placeholder = val;
    });

    // data-i18n-html → innerHTML（用于带标签的富文本）
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        const val = resolve(key);
        if (val !== null) el.innerHTML = val;
    });

    // 更新 html lang 属性
    document.documentElement.lang = lang === 'en' ? 'en' : (lang === 'zh-TW' ? 'zh-TW' : 'zh-CN');

    // 更新页面 title
    document.title = texts.heroTitle + ' - ' + texts.heroSubtitle;
}

// 监听语言切换事件，自动刷新 DOM
if (typeof window !== 'undefined') {
    window.addEventListener('langchange', () => applyI18nToDOM());
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UI_TEXT, tUI, applyI18nToDOM };
}

// ═══════════════════════════════════════════════════════════════
// UI_DYNAMIC — 动态生成区域三语言数据层
// 覆盖：8驱动力、8属性维度、相性标签、关系描述、时代地图等
// 用法：tDyn('drive8.野心者.label') 或直接 UI_DYNAMIC[CURRENT_LANG].xxx
// ═══════════════════════════════════════════════════════════════
const UI_DYNAMIC = {

    // ──────────────────── 简体中文 ────────────────────────────
    zh: {
        // 8种驱动力
        drive8: [
            { label: '野心者', desc: '想要更多，永不满足，代价是很难真正停下来', coreConflict: '得到了还想要 vs 已经够了还不知道', wound: '曾经一无所有，或曾被人看不起', starHint: '七杀/破军/贪狼命格最常见' },
            { label: '执念者', desc: '有一件事/一个人放不下，整个人生都在绕着它转', coreConflict: '放不下那个执念 vs 执念正在吞噬自己', wound: '曾经失去过某样东西，从此无法真正接受"失去"', starHint: '化忌入夫妻宫/命宫的格局，巨门/廉贞命格' },
            { label: '谋局者', desc: '凡事都在布局，极少暴露真实意图，连身边人也未必读得懂', coreConflict: '算计一切 vs 算计了所有人却算计不了孤独', wound: '曾经因为"天真"而被伤害，从此再不轻易信任', starHint: '天机/紫微命格，权忌叠加格局' },
            { label: '享乐者', desc: '活在当下，本能地回避痛苦，不太愿意为明天透支今天', coreConflict: '活在当下是智慧 vs 逃避是另一种懦弱', wound: '某段经历让他学会：未来是假的，只有现在是真的', starHint: '天同/贪狼/太阴命格，化禄入命宫' },
            { label: '守护者', desc: '为某人或某件事活着，习惯把自己放在最后', coreConflict: '守护了所有人 vs 谁来守护我', wound: '曾经没有守护好某个重要的人，从此以守护赎罪', starHint: '天府/太阳/天梁命格，夫妻宫/子女宫有重要星' },
            { label: '破局者', desc: '天生看不惯既有秩序，不打破什么就浑身难受', coreConflict: '不破不立 vs 打破了之后空留一地碎片', wound: '曾被一个不公平的规则深深伤害，立誓要推翻它', starHint: '破军/七杀命格，忌权叠加' },
            { label: '漂泊者', desc: '找不到真正意义上的根，永远在路上，停下来反而迷茫', coreConflict: '渴望归属 vs 真正定下来时又觉得窒息', wound: '从小就没有一个真正意义上的"家"', starHint: '天机/贪狼迁移宫强旺，命宫有空宫/化忌' },
            { label: '隐忍者', desc: '能扛，扛到极限才会爆发，平时看起来比任何人都稳', coreConflict: '忍耐是力量 vs 忍耐也是在慢慢消灭自己', wound: '曾经爆发过，结果失去了太多，从此学会了压抑', starHint: '天相/太阴/武曲命格，化忌入福德宫' },
        ],
        // 相性评分标签
        compatLabels: { high: '高度契合', good: '关系良好', tension: '张力显著', conflict: '冲突型组合' },
        compatTitle: '命盘相性',
        
        // 8大维度（统一使用数组格式，与英文版保持一致）
        attr: [
            { id: 'appearance', name: '外貌特征', options: ['威严霸气', '温和儒雅', '锐利干练', '柔和亲和', '独特个性', '低调朴素'] },
            { id: 'speech', name: '说话方式', options: ['简洁有力', '温和委婉', '热情洋溢', '沉稳冷静', '幽默风趣', '寡言内敛'] },
            { id: 'behavior', name: '行为习惯', options: ['雷厉风行', '深思熟虑', '随性而为', '谨慎小心', '有条不紊', '自由随性'] },
            { id: 'emotion', name: '情感表达', options: ['外露直白', '内敛含蓄', '丰富多变', '稳定平和', '理性克制', '感性冲动'] },
            { id: 'social', name: '社交风格', options: ['主动热情', '被动等待', '理性交往', '感性相交', '圆滑世故', '直率真诚'] },
            { id: 'crisis', name: '应对危机', options: ['冷静分析', '果断行动', '寻求帮助', '逃避回避', '慌乱无措', '坚定抵抗'] },
            { id: 'learning', name: '学习适应', options: ['快速学习', '稳步积累', '依赖经验', '善于应变', '固执己见', '灵活调整'] },
            { id: 'growth', name: '成长方向', options: ['追求成功', '追求自由', '追求安稳', '追求真理', '追求情感', '追求平衡'] }
        ],
        // 四化相性描述
        sihuaScoreMap: {
            '化禄型_化权型': [+12, '禄权相辅，一方给力一方掌局，合作有天然驱动力'],
            '化权型_化禄型': [+12, '禄权相辅，一方给力一方掌局，合作有天然驱动力'],
            '化禄型_化科型': [+10, '禄科组合，务实与理想相得益彰，互相成就'],
            '化科型_化禄型': [+10, '禄科组合，务实与理想相得益彰，互相成就'],
            '化权型_化科型': [+8,  '权科并立，一方主导一方疏通，运转顺畅'],
            '化科型_化权型': [+8,  '权科并立，一方主导一方疏通，运转顺畅'],
            '化忌型_化忌型': [-15, '双忌叠加，两人执念互相放大，容易陷入消耗战'],
            '化禄型_化忌型': [+5,  '禄忌对撞，一方给予一方执念，张力十足但易耗尽'],
            '化忌型_化禄型': [+5,  '禄忌对撞，一方给予一方执念，张力十足但易耗尽'],
            '化权型_化忌型': [-5,  '权忌相遇，掌控欲对执念，双方都不愿妥协'],
            '化忌型_化权型': [-5,  '权忌相遇，掌控欲对执念，双方都不愿妥协'],
            '化科型_化忌型': [+3,  '科忌之间有微妙拉力，理性试图理解执念，难以稳定'],
            '化忌型_化科型': [+3,  '科忌之间有微妙拉力，理性试图理解执念，难以稳定'],
        },
        // 驱动力关系描述（对比分析）
        relationMap: {
            '野心者_执念者': '两人都是目标导向型，容易在同一条路上竞争，甚至互为镜像——外向扩张对内向执着，张力极强。',
            '执念者_野心者': '两人都是目标导向型，容易在同一条路上竞争，甚至互为镜像——外向扩张对内向执着，张力极强。',
            '野心者_隐忍者': '一个主动出击，一个蓄力待发。表面强弱，实则隐忍者的爆发往往比野心者更彻底。适合设计从依附到反转的关系弧。',
            '隐忍者_野心者': '一个主动出击，一个蓄力待发。表面强弱，实则隐忍者的爆发往往比野心者更彻底。适合设计从依附到反转的关系弧。',
            '谋局者_执念者': '一个算计全局，一个死磕一点。前者容易把后者当棋子，后者往往是最后翻盘的变量。适合设计利用与被利用、最终失控的关系。',
            '执念者_谋局者': '一个算计全局，一个死磕一点。前者容易把后者当棋子，后者往往是最后翻盘的变量。适合设计利用与被利用、最终失控的关系。',
            '隐忍者_执念者': '两人都有强烈内驱力，一个向内消化，一个向外固着。放在亲密关系里尤其有戏——彼此理解却互相消耗。',
            '执念者_隐忍者': '两人都有强烈内驱力，一个向内消化，一个向外固着。放在亲密关系里尤其有戏——彼此理解却互相消耗。',
        },
        relationDefault: '这几种类型并置，核心戏剧张力来自各自动机的碰撞——目标交叉时冲突自然产生，合作也带着裂缝。',
        // 对比面板：背景处境注释
        contextCrossEra: (eraList) => '角色处于不同时代（' + eraList.join(' / ') + '），若需同框需设计跨时代叙事结构。',
        contextCrossAge: (nameAgeList) => '年龄段不同（' + nameAgeList + '），适合设计代际传承或对抗关系。',
        contextCrossGender: (era) => '性别构成混合，' + era + '背景下，性别带来的社会处境差异本身就是戏剧资源。',
        contextSame: (era, age) => '背景相近（' + era + '，' + age + '），关系张力主要来自内在驱动力与价值观差异，适合设计同类相斥的竞争。',
        // 对比面板标题
        cmpSectionRelation: '四化类型',
        cmpSectionDrama: '戏剧关系',
        cmpSectionContext: '背景处境',
        // 相性评分项目标签
        compatEraScore: (same) => same ? '时代背景：同框 +8' : '时代背景：跨时代 −5（需叙事支撑）',
        compatAgeNear: '年龄段：相近 +5',
        compatAgeFar: '年龄段：代际错位 −5',
        compatGenderDiff: '性别：异性互补 +5',
        // 时代地图
        eraMap: { ancient: '古代', modern: '近代', contemporary: '现代' },
        ageMap: { youth: '青年', middle: '中年', senior: '老年' },
        // 命盘推荐徽章
        badgeTop1: '✦ 命盘首选',
        badgeTop2: '◈ 次选',
        badgeSource: (src) => (src || '命盘') + '推荐：',
        badgeAttr: '命盘倾向',
        // 飞星关系图谱
        interpersonalTitle: '🌐 飞星人际关系图谱',
        interpersonalRelMap: (name) => name + ' · 关系图谱',
        interpersonalFuqi: '感情投影',
        interpersonalJiaoyou: '社交动力',
        interpersonalFly: '飞星执念',
        interpersonalAttach: '依恋类型',
        interpersonalResonance: (nameA, starA, nameB) => '<strong>命盘共鸣：</strong>' + nameA + '的夫妻宫主星（' + starA + '）= ' + nameB + '的命宫主星——' + nameB + '正好是' + nameA + '在感情中寻找的"那个人"。这是戏剧性最高的关系结构。',
        interpersonalDoubleWound: '<strong>双伤共鸣：</strong>两人命盘都存在飞星执念。这段关系会互相激活彼此最深的伤，是最有戏剧张力的组合——编剧可以设计"两人用对方的方式治愈自己，同时也加深对方的痛"。',
        // 驱动力确认按钮提示
        toastSelectDrive: '请先选择驱动力类型',
        woundLabel: '伤',
    },

    // ──────────────────── 繁體中文 ────────────────────────────
    'zh-TW': {
        drive8: [
            { label: '野心者', desc: '想要更多，永不滿足，代價是很難真正停下來', coreConflict: '得到了還想要 vs 已經夠了還不知道', wound: '曾經一無所有，或曾被人看不起', starHint: '七殺/破軍/貪狼命格最常見' },
            { label: '執念者', desc: '有一件事/一個人放不下，整個人生都在繞著它轉', coreConflict: '放不下那個執念 vs 執念正在吞噬自己', wound: '曾經失去過某樣東西，從此無法真正接受「失去」', starHint: '化忌入夫妻宮/命宮的格局，巨門/廉貞命格' },
            { label: '謀局者', desc: '凡事都在佈局，極少暴露真實意圖，連身邊人也未必讀得懂', coreConflict: '算計一切 vs 算計了所有人卻算計不了孤獨', wound: '曾經因為「天真」而被傷害，從此再不輕易信任', starHint: '天機/紫微命格，權忌疊加格局' },
            { label: '享樂者', desc: '活在當下，本能地回避痛苦，不太願意為明天透支今天', coreConflict: '活在當下是智慧 vs 逃避是另一種懦弱', wound: '某段經歷讓他學會：未來是假的，只有現在是真的', starHint: '天同/貪狼/太陰命格，化祿入命宮' },
            { label: '守護者', desc: '為某人或某件事活著，習慣把自己放在最後', coreConflict: '守護了所有人 vs 誰來守護我', wound: '曾經沒有守護好某個重要的人，從此以守護贖罪', starHint: '天府/太陽/天梁命格，夫妻宮/子女宮有重要星' },
            { label: '破局者', desc: '天生看不慣既有秩序，不打破什麼就渾身難受', coreConflict: '不破不立 vs 打破了之後空留一地碎片', wound: '曾被一個不公平的規則深深傷害，立誓要推翻它', starHint: '破軍/七殺命格，忌權疊加' },
            { label: '漂泊者', desc: '找不到真正意義上的根，永遠在路上，停下來反而迷茫', coreConflict: '渴望歸屬 vs 真正定下來時又覺得窒息', wound: '從小就沒有一個真正意義上的「家」', starHint: '天機/貪狼遷移宮強旺，命宮有空宮/化忌' },
            { label: '隱忍者', desc: '能扛，扛到極限才會爆發，平時看起來比任何人都穩', coreConflict: '忍耐是力量 vs 忍耐也是在慢慢消滅自己', wound: '曾經爆發過，結果失去了太多，從此學會了壓抑', starHint: '天相/太陰/武曲命格，化忌入福德宮' },
        ],
        compatLabels: { high: '高度契合', good: '關係良好', tension: '張力顯著', conflict: '衝突型組合' },
        compatTitle: '命盤相性',
        
        // 8大维度（统一使用数组格式）
        attr: [
            { id: 'appearance', name: '外貌特徵', options: ['威嚴霸氣', '溫和儒雅', '銳利幹練', '柔和親和', '獨特個性', '低調樸素'] },
            { id: 'speech', name: '說話方式', options: ['簡潔有力', '溫和委婉', '熱情洋溢', '沉穩冷靜', '幽默風趣', '寡言內斂'] },
            { id: 'behavior', name: '行為習慣', options: ['雷厲風行', '深思熟慮', '隨性而為', '謹慎小心', '有條不紊', '自由隨性'] },
            { id: 'emotion', name: '情感表達', options: ['外露直白', '內斂含蓄', '豐富多變', '穩定平和', '理性克制', '感性衝動'] },
            { id: 'social', name: '社交風格', options: ['主動熱情', '被動等待', '理性交往', '感性相交', '圓滑世故', '直率真誠'] },
            { id: 'crisis', name: '應對危機', options: ['冷靜分析', '果斷行動', '尋求幫助', '逃避回避', '慌亂無措', '堅定抵抗'] },
            { id: 'learning', name: '學習適應', options: ['快速學習', '穩步積累', '依賴經驗', '善於應變', '固執己見', '靈活調整'] },
            { id: 'growth', name: '成長方向', options: ['追求成功', '追求自由', '追求安穩', '追求真理', '追求情感', '追求平衡'] }
        ],
        sihuaScoreMap: {
            '化祿型_化權型': [+12, '祿權相輔，一方給力一方掌局，合作有天然驅動力'],
            '化權型_化祿型': [+12, '祿權相輔，一方給力一方掌局，合作有天然驅動力'],
            '化祿型_化科型': [+10, '祿科組合，務實與理想相得益彰，互相成就'],
            '化科型_化祿型': [+10, '祿科組合，務實與理想相得益彰，互相成就'],
            '化權型_化科型': [+8,  '權科並立，一方主導一方疏通，運轉順暢'],
            '化科型_化權型': [+8,  '權科並立，一方主導一方疏通，運轉順暢'],
            '化忌型_化忌型': [-15, '雙忌疊加，兩人執念互相放大，容易陷入消耗戰'],
            '化祿型_化忌型': [+5,  '祿忌對撞，一方給予一方執念，張力十足但易耗盡'],
            '化忌型_化祿型': [+5,  '祿忌對撞，一方給予一方執念，張力十足但易耗盡'],
            '化權型_化忌型': [-5,  '權忌相遇，掌控欲對執念，雙方都不願妥協'],
            '化忌型_化權型': [-5,  '權忌相遇，掌控欲對執念，雙方都不願妥協'],
            '化科型_化忌型': [+3,  '科忌之間有微妙拉力，理性試圖理解執念，難以穩定'],
            '化忌型_化科型': [+3,  '科忌之間有微妙拉力，理性試圖理解執念，難以穩定'],
        },
        relationMap: {
            '野心者_執念者': '兩人都是目標導向型，容易在同一條路上競爭，甚至互為鏡像——外向擴張對內向執著，張力極強。',
            '執念者_野心者': '兩人都是目標導向型，容易在同一條路上競爭，甚至互為鏡像——外向擴張對內向執著，張力極強。',
            '野心者_隱忍者': '一個主動出擊，一個蓄力待發。表面強弱，實則隱忍者的爆發往往比野心者更徹底。適合設計從依附到反轉的關係弧。',
            '隱忍者_野心者': '一個主動出擊，一個蓄力待發。表面強弱，實則隱忍者的爆發往往比野心者更徹底。適合設計從依附到反轉的關係弧。',
            '謀局者_執念者': '一個算計全局，一個死磕一點。前者容易把後者當棋子，後者往往是最後翻盤的變量。適合設計利用與被利用、最終失控的關係。',
            '執念者_謀局者': '一個算計全局，一個死磕一點。前者容易把後者當棋子，後者往往是最後翻盤的變量。適合設計利用與被利用、最終失控的關係。',
            '隱忍者_執念者': '兩人都有強烈內驅力，一個向內消化，一個向外固著。放在親密關係裡尤其有戲——彼此理解卻互相消耗。',
            '執念者_隱忍者': '兩人都有強烈內驅力，一個向內消化，一個向外固著。放在親密關係裡尤其有戲——彼此理解卻互相消耗。',
        },
        relationDefault: '這幾種類型並置，核心戲劇張力來自各自動機的碰撞——目標交叉時衝突自然產生，合作也帶著裂縫。',
        contextCrossEra: (eraList) => '角色處於不同時代（' + eraList.join(' / ') + '），若需同框需設計跨時代敘事結構。',
        contextCrossAge: (nameAgeList) => '年齡段不同（' + nameAgeList + '），適合設計代際傳承或對抗關係。',
        contextCrossGender: (era) => '性別構成混合，' + era + '背景下，性別帶來的社會處境差異本身就是戲劇資源。',
        contextSame: (era, age) => '背景相近（' + era + '，' + age + '），關係張力主要來自內在驅動力與價值觀差異，適合設計同類相斥的競爭。',
        cmpSectionRelation: '四化類型',
        cmpSectionDrama: '戲劇關係',
        cmpSectionContext: '背景處境',
        compatEraScore: (same) => same ? '時代背景：同框 +8' : '時代背景：跨時代 −5（需敘事支撐）',
        compatAgeNear: '年齡段：相近 +5',
        compatAgeFar: '年齡段：代際錯位 −5',
        compatGenderDiff: '性別：異性互補 +5',
        eraMap: { ancient: '古代', modern: '近代', contemporary: '現代' },
        ageMap: { youth: '青年', middle: '中年', senior: '老年' },
        badgeTop1: '✦ 命盤首選',
        badgeTop2: '◈ 次選',
        badgeSource: (src) => (src || '命盤') + '推薦：',
        badgeAttr: '命盤傾向',
        interpersonalTitle: '🌐 飛星人際關係圖譜',
        interpersonalRelMap: (name) => name + ' · 關係圖譜',
        interpersonalFuqi: '感情投影',
        interpersonalJiaoyou: '社交動力',
        interpersonalFly: '飛星執念',
        interpersonalAttach: '依戀類型',
        interpersonalResonance: (nameA, starA, nameB) => '<strong>命盤共鳴：</strong>' + nameA + '的夫妻宮主星（' + starA + '）= ' + nameB + '的命宮主星——' + nameB + '正好是' + nameA + '在感情中尋找的「那個人」。這是戲劇性最高的關係結構。',
        interpersonalDoubleWound: '<strong>雙傷共鳴：</strong>兩人命盤都存在飛星執念。這段關係會互相激活彼此最深的傷，是最有戲劇張力的組合——編劇可以設計「兩人用對方的方式治癒自己，同時也加深對方的痛」。',
        toastSelectDrive: '請先選擇驅動力類型',
        woundLabel: '傷',
    },

    // ──────────────────── English ─────────────────────────────
    en: {
        drive8: [
            { label: 'Ambitious', desc: 'Always wants more — relentless hunger. The price: never knowing when to stop.', coreConflict: 'Still wanting more vs. already having enough', wound: 'Once had nothing — or was once dismissed and looked down on.', starHint: 'Common in Seven Killings / Po Jun / Tan Lang charts' },
            { label: 'Obsessed', desc: 'One thing — or one person — they cannot let go of. Their entire life orbits it.', coreConflict: 'Unable to release the fixation vs. the fixation consuming them', wound: 'Lost something irreplaceable; has never truly accepted loss since.', starHint: 'Hua Ji in Spouse or Life Palace; Ju Men / Lian Zhen charts' },
            { label: 'Strategist', desc: 'Always three moves ahead. Rarely reveals true intent — even those closest may not read them.', coreConflict: 'Calculating everything vs. calculating everyone but unable to calculate loneliness', wound: 'Was once hurt for being naive; never trusted freely again.', starHint: 'Tian Ji / Zi Wei charts; overlapping Hua Quan & Hua Ji' },
            { label: 'Hedonist', desc: 'Lives in the now. Instinctively avoids pain — unwilling to mortgage today for tomorrow.', coreConflict: 'Living in the present as wisdom vs. avoidance as a form of cowardice', wound: 'One experience taught them: the future is a lie; only now is real.', starHint: 'Tian Tong / Tan Lang / Tai Yin charts; Hua Lu in Life Palace' },
            { label: 'Guardian', desc: 'Lives for someone or something — habitually puts themselves last.', coreConflict: 'Having protected everyone vs. who will protect me', wound: 'Once failed to protect someone who mattered. Has been atoning ever since.', starHint: 'Tian Fu / Tai Yang / Tian Liang charts; significant stars in Spouse or Children Palace' },
            { label: 'Disruptor', desc: 'Born unable to tolerate the existing order. If they aren\'t breaking something, something feels wrong.', coreConflict: 'Break it to rebuild vs. breaking things and leaving only shards', wound: 'Once deeply wronged by an unjust rule; swore to tear it down.', starHint: 'Po Jun / Seven Killings charts; Hua Ji + Hua Quan overlap' },
            { label: 'Wanderer', desc: 'Can\'t find a real home. Always on the road — stopping brings more confusion, not less.', coreConflict: 'Craving belonging vs. feeling suffocated when they finally settle', wound: 'Never had a real home, even in childhood.', starHint: 'Tian Ji / Tan Lang strong in Travel Palace; empty Life Palace or Hua Ji in Ming' },
            { label: 'Endurer', desc: 'Carries everything. Only breaks at the limit. Looks more composed than anyone — until they don\'t.', coreConflict: 'Endurance is power vs. endurance slowly erasing the self', wound: 'Exploded once, lost too much. Learned to suppress everything after that.', starHint: 'Tian Xiang / Tai Yin / Wu Qu charts; Hua Ji in Fortune Palace' },
        ],
        // 8 Attributes (统一使用 attr 数组格式，与中文版保持一致)
        attr: [
            { id: 'appearance', name: 'Appearance', options: ['Commanding', 'Gentle & Refined', 'Sharp & Capable', 'Warm & Approachable', 'Distinctive', 'Unassuming'] },
            { id: 'speech', name: 'Speaking Style', options: ['Direct & Concise', 'Tactful & Soft', 'Enthusiastic', 'Calm & Measured', 'Humorous', 'Reserved'] },
            { id: 'behavior', name: 'Habits', options: ['Decisive', 'Thoughtful', 'Spontaneous', 'Cautious', 'Methodical', 'Free-spirited'] },
            { id: 'emotion', name: 'Emotional Expression', options: ['Openly Expressive', 'Reserved', 'Changeable', 'Stable', 'Rationally Controlled', 'Impulsive'] },
            { id: 'social', name: 'Social Style', options: ['Proactive', 'Passive', 'Rational', 'Emotionally Guided', 'Diplomatic', 'Frank & Honest'] },
            { id: 'crisis', name: 'Crisis Response', options: ['Calm Analysis', 'Swift Action', 'Seeks Help', 'Avoidance', 'Panic', 'Firm Resistance'] },
            { id: 'learning', name: 'Adaptability', options: ['Fast Learner', 'Steady Accumulator', 'Experience-reliant', 'Highly Adaptive', 'Stubborn', 'Flexible'] },
            { id: 'growth', name: 'Growth Direction', options: ['Achievement', 'Freedom', 'Stability', 'Truth', 'Connection', 'Balance'] }
        ],
        compatLabels: { high: 'Highly Compatible', good: 'Good Dynamic', tension: 'Charged Tension', conflict: 'Conflict-Driven' },
        compatTitle: 'Chart Compatibility',
        sihuaScoreMap: {
            '化禄型_化权型': [+12, 'Lu & Quan: one empowers, one commands. Natural drive for collaboration.'],
            '化权型_化禄型': [+12, 'Lu & Quan: one empowers, one commands. Natural drive for collaboration.'],
            '化禄型_化科型': [+10, 'Lu & Ke: pragmatism meets idealism — each brings out the other\'s best.'],
            '化科型_化禄型': [+10, 'Lu & Ke: pragmatism meets idealism — each brings out the other\'s best.'],
            '化权型_化科型': [+8,  'Quan & Ke: one leads, one facilitates — a well-oiled dynamic.'],
            '化科型_化权型': [+8,  'Quan & Ke: one leads, one facilitates — a well-oiled dynamic.'],
            '化忌型_化忌型': [-15, 'Ji & Ji: double fixation amplifies each other\'s obsessions — risk of exhausting conflict.'],
            '化禄型_化忌型': [+5,  'Lu & Ji: one gives, the other fixates. Intense tension — but may drain the giver.'],
            '化忌型_化禄型': [+5,  'Lu & Ji: one gives, the other fixates. Intense tension — but may drain the giver.'],
            '化权型_化忌型': [-5,  'Quan & Ji: control meets obsession — neither will yield.'],
            '化忌型_化权型': [-5,  'Quan & Ji: control meets obsession — neither will yield.'],
            '化科型_化忌型': [+3,  'Ke & Ji: a subtle pull — reason tries to understand fixation. Rarely stable.'],
            '化忌型_化科型': [+3,  'Ke & Ji: a subtle pull — reason tries to understand fixation. Rarely stable.'],
        },
        relationMap: {
            '野心者_执念者': 'Both are goal-driven. They easily compete on the same path, even mirroring each other — outward expansion vs. inward fixation. Extreme tension.',
            '执念者_野心者': 'Both are goal-driven. They easily compete on the same path, even mirroring each other — outward expansion vs. inward fixation. Extreme tension.',
            '野心者_隐忍者': 'One strikes first; the other waits. On the surface one seems dominant — but the Endurer\'s explosion often goes further. Great for a reversal arc.',
            '隐忍者_野心者': 'One strikes first; the other waits. On the surface one seems dominant — but the Endurer\'s explosion often goes further. Great for a reversal arc.',
            '谋局者_执念者': 'One plays the whole board; the other digs in on one point. The Strategist treats the Obsessed as a pawn — who often becomes the variable that breaks the plan.',
            '执念者_谋局者': 'One plays the whole board; the other digs in on one point. The Strategist treats the Obsessed as a pawn — who often becomes the variable that breaks the plan.',
            '隐忍者_执念者': 'Both have fierce inner drives — one internalises, one fixates outward. Especially compelling in intimate relationships: mutual understanding, mutual drain.',
            '执念者_隐忍者': 'Both have fierce inner drives — one internalises, one fixates outward. Especially compelling in intimate relationships: mutual understanding, mutual drain.',
        },
        relationDefault: 'These types in proximity generate dramatic tension from the collision of motives — conflict arises naturally when goals intersect, and even cooperation carries fault lines.',
        contextCrossEra: (eraList) => 'Characters span different eras (' + eraList.join(' / ') + '). To share the same story world, a cross-era narrative device is needed.',
        contextCrossAge: (nameAgeList) => 'Different life stages (' + nameAgeList + '). Good for intergenerational mentor/rival dynamics.',
        contextCrossGender: (era) => 'Mixed genders. In a ' + era + ' setting, social gender roles are themselves a dramatic resource.',
        contextSame: (era, age) => 'Similar backgrounds (' + era + ', ' + age + '). Tension comes from clashing values and motivations — good for same-tier rivalry.',
        cmpSectionRelation: 'Transformation Types',
        cmpSectionDrama: 'Dramatic Dynamic',
        cmpSectionContext: 'Context Note',
        compatEraScore: (same) => same ? 'Era: same setting +8' : 'Era: cross-era −5 (needs narrative bridge)',
        compatAgeNear: 'Age: similar +5',
        compatAgeFar: 'Age: generational gap −5',
        compatGenderDiff: 'Gender: complementary +5',
        eraMap: { ancient: 'Ancient', modern: 'Modern', contemporary: 'Contemporary' },
        ageMap: { youth: 'Young', middle: 'Middle-aged', senior: 'Senior' },
        badgeTop1: '✦ Chart Pick',
        badgeTop2: '◈ Alt',
        badgeSource: (src) => (src || 'Chart') + ' rec: ',
        badgeAttr: 'Chart Tendency',
        interpersonalTitle: '🌐 Flying-Star Relationship Map',
        interpersonalRelMap: (name) => name + ' · Relationship Profile',
        interpersonalFuqi: 'Romantic Projection',
        interpersonalJiaoyou: 'Social Drive',
        interpersonalFly: 'Fixation Star',
        interpersonalAttach: 'Attachment Style',
        interpersonalResonance: (nameA, starA, nameB) => '<strong>Chart Resonance:</strong> ' + nameA + '\'s Spouse Palace star (' + starA + ') = ' + nameB + '\'s Life Palace star — ' + nameB + ' is exactly who ' + nameA + ' is looking for in love. The most dramatically charged pairing.',
        interpersonalDoubleWound: '<strong>Double Wound:</strong> Both charts carry flying-star fixations. This relationship activates each other\'s deepest wounds — the most dramatically potent combination. Write them healing each other in the other\'s language, while deepening each other\'s pain.',
        toastSelectDrive: 'Please choose a drive type first',
        woundLabel: 'Wound',
    },
};

/**
 * 取动态内容文案
 * @param {string} key - 如 'compatTitle' 或函数调用直接用 d.compatEraScore(true)
 */
function tDyn(key) {
    const lang = (typeof CURRENT_LANG !== 'undefined') ? CURRENT_LANG : 'zh';
    const d = UI_DYNAMIC[lang] || UI_DYNAMIC['zh'];
    return d[key] !== undefined ? d[key] : (UI_DYNAMIC['zh'][key] || key);
}

/** 获取当前语言的动态内容对象（完整对象，供外部代码直接取属性） */
function getDynamic() {
    const lang = (typeof CURRENT_LANG !== 'undefined') ? CURRENT_LANG : 'zh';
    return UI_DYNAMIC[lang] || UI_DYNAMIC['zh'];
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UI_TEXT, tUI, applyI18nToDOM, UI_DYNAMIC, tDyn, getDynamic };
}
