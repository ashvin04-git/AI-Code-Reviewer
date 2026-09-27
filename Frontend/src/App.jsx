import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

const CodeEditor = typeof Editor === 'function' ? Editor : (Editor?.default || Editor);

function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState(` function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    if (loading) return;
    setLoading(true);
    setReview("⏳ **Analyzing code, please wait...**");
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data);
    } catch (err) {
      console.error("Review request failed:", err);
      const errorMessage = typeof err.response?.data === 'string' 
        ? err.response.data 
        : (err.response?.data?.message || err.message || "Failed to fetch code review.");
      setReview(`⚠️ **Error Fetching Review:**\n\n${errorMessage}\n\n*Please ensure your Backend server is running and a valid \`GOOGLE_GEMINI_KEY\` is configured in \`Backend/.env\`.*`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <CodeEditor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <button
            disabled={loading}
            onClick={reviewCode}
            className="review"
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Reviewing..." : "Review"}
          </button>
        </div>
        <div className="right">
          <Markdown
            rehypePlugins={[rehypeHighlight]}
          >{review}</Markdown>
        </div>
      </main>
    </>
  )
}



export default App