const TOKEN_REFRESH_BEFORE_EXPIRY = 3 * 60;
let tokenInfo = {
    endpoint: null,
    token: null,
    expiredAt: null
};

// HTML 页面模板
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>一只会飞的旺旺 - 让文字开口说话的神器</title>
    <meta name="description" content="声音魔法师，一键将文字转换为自然流畅的语音，支持20+种中文声音，免费在线使用，让你的内容更生动有趣！">
    <meta name="keywords" content="文字转语音,AI语音合成,在线TTS,语音生成器,免费语音工具">
    <style>
        :root {
            --primary-color: #2563eb;
            --primary-hover: #1d4ed8;
            --secondary-color: #64748b;
            --success-color: #059669;
            --warning-color: #d97706;
            --error-color: #dc2626;
            --background-color: #f8fafc;
            --surface-color: #ffffff;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --border-color: #e2e8f0;
            --border-focus: #3b82f6;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            --radius-sm: 6px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-xl: 16px;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--background-color);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: var(--surface-color);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            padding: 40px 30px;
            text-align: center;
            margin-bottom: 30px;
            border: 1px solid var(--border-color);
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--primary-color);
            margin-bottom: 12px;
            letter-spacing: -0.025em;
        }
        
        .header .subtitle {
            font-size: 1.125rem;
            color: var(--text-secondary);
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .header .features {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-secondary);
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .feature-icon {
            width: 20px;
            height: 20px;
            color: var(--success-color);
        }
        
        .main-content {
            background: var(--surface-color);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border-color);
            overflow: hidden;
        }
        
        .form-container {
            padding: 40px;
        }
        
        .form-group {
            margin-bottom: 24px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.875rem;
        }
        
        .form-input, .form-select, .form-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: 16px;
            color: var(--text-primary);
            background: var(--surface-color);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none;
            border-color: var(--border-focus);
            box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
        }
        
        .form-textarea {
            min-height: 120px;
            resize: vertical;
            font-family: inherit;
        }
        
        .controls-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }
        
        .btn-primary {
            width: 100%;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 16px 32px;
            font-size: 16px;
            font-weight: 600;
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .btn-primary:hover:not(:disabled) {
            background: var(--primary-hover);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }
        
        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .btn-secondary {
            background: var(--success-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: var(--radius-md);
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .btn-secondary:hover {
            background: #047857;
            transform: translateY(-1px);
        }
        
        .result-container {
            margin-top: 32px;
            padding: 24px;
            background: var(--background-color);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            display: none;
        }
        
        .audio-player {
            width: 100%;
            margin-bottom: 16px;
            border-radius: var(--radius-md);
        }
        
        .error-message {
            color: var(--error-color);
            background: #fef2f2;
            border: 1px solid #fecaca;
            padding: 16px;
            border-radius: var(--radius-md);
            margin-top: 16px;
            font-weight: 500;
        }
        
        .loading-container {
            text-align: center;
            padding: 32px 20px;
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-color);
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }
        
        .loading-text {
            color: var(--text-secondary);
            font-weight: 500;
        }
        
        .wechat-promotion {
            margin-top: 40px;
            background: var(--surface-color);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
            overflow: hidden;
        }
        
        .promotion-header {
            background: #f1f5f9;
            padding: 20px 30px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .promotion-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 8px;
        }
        
        .promotion-subtitle {
            color: var(--text-secondary);
            font-size: 0.875rem;
        }
        
        .promotion-content {
            padding: 30px;
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 24px;
            align-items: center;
        }
        
        .qr-code {
            width: 120px;
            height: 120px;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-lg);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .qr-code img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .promotion-info h3 {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 12px;
        }
        
        .promotion-info p {
            color: var(--text-secondary);
            margin-bottom: 16px;
            line-height: 1.6;
        }
        
        .benefits-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .benefits-list li {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 8px;
        }
        
        .benefits-list li:before {
            content: "✓";
            color: var(--success-color);
            font-weight: bold;
            font-size: 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
        .fade-in {
            animation: fadeIn 0.3s ease-out;
        }
        
        /* 文件上传相关样式 */
        .input-method-tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .tab-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 16px;
            border: 2px solid var(--border-color);
            background: var(--surface-color);
            color: var(--text-secondary);
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .tab-btn:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
        }
        
        .tab-btn.active {
            border-color: var(--primary-color);
            background: var(--primary-color);
            color: white;
        }
        
        .file-upload-container {
            width: 100%;
        }
        
        .file-drop-zone {
            border: 2px dashed var(--border-color);
            border-radius: var(--radius-lg);
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            background: var(--background-color);
        }
        
        .file-drop-zone:hover,
        .file-drop-zone.dragover {
            border-color: var(--primary-color);
            background: #f0f7ff;
        }
        
        .file-drop-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        
        .file-drop-icon {
            font-size: 2rem;
            margin-bottom: 8px;
        }
        
        .file-drop-text {
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-primary);
            margin: 0;
        }
        
        .file-drop-hint {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin: 0;
        }
        
        .file-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            background: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            margin-top: 12px;
        }
        
        .file-details {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .file-name {
            font-weight: 500;
            color: var(--text-primary);
        }
        
        .file-size {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        
        .file-remove-btn {
            width: 24px;
            height: 24px;
            border: none;
            background: var(--error-color);
            color: white;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            transition: all 0.2s ease;
        }
        
        .file-remove-btn:hover {
            background: #b91c1c;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 16px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .form-container {
                padding: 24px;
            }
            
            .controls-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .promotion-content {
                grid-template-columns: 1fr;
                text-align: center;
                gap: 20px;
            }
            
            .qr-code {
                margin: 0 auto;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>声音魔法师</h1>
            <p class="subtitle">让文字开口说话的神器</p>
            <div class="features">
                <div class="feature-item">
                    <span class="feature-icon">✨</span>
                    <span>20+种中文声音</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">⚡</span>
                    <span>秒速生成</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🆓</span>
                    <span>完全免费</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">📱</span>
                    <span>支持下载</span>
                </div>
            </div>
        </div>
        
        <div class="main-content">
            <div class="form-container">
                <form id="ttsForm">
                    <!-- 输入方式选择 -->
                    <div class="form-group">
                        <label class="form-label">选择输入方式</label>
                        <div class="input-method-tabs">
                            <button type="button" class="tab-btn active" id="textInputTab">
                                <span>✏️</span>
                                <span>手动输入</span>
                            </button>
                            <button type="button" class="tab-btn" id="fileUploadTab">
                                <span>📁</span>
                                <span>上传文件</span>
                            </button>
                        </div>
                    </div>

                    <!-- 手动输入区域 -->
                    <div class="form-group" id="textInputArea">
                        <label class="form-label" for="text">输入文本</label>
                        <textarea class="form-textarea" id="text" placeholder="请输入要转换为语音的文本内容，支持中文、英文、数字等..." required></textarea>
                    </div>

                    <!-- 文件上传区域 -->
                    <div class="form-group" id="fileUploadArea" style="display: none;">
                        <label class="form-label" for="fileInput">上传txt文件</label>
                        <div class="file-upload-container">
                            <div class="file-drop-zone" id="fileDropZone">
                                <div class="file-drop-content">
                                    <span class="file-drop-icon">📄</span>
                                    <p class="file-drop-text">拖拽txt文件到此处，或点击选择文件</p>
                                    <p class="file-drop-hint">支持txt格式，最大500KB</p>
                                </div>
                                <input type="file" id="fileInput" accept=".txt,text/plain" style="display: none;">
                            </div>
                            <div class="file-info" id="fileInfo" style="display: none;">
                                <div class="file-details">
                                    <span class="file-name" id="fileName"></span>
                                    <span class="file-size" id="fileSize"></span>
                                </div>
                                <button type="button" class="file-remove-btn" id="fileRemoveBtn">✕</button>
                            </div>
                        </div>
                    </div>
                
                    <div class="controls-grid">
                        <div class="form-group">
                            <label class="form-label" for="voice">语音选择</label>
                            <select class="form-select" id="voice">
                                <option value="zh-CN-XiaoxiaoNeural">晓晓 (女声·温柔)</option>
                                <option value="zh-CN-YunxiNeural">云希 (男声·清朗)</option>
                                <option value="zh-CN-YunyangNeural">云扬 (男声·阳光)</option>
                                <option value="zh-CN-XiaoyiNeural">晓伊 (女声·甜美)</option>
                                <option value="zh-CN-YunjianNeural">云健 (男声·稳重)</option>
                                <option value="zh-CN-XiaochenNeural">晓辰 (女声·知性)</option>
                                <option value="zh-CN-XiaohanNeural">晓涵 (女声·优雅)</option>
                                <option value="zh-CN-XiaomengNeural">晓梦 (女声·梦幻)</option>
                                <option value="zh-CN-XiaomoNeural">晓墨 (女声·文艺)</option>
                                <option value="zh-CN-XiaoqiuNeural">晓秋 (女声·成熟)</option>
                                <option value="zh-CN-XiaoruiNeural">晓睿 (女声·智慧)</option>
                                <option value="zh-CN-XiaoshuangNeural">晓双 (女声·活泼)</option>
                                <option value="zh-CN-XiaoxuanNeural">晓萱 (女声·清新)</option>
                                <option value="zh-CN-XiaoyanNeural">晓颜 (女声·柔美)</option>
                                <option value="zh-CN-XiaoyouNeural">晓悠 (女声·悠扬)</option>
                                <option value="zh-CN-XiaozhenNeural">晓甄 (女声·端庄)</option>
                                <option value="zh-CN-YunfengNeural">云枫 (男声·磁性)</option>
                                <option value="zh-CN-YunhaoNeural">云皓 (男声·豪迈)</option>
                                <option value="zh-CN-YunxiaNeural">云夏 (男声·热情)</option>
                                <option value="zh-CN-YunyeNeural">云野 (男声·野性)</option>
                                <option value="zh-CN-YunzeNeural">云泽 (男声·深沉)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="speed">语速调节</label>
                            <select class="form-select" id="speed">
                                <option value="0.5">🐌 很慢</option>
                                <option value="0.75">🚶 慢速</option>
                                <option value="1.0" selected>⚡ 正常</option>
                                <option value="1.25">🏃 快速</option>
                                <option value="1.5">🚀 很快</option>
                                <option value="2.0">💨 极速</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="pitch">音调高低</label>
                            <select class="form-select" id="pitch">
                                <option value="-50">📉 很低沉</option>
                                <option value="-25">📊 低沉</option>
                                <option value="0" selected>🎵 标准</option>
                                <option value="25">📈 高亢</option>
                                <option value="50">🎶 很高亢</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="style">语音风格</label>
                            <select class="form-select" id="style">
                                <option value="general" selected>🎭 通用风格</option>
                                <option value="assistant">🤖 智能助手</option>
                                <option value="chat">💬 聊天对话</option>
                                <option value="customerservice">📞 客服专业</option>
                                <option value="newscast">📺 新闻播报</option>
                                <option value="affectionate">💕 亲切温暖</option>
                                <option value="calm">😌 平静舒缓</option>
                                <option value="cheerful">😊 愉快欢乐</option>
                                <option value="gentle">🌸 温和柔美</option>
                                <option value="lyrical">🎼 抒情诗意</option>
                                <option value="serious">🎯 严肃正式</option>
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn-primary" id="generateBtn">
                        <span>🎙️</span>
                        <span>开始生成语音</span>
                    </button>
            </form>
            
                <div id="result" class="result-container">
                    <div id="loading" class="loading-container" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p class="loading-text">正在生成语音，请稍候...</p>
                    </div>
                    
                    <div id="success" style="display: none;">
                        <audio id="audioPlayer" class="audio-player" controls></audio>
                        <a id="downloadBtn" class="btn-secondary" download="speech.mp3">
                            <span>📥</span>
                            <span>下载音频文件</span>
                        </a>
                    </div>
                    
                    <div id="error" class="error-message" style="display: none;"></div>
                </div>
            </div>
        </div>
        
        <!-- 公众号推广组件 -->
        <div class="wechat-promotion" id="wechatPromotion" style="display: none;">
            <div class="promotion-header">
                <h2 class="promotion-title">🎉 生成成功！喜欢这个工具吗？</h2>
                <p class="promotion-subtitle">关注我们获取更多AI工具和技术分享</p>
            </div>
            <div class="promotion-content">
                <div class="qr-code">
                    <img src="https://img.996007.icu/file/img1/a48c4eac2f2a99909da5611c3885726.jpg" alt="微信公众号二维码" />
                </div>
                <div class="promotion-info">
                    <h3>关注「一只会飞的旺旺」公众号</h3>
                    <p>获取更多实用的AI工具、技术教程和独家资源分享</p>
                    <ul class="benefits-list">
                        <li>最新AI工具推荐和使用教程</li>
                        <li>前沿技术解析和实战案例</li>
                        <li>独家资源和工具源码分享</li>
                        <li>技术问题答疑和交流社群</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script>
        let selectedFile = null;
        let currentInputMethod = 'text'; // 'text' or 'file'

        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            initializeInputMethodTabs();
            initializeFileUpload();
        });

        // 初始化输入方式切换
        function initializeInputMethodTabs() {
            const textInputTab = document.getElementById('textInputTab');
            const fileUploadTab = document.getElementById('fileUploadTab');
            const textInputArea = document.getElementById('textInputArea');
            const fileUploadArea = document.getElementById('fileUploadArea');

            textInputTab.addEventListener('click', function() {
                currentInputMethod = 'text';
                textInputTab.classList.add('active');
                fileUploadTab.classList.remove('active');
                textInputArea.style.display = 'block';
                fileUploadArea.style.display = 'none';
                document.getElementById('text').required = true;
            });

            fileUploadTab.addEventListener('click', function() {
                currentInputMethod = 'file';
                fileUploadTab.classList.add('active');
                textInputTab.classList.remove('active');
                textInputArea.style.display = 'none';
                fileUploadArea.style.display = 'block';
                document.getElementById('text').required = false;
            });
        }

        // 初始化文件上传功能
        function initializeFileUpload() {
            const fileDropZone = document.getElementById('fileDropZone');
            const fileInput = document.getElementById('fileInput');
            const fileInfo = document.getElementById('fileInfo');
            const fileRemoveBtn = document.getElementById('fileRemoveBtn');

            // 点击上传区域
            fileDropZone.addEventListener('click', function() {
                fileInput.click();
            });

            // 文件选择
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    handleFileSelect(file);
                }
            });

            // 拖拽功能
            fileDropZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                fileDropZone.classList.add('dragover');
            });

            fileDropZone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                fileDropZone.classList.remove('dragover');
            });

            fileDropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                fileDropZone.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file) {
                    handleFileSelect(file);
                }
            });

            // 移除文件
            fileRemoveBtn.addEventListener('click', function() {
                selectedFile = null;
                fileInput.value = '';
                fileInfo.style.display = 'none';
                fileDropZone.style.display = 'block';
            });
        }

        // 处理文件选择
        function handleFileSelect(file) {
            // 验证文件类型
            if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
                alert('请选择txt格式的文本文件');
                return;
            }

            // 验证文件大小
            if (file.size > 500 * 1024) {
                alert('文件大小不能超过500KB');
                return;
            }

            selectedFile = file;
            
            // 显示文件信息
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('fileSize').textContent = formatFileSize(file.size);
            document.getElementById('fileInfo').style.display = 'flex';
            document.getElementById('fileDropZone').style.display = 'none';
        }

        // 格式化文件大小
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // 表单提交处理
        document.getElementById('ttsForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const voice = document.getElementById('voice').value;
            const speed = document.getElementById('speed').value;
            const pitch = document.getElementById('pitch').value;
            const style = document.getElementById('style').value;
            
            const generateBtn = document.getElementById('generateBtn');
            const resultContainer = document.getElementById('result');
            const loading = document.getElementById('loading');
            const success = document.getElementById('success');
            const error = document.getElementById('error');
            
            // 验证输入
            if (currentInputMethod === 'text') {
                const text = document.getElementById('text').value;
                if (!text.trim()) {
                    alert('请输入要转换的文本内容');
                    return;
                }
            } else if (currentInputMethod === 'file') {
                if (!selectedFile) {
                    alert('请选择要上传的txt文件');
                    return;
                }
            }
            
            // 重置状态
            resultContainer.style.display = 'block';
            loading.style.display = 'block';
            success.style.display = 'none';
            error.style.display = 'none';
            generateBtn.disabled = true;
            generateBtn.textContent = '生成中...';
            
            try {
                let response;
                
                if (currentInputMethod === 'text') {
                    // 手动输入文本
                    const text = document.getElementById('text').value;
                    response = await fetch('/v1/audio/speech', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            input: text,
                            voice: voice,
                            speed: parseFloat(speed),
                            pitch: pitch,
                            style: style
                        })
                    });
                } else {
                    // 文件上传
                    const formData = new FormData();
                    formData.append('file', selectedFile);
                    formData.append('voice', voice);
                    formData.append('speed', speed);
                    formData.append('pitch', pitch);
                    formData.append('style', style);
                    
                    response = await fetch('/v1/audio/speech', {
                        method: 'POST',
                        body: formData
                    });
                }
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || '生成失败');
                }
                
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // 显示音频播放器
                const audioPlayer = document.getElementById('audioPlayer');
                const downloadBtn = document.getElementById('downloadBtn');
                
                audioPlayer.src = audioUrl;
                downloadBtn.href = audioUrl;
                
                loading.style.display = 'none';
                success.style.display = 'block';
                
                // 显示公众号推广组件
                setTimeout(() => {
                    const wechatPromotion = document.getElementById('wechatPromotion');
                    wechatPromotion.style.display = 'block';
                    wechatPromotion.classList.add('fade-in');
                }, 1000);
                
            } catch (err) {
                loading.style.display = 'none';
                error.style.display = 'block';
                error.textContent = '错误: ' + err.message;
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<span>🎙️</span><span>开始生成语音</span>';
            }
        });
    </script>
