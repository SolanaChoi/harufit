"use client";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./IndexPage.css";
import runnerBackground from '../../assets/images/index_image.png';
import ModeDescription from '../../components/common/modeDescription.jsx';
import apiClient from '../../api/apiClient';

export default function IndexPage() {
    const [showDifficultyButtons, setShowDifficultyButtons] = useState(false);
    const [selectedMode, setSelectedMode] = useState("");
    const [nickname, setNickname] = useState("");
    const [pin, setPin] = useState("");
    const [hoveredMode, setHoveredMode] = useState('');
    const [apiMessage, setApiMessage] = useState('');
    const [isInitialState, setIsInitialState] = useState(true);

    const navigate = useNavigate();

    const difficultyModes = [
        { id: "easy", label: "EASY", color: "#C8E6C9" },
        { id: "normal", label: "NORMAL", color: "#E1BEE7" },
        { id: "hard", label: "HARD", color: "#FFCDD2" },
    ];

    const modeDescriptions = {
        easy: "편안한 시작",
        normal: "꾸준한 관리",
        hard: "강력한 변화",
    };

    // ✅✅✅ 핵심 수정 부분 ✅✅✅
    const handleModeSelect = async (mode) => {
        setSelectedMode(mode);
        setApiMessage('');

        const userNickname = localStorage.getItem('userNickname');

        // 1. 게스트 사용자인지 확인
        if (userNickname === 'Guest') {
            // 2. 게스트이면 API 호출 없이 로컬스토리지에 모드 저장 후 바로 이동
            localStorage.setItem('userMode', mode);
            navigate(`/home?nickname=Guest&mode=${mode}`);
            return; // 함수 종료
        }

        // 3. 정식 사용자일 경우에만 백엔드에 모드 변경 요청
        try {
            await apiClient.put('/users/mode', { mode });
            localStorage.setItem('userMode', mode);
            navigate(`/home?nickname=${userNickname}&mode=${mode}`);
        } catch (error) {
            setApiMessage(`오류: ${error.response?.data?.message || '모드 변경 중 오류 발생'}`);
            console.error('Mode select error:', error);
        }
    };

    const handleEnterClick = async () => {
        setApiMessage('');
        if (!nickname.trim()) {
            setApiMessage('닉네임을 입력해주세요.');
            return;
        }
        if (nickname.trim().length < 2 || nickname.trim().length > 20) {
            setApiMessage('닉네임은 2자 이상 20자 이하로 입력해주세요.');
            return;
        }
        if (!pin.trim()) {
            setApiMessage('PIN 번호를 입력해주세요.');
            return;
        }
        if (pin.length !== 4 || !/^\d+$/.test(pin.trim())) {
            setApiMessage('PIN 번호는 4자리 숫자로 입력해주세요.');
            return;
        }

        try {
            const response = await apiClient.post('/users', {
                nickname: nickname.trim(),
                pin: pin.trim(),
            });

            setApiMessage(`성공: ${response.data.message}`);
            
            localStorage.setItem('userNickname', response.data.user.nickname);
            localStorage.setItem('userPin', response.data.user.pin); // pin도 저장해주는 것이 좋습니다.
            localStorage.setItem('userMode', response.data.user.mode || 'normal');
            
            setIsInitialState(false);
            setShowDifficultyButtons(true);

        } catch (error) {
            const errorMessage = error.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
            setApiMessage(`오류: ${errorMessage}`);
            console.error('Login/Signup error:', error);
        }
    };
    
    const handleGuestMode = () => {
        setApiMessage('');
        // '게스트'로 상태를 설정해야 헤더 텍스트가 즉시 바뀝니다.
        setNickname('게스트'); 
        setPin('');
        localStorage.setItem('userNickname', 'Guest');
        localStorage.setItem('userPin', '0000');
        localStorage.setItem('userMode', 'easy');
        setIsInitialState(false);
        setShowDifficultyButtons(true);
    };

    const handleMouseEnterModeBtn = (modeId) => {
        setHoveredMode(modeId);
    };

    const handleMouseLeaveModeBtn = () => {
        setHoveredMode("");
    };

    return (
        <div className="index-container">
            <div
                className="background-image"
                style={{ backgroundImage: `url(${runnerBackground})` }}
            >
                <div className="overlay">
                    <div className="header-text">
                        {isInitialState ? (
                            <p>안녕하세요! 하루핏과 함께 건강해질 준비 되셨나요?</p>
                        ) : (
                            <p><strong>{nickname} </strong>님, 하루핏과 함께 건강해질 준비 되셨나요?</p>
                        )}
                    </div>
                    <h1 className="main-title">
                        YOUR AI HEALTH TRAINER, <br />
                        <span className="brand-name">HARU-FIT</span>
                    </h1>
                    {isInitialState && (
                        <div className="input-interaction-section">
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="닉네임을 입력해주세요"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleEnterClick()}
                                    className="input-field nickname-input"
                                />
                                <input
                                    type="password"
                                    placeholder="PIN 4자리 숫자"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleEnterClick()}
                                    maxLength="4"
                                    className="input-field pin-input"
                                />
                                <button
                                    onClick={handleEnterClick}
                                    className="submit-btn"
                                    disabled={!nickname.trim() || !pin.trim()}
                                >
                                    입장
                                </button>
                            </div>
                            <button
                                onClick={handleGuestMode}
                                className="guest-btn-inline"
                            >
                                게스트로 입장
                            </button>
                        </div>
                    )}
                    <div className="message-area-fixed">
                        {apiMessage && (
                            <p className={`api-status-message ${apiMessage.startsWith('오류') ? 'error' : 'success'}`}>
                                {apiMessage}
                            </p>
                        )}
                    </div>
                    <div className={`difficulty-buttons-container ${showDifficultyButtons ? 'show-modes' : ''}`}>
                        {difficultyModes.map((mode) => (
                            <div className="difficulty-btn-wrapper" key={mode.id}>
                                <div
                                    className={`difficulty-btn ${mode.id} ${selectedMode === mode.id ? "selected" : ""}`}
                                    style={{ backgroundColor: mode.color }}
                                    onClick={() => handleModeSelect(mode.id)}
                                    onMouseEnter={() => handleMouseEnterModeBtn(mode.id)}
                                    onMouseLeave={() => handleMouseLeaveModeBtn()}
                                >
                                    {mode.label}
                                </div>
                                <ModeDescription
                                    isVisible={hoveredMode === mode.id}
                                    description={modeDescriptions[mode.id]}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}