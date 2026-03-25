"use client"; // ⭐ 이 한 줄이 서버 컴포넌트를 클라이언트 컴포넌트로 바꿔줍니다.

import React from 'react';

export default function HallOfFame() {
  return (
    <>
      {/* 스타일 설정 */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Chiron+Sung+HK:ital,wght@0,200..900;1,200..900&display=swap" 
        rel="stylesheet" 
      />
      
      <style jsx global>{`
        body {
          font-family: 'Chiron Sung HK', Arial, sans-serif;
          background: #0b1320;
          color: white;
          margin: 0;
        }

        .title {
          text-align: center;
          font-size: 40px;
          letter-spacing: 4px;
          margin: 50px 0;
          white-space: pre;
        }

        .center_logo {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background-image: url("/image/logo.png");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0.35;
          z-index: 0;
          pointer-events: none;
        }

        .container {
          position: relative;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 60px;
          padding: 40px;
          z-index: 1;

          max-width: 1200px;
        }

        .player {
          width: 260px;
          height: 420px;
          background: linear-gradient(to bottom, #ffffff 0%, #ffffff 55%, #1b2235 55%, #0f1524 100%);
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
          transition: 0.3s;
        }

        .player:hover {
          transform: translateY(-8px) scale(1.2);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.9);
        }

        .photocard {
          width: 100%;
          height: 230px;
          background-size: cover;
          background-position: center;
          filter: grayscale(20%);
        }

        .description {
          padding: 20px;
          text-align: center;
        }

        .name {
          font-size: 22px;
          margin-bottom: 10px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .info {
          font-size: 14px;
          color: #d4d7e2;
          line-height: 1.6;
          white-space: pre;
        }

        /* ⭐ 모바일 대응 (화면 너비 768px 이하일 때) */
        @media (max-width: 768px) {
          .container {
            gap: 15px; /* 모바일에서는 간격을 좁게 */
            padding: 15px;
          }

          .title {
            font-size: 24px; /* 제목 크기 축소 */
            margin: 30px 0;
          }

          .player {
            /* ⭐ 핵심: 화면 너비에서 간격을 뺀 값의 절반(2열 배치) */
            width: calc(50% - 10px); 
            height: auto; /* 높이는 콘텐츠에 맞게 자동 조절 (혹은 고정값 320px 정도) */
            min-height: 300px;
          }

          .photocard {
            height: 160px; /* 사진 영역 높이 축소 */
          }

          .name {
            font-size: 16px; /* 이름 크기 축소 */
          }

          .info {
            font-size: 11px; /* 설명 글씨 축소 */
            line-height: 1.4;
          }
      `}</style>

      {/* 화면 구조 */}
      <div className="title">
        {"명예의 전당   HALL OF FAME"}
      </div>

      <div className="center_logo"></div>

      <div className="container">
        <div className="player">
          <div 
            className="photocard" 
            style={{ backgroundImage: "url('/image/hikaru.png')" }} 
          />
          <div className="description">
            <div className="name">히카루</div>
            <div className="info">
              {"2027.3.14 아레나 나잇 우승자\nArena Night Winner"}
            </div>
          </div>
        </div>

        <div className="player">
          <div 
            className="photocard" 
            style={{ backgroundImage: "url('/image/magnus.png')" }} 
          />
          <div className="description">
            <div className="name">매그너스</div>
            <div className="info">
              {"2027.3.28 아레나 나잇 우승자\nArena Night Winner"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}