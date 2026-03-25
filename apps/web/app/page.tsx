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
          overflow-x: hidden;
        }

        .title {
          width: 100%;
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
          width: 500px;
          height: 500px;
          background-image: url("/image/logo.png");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0.35;
          z-index: 0;
          pointer-events: none;
        }

        .container {
          width: 1024px;
          max-width: 1024px;
          margin: 0 auto;
          
          position: relative;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 60px;
          padding: 40px;
          z-index: 1;
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