frontend/src/components/Card/ManagerChat.jsx

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
export default function ManagerChat({ mode, shouldFocusInput, triggerSource }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '안녕하세요! 하루핏과 함께 건강해질 준비 되셨나요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //  스크롤과 입력창 포커스를 위한 ref 2개 생성
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // 입력창 참조를 위한 ref 추가

  //state: 특수 포커스 효과가 활성화될지 여부를 제어.
  const [isSpecialFocusActive, setIsSpecialFocusActive] = useState(false);
  // 특수 포커스 시 설정되는 초기 메시지를 저장 (해제 로직에 사용)
  const [initialMessageForFocus, setInitialMessageForFocus] = useState('');
  // 특수 포커스 시 설정되는 플레이스홀더 텍스트를 저장
  const [initialPlaceholderForFocus, setInitialPlaceholderForFocus] = useState('');

  // 메시지 목록이 변경될 때마다 맨 아래로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // shouldFocusInput나 triggerSource이 변경될 때 포커스를 주도록  
  useEffect(() => {
    // shouldFocusInput 값 0보다 크거나(새로운 트리거 요청) triggerSource가 유효한 값으로 변경되었을 때 (이미 shouldFocusInput이 트리거된 후에도)
    if (shouldFocusInput > 0 && triggerSource) {
      if (inputRef.current) {
        inputRef.current.focus();

        let messageToSet = '';
        let placeholderToSet = '';

        switch (triggerSource) {
          case 'diet':
            messageToSet = "오늘 식단 기록할게요: ";
            placeholderToSet = "오늘 식단 기록을 시작해보세요!";
            break;
          case 'workout':
            messageToSet = "오늘 운동 기록할게요: ";
            placeholderToSet = "오늘 운동 기록을 시작해보세요!";
            break;
          case 'status':
            messageToSet = "오늘 상태 기록할게요: ";
            placeholderToSet = "오늘 상태 기록을 시작해보세요!";
            break;
          default:
            messageToSet = "";
            placeholderToSet = "메시지를 입력하세요...";
            break;
        }

        setInput(messageToSet); // ✅ 동적으로 메시지 설정
        setInitialMessageForFocus(messageToSet); // 초기 메시지 저장
        setInitialPlaceholderForFocus(placeholderToSet); // 초기 플레이스홀더 저장

        // 특수 포커스 효과 활성화
        setIsSpecialFocusActive(true);

        // 😥디버깅용
        console.log('ManagerChat: isSpecialFocusActive TRUE로 설정됨'); 

        // 커서를 맨 뒤로 보내기 위한 지연
        setTimeout(() => {
          inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        }, 0);

        // 중요: 특수효과 적용된 후, HomepPage에 해당 트리거 초기화 요청
        // ManagerChat 내부에서 직접 HomePage의 state를 변경할 수 없으므로, HomePage에서 이 상태를 초기화할 수 있는 콜백함수를 ManagerChat에 prop으로 넘겨줘함! 일단 여기서는 특수 포커스 활성 상태를 false로 바로 되돌림.
        // (이후 HomePage에서 shouldFocusInput을 다시 0으로 초기화하는 로직이 필요할 수 있음. 현재는 HomePage의 shouldFocusInput은 ManagerChat이 독립적 처리하지 않고, HomePage에서 Chat페이지로 전환되는 신호로 사용되므로, ManagerChat에서 초기화하지 않고 className='focused'만 제어하는 isSpecialFocusActive를 사용.)
      }
    }
  }, [shouldFocusInput, triggerSource]);  

  // input값 변경(사용자 타이핑 시작) 시 특수포커스 비활성화
  useEffect(() => {
    // 초기 메시지가 설정되어 있는 경우에만 비교
    if (isSpecialFocusActive && initialMessageForFocus && input !== initialMessageForFocus) {
      setIsSpecialFocusActive(false); 
    }
  }, [input, isSpecialFocusActive, initialMessageForFocus]);


  // 메시지 전송 처리 함수
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
    // 메시지 전송 후에는 항상 특수 포커스 효과 비활성화
    setIsSpecialFocusActive(false);

    try {
      const response = await apiClient.post('/ai/chat', {
        message: userMessage.text,
        history: historyForApi
      });
      const aiMessage = { sender: 'ai', text: response.data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { sender: 'ai', text: '죄송해요, 지금은 답변하기 어려워요.' };
      setMessages(prev => [...prev, errorMessage]);
      console.error("AI 채팅 오류:", error);
    } finally {
      setIsLoading(false);
      // 로딩이 끝난 후 다시 일반적인 포커스 유지
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


