import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../api/apiClient'; // API 클라이언트 import
import './ManagerChat.css';

export default function ManagerChat({ mode, shouldFocusInput }) {
    // ✅ [수정] 첫 메시지는 useEffect에서 닉네임과 함께 동적으로 생성하므로 초기 상태를 비웁니다.
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // ✅ 모드별 설명을 위한 객체 추가
    const modeDescriptions = {
        easy: "편안한 시작",
        normal: "꾸준한 관리",
        hard: "강력한 변화",
    };

    // ✅ [수정] useEffect를 사용하여 컴포넌트가 처음 로딩될 때 환영 메시지들을 설정합니다.
    useEffect(() => {
        const userNickname = localStorage.getItem('userNickname') || '게스트';
        const userMode = localStorage.getItem('userMode') || 'normal';
        const welcomeMessage = {
            sender: 'ai',
            text: `안녕하세요! ${userNickname}님, 하루핏과 함께 건강해질 준비 되셨나요?`
        };
        // 메시지 상태를 업데이트합니다.
        setMessages([welcomeMessage]);

        // 1초 후에 모드에 대한 설명 메시지를 추가합니다.
        const timer = setTimeout(() => {
            const modeInfoMessage = {
                sender: 'ai',
                text: `'${userMode.toUpperCase()}' 모드를 선택하셨군요. '${modeDescriptions[userMode]}'를 목표로 함께 나아가요!`
            };
            setMessages(prevMessages => [...prevMessages, modeInfoMessage]);
        }, 1000); // 1초 지연

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리

    }, []); // 빈 배열을 전달하여 이 효과가 한 번만 실행되도록 합니다.


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // ✅ shouldFocusInput 로직은 현재 파일에 없으므로, 기본 포커스 로직만 유지합니다.
    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: input };

        const historyForApi = messages.map(msg => ({
            role: msg.sender === 'ai' ? 'assistant' : 'user',
            content: msg.text
        }));

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // ✅ [핵심 수정] API 호출 주소를 최신 기능인 '/ai/parse-and-log'로 변경합니다.
            const response = await apiClient.post('/ai/parse-and-log', {
                message: userMessage.text,
                history: historyForApi,
            });

            // 1. AI의 대화 응답을 먼저 추가합니다.
            const aiReplyMessage = { sender: 'ai', text: response.data.reply };
            setMessages(prev => [...prev, aiReplyMessage]);

            // 2. ✅ [핵심 수정] 백엔드에서 데이터가 성공적으로 저장되었다면, 확인 메시지를 추가합니다.
            if (response.data.savedData && response.data.savedData.length > 0) {
                // 0.5초 후에 "기록했어요!" 메시지를 띄워서 자연스럽게 보이도록 합니다.
                setTimeout(() => {
                    const successLogMessage = { sender: 'ai', text: '말씀하신 내용을 바탕으로 식단/운동 정보를 기록했어요! 👍' };
                    setMessages(prev => [...prev, successLogMessage]);
                }, 500);
            }

        } catch (error) {
            const errorMessage = { sender: 'ai', text: '죄송해요, 지금은 답변하기 어려워요.' };
            setMessages(prev => [...prev, errorMessage]);
            console.error("AI 채팅 오류:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="manager-chat-container">
            <div className={`manager-card-header ${mode}-theme`}>하루핏 AI 매니저</div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div className="bubble">{msg.text}</div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message ai">
                        <div className="bubble typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    disabled={isLoading}
                    className="chat-input"
                />
                <button type="submit" disabled={isLoading} className="chat-send-btn">전송</button>
            </form>
        </div>
    );
}