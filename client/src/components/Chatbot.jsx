import { useState, useRef, useEffect } from 'react';

// ── Knowledge base (migrated from constants.js) ──────────────────────────────
const PROMPTS = [
  ['hello', 'hi', 'hey', 'greetings'],
  ['how are you', 'how r u', 'whats up'],
  ['what is your name', 'your name', 'who are you'],
  ['what is food waste management', 'about this project', 'what is this project'],
  ['how to donate food', 'donate food', 'how do i donate'],
  ['what food can i donate', 'which food can be donated'],
  ['how will my donation be used', 'where does food go', 'food usage'],
  ['what about expiration dates', 'expiry', 'expired food'],
  ['how to package food', 'packaging'],
  ['cooked food donation', 'can i donate cooked food'],
  ['thank you', 'thanks', 'thank u'],
  ['bye', 'goodbye', 'see you'],
];

const REPLIES = [
  'Hello! Welcome to FoodDonate 🌿 How can I help you today?',
  "I'm doing great! Ready to help connect surplus food with people who need it.",
  "I'm FoodBot, the virtual assistant for the Food Waste Management platform.",
  "The Food Waste Management platform connects food donors with local NGO partners and delivery volunteers to reduce food waste and feed the underprivileged.",
  "To donate food, sign up or log in, then click 'Donate' in the navigation bar. Fill in the form with food details, quantity, expiry, and your location.",
  "You can donate raw food, cooked food, or packed/canned food. Please ensure it's fit for consumption.",
  "Your donated food is picked up by our NGO partners and delivered to people in need via our delivery volunteers.",
  "Please only donate food that hasn't expired. The platform will reject donations with a past expiry date/time.",
  "For cooked food, use clean, sealed containers. For raw/packed food, keep original packaging intact.",
  "Yes! Cooked food donations are welcome as long as they are freshly prepared, properly packaged, and not expired.",
  "You're welcome! 😊 Feel free to ask anything else.",
  "Goodbye! Thank you for being part of the movement to reduce food waste. 🌱",
];

function findBestMatch(input) {
  const normalized = input.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  let bestIdx = -1;
  let bestScore = 0;

  for (let i = 0; i < PROMPTS.length; i++) {
    for (const keyword of PROMPTS[i]) {
      if (normalized.includes(keyword)) {
        const score = keyword.length;
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }
    }
  }

  if (bestIdx >= 0) return REPLIES[bestIdx];
  return "Sorry, I'm still learning! For direct help, email us at rvustudent@rvu.edu.in or call 6363609253.";
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m FoodBot. Ask me about food donation! 🥗' },
  ]);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: 'user', text }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = findBestMatch(text);
      setTyping(false);
      setMessages((prev) => [...prev, { from: 'bot', text: reply }]);

      // TTS
      if (window.speechSynthesis) {
        const utt = new SpeechSynthesisUtterance(reply);
        utt.lang = 'en-US';
        window.speechSynthesis.speak(utt);
      }
    }, 800);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') send();
  };

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>🤖 FoodBot</span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'transparent', color: 'white', fontSize: '1.2rem', padding: 0 }}
            >
              ✕
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from === 'user' ? 'user' : ''}`}>
                <div className="msg-text">{m.text}</div>
              </div>
            ))}
            {typing && (
              <div className="msg">
                <div className="msg-text" style={{ fontStyle: 'italic', color: '#999' }}>
                  FoodBot is typing…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything…"
            />
            <button onClick={send}>Send</button>
          </div>
        </div>
      )}
      <button className="chatbot-toggle" onClick={() => setOpen((v) => !v)} title="Chat with FoodBot">
        💬
      </button>
    </div>
  );
}
