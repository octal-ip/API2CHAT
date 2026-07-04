<div align="center">
  <pre>
 █████╗ ██████╗ ██╗██████╗  ██████╗██╗  ██╗ █████╗ ████████╗
██╔══██╗██╔══██╗██║╚════██╗██╔════╝██║  ██║██╔══██╗╚══██╔══╝
███████║██████╔╝██║ █████╔╝██║     ███████║███████║   ██║   
██╔══██║██╔═══╝ ██║██╔═══╝ ██║     ██╔══██║██╔══██║   ██║   
██║  ██║██║     ██║███████╗╚██████╗██║  ██║██║  ██║   ██║   
╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
  </pre>
  <h3>A Zero-Knowledge, Serverless GUI for Universal LLM Access</h3>
  
  [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
  [![HTML/JS](https://img.shields.io/badge/tech-HTML5%20%7C%20Vanilla%20JS-f06529)](https://github.com/PacifAIst/API2CHAT)
</div>

<br>

**API2CHAT** is a lightweight (<100KB), high performance, purely client-side Graphical User Interface designed to interact with any OpenAI-compatible LLM endpoint. It bypasses the need for bloated backends, databases, or subscriptions, allowing you to plug in your own API keys. 

**v2 release:** Added the free OpenRouter models by default (https://openrouter.ai/openrouter/free), so you can simply paste your OpenRouter API key. **Important!** OpenRouter's free tier for free models typically allows 200 daily queries. If you purchase at least 10 credits (about $10), your daily limit increases to 1000 free model requests per day :)

**v2.1 modifications by octal-ip:**
* Added the ability to include system prompts to better control the behaviour of the LLM.
* Providers are now stored in models.json, allowing persistent configuration for your favourite endpoints. Includes the optional storage of API key and system prompts. **⚠️Warning⚠️** This information is readable and usable by anyone who can access your web server, so either lock it down with authentication and HTTPS or make sure it's only used in a secure and trusted zone (e.g. home lab). The API keys can be left blank in the JSON file and manually specified on the home page if preferred.
* Added prompt processing statistics (prompt, response and reasoning token counts, finish reason and total consumed time).
* Available models are automatically detected through the API, no need to manually specify the model to use. Models can also be switched mid-conversation.
* Added in-line markdown rendering for chat responses using [marked](https://github.com/markedjs/marked) v15.0.12

## 🚀 Key Features

* **🛡️ 100% Zero-Knowledge Security:** No prompts, context files or chat logs are ever transmitted to the server hosting this app as it runs entirely in your local browser's volatile memory.
* **🔌 Maximum Compatibility:** Natively supports OpenAI, Google (Gemini via OpenAI Shim), DeepSeek, and OpenRouter. Features a "Custom" mode to connect to any local (e.g., LM Studio, llama.cpp) or remote provider using the OpenAI standard API.
* **📎 Local File Context:**  Files are read locally by your browser and injected into the LLM prompt without requiring an upload server. Even when you can attach a file to it (e.g., a PDF) it is not stored anywhere.
* **💻 Host Anywhere:** Because there is no PHP, Python, or Node.js required, you can host API2CHAT on GitHub Pages, S3 buckets, cheap shared hosting (e.g., Namecheap), or simply double-click `index.html` on your desktop (Windows, Linux, iOS, Android, rpi-related...).
* **🎨 Hacker Aesthetic:** A sleek, minimal, dark-mode UI with full Markdown rendering and code syntax highlighting.

## 📸 Interface & Features

API2CHAT features a sleek, terminal-inspired interface designed for speed and low-friction interactions.

<div align="center">
  <img src="/images/1.png" width="50%" alt="Settings Modal">
</div>
<div align="center">
  <img src="/images/2.png" width="50%" alt="Chat Interface">
</div>

### 📎 Local File Reading (Zero-Upload)
API2CHAT can natively read local files and inject them directly into your LLM prompt. **Files are never uploaded to a server**. Your browser reads the text locally and sends it straight to the API provider. 

## 🛠️ Deploy locally or on cheap shared webhosting

1. Clone or download this repository.
2. **Unzip the contents** to your device or any hosting provider _(from low-end Namecheap, Hostgator, etc... will work!)._
3. Double-click `index.html` to open it **in any browser and OS** _(requires no: PHP, Python, Node.js... nothing!)._
4. Select provider, paste your API key, and start chatting. You can **copy/paste text or upload a file** to ask the LLM.
5. _(Optionally)_ To make sure all data was erased click **"Flush session"**, or if you wish to start a new clean chat.
6. _(Optionally)_ Set your own preferred providers in the providers.json file. **⚠️Warning⚠️** This information is readable and usable by anyone who can access your web server, so either lock it down with authentication and HTTPS or make sure it's only used in a secure and trusted zone (e.g. home lab). The API keys can be left blank in the JSON file and manually specified on the home page if preferred.

## 🌐 Deploying to GitHub Pages

Want to host your own secure, live instance for free?
1. Fork or upload this repository to GitHub.
2. Go to your repository **Settings** > **Pages**.
3. Under **Branch**, select `main` and click **Save**.
4. Your live link will be generated in minutes.

## 🤖 Provider Examples by Default (RECOMMENDED: click 'Custom' for yours)

| Provider | Base URL | Default Model |
| :--- | :--- | :--- |
| **OpenAI** | `https://api.openai.com/v1` | `gpt-4o-mini` |
| **DeepSeek** | `https://api.deepseek.com` | `deepseek-chat` |
| **OpenRouter** | `https://openrouter.ai/api/v1` | `qwen/qwen3.5-flash-02-23` |
| **Custom** | *User Defined* | *User Defined* |

## 👨‍💻 Author & License

Created by **Dr. Manuel Herrador** ([mherrador@ujaen.es](mailto:mherrador@ujaen.es)) - University of Jaen (Spain)

Enhanced by Octal-IP.

Released under the **[Apache 2.0 License](https://github.com/PacifAIst/API2CHAT/blob/main/LICENSE)**. You are free to modify, distribute, and use this software privately or commercially. The author takes no liability for any damages or data lost.

---

<p align="center">Made with ❤️ for the Local AI Community by PacifAIst and Octal-IP</p>

