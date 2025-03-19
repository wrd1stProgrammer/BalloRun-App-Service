
<br><br> 

이미지 로드 실패시 새로고침을 해보세요 ! !

![first](https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/001.jpg)

# 발로뛰어, 심부름하고 용돈 벌자!

걸어서 배달을 해보세요!
+설명 추가..
<br><br>
## [🚀발로뛰어 다운로드](https://drive.google.com/file/d/1uBQsr30guslfm38HbrAQWMXV6wStFYUm/view?usp=drive_link)
!!dev 서버 디버그용 apk Link

<br>
<img src="https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/logo_final.png" width="200">

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
![rabbitMQ 아키텍쳐](https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/rabbitmq.jpeg)

## 시스템 아키텍처
![시스템 아키텍처](https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/archi.drawio.png)


## 프로젝트 목적
실서비스가 가능한 애플리케이션 구축을 중점으로 배포와 설계, 기술적고민을 경험하고 직접 트래픽을 경험하는 것을 목표로 시작했습니다.<br>
?? 개발의 전반적인 지식을 쌓으려고 했습니다. (추가 예정)



## 화면 구성💻
![first](https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/006.jpg)
![first](https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/007.jpg)
![first](https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/008.jpg)
![first](https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/009.jpg)


## 핵심 기능⭐


### 🌠로그인
- **소셜 로그인**  
  - 소셜 로그인 구현을 위해 OAuth2 인증 방식을 사용했으며, 엑세스 토큰으로 받아오는 유저 정보를 커스텀하여 사용하였습니다.  
- **일반 로그인**  
  - 자체 로그인 방식으로는 회원가입 시 입력한 비밀번호를 해시 암호화 알고리즘을 적용하여 나온 해시값을 DB에 저장하였습니다.  
  - 로그인 시 사용한 해시 알고리즘을 찾아 비밀번호의 정합성을 검증하였습니다.  
  - FCM 서비스를 이용해 전화번호 인증 기능을 활용하였습니다.

### 🌠주문 요청/조회
- **주문 요청**  
  - 사용자가 주문 요청을 보내면 `Node.js` 백엔드에서 사용자 토큰을 검증한 후 API를 호출하였습니다.  
  - 요청을 `RabbitMQ` 큐에 삽입하여 워커(컨슈머)가 비동기적으로 처리하도록 설계하였습니다.  
  - 이를 통해 주문 요청의 부하를 분산하고 안정적인 처리를 보장하였습니다.  
- **주문 조회 및 상태 업데이트**  
  - 주문 정보를 처음 조회할 때 `MongoDB`에서 데이터를 가져온 후 `Redis`에 캐싱하여 빠른 응답을 제공하였습니다.  
  - 배달 상태가 변경될 경우 `Socket`을 활용해 실시간으로 유저에게 알림을 전송하였으며, 이후 유저가 다시 조회할 때는 `Redis` 캐시가 아닌 `MongoDB`에서 최신 데이터를 가져오도록 구현하였습니다.  
  - 프론트엔드에서는 `React Native`와 `Redux`를 사용해 상태를 관리하며, 실시간 업데이트를 반영한 UI를 제공하였습니다.  
- **위치 조회**  
  - 사용자의 위치 정보를 최초 조회 시 `MongoDB`에서 가져와 `Redis`에 캐싱하여 빠른 접근을 지원하였습니다.  
  - 위치가 업데이트될 경우 `Socket`을 통해 유저에게 실시간으로 변경 사항을 전달하였으며, 이후 조회 시 `MongoDB`에서 최신 데이터를 가져와 정확성을 유지하였습니다.
 
### 🌠배달 수락
- **주문 정보 캐싱**  
  - 요청된 주문 정보를 `Redis`에 캐싱하여 배달자가 캐싱된 데이터를 UI에서 빠르게 확인하고 수락할 수 있도록 하였습니다.  
  - 주문 요청의 자동 취소와 자동 상태 변경(예: "수락 대기" → "만료")을 효율적으로 관리하기 위해 `Redis`의 TTL(Time-To-Live) 기능을 활용하여 캐시에 저장하였습니다.  
- **수락 요청 처리**  
  - 배달자의 수락 요청 시 `Redis 락`(예: Redlock)을 사용하여 여러 배달자가 동일한 주문을 동시에 수락하는 중복 문제를 방지하였습니다.  
  - 수락 요청을 `RabbitMQ` 큐에 삽입하여 워커가 순차적이고 효율적으로 처리하도록 설계하였습니다.  
  - 이를 통해 동시성 문제를 해결하고, 주문 수락 프로세스의 안정성과 처리 속도를 개선하였습니다.
 
### 🌠결제
- **카카오페이 단건 결제**
  - (mokup 코드만 작성 완료, 아직 계약 성사 전 단계)
  - `Front-End`에서 사용자가 결제 요청을 시작하면 `Back-End`로 결제 데이터를 전송하였습니다.  
  - `Back-End`는 카카오페이 단일 결제 API를 호출하여 결제 준비 요청(`/v1/payment/ready`)을 수행하고, TID(거래 고유 번호)를 발급받아 저장하였습니다.  
  - 사용자를 카카오페이 결제 페이지로 리다이렉트하여 결제를 완료하도록 하였으며, 성공 시 `/v1/payment/approve` API를 호출해 결제를 승인하였습니다.  
  - 결제 승인 후 결과를 `DB`에 저장하고, `Front-End`에 결제 완료 알림을 전송하여 UI에서 확인할 수 있도록 하였습니다.  
  - 결제 취소 요청 시 `/v1/payment/cancel` API를 호출하여 취소 요청을 처리하고, 결과를 `DB`에 반영한 후 사용자에게 알림을 전송하였습니다.  
  - 결제 요청 시 필수 파라미터(예: `cid`, `partner_order_id`, `partner_user_id`, `item_name`, `quantity`, `total_amount`, `approval_url`, `cancel_url`, `fail_url`)를 설정하여 안정적인 결제 흐름을 보장하였습니다.  
