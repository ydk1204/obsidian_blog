---
title: HTTP 상태코드
description: HTTP 상태코드란 서버와 클라이언트 간의 통신 상태를 나타내는 역할
date: 2024-11-20
tags:
  - 컴퓨터공학
  - 네트워크
  - 프로토콜
  - HTTP
disqus: true
---
## HTTP 상태 코드란

일상생활에서 사용하는 <mark style="background: #FF5582A6;">신호등</mark>과 비슷하다고 생각하면 된다.<br/>
<mark style="background: #FF5582A6;">빨간불</mark>, <mark style="background: #FFB86CA6;">노란불</mark>, <mark style="background: #BBFABBA6;">초록불</mark>이 각각 다른 의미를 가지고 있듯이, HTTP 상태 코드도 서버와 클라이언트 간의 통신 상태를 나타내는 신호등 역할을 한다.

## HTTP 상태 코드의 기본 구조

HTTP 상태 코드는 3자리 숫자로 구성되어 있으며, 첫 번째 숫자에 따라 5개의 클래스로 나뉜다.
1. 1xx (정보): 요청을 받았으며 프로세스를 계속 진행한다.
2. 2xx (성공): 요청을 <mark style="background: #BBFABBA6;">성공적</mark>으로 받았으며 인식했고 수용했다.
3. 3xx (리다이렉션): 요청 완료를 위해 추가 작업 <mark style="background: #FFB86CA6;">조치가 필요</mark>하다.
4. 4xx (클라이언트 오류): 요청의 문법이 잘 못 되었거나 요청을 <mark style="background: #FF5582A6;">처리할 수 없다</mark>.
5. 5xx (서버 오류): 서버가 명백히 유효한 요청에 대해 충족을 <mark style="background: #FF5582A6;">실패했다</mark>.

좀 더 자세히 보자면,
### 1xx 정보 응답
이 클래스의 상태 코드는 임시적인 응답이다. 현재는 HTTP/1.1 명세에 정의된 1xx 상태 코드가 많이 사용되지 않는다.
- 100 Continue: 지금까지의 진행상태에 문제가 없으며 클라이언트가 계속해서 요청을 하거나 이미 요청을 완료한 경우에는 무시해도 되는 것을 알려준다.
- 101 Switching Protocols: 클라이언트가 보낸 Upgrade 요청 헤더에 대한 응답에 해당하며 서버에서 프로토콜을 변경할 것임을 알려준다.
#### Upgrad 요청 헤더
Upgrad 요청 헤더는 클라이언트가 서버에게 현재 사용 중인 프로토콜에서 다른 <mark style="background: #ABF7F7A6;">프로토콜로 전환</mark>하고 싶다는 의사를 전달하는 HTTP 헤더다. 이는 마치 대화 중에 "우리 이제부터 영어로 대화할까요?"라고 제안하는 것과 비슷하다.

예를 들어, 클라이언트가 다음과 같은 요청을 보낼 수 있다.
```text
GET /index.html HTTP/1.1 
Host: www.example.com 
Connection: Upgrade 
Upgrade: websocket
```

여기서 클라이언트는 <mark style="background: #ABF7F7A6;">현재의 HTTP 연결을 WebSocket 프로토콜로 업그레이드</mark>하고 싶다고 요청하고 있다.
<br/>
서버가 <mark style="background: #ABF7F7A6;">이 요청을 수락하면, 101 Switching Protocols 응답</mark>을 보낸다. 이는 "네, 당신의 요청을 수락하고 프로토콜을 변경하겠습니다"라는 의미다.

```text
HTTP/1.1 101 Switching Protocols 
Upgrade: websocket 
Connection: Upgrade
```

이 과정은 이미 서비스 중인 웹의 전체 프로토콜을 바꾸는 것이 아니라, 특정 연결에 대해서만 프로토콜을 변경하는 것이다. 따라서 다른 사용자들의 연결에는 영향을 미치지 않는다.
### 2xx 성공 응답
이 클래스의 상태 코드는 클라이언트의 요청이 <mark style="background: #BBFABBA6;">성공적으로 처리</mark>되었음을 나타낸다.
- 200 OK: 요청이 성공적으로 처리된 상태. 가장 자주 볼 수 있는 상태 코드다.
- 201 Created: 요청이 성공적이었으며 그 결과로 새로운 리소스가 생성됐음을 의미한다. 이는 일반적으로 POST 요청 이후에 따라온다.
- 204 No Content: 요청이 성공적으로 처리되었지만 제공할 컨텐츠가 없음을 의미한다.

