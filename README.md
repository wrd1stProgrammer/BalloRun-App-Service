
<br><br> 
임시 이미지.
![logo](https://user-images.githubusercontent.com/103496262/197355772-f4df931e-10fb-43e5-843f-04d33a04df64.JPG](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8p1vW3pwuQKJuxp6d6pw0j4fyibaNzX40Ag&s))

# 발로뛰어, 심부름하고 용돈 벌자!

걸어서 배달을 해보세요!
+설명 추가..
<br><br>
## [🚀발로뛰어 다운로드](https://)
<br>

# 📖 목차 
 - [개요](#개요) 
 - [개발 환경](#개발-환경)
 - [사용 기술](#사용-기술)
 - [아키텍처](#시스템-아키텍처) 
 - [프로젝트 목적](#프로젝트-목적)
 - [화면 구성](#화면-구성)
 -  [핵심 기능](#핵심-기능)
    - [로그인](#로그인)
 - [CI/CD](#cicd)
    - [무중단 배포](#무중단-배포)


## 📃개요
**발로뛰어**는 심부름 배달을 위한 앱 애플리케이션 입니다.<br> 


## 개발 환경

![MacOS](https://img.shields.io/badge/macOS-M4-black?style=flat&logo=macos) ![VSCode](https://img.shields.io/badge/vscode-blue?style=flat&logo=VisualStudioCode) ![GitHub](https://img.shields.io/badge/github-606060?style=flat&logo=github) ![Docker](https://img.shields.io/badge/Docker-ADD8E6?style=flat&logo=docker) ![Xcode](https://img.shields.io/badge/Xcode-147EFB?style=flat&logo=xcode)

 - MacOS M4
 - Visual Studio Code
 - GitHub
 - Docker
 - Xcode

## 사용 기술

### 백엔드
- Node.js
- Express.js
- JavaScript
- Socket (WebSocket)

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript) ![Socket](https://img.shields.io/badge/Socket-000000?style=flat&logo=websocket)

### 프론트엔드
- React Native
- TypeScript
- Redux
- MMKV

![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript) ![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat&logo=redux) ![MMKV](https://img.shields.io/badge/MMKV-000000?style=flat&logo=mmkv)

### 빌드 툴
- Expo CLI

![Expo CLI](https://img.shields.io/badge/Expo_CLI-000020?style=flat&logo=expo)

### 데이터베이스
- MongoDB
- Cloudinary
- Redis

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb) ![Cloudinary](https://img.shields.io/badge/Cloudinary-0F1419?style=flat&logo=cloudinary) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis)

### 인프라
- AWS EC2
- GitHub Actions
- Docker
- DockerHub
- RabbitMQ

![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF8C00?style=flat&logo=amazonec2) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=githubactions) ![Docker](https://img.shields.io/badge/Docker-ADD8E6?style=flat&logo=docker) ![DockerHub](https://img.shields.io/badge/DockerHub-0DB7ED?style=flat&logo=docker) ![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat&logo=rabbitmq)


## 시스템 아키텍처
임시
![시스템 아키텍처](https://user-images.githubusercontent.com/103496262/200223486-3f5407ab-cf76-4acf-acae-a5760c9af559.png)



## Server 아키텍처 
임시
![아키텍처](https://user-images.githubusercontent.com/103496262/197343496-40279a8a-7ee3-4360-b1e5-679379bacd90.JPG)


## E-R 다이어그램
비관계형이라 필요없음 대안 찾아봄



## 프로젝트 목적
실서비스가 가능한 애플리케이션 구축을 중점으로 배포와 설계, 기술적고민을 경험하고 직접 트래픽을 경험하는 것을 목표로 시작했습니다.<br>
?? 개발의 전반적인 지식을 쌓으려고 했습니다. (추가 예정)



## 화면 구성💻


## 핵심 기능⭐
<예시>
### 🌠로그인
- 소셜 로그인
    - 소셜 로그인 구현을 위해 스프링 시큐리티와, OAuth2 인증방식을 사용했으며, 엑세스 토큰으로 받아오는 유저 정보를 커스텀하여 사용하기 위해 Oauth2UserService 인터페이스를 상속받아 CustomOauth2UserService 클래스를 구현하였습니다. <br> [CustomOauth2UserService](https://github.com/JaeJinByun/MoCo/blob/986566e2fe78b7bab74394fa0f3650f85186adc2/src/main/java/com/board/board/service/user/CustomOAuth2UserService.java#L25)
- 일반 로그인
    -  자체 로그인 방식으로는 회원가입시 입력한 비밀번호를 해시 암호화 알고리즘을 적용하여 나온 해시값을 DB에 저장합니다.
    - 로그인시 사용한 해시 알고리즘을 찾아 비밀번호의 정합성을 검증합니다. <br> [UserService](https://github.com/wlswo/MoCo/blob/df49bb214d4e8429045f7a1b1f808d82c8189235/src/main/java/com/board/board/service/user/CustomOAuth2UserService.java#L24-L70)



### CI/CD
반복적인 프로세스를 줄이고 유지보수의 편리함을 위해 지속적 통합과 지속적 배포 파이프라인을 구축하였습니다.

깃 허브액션이 master 브랜치로 push된 code를 감지하여 생성한 스크립트 설정파일에 따라 jar 파일로 빌드후 도커 이미지화 시킵니다.

도커 이미지화된 도커파일은 도커 이미지 저장소인 도커 허브로 push 됩니다.

push가 완료되면 ec2 인스턴스가 해당 도커 파일을 pull 하게 되며 실행중이었던 node.js 도커파일을
정지 -> 컨테이너 삭제 -> 새로 내려받은 도커파일 실행 순으로 작업을 진행합니다.

### 무중단 배포

nginx를 도입하여 무중단 배포 환경을 구현하였습니다.
- 새로운 버전의 애플리케이션이 배포되면 사용하지 않는 포트를 확인하여 docker로 구동시킵니다.
    - ex)  8080포트가 사용중이면 8081 / 8081번 포트가 사용중이면 8080으로 구동시킵니다.
- 구동된 앱의 health 를 체크하여 서버의 상태를 확인합니다.
-  정상 배포가 확인되면 nginx의 리버스 프록시 대상을 신규 버전의 앱의 포트로 변경합니다.
-  사용중이던 컨테이너와 이미지를 삭제 하여 서버 교체를 마무리 합니다.

scipt 예시 (작성예정)
[배포 스크립트](https://github.com/JaeJinByun/MoCo/blob/a4cada0878e963cb8260effbf357f7eaced211cc/.github/workflows/gradle.yml#L59-L111)


---

