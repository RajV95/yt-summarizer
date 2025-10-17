# YouTube AI Summarizer

Transform any YouTube video into a comprehensive, beautifully formatted summary using AI! This project leverages modern web technologies, advanced AI models, and a stunning UI to deliver instant, readable video summaries in Markdown format.

---

## Features

- **Paste any YouTube URL** and get a detailed summary of the video content
- **AI-powered summarization** using LLMs (Ollama + Llama3)
- **Markdown output** for rich, structured summaries
- **Beautiful, animated UI** with gradients, icons, and responsive design
- **Copy and Download** summary as Markdown
- **Dark mode** and mobile-friendly

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── summarize/route.ts      # API route for AI summarization
│   │   └── transcript/route.ts     # API route for YouTube transcript extraction
│   ├── globals.css                 # Global styles, custom animations, typography
│   ├── layout.tsx                  # App layout and metadata
│   └── page.tsx                    # Main entry, renders the summarizer UI
├── components/
│   ├── TranscriptionForm.tsx       # Main UI component for input and summary
│   ├── SummaryDisplay.tsx          # (Optional) For modular summary display
│   └── ui/                         # Reusable UI components (Button, Card, etc.)
├── lib/
│   └── utils.ts                    # Utility functions (if any)
├── public/                         # Static assets
├── package.json                    # Project dependencies and scripts
├── next.config.ts                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS config (if present)
└── README.md                       # This file
```

---

## How It Works

### 1. **Frontend (TranscriptionForm.tsx)**
- User pastes a YouTube URL and clicks **Summarize**.
- Shows animated loading, error, and success states.
- Displays the summary in Markdown with beautiful styling.
- Allows copying or downloading the summary.

### 2. **API: /api/transcript/route.ts**
- Receives the YouTube URL.
- Extracts the video ID and fetches transcript using `youtubei.js`.
- Handles errors (invalid URL, no transcript, etc.).
- Returns the full transcript as plain text.

### 3. **API: /api/summarize/route.ts**
- Receives the transcript.
- Uses `@langchain/ollama` to call a local Ollama LLM (Llama3) with a prompt instructing Markdown output.
- Returns the AI-generated Markdown summary.

### 4. **Styling & Animations**
- Uses Tailwind CSS and `@tailwindcss/typography` for beautiful prose.
- Custom CSS for animated gradients, floating icons, progress bars, and more.
- Responsive and dark mode ready.

---

## Key Technologies

- **Next.js** (App Router, API routes)
- **React** (19+)
- **Tailwind CSS** (v4+)
- **youtubei.js** (YouTube transcript extraction)
- **LangChain + Ollama** (AI summarization)
- **react-markdown** + **remark-gfm** (Markdown rendering)
- **Lucide React** (Modern icons)

---

## Setup & Usage

1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd yt-summarizer
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start Ollama server:**
   - Install [Ollama](https://ollama.com/) and pull the `llama3` model:
     ```sh
     ollama pull llama3
     ollama serve
     ```
4. **Run the app:**
   ```sh
   npm run dev
   ```
5. **Open in browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## Customization

- **Change AI Model:** Edit `app/api/summarize/route.ts` to use a different Ollama model.
- **UI Tweaks:** Modify `components/TranscriptionForm.tsx` and `app/globals.css` for branding/colors.
- **Add Features:** Extend with authentication, history, export formats, etc.

---

## Limitations

- Only works with YouTube videos that have transcripts/captions available.
- Requires a running Ollama server with the Llama3 model (or compatible LLM).
- Summaries are as good as the transcript and the LLM's capabilities.

---

## Credits

- [youtubei.js](https://github.com/LuanRT/YouTube.js)
- [LangChain](https://js.langchain.com/)
- [Ollama](https://ollama.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

