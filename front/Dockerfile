# Node.js를 기반으로 React Native Metro Bundler 실행
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm install

# 프로젝트 코드 복사
COPY . .

# Metro Bundler를 위한 포트 노출
EXPOSE 8081

# Metro Bundler 실행
CMD ["npm", "start", "--", "--reset-cache"]
