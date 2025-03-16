
<br><br> 
임시 이미지.
![logo](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8p1vW3pwuQKJuxp6d6pw0j4fyibaNzX40Ag&s)

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
 - [기술적 선택](#기술적-선택)
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


## 기술적 선택

배달앱의 특성과 요구사항을 고려하여 아래 기술들을 선택했습니다. 각 기술의 사용 목적과 구체적인 활용 사례 설명

### Redis

- **목적:** 캐싱을 통한 빠른 데이터 조회 및 실시간 처리  
- **이유:**  
  우리 앱은 배달앱 특성상 유저가 자신의 위치나 배송 현황을 빈번하게 조회하는 특성을 가집니다. 이러한 요청이 중복적으로 데이터베이스에 접근하면 부하,과금이 발생할 수 있으며, 실시간으로 변동하는 데이터를 빠르게 제공해야 합니다. Redis는 인메모리 데이터 저장소로, 디스크 기반 데이터베이스보다 월등히 빠른 응답 속도를 제공하고 데이터베이스 부하를 줄이고 유저 경험을 개선할 수 있기에 채택함.  
- **사용 사례:**  
  - **유저 위치 캐싱:** 라이더의 실시간 위치 데이터를 Redis에 캐싱하여 빠르게 조회합니다. 예: 라이더가 이동 중일 때 데이터베이스 대신 캐시에서 위치를 가져옴.  (일부 DB 접근)
  - **배송 현황 실시간 업데이트:** 주문 상태(예: "준비 중", "배달 중")를 Redis에 저장하고, 유저가 조회 시 즉시 제공하며 배달원 업데이트 시 캐시를 갱신함.  

### RabbitMQ

- **목적:** 메시지 큐를 활용한 비동기 처리 및 부하 분산  
- **이유:**  
  배달앱에서는 한 주문에 여러 배달자가 동시에 수락을 시도하거나, 피크 타임에 다수의 주문이 동시 요청될 수 있습니다. RabbitMQ는 메시지 큐를 통해 작업을 비동기적으로 처리하여 서버 응답성을 유지하고, 동시성 문제와 부하를 효과적으로 관리합니다. 이를 통해 시스템 안정성과 확장성을 확보하기 위해 채택함.  
- **사용 사례:**  
  - **주문 수락 처리:** 새 주문이 생성되면 주문 정보를 RabbitMQ 큐에 추가하고, 여러 워커가 큐를 순차적으로 소비하여 충돌을 방지하고 많은 요청을 효율적으로 처리가능.  
  - **동시 주문 부하 분산:** 피크 타임에 다수 주문이 발생 시, 큐에 요청을 쌓아 백엔드 서버가 순차적으로 처리하도록 하여 과부하를 방지합니다.  
https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/rabbitmq.jpeg

## 시스템 아키텍처
![시스템 아키텍처](https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/archi.drawio.png)


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
![CI/CD](https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/_cicd.drawio.png)

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

