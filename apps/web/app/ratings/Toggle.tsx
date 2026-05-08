import React from 'react';
import styles from './Toggle.module.css';

// 1. Props 타입 정의
interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string; // 선택사항: 토글 옆에 표시할 텍스트
  alpha?: number; // 투명도
}

const Toggle = ({ isOn, onToggle, label, alpha }: ToggleProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
      fontFamily: "var(--font-notoSerif)"
     }}>
      {/* 토글 컨테이너 */}
      <div 
        className={`${styles.toggle_container} ${isOn ? styles.active : ''}`}
        onClick={onToggle}
        >
        {/* 움직이는 동그라미 */}
        <div className={styles.toggle_circle} />
      </div>
      
      <div className="font-light text-sm md:text-base font-inter ml-0.5 font-white"
        style={{ opacity: alpha }}>
        {label}
      </div>

    </div>
  );
};

export default Toggle;