### 3xx 리다이렉션 메시지
이 클래스의 상태 코드는 클라이언트가 <mark style="background: #FFB86CA6;">요청을 완료하기 위해 추가적인 동작이 필요함</mark>을 나타낸다.
- 301 Moved Permanently: 요청한 리소스의 URI가 변경되었음을 의미한다. 새로운 URI가 응답에서 제공된다.
- 302 Found: 요청한 리소스의 URI가 일시적으로 변경되었음을 의미한다. 향후 요청시 원래 URI를 계속 사용해야 한다.
- 304 Not modified: 클라이언트가 조건부 Get 요청을 했고, 리소스에 접근은 허용되지만 조건에 맞지 않아 변경되지 않았음을 나타낸다.

### 4xx 클라이언트 에러 응답
이 클래스의 상태 코드는 클라이언트에 <mark style="background: #FF5582A6;">오류</mark>가 있음을 나타낸다.
- 400 Bad Request: 서버가 요청을 이해할 수 없음을 의미한다. 클라이언트는 수정 없이 이 요청을 재전송하면 안 된다.
- 401 Unauthorized: 인증이 필요한 리소스에 대해 인증 없이 접근했을 때 발생한다.
- 403 Forbidden: 서버가 요청을 이해했지만 승인을 거부했음을 의미한다.
- 404 Not Found: 서버가 요청한 리소스를 찾을 수 없다. 브라우저에서 가장 자주 볼 수 있는 오류 중 하나이다.

### 5xx 서버 에러 응답
이 클래스의 상태 코드는 서버가 유효한 <mark style="background: #FF5582A6;">요청을 수행하지 못 했음</mark>을 나타낸다.
- 500 Internal Server Error: 서버에 오류가 발생하여 요청을 수행할 수 없다.
- 502 Bad Gateway: 게이트웨이나 프록시 역할을 하는 서버가 업스트림 서버로부터 유효하지 않은 응답을 받았음을 나타낸다.
- 503 Service Unavailalbe: 서버가 일시적으로 서비스를 제공할 수 없다. 일반적으로 유지보수를 위해 작동이 중단되거나 과부하가 걸린 서버에서 발생한다.
#### 업스트림

> [!info] 업스트림 서버
> '업스트림 서버'는 원본 서버 또는 백엔드 서버를 의미한다. 이는 마치 물이 상류에서 하류로 흐르는 것처럼, 데이터가 원본 서버에서 프록시 서버를 거쳐 클라이언트로 흐르는 것을 비유한 표현이다.


<mark style="background: #ABF7F7A6;">웹 아키텍처를 강물에 비유하자면,</mark>
1. 클라이언트(사용자의 브라우저): 강 하구
2. 프록시 서버 또는 게이트웨이: 강의 중간 지점
3. 원본 서버(업스트림 서버): 강의 상류
<br/>
502Bad Gateway 오류는 프록시 서버가 업스트림 서버로부터 잘못된 응답을 받았을 때 발생한다. <br/>
예를 들어:
1. 클라이언트가 웹 사이트를 요청한다.
2. 이 요청은 먼저 프록시 서버(예: CDN)에 도달한다.
3. 프록시 서버는 원본 서버(업스트림 서버)에 요청을 전달한다.
4. 원본 서버가 잘 못된 형식의 응답을 보내거나, 응답을 보내지 않는다.
5. 프록시 서버는 이 상황을 502 Bad Gateway 오류로 클라이언트에게 알린다.
<br/>
이는 마치 강의 중간에서 물을 정화하는 시설이 상류에서 <mark style="background: #ABF7F7A6;">오염된 물을 받아 제대로 처리할 수 없는 상황</mark>과 비슷하다고 볼 수 있다.

HTTP 상태 코드는 마치 웹 세상의 교통 신호와 같다.<mark style="background: #BBFABBA6;"> 200 OK는 초록불</mark>처럼 모든 것이 순조롭게 진행되고 있음을, <mark style="background: #FF5582A6;">404 Not Found는</mark> 길을 잃었다는 <mark style="background: #FF5582A6;">빨간불</mark>과 같다. <mark style="background: #FFB86CA6;">301 Moved Permanently</mark>는 "이 길은 막혔으니 <mark style="background: #FFB86CA6;">다른 길로 가세요</mark>"라는 안내 표지판과 비슷하다.

---


### 블로그 내 관련 문서
- [[HTTP에 대해2]]

---
### 참고 자료
출처 :
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" target="_blank">mdn</a>
- <a href="https://www.semrush.com/blog/http-status-codes/" target="_blank">semrush</a>
- <a href="https://developers.cloudflare.com/support/troubleshooting/http-status-codes/http-status-codes/" target="_blank">cloudflare</a>
- <a href="https://techcommunity.microsoft.com/blog/appsonazureblog/troubleshooting-azure-app-service-apps-using-web-server-logs/392329" target="_blank">microsoft</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade" target="_blank">mdn2</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism?v=1.1.1" target="_blank">mdn3</a>