- **네이버페이 준비 중**  
  - 네이버페이 결제 기능은 현재 개발 중이며, 추후 추가될 예정입니다.
 
### 🌠이미지 업로드 기능
- **주문 관련 이미지 업로드**  
  - 사용자가 주문 요청 시 관련 사진(예: 요청사항 사진)과 비대면 배달을 위한 상세 주소 이미지를 업로드할 수 있도록 구현하였습니다.  
  - `Multer`를 사용하여 `Front-End`에서 전송된 multipart/form-data 형식의 파일을 처리하고, 임시로 서버에 저장하였습니다.  
  - 임시 저장된 파일을 `Cloudinary`에 업로드하여 클라우드 스토리지에 저장하고, 반환된 URL을 `DB`에 저장하여 주문 정보와 연결하였습니다.  
  - `Cloudinary`의 이미지 최적화 기능을 활용하여 업로드된 이미지를 자동으로 압축하고, 디바이스에서 빠르게 로드되도록 하였습니다.  
  - 업로드 완료 후, `Front-End`에 업로드 성공 여부와 이미지 URL을 반환하여 UI에서 확인할 수 있도록 하였습니다.  
  - 이미지 업로드 실패 시 `Multer`의 에러 핸들링을 통해 적절한 에러 메시지를 사용자에게 전달하였습니다.

### 🌠채팅 기능
- **실시간 1대1 채팅**  
  - 사용자가 배달자와 1대1로 소통할 수 있도록 실시간 채팅 기능을 구현하였습니다.  
  - `WebSocket`을 사용하여 클라이언트와 서버 간 양방향 통신을 설정하고, 실시간 메시지 전송을 지원하였습니다.  
  - `ChatRoom` 모델을 설계하여 두 유저(사용자와 배달자)를 하나의 채팅방에 참가시키고, 각 채팅방에 고유한 소켓 룸 ID를 부여하였습니다.  
  - 소켓 연결 시 해당 채팅방의 소켓 룸 ID를 활용하여 두 유저를 동일한 룸에 연결함으로써, 실시간으로 메시지를 주고받을 수 있도록 하였습니다.  
  - 메시지 전송 시 `WebSocket`을 통해 상대방에게 즉시 메시지를 전달하고, 메시지 데이터를 `DB`에 저장하여 채팅 기록을 유지하였습니다.  
  - 채팅방 입장 시 기존 메시지 기록을 `DB`에서 조회하여 `Front-End`에 표시함으로써, 이전 대화 내용을 확인할 수 있도록 하였습니다.  
  - 연결이 끊겼을 경우 재연결 로직을 추가하여 안정적인 채팅 환경을 제공하였습니다.  
- **알림 기능**  
  - 새로운 메시지가 도착했을 때 `FCM`(Firebase Cloud Messaging)을 활용하여 푸시 알림을 전송하도록 구현하였습니다.  
  - 사용자가 채팅방에 입장하지 않은 상태에서도 실시간으로 메시지 도착을 확인할 수 있도록 하였습니다.  
  - 사용자가 알림 끄기 기능을 선택할 경우, 해당 채팅방에 참가한 유저들의 알람 상태를 각각 관리해 상태를 변경해 불필요한 알림을 방지하였습니다.  
- **채팅방 나가기**  
  - 사용자가 채팅방에서 나갈 수 있는 기능을 구현하였습니다.  
  - 채팅방 나가기 요청 시 `ChatRoom` 모델에서 해당 유저를 제거하고, 소켓 연결을 종료하여 더 이상 메시지를 수신하지 않도록 하였습니다.  
  - 나가기 후에도 `DB`에 저장된 채팅 기록은 유지되어 필요 시 다시 조회할 수 있도록 하였습니다.  
- **실시간 UI 업데이트**  
  - `Redux`를 활용하여 최신 메시지와 대화 목록을 실시간으로 관리하였습니다.  
  - 새로운 메시지가 도착하거나 대화 상태가 변경될 때 `WebSocket` 이벤트를 통해 `Redux` 상태를 업데이트하고, 이를 `Front-End` UI에 반영하여 최신 대화 내용을 즉시 표시하였습니다.  
  - 이를 통해 사용자가 앱 내에서 실시간으로 원활한 채팅 경험을 누릴 수 있도록 하였습니다.  


### CI/CD
![CI/CD](https://github.com/wrd1stProgrammer/eighteen/blob/sub/front/src/assets/images/_cicd.drawio.png)


### 팀원
<table width="800">
<thead>
<tr>
<th width="100" align="center">이름</th>
<th width="250" align="center">역할</th>
<th width="150" align="center">Github 계정</th>
</tr> 
</thead>

<tr>
<td width="100" align="center">채민식</td>
<td width="250" align="center">BE, FE, DevOps</td>
<td width="150" align="center">	
	<a href="https://github.com/wrd1stProgrammer" target="_blank"><img src="https://img.shields.io/badge/minsik-655ced?style=social&logo=github"/></a>
</td>
</tr>

<tbody>
<tr>
<td width="100" align="center">박영서</td>
<td width="250" align="center">BE,FE </td>
<td width="150" align="center">
  <a href="https://github.com/givpro22" target="_blank"><img src="https://img.shields.io/badge/youngseo-655ced?style=social&logo=github"></a></td>
</tr>

</tbody>
---