</body>
</html>
`;

export default {
    async fetch(request, env, ctx) {
        return handleRequest(request);
    }
};

async function handleRequest(request) {
    if (request.method === "OPTIONS") {
        return handleOptions(request);
    }




    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname;

    // 返回前端页面
    if (path === "/" || path === "/index.html") {
        return new Response(HTML_PAGE, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                ...makeCORSHeaders()
            }
        });
    }

    if (path === "/v1/audio/speech") {
        try {
            const contentType = request.headers.get("content-type") || "";
            
            // 处理文件上传
            if (contentType.includes("multipart/form-data")) {
                return await handleFileUpload(request);
            }
            
            // 处理JSON请求（原有功能）
            const requestBody = await request.json();
            const {
                input,
                voice = "zh-CN-XiaoxiaoNeural",
                speed = '1.0',
                volume = '0',
                pitch = '0',
                style = "general"
            } = requestBody;

            let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
            let numVolume = parseInt(String(parseFloat(volume) * 100));
            let numPitch = parseInt(pitch);
            const response = await getVoice(
                input,
                voice,
                rate >= 0 ? `+${rate}%` : `${rate}%`,
                numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
                numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
                style,
                "audio-24khz-48kbitrate-mono-mp3"
            );

            return response;

        } catch (error) {
            console.error("Error:", error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message,
                    type: "api_error",
                    param: null,
                    code: "edge_tts_error"
                }
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }
    }

    // 默认返回 404
    return new Response("Not Found", { status: 404 });
}

async function handleOptions(request) {
    return new Response(null, {
        status: 204,
        headers: {
            ...makeCORSHeaders(),
            "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
            "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "Authorization"
        }
    });
}

async function getVoice(text, voiceName = "zh-CN-XiaoxiaoNeural", rate = '+0%', pitch = '+0Hz', volume = '+0%', style = "general", outputFormat = "audio-24khz-48kbitrate-mono-mp3") {
    try {
        const maxChunkSize = 2000;
        const chunks = text.trim().split("\n");


        // 获取每个分段的音频
        //const audioChunks = await Promise.all(chunks.map(chunk => getAudioChunk(chunk, voiceName, rate, pitch, volume,style, outputFormat)));
        let audioChunks = []
        while (chunks.length > 0) {
            try {
                let audio_chunk = await getAudioChunk(chunks.shift(), voiceName, rate, pitch, volume, style, outputFormat)
                audioChunks.push(audio_chunk)

            } catch (e) {
                return new Response(JSON.stringify({
                    error: {
                        message: String(e),
                        type: "api_error",
                        param: `${voiceName}, ${rate}, ${pitch}, ${volume},${style}, ${outputFormat}`,
                        code: "edge_tts_error"
                    }
                }), {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...makeCORSHeaders()
                    }
                });

            }
        }


        // 将音频片段拼接起来
        const concatenatedAudio = new Blob(audioChunks, { type: 'audio/mpeg' });
        const response = new Response(concatenatedAudio, {
            headers: {
                "Content-Type": "audio/mpeg",
                ...makeCORSHeaders()
            }
        });


        return response;

    } catch (error) {
        console.error("语音合成失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: error,
                type: "api_error",
                param: null,
                code: "edge_tts_error " + voiceName
            }
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                ...makeCORSHeaders()
            }
        });
    }
}



//获取单个音频数据
async function getAudioChunk(text, voiceName, rate, pitch, volume, style, outputFormat = 'audio-24khz-48kbitrate-mono-mp3') {
    const endpoint = await getEndpoint();
    const url = `https://${endpoint.r}.tts.speech.microsoft.com/cognitiveservices/v1`;
    let m = text.match(/\[(\d+)\]\s*?$/);
    let slien = 0;
    if (m && m.length == 2) {
        slien = parseInt(m[1]);
        text = text.replace(m[0], '')

    }
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": endpoint.t,
            "Content-Type": "application/ssml+xml",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
            "X-Microsoft-OutputFormat": outputFormat
        },
        body: getSsml(text, voiceName, rate, pitch, volume, style, slien)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Edge TTS API error: ${response.status} ${errorText}`);
    }

    return response.blob();

}

function getSsml(text, voiceName, rate, pitch, volume, style, slien = 0) {
    let slien_str = '';
    if (slien > 0) {
        slien_str = `<break time="${slien}ms" />`
    }
    return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="zh-CN"> 
                <voice name="${voiceName}"> 
                    <mstts:express-as style="${style}"  styledegree="2.0" role="default" > 
                        <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">${text}</prosody> 
                    </mstts:express-as> 
                    ${slien_str}
                </voice> 
            </speak>`;

}

