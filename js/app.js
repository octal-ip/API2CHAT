document.addEventListener('DOMContentLoaded', async () => {
    const d = document,
          get = id => d.getElementById(id),
          chatInput = get('chat-input'),
          attachBtn = get('attach-btn'),
          fileUpload = get('file-upload'),
          messagesArea = get('messages-area'),
          inputArea = get('input-area'),
          settingsModal = get('settings-modal'),
          startBtn = get('start-session-btn'),
          apiUrl = get('api-url'),
          apiKey = get('api-key'),
          urlGroup = get('url-group'),
          infoModal = get('info-modal'),
          modelSelect = get('model-select');

    const APP_VERSION = '2.1';
    let sUrl = '', sKey = '', sModel = '', sSystemPrompt = '';
    let providers = [];
    let providerApiKey = '';
    let providerSystemPrompt = '';

    function updateApiKeyHint() {
        apiKey.placeholder = providerApiKey ? 'Using API key stored in JSON. Enter a new key to override...' : 'Enter your API Key...';
    }

    const modelsWarning = get('models-warning');
    const dismissWarningBtn = get('dismiss-warning-btn');

    try {
        const response = await fetch('providers.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        providers = data.providers;
    } catch (e) {
        console.error('Failed to load providers.json:', e);
        providers = [
            { id: 'ai-base', name: 'OpenAI', url: 'https://api.openai.com/v1', systemPrompt: '', isCustom: false },
            { id: 'ai-base2', name: 'DeepSeek', url: 'https://api.deepseek.com', systemPrompt: '', isCustom: false },
            { id: 'openrouter', name: 'OpenRouter', url: 'https://openrouter.ai/api/v1', systemPrompt: '', isCustom: false },
            { id: 'custom', name: 'Custom', url: '', systemPrompt: '', isCustom: true }
        ];
        if (modelsWarning) modelsWarning.style.display = 'block';
    }

    if (dismissWarningBtn) {
        dismissWarningBtn.addEventListener('click', () => {
            if (modelsWarning) modelsWarning.style.display = 'none';
        });
    }

    const radioGroup = d.querySelector('.radio-group');
    providers.forEach(p => {
        const label = d.createElement('label');
        const input = d.createElement('input');
        input.type = 'radio';
        input.name = 'api-provider';
        input.value = p.id;
        if (p.id === 'openrouter') input.checked = true;
        if (p.isCustom) {
            label.innerHTML = `<b>${p.name}</b>`;
        } else {
            label.innerHTML = `${p.name} <span class="provider-url">${p.url}</span>`;
        }
        input.addEventListener('change', () => {
            const provider = providers.find(pr => pr.id === input.value);
            const isCustom = provider && provider.isCustom;
            urlGroup.style.display = isCustom ? 'block' : 'none';
            if (isCustom) apiUrl.value = '';
            else apiUrl.value = provider.url;
            providerApiKey = provider.apiKey || '';
            providerSystemPrompt = provider.systemPrompt || '';
            get('system-prompt').value = providerSystemPrompt;
            updateApiKeyHint();
        });
        label.insertBefore(input, label.firstChild);
        radioGroup.appendChild(label);
    });

    const defaultProvider = providers.find(p => p.id === 'openrouter') || providers[0];
    providerApiKey = defaultProvider.apiKey || '';
    providerSystemPrompt = defaultProvider.systemPrompt || '';
    get('system-prompt').value = providerSystemPrompt;
    updateApiKeyHint();
    settingsModal.style.display = 'flex';

    // 1. SETUP & ENTER KEY SUPPORT
    [apiUrl, apiKey].forEach(el => el.addEventListener('keydown', e => {
        if (e.key === 'Enter') startBtn.click();
    }));

    d.querySelectorAll('input[name="api-provider"]').forEach(r => {
        r.addEventListener('change', e => {
            const provider = providers.find(p => p.id === e.target.value);
            const isCustom = provider && provider.isCustom;
            urlGroup.style.display = isCustom ? 'block' : 'none';

            if (isCustom) apiUrl.value = '';
            else apiUrl.value = provider.url;
            providerApiKey = provider.apiKey || '';
            providerSystemPrompt = provider.systemPrompt || '';
            get('system-prompt').value = providerSystemPrompt;
            updateApiKeyHint();
        });
    });

    // 2. FETCH MODELS & START SESSION
    startBtn.addEventListener('click', async () => {
        const u = apiUrl.value.trim(), formKey = apiKey.value.trim().replace(/^bearer\s+/i, '');
        const k = formKey || providerApiKey;
        if (!u || !k) { alert("Please provide an API Key and URL."); return; }

        sUrl = u; sKey = k;
        const userSystemPrompt = get('system-prompt').value.trim();
        sSystemPrompt = userSystemPrompt || providerSystemPrompt || '';

        modelSelect.innerHTML = '<option value="">Loading models...</option>';
        modelSelect.disabled = true;

        try {
            const modelsUrl = `${u.trim().replace(/\/chat\/completions\/?$/, '').replace(/\/$/, '')}/models`;
            const res = await fetch(modelsUrl, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${k}` }
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}: Cannot list models`);

            const data = await res.json();
            const modelIds = (data.data || []).map(m => m.id).filter(Boolean);

            if (modelIds.length === 0) throw new Error('No models returned by API');

            modelSelect.innerHTML = '';
            modelIds.forEach(id => {
                const opt = d.createElement('option');
                opt.value = id; opt.textContent = id;
                modelSelect.appendChild(opt);
            });
            sModel = modelIds[0];
            modelSelect.disabled = false;
            settingsModal.style.display = 'none';
            inputArea.style.display = 'block';
        } catch (e) {
            modelSelect.innerHTML = '';
            const opt = d.createElement('option');
            opt.value = ''; opt.textContent = `Error: ${e.message}`;
            modelSelect.appendChild(opt);
            modelSelect.disabled = false;
            alert(`Failed to load models: ${e.message}\n\nYou can still proceed by entering a model ID manually in the dropdown.`);
            modelSelect.innerHTML = '';
            const manualOpt = d.createElement('option');
            manualOpt.value = ''; manualOpt.textContent = 'Enter model ID manually';
            modelSelect.appendChild(manualOpt);
            modelSelect.innerHTML += '<option value="__manual">Type model ID below</option>';
            modelSelect.disabled = false;
            settingsModal.style.display = 'none';
            inputArea.style.display = 'block';
        }
    });

    modelSelect.addEventListener('change', () => {
        sModel = modelSelect.value;
    });

    // 3. CONTROLS
    get('info-btn').addEventListener('click', () => infoModal.style.display = 'flex');
    get('close-info-btn').addEventListener('click', () => infoModal.style.display = 'none');
    infoModal.addEventListener('click', e => { if (e.target === infoModal) infoModal.style.display = 'none'; });

    get('restart-btn').addEventListener('click', () => {
        sUrl = sKey = sModel = sSystemPrompt = '';
        apiKey.value = '';
        messagesArea.querySelectorAll('.message, .usage-footer').forEach(m => m.remove());
        modelSelect.innerHTML = '';
        modelSelect.disabled = true;
        inputArea.style.display = 'none';
        fileUpload.value = '';
        get('file-preview').style.display = 'none';
        providerApiKey = '';
        providerSystemPrompt = '';
        get('system-prompt').value = '';
        updateApiKeyHint();
        settingsModal.style.display = 'flex';
        d.querySelector(`input[value="${defaultProvider.id}"]`).click();
    });

    // 4. INPUT & FILE HANDLING
    chatInput.addEventListener('input', function() { this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'; });
    chatInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleMsg(); } });

    attachBtn.addEventListener('click', () => fileUpload.click());
    fileUpload.addEventListener('change', function() {
        if (this.files.length > 0) { get('file-name').textContent = this.files[0].name; get('file-preview').style.display = 'inline-flex'; }
    });
    get('remove-file-btn').addEventListener('click', () => { fileUpload.value = ''; get('file-preview').style.display = 'none'; });

    // 5. UI RENDERING
    function appendMsg(role, text) {
        const div = d.createElement('div'), c = d.createElement('div');
        div.className = `message ${role}-message`; c.className = 'message-content';

        if (role === 'ai' && typeof marked !== 'undefined') {
            c.innerHTML = marked.parse(text);
            if (typeof hljs !== 'undefined') c.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
        } else c.textContent = text;

        div.appendChild(c); messagesArea.appendChild(div); messagesArea.scrollTop = messagesArea.scrollHeight;
        return c;
    }

    function appendFooter(usage, finishReason, elapsedSeconds) {
        const footer = d.createElement('div');
        footer.className = 'usage-footer';

        const pt = usage ? usage.prompt_tokens : '—';
        const ct = usage ? usage.completion_tokens : '—';
        const tt = usage ? usage.total_tokens : '—';
        const rt = usage && usage.completion_tokens_details ? (usage.completion_tokens_details.reasoning_tokens || 0) : '—';
        const fr = finishReason || '—';
        const time = elapsedSeconds !== null ? elapsedSeconds.toFixed(1) + 's' : '—';

        footer.innerHTML = `
            <span class="usage-item">Prompt tokens: <b>${pt}</b></span>
            <span class="usage-sep">·</span>
            <span class="usage-item">Response tokens: <b>${ct}</b></span>
            <span class="usage-sep">·</span>
            <span class="usage-item">Total: <b>${tt}</b></span>
            <span class="usage-sep">·</span>
            <span class="usage-item">Reasoning tokens: <b>${rt}</b></span>
            <span class="usage-sep">·</span>
            <span class="usage-item">Finish reason: <b>${fr}</b></span>
            <span class="usage-sep">·</span>
            <span class="usage-item">Total consumed time: <b>${time}</b></span>
        `;

        messagesArea.appendChild(footer);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // 6. API LOGIC
    async function handleMsg() {
        const txt = chatInput.value.trim(), file = fileUpload.files[0];
        if (!txt && !file) return;
        if (!sModel) { alert("Please select a model from the dropdown."); return; }
        chatInput.value = ''; chatInput.style.height = 'auto';

        let p = txt;
        if (file) {
            p = `File: ${file.name}\nContent:\n${await new Promise(r => { const rd = new FileReader(); rd.onload = e => r(e.target.result); rd.readAsText(file); })}\n\nQuestion: ${txt}`;
            fileUpload.value = ''; get('file-preview').style.display = 'none';
        }

        appendMsg('user', txt);
        const ui = appendMsg('ai', 'Thinking...');
        if (!sUrl || !sKey) return ui.textContent = "Error: Missing API Context. Please restart session.";

        let fUrl = `${sUrl.trim().replace(/\/chat\/completions\/?$/, '').replace(/\/$/, '')}/chat/completions`;

        const startTime = performance.now();

        try {
            const res = await fetch(fUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sKey}` },
                body: JSON.stringify({ model: sModel, messages: sSystemPrompt ? [{ role: 'system', content: sSystemPrompt }, { role: 'user', content: p }] : [{ role: 'user', content: p }] })
            });

            const endTime = performance.now();
            const elapsedSeconds = (endTime - startTime) / 1000;

            if (!res.ok) {
                let err = `HTTP ${res.status}: Server Error`;
                if (res.status === 400) err = "HTTP 400: Bad Request. Check if the model ID is correct and supported by the provider.";
                if (res.status === 401) err = "HTTP 401: API key is invalid or missing.";
                if (res.status === 403) err = "HTTP 403: Forbidden access to this model.";
                if (res.status === 429) err = "HTTP 429: Rate limit exceeded.";
                throw new Error(err);
            }

            const json = await res.json();
            const content = json.choices[0].message.content;
            const finishReason = json.choices[0].finish_reason;
            const usage = json.usage;

            ui.parentElement.remove();
            appendMsg('ai', content);
            appendFooter(usage, finishReason, elapsedSeconds);
        } catch (e) {
            ui.textContent = `❌ ${e.message}`;
            ui.style.color = '#ff6b6b';
        }
    }
});
