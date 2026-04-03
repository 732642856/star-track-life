/**
 * 星轨人生 - 星盘存储模块
 */

var ChartStorage = {
    save: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('保存失败:', e);
            return false;
        }
    },
    
    load: function(key) {
        try {
            var data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('加载失败:', e);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }
};

if (typeof window !== 'undefined') {
    window.ChartStorage = ChartStorage;
}
