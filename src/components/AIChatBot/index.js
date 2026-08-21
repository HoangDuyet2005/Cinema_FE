import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./styles.scss";

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Xin chào! 👋 Tôi là <b>Trợ lý AI World Cinema</b>.<br>Tôi có thể giúp bạn tra cứu phim đang chiếu, phim sắp chiếu, lịch chiếu theo chi nhánh rạp và hỗ trợ link đặt vé nhanh chóng. Bạn cần hỗ trợ gì hôm nay?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUser = useSelector(
    (state) => state.authReducer?.currentUser || state.usersManagementReducer?.successInfoUser
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = typeof textToSend === "string" ? textToSend : inputText;
    if (!text.trim() || isLoading) return;

    const userMsg = { sender: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const userId = currentUser?.data?.id || currentUser?.id || 1;
      const res = await axios.post("http://localhost:5001/handle_message", {
        message: text.trim(),
        user_id: userId,
      });

      const botReply = res.data?.response || "Xin lỗi, tôi không thể xử lý câu hỏi lúc này.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("AI Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Xin lỗi, hiện tại dịch vụ AI đang bận hoặc chưa khởi động. Bạn vui lòng thử lại sau giây lát!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (promptText) => {
    handleSendMessage(promptText);
  };

  return (
    <>
      {/* Nút tròn nổi mở ChatBot sử dụng LogoAI.png */}
      {!isOpen && (
        <button
          className="ai-chatbot-launcher"
          onClick={() => setIsOpen(true)}
          title="Trò chuyện với World Cinema AI"
          aria-label="AI Chatbot"
        >
          <span className="badge-ai">AI</span>
          <img
            src="/img/LogoAI.png"
            alt="World Cinema AI"
            className="launcher-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </button>
      )}

      {/* Cửa sổ chat AI */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-avatar">
                <img
                  src="/img/LogoAI.png"
                  alt="World Cinema AI"
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <p className="title">World Cinema AI</p>
                <p className="status">Online</p>
              </div>
            </div>
            <div className="header-actions">
              <button onClick={() => setIsOpen(false)} title="Đóng">
                ✕
              </button>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="quick-prompts">
            <button className="prompt-chip" onClick={() => handlePromptClick("Danh sách phim đang chiếu tại World Cinema")}>
              🎬 Phim đang chiếu
            </button>
            <button className="prompt-chip" onClick={() => handlePromptClick("Danh sách phim sắp chiếu tại World Cinema")}>
              ⏳ Phim sắp chiếu
            </button>
            <button className="prompt-chip" onClick={() => handlePromptClick("Lịch chiếu phim hôm nay")}>
              📅 Lịch chiếu
            </button>
            <button className="prompt-chip" onClick={() => handlePromptClick("Danh sách các cụm rạp World Cinema")}>
              🏢 Danh sách rạp
            </button>
          </div>

          {/* Messages body */}
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div
                  className="msg-content"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input footer */}
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Hỏi về phim, lịch chiếu rạp World Cinema..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              autoFocus
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              title="Gửi tin nhắn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}