# Node.js 이미지 사용
FROM node:20

# 빌드 도구 설치
#RUN apt-get update && apt-get install -y make g++ python3

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 lock 파일 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# .env 파일을 Docker 컨테이너에서도 사용할 수 있게 설정
COPY .env .env

# Express 서버 포트 노출 (5000번 사용)
EXPOSE 5001

# 서버 실행 명령어
CMD ["npm", "start"]