async function getEndpoint() {
    const now = Date.now() / 1000;

    if (tokenInfo.token && tokenInfo.expiredAt && now < tokenInfo.expiredAt - TOKEN_REFRESH_BEFORE_EXPIRY) {
        return tokenInfo.endpoint;
    }

    // 获取新token
    const endpointUrl = "https://dev.microsofttranslator.com/apps/endpoint?api-version=1.0";
    const clientId = crypto.randomUUID().replace(/-/g, "");

    try {
        const response = await fetch(endpointUrl, {
            method: "POST",
            headers: {
                "Accept-Language": "zh-Hans",
                "X-ClientVersion": "4.0.530a 5fe1dc6c",
                "X-UserId": "0f04d16a175c411e",
                "X-HomeGeographicRegion": "zh-Hans-CN",
                "X-ClientTraceId": clientId,
                "X-MT-Signature": await sign(endpointUrl),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": "0",
                "Accept-Encoding": "gzip"
            }
        });

        if (!response.ok) {
            throw new Error(`获取endpoint失败: ${response.status}`);
        }

        const data = await response.json();
        const jwt = data.t.split(".")[1];
        const decodedJwt = JSON.parse(atob(jwt));

        tokenInfo = {
            endpoint: data,
            token: data.t,
            expiredAt: decodedJwt.exp
        };

        return data;

    } catch (error) {
        console.error("获取endpoint失败:", error);
        // 如果有缓存的token，即使过期也尝试使用
        if (tokenInfo.token) {
            console.log("使用过期的缓存token");
            return tokenInfo.endpoint;
        }
        throw error;
    }
}



function makeCORSHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
        "Access-Control-Max-Age": "86400"
    };
}

async function hmacSha256(key, data) {
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
    return new Uint8Array(signature);
}

async function base64ToBytes(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function bytesToBase64(bytes) {
    return btoa(String.fromCharCode.apply(null, bytes));
}

function uuid() {
    return crypto.randomUUID().replace(/-/g, "");
}

async function sign(urlStr) {
    const url = urlStr.split("://")[1];
    const encodedUrl = encodeURIComponent(url);
    const uuidStr = uuid();
    const formattedDate = dateFormat();
    const bytesToSign = `MSTranslatorAndroidApp${encodedUrl}${formattedDate}${uuidStr}`.toLowerCase();
    const decode = await base64ToBytes("oik6PdDdMnOXemTbwvMn9de/h9lFnfBaCWbGMMZqqoSaQaqUOqjVGm5NqsmjcBI1x+sS9ugjB55HEJWRiFXYFw==");
    const signData = await hmacSha256(decode, bytesToSign);
    const signBase64 = await bytesToBase64(signData);
    return `MSTranslatorAndroidApp::${signBase64}::${formattedDate}::${uuidStr}`;
}

function dateFormat() {
    const formattedDate = (new Date()).toUTCString().replace(/GMT/, "").trim() + " GMT";
    return formattedDate.toLowerCase();
}

// 处理文件上传的函数
async function handleFileUpload(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const voice = formData.get('voice') || 'zh-CN-XiaoxiaoNeural';
        const speed = formData.get('speed') || '1.0';
        const volume = formData.get('volume') || '0';
        const pitch = formData.get('pitch') || '0';
        const style = formData.get('style') || 'general';

        // 验证文件
        if (!file) {
            return new Response(JSON.stringify({
                error: {
                    message: "未找到上传的文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "missing_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件类型
        if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
            return new Response(JSON.stringify({
                error: {
                    message: "不支持的文件类型，请上传txt文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "invalid_file_type"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件大小（限制为500KB）
        if (file.size > 500 * 1024) {
            return new Response(JSON.stringify({
                error: {
                    message: "文件大小超过限制（最大500KB）",
                    type: "invalid_request_error",
                    param: "file",
                    code: "file_too_large"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 读取文件内容
        const text = await file.text();
        
        // 验证文本内容
        if (!text.trim()) {
            return new Response(JSON.stringify({
                error: {
                    message: "文件内容为空",
                    type: "invalid_request_error",
                    param: "file",
                    code: "empty_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 文本长度限制（10000字符）
        if (text.length > 10000) {
            return new Response(JSON.stringify({
                error: {
                    message: "文本内容过长（最大10000字符）",
                    type: "invalid_request_error",
                    param: "file",
                    code: "text_too_long"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 处理参数格式，与原有逻辑保持一致
        let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
        let numVolume = parseInt(String(parseFloat(volume) * 100));
        let numPitch = parseInt(pitch);

        // 调用TTS服务
        return await getVoice(
            text,
            voice,
            rate >= 0 ? `+${rate}%` : `${rate}%`,
            numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
            numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
            style,
            "audio-24khz-48kbitrate-mono-mp3"
        );

    } catch (error) {
        console.error("文件上传处理失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: "文件处理失败",
                type: "api_error",
                param: null,
                code: "file_processing_error"
            }
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                ...makeCORSHeaders()
            }
        });
    }
}

