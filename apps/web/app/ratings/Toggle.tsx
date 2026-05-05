import React from 'react';
import styles from './Toggle.module.css';

// 1. Props 타입 정의
interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string; // 선택사항: 토글 옆에 표시할 텍스트
}

const Toggle = ({ isOn, onToggle, label }: ToggleProps) => {
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

      {label && <span>{label}</span>}
    </div>
  );
};

export default Toggle;