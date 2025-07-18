// AboutUsExpanded.jsx
import React from 'react';
import './AboutUsExpanded.css'; // 방금 만든 CSS 파일을 import
import member1 from '../../assets/images/고진석님.jpg';
import member2 from '../../assets/images/구하영님.jpg';
import member3 from '../../assets/images/이가원님.jpg';


// 팀원 정보를 배열로 관리하면 나중에 수정하거나 추가하기 아주 편하네.
const teamData = [
  {
    id: 1,
    name: '[고진석]',
    role: 'Backend Developer \n Feature Planner',
    intro: '서버의 튼튼한 기반을 다집니다. \n 하루핏의 주요 기능 아이디어를 설계하고 실현합니다.',
    imageUrl: member1
  },
  {
    id: 2,
    name: '[구하영]',
    role: 'Project Manager \n Frontend Supporter',
    intro: '하루핏 프로젝트를 총괄합니다. \n 화면 디자인을 심도 있게 구현합니다.',
    imageUrl: member2
  },
  {
    id: 3,
    name: '[이가원]',
    role: 'UI/UX Designer \n Frontend ',
    intro: '사용자가 마주하는 화면을 기획합니다.\n 하루핏 앱이 더 아름답고 쓰기 편하도록 디자인합니다.',
    imageUrl: member3
  }
];


const AboutUsExpanded = ({ onClose }) => {
  return (
    <div className="about-us-content-wrapper zoom-in">
      <span className="close-button" onClick={onClose}>&times;</span>
      <h2>Our Team</h2>
      <div className="team-container">
        {teamData.map((member) => (
          <div key={member.id} className="team-member-card">
            <img src={member.imageUrl} alt="mamberImage" className="member-image" />
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
            <p className="intro-text">{member.intro}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsExpanded;