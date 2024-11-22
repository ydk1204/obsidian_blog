---
title: HTTP 메서드 PUT과 PATCH
description: HTTP 메서드 중 PUT과 PATCH에 대해 알아보자
date: 2024-11-22
tags:
  - 컴퓨터공학
  - 네트워크
  - HTTP
  - 메서드
disqus: true
---
## PUT 메서드

PUT 메서드는 주로 리소스를 <mark style="background: #FF5582A6;">업데이트</mark>하거나 새로운 리소스를 <mark style="background: #FF5582A6;">생성</mark>할 때 사용된다.

### PUT의 주요 특징
1. 멱등성(Idempotent): PUT 요청은 여러 번 실행해도 <mark style="background: #FF5582A6;">결과가 동일</mark>하다.
2. 전체 리소스 교체: PUT은 <mark style="background: #FF5582A6;">리소스 전체를 교체</mark>한다.
3. 리소스 생성 가능: 지정된 URI에 리소스가 <mark style="background: #FF5582A6;">없으면 새로 생성</mark>할 수 있다.

### PUT 예제
음식 주문 시스템을 예로 들어보자. 고객이 주문한 피자의 토핑을 변경하고 싶다고 가정해보자.

```text
PUT /orders/12345 HTTP/1.1 
Host: pizza.example.com 
Content-Type: application/json 

{ 
	"orderId": "12345", 
	"customerName": "흰둥이", 
	"pizza": "치즈 피자", 
	"toppings": ["올리브", "버섯", "파인애플"], 
	"size": "large", 
	"status": "준비중" 
}
```

이 요청은 주문 ID 12345의 전체 정보를 업데이트한다. 서버는 이 정보로 <mark style="background: #FF5582A6;">기존 주문을 완전히 대체</mark>한다.

---
## PATCH 메서드

PATCH 메서드는 리소스의 <mark style="background: #BBFABBA6;">부분적인 수정</mark>을 위해 사용된다.

### PATCH의 주요 특징
1. 부분 수정: 리소스의 <mark style="background: #BBFABBA6;">일부만 수정</mark>할 수 있다.
2. 비멱등성: PATCH 요청은 <mark style="background: #BBFABBA6;">멱등하지 않을 수</mark> 있다.
3. 유연성: 다양한 형식의 패치 문서를 사용할 수 있다.

### PATCH 예제
같은 피자 주문 시스템에서, 이번에는 주문 상태만 변경하고 싶다고 가정해보자.

```text
PATCH /orders/12345 HTTP/1.1 
Host: pizza.example.com 
Content-Type: application/json-patch+json 

[ 
	{ "op": "replace", "path": "/status", "value": "배달중" } 
]
```

이 요청은 주문 상태만 "배달중"으로 <mark style="background: #BBFABBA6;">업데이트</mark>한다. 다른 정보는 그대로 유지된다.

---
## PUT vs PATCH

1. 데이터 범위: PUT은 <mark style="background: #FF5582A6;">전체 리소스를 교체</mark>하지만, PATCH는 <mark style="background: #BBFABBA6;">일부만 수정</mark>한다.
2. 멱등성: PUT은 <mark style="background: #FF5582A6;">멱등</mark>하지만, PATCH는 <mark style="background: #BBFABBA6;">항상 그렇지는 않다</mark>.
3. 사용 상황:
	- PUT: 리소스 전체를 업데이트하거나 새로 생성할 때
	- PATCH: 리소스의 일부만 수정할 때

---
## 예제

Node.js와 Express를 사용한 간단한 실습 예제를 만들어보자. 이 예제는 사용자 정보를 관리하는 간단한 API다

### 프로젝트 설정
1. 새 디렉토리 생성 및 초기화
```bash
mkdir http-methods-example 
cd http-methods-example 
npm init -y
```


<br/>
2. 필요한 패키지 설치
```bash
npm install express
```


<br/>
3. 프로젝트 구조
```text
http-methods-example/ 
│ 
├── server.js 
└── package.json
```

<br/>
### 코드(server.js)
```javascript
const express = require('express');
const app = express();
app.use(express.json());

let users = [
	{ id: 1, name: '신짱구', email: 'shin@example.com', age: 5 }
];

// PUT 요청 처리
app.put('/users/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const updatedUser = req.body;
	const index = users.findIndex(user => user.id === id);
	
	if (index !== -1) {
		users[index] = { ...updatedUser, id };
		res.json(users[index]);
	} else {
		users.push({ ...updatedUser, id });
		res.status(201).json(updatedUser);
	}
});

// PATCH 요청 처리
app.patch('/users/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const updates = req.body;
	const index = users.findIndex(user => user.id === id);
	
	if (index !== -1) {
		users[index] = { ...users[index], ...updates };
		res.json(users[index]);
	} else {
		res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
	}
});

// 사용자 목록 조회 (테스트용)
app.get('/users', (req, res) => {
	res.json(users);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`));
```


이 예제에서 PUT 요청은 사용자 정보 전체를 교체하거나 새로운 사용자를 생성한다. PATCH 요청은 기존 사용자 정보의 일부만 수정한다.

### 실행
1. 서버 실행
```bash
node server.js
```


<br/>
### 테스트 방법
서버를 실행한 뒤 API 클라이언트(예: Postman) 또는 `curl` 명령어를 사용하여 테스트할 수 있다. 본 글에서는 `curl` 명령어를 상용한 테스트를 진행한다.

<br/>

>[!note] curl이란?
>curl은 다양한 프로토콜을 사용하여 데이터를 전송하는 명령줄 도구이다. 웹 개발자들이 API를 테스트하거나 HTTP 요청을 보낼 떄 자주 사용한다.


<br/>

curl의 주요 특징:
1. 다양한 프로토콜 지원 (HTTP, HTTPS, FTP 등)
2. 데이터 전송 및 수신 가능
3. 인증, 쿠키, 헤더 설정 등 다양한 옵션 제공
4. 스크립트에서 사용하기 좋음

<br/>
#### PUT 요청 테스트
- 아래와 같은 형태의 PUT 요청을 한다고 가정한다.(신짱아 추가)
```text
PUT /users/2 HTTP/1.1 
Content-Type: application/json 

{ 
	"name": "신짱아", 
	"email": "hima@example.com", 
	"age": 0
}
```


<br/>
- 터미널에 curl 명령어 입력
```bash
curl -X PUT -H "Content-Type: application/json" -d '{"name":"신짱아","email":"hima@example.com","age":0}' http://localhost:3000/users/2
```


<br/>
- 결과: 
```text
{"name":"신짱아","email":"hima@example.com","age":0}%
```

<br/>
#### PATCH 요청 테스트
- 아래와 같은 형태의 PATCH 요청을 한다고 가정한다.(신짱구 나이 30으로 변경)
```text
PATCH /users/1 HTTP/1.1 
Content-Type: application/json 

