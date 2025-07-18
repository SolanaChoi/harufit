import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../api/apiClient'; // API 클라이언트 import
import './ManagerChat.css';

export default function ManagerChat({ mode, shouldFocusInput, triggerSource }) {
  const [messages, setMessages] = useState([]); // ✅ 초기 메시지는 useEffect에서 동적으로 생성하므로 비웁니다.
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [isSpecialFocusActive, setIsSpecialFocusActive] = useState(false);
  const [initialMessageForFocus, setInitialMessageForFocus] = useState(''); //특수포커스 시 설정되는 초기메시지 저장 (해제 로직에 사용)
  const [initialPlaceholderForFocus, setInitialPlaceholderForFocus] = useState('');

  // ✅ 모드별 설명을 위한 객체 추가 (진석님 파일 기능)
  const modeDescriptions = {
    easy: "편안한 시작",
    normal: "꾸준한 관리",
    hard: "강력한 변화",
  };

  // 메시지 목록이 변경될 때마다 맨 아래로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // ✅ [유지] 당신이 만든, 닉네임과 모드에 따른 동적 환영 메시지 기능
  useEffect(() => {
    const userNickname = localStorage.getItem('userNickname') || '게스트';
    const userMode = localStorage.getItem('userMode') || 'normal';
    const welcomeMessage = {
      sender: 'ai',
      text: `안녕하세요! ${userNickname}님, 하루핏과 함께 건강해질 준비 되셨나요?`
    };
    setMessages([welcomeMessage]);

    const timer = setTimeout(() => {
      const modeInfoMessage = {
        sender: 'ai',
        text: `'${userMode.toUpperCase()}' 모드를 선택하셨군요. '${modeDescriptions[userMode]}'를 목표로 함께 나아가요!`
      };
      setMessages(prevMessages => [...prevMessages, modeInfoMessage]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ [병합] shouldFocusInput 또는 triggerSource가 변경될 때 입력창 포커스 및 초기 메시지/플레이스홀더 설정 (기존 특수 포커스 기능)
  useEffect(() => {
    if (shouldFocusInput > 0 && triggerSource) { // 새로운 트리거 요청이 왔다면
      if (inputRef.current) {
        inputRef.current.focus();

        let messageToSet = '';
        let placeholderToSet = '';

        switch (triggerSource) {
          case 'diet':
            messageToSet = '오늘 식단 기록할게요: ';
            placeholderToSet = '예: 아침 사과, 점심 닭가슴살 샐러드, 저녁 소고기';
            break;
          case 'workout':
            messageToSet = '오늘 운동 기록할게요: ';
            placeholderToSet = '예: 벤치프레스 60kg 3x10, 런닝 30분';
            break;
          case 'status':
            messageToSet = '오늘 상태 기록할게요: ';
            placeholderToSet = '예: 체중 70kg, 체지방률 15%';
            break;
          default:
            messageToSet = '';
            placeholderToSet = '메시지를 입력하세요...';
        }

        setInput(messageToSet);
        setInitialMessageForFocus(messageToSet); // 초기 메시지 저장
        setInitialPlaceholderForFocus(placeholderToSet); // 초기 플레이스홀더 저장
        setIsSpecialFocusActive(true); // 특수 포커스 효과 활성화


        // 커서를 맨 뒤로 보내기 위한 지연
        setTimeout(() => {
          inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        }, 0);
      }
    }
  }, [shouldFocusInput, triggerSource]);

  // ✅ [병합] input값 변경될 때(사용자 타이핑 시작 시) 특수포커스 비활성화 (기존 특수 포커스 기능)
  useEffect(() => {
    // isSpecialFocusActive가 활성화된 상태이고,
    // input 값이 초기 메시지 (initialMessageForFocus)와 달라졌을 때
    if (isSpecialFocusActive && initialMessageForFocus && input !== initialMessageForFocus) {
      setIsSpecialFocusActive(false); // 특수 효과 해제
      setInitialMessageForFocus(''); // 초기 메시지 초기화
      setInitialPlaceholderForFocus(''); // 초기 플레이스홀더 초기화
    }
  }, [input, isSpecialFocusActive, initialMessageForFocus]);


  // ✅ [유지] 진석님의 최신 API 호출 및 DB 기록 기능
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
    setIsSpecialFocusActive(false); // 메시지 전송 후 특수 포커스 해제

    try {
      const response = await apiClient.post('/ai/parse-and-log', {
        message: userMessage.text,
        history: historyForApi,
      });

      const aiReplyMessage = { sender: 'ai', text: response.data.reply };
      setMessages(prev => [...prev, aiReplyMessage]);

      if (response.data.savedData && response.data.savedData.length > 0) {
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
      inputRef.current?.focus();
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
        {/* isSpecialFocusActive 상태에 따라 'focused' 클래스 적용 */}
        <input className={`chat-input ${isSpecialFocusActive ? 'focused' : ''}`}
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isSpecialFocusActive ? initialPlaceholderForFocus : "메시지를 입력하세요..."}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading} className="chat-send-btn">전송</button>
      </form>
    </div>
  );
}
