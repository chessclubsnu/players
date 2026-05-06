/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! 주의: 타입 에러가 있어도 빌드를 강제로 완료합니다.
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