{ 
	"age": 30
}
```


<br/>

- 터미널에 curl 명렁어 입력
```bash
curl -X PATCH -H "Content-Type: application/json" -d '{"age":30}' http://localhost:3000/users/1
```


<br/>
- 결과:
```text
{"id":1,"name":"신짱구","email":"shin@example.com","age":30}%
```


<br/>
#### 사용자 목록 조회(변경 확인)
```bash
curl http://localhost:3000/users
```


<br/>

결과
```text
[{"id":1,"name":"신짱구","email":"shin@example.com","age":30},{"name":"신짱아","email":"hima@example.com","age":0,"id":2}]%
```



PUT과 PATCH 메서드를 사용하면 리소스를 효율적으로 관리할 수 있다. PUT은 전체 리소스를 한 번에 업데이트하고 싶을 때, PATCH는 일부만 수정하고 싶을 때 사용하면 된다.

<br/>
#### 주의사항
- 이 예제는 메모리 내 데이터를 사용하므로 서버를 재시작하면 변경사항이 초기화 된다.
- 실제 프로젝트에서는 <mark style="background: #FF5582A6;">데이터베이스를 사용</mark>하여 영구적으로 데이터를 저장해야 한다.
- <mark style="background: #FF5582A6;">보안, 유효성 검사</mark> 등의 추가적인 처리가 필요하다.


---
## PUT과 POST의 차이

PUT과 POST 모두 리소스를 생성할 수 있는데, 무슨 차이가 있을까?
<br/>

| 특징               | PUT                             | POST                                      |
| ---------------- | ------------------------------- | ----------------------------------------- |
| 멱등성(Idempotency) | O <br>같은 요청을 여러 번 보내도 결과가 동일하다. | X<br>같은 요청을 여러 번 보내면 여러 개의 리소스가 생성될 수 있다. |
| URI 의미           | URI로 리소스의 정확한 위치를 지정한다.         | URI가 리소스를 처리할 위치를 나타낸다.                   |
| 리소스 생성 방식        | 클라이언트가 리소스의 URI를 알고 있어야 한다.     | 서버가 새 리소스의 URI를 결정한다.                     |
| 기존 리소스 처리        | 기존 리소스가 있으면 완전히 대체한다.           | 새 리소스를 생성한다                               |
| 요청 본문            | 전체 리소스 데이터를 포함해야 한다.            | 새 리소스에 필요한 데이터만 포함할 수 있다.                 |
| 용도               | 주로 업데이트에 사용된다.                  | 새 리소스 생성에 사용된다.                           |


<br/>
### 멱등성과 URI 차이
예를 들어 PUT의 경우
```bash
curl -X PUT -H "Content-Type: application/json" -d '{"name":"신짱아","email":"hima@example.com","age":0}' http://localhost:3000/users/2
```

<br/>
이렇게 `/users/2` 라는 특정 위치에 리소스를 생성하거나 업데이트한다. 같은 요청을 여러 번 보내도 결과는 동일할 것이다. 이것이 PUT의 멱등성(idempotency)이다.

<br/>
반면 POST의 경우 일반적으로 새로운 리소스를 생성하는 데 사용되며, 서버가 새 리소스의 URI를 결정한다.
예를 들어, server.js에 다음 코드를 추가한 뒤

```javascript
// POST 요청 처리 
app.post('/users', (req, res) => { 
	const newUser = req.body; 
	const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1; 
	const userWithId = { id: newId, ...newUser }; 
	users.push(userWithId); 
	res.status(201).json(userWithId); 
});
```


<br/>
아래와 같은 curl 명령어를 입력해보자.

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"흰둥이","email":"whitey@example.com","age":2}' http://localhost:3000/users
```


<br/>
이 요청을 여러 번 보내면, 서버는 매번 새로운 리소스를 생성할 수 있다. <br/>
맨 처음에는 "id:2"로 추가되고, 한번 더 하면 "id:3"로 또 다시 흰둥이가 추가된다. 따라서 POST는 멱등하지 않다.

<br/>

요약하자면:
1. PUT은 클라이언트가 리소스의 위치(URI)를 정확하게 알고 있을 때 사용한다.
2. POST는 새 리소스를 생성할 때 사용하며, 서버가 새 리소스의 URI를 결정한다.
3. PUT은 멱등하지만, POST는 멱등하지 않다.

---
### 블로그 내 관련 문서
- [[HTTP 메서드 PUT과 PATCH]]

---
### 참고 자료
출처 :
- <a href="https://http.dev/put" target="_blank">.dev/put</a>
- <a href="https://http.dev/patch" target="_blank">.dev/patch</a>
- <a href="https://reqbin.com/req/orjagaoq/http-put-request" target="_blank">reqbin</a>
- <a href="https://en.wikipedia.org/wiki/PATCH_(HTTP)" target="_blank">wikipedia</a>
- <a href="https://www.akto.io/academy/put" target="_blank">akto</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH" target="_blank">mdn</a>
- <a href="https://www.lonti.com/blog/understanding-http-methods-in-rest-api-development" target="_blank">lonti</a>
- <a href="https://www.akto.io/academy/put-vs-post" target="_blank">akto-put-vs-post</a>
- <a href="https://sentry.io/answers/what-is-the-difference-between-post-and-put-in-http/" target="_blank">sentry</a>
- <a href="https://www.freecodecamp.org/news/http-request-methods-explained/" target="_blank">freecodecamp</a>
- <a href="https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/PUT-vs-POST-Whats-the-difference" target="_blank">theserverside</a>