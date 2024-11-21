---
title: HTTP 메서드 GET과 POST
description: HTTP 메서드 중 GET과 POST에 대해 알아보자
date: 2024-11-21
tags:
  - 컴퓨터공학
  - 네트워크
  - HTTP
  - 메서드
disqus: true
---
## HTTP와 메서드

### HTTP 메서드도 프로토콜인가?
GET과 POST는 프로토콜이 아닌 <mark style="background: #FF5582A6;">HTTP 메서드(HTTP Method)</mark>다.

HTTP(HyperText Transfer Protocol)가 프로토콜이고, GET과 POST는 이 HTTP 프로토콜 내에서 사용되는 요청 메서드들이다. 쉽게 설명하자면,
- 프로토콜(Protocol): HTTP/1.1과 같이 웹에서 데이터를 주고받는 방식을 정의한 <mark style="background: #ADCCFFA6;">규약</mark>
- HTTP 메서드(Method): GET, POST, PUT, DELETE 등과 같이 HTTP 프로토콜 내에서 서버에 요청을 보내는 <mark style="background: #FF5582A6;">방식</mark>을 나타낸다.

이를 실생활에 비유하면:
- 프로토콜(HTTP)은 <mark style="background: #ADCCFFA6;">우체국 시스템과 같은 전체 통신 체계</mark>이다.
- HTTP 메서드(GET/POST)는 그 시스템 내에서 우편물을 보내는 <mark style="background: #FF5582A6;">구체적인 방식(일반우편, 등기우편 등)</mark>이라고 볼 수 있다.

---
## GET 메서드

GET 메서드는 서버에서 정보를 '<mark style="background: #FF5582A6;">가져오는</mark>' 용도로 사용된다. 마치 햄버거 가게에서 <mark style="background: #FF5582A6;">메뉴판</mark>을 보는 것과 같다. 우리가 메뉴를 보고 싶다고 요청하면, 가게는 메뉴 정보를 보여준다. 이때 우리는 메뉴 정보를 변경하거나 새로운 메뉴를 추가하지 않고, <mark style="background: #FF5582A6;">단순히 정보를 받아볼 뿐</mark>이다.
### GET 메서드의 주요 특징
1. 데이터 요청에 사용된다.
2. URL에 파라미터가 노출된다.
3. 브라우저 히스토리에 남는다.
4. 북마크가 가능하다.
5. 캐시될 수 있다.
6. 데이터 길이에 제한이 있다.

---
## POST 메서드

POST 메서드는 서버로 데이터를 '<mark style="background: #FF5582A6;">보내는</mark>' 용도로 사용된다. 햄버거 가게에서 <mark style="background: #FF5582A6;">주문</mark>을 하는 것과 비슷하다. 우리가 원하는 햄버거와 음료, 사이드 메뉴를 선택해서 주문하면, 가게에서는 그 정보를 받아 처리한다. 이때 우리는 새로운 정보(주문)을 <mark style="background: #FF5582A6;">가게에 전달</mark>하고 있는거다.

### POST 메서드의 주요 특징
1. 데이터 제출에 사용된다.
2. URL에 데이터가 노출되지 않는다.
3. 브라우저 히스토리에 남지 않는다.
4. 북마크할 수 없다.
5. 캐시되지 않는다.
6. 데이터 길이에 제한이 없다.

---
## GET과 POST의 주요 차이점

### 데이터 전송 방식
- GET: URL의 쿼리 문자열로 데이터를 전송한다.
- POST: HTTP 요청의 본문에 데이터를 전송한다.
### 보안
- GET: URL에 데이터가 노출되어 상대적으로 덜 안전하다.
- POST: 데이터가 본문에 포함되어 상대적으로 더 안전하다.
### 캐싱
- GET: 요청 결과를 캐시할 수 있어 성능상 이점이 있다.
- POST: 일반적으로 캐시되지 않는다.
### 멱등성
- GET: 멱등적이다. 같은 요청을 여러 번 해도 결과가 동일하다
- POST: 멱등적이지 않다, 같은 요청을 여러 번 하면 어러 번의 작업이 수행될 수 있다.

---
## 예제

Node.js와 Express를 사용하여 예제를 만들어 보자.

### 프로젝트 설정
1. 새 프로젝트 폴더 생성:
```bash
mkdir hamburger-shop 
cd hamburger-shop
```

2. Node.js 프로젝트 초기화:
```bash
npm init -y
```

3. 필요한 패키지 설치:
```bash
npm i express cors
```


### 폴더 구조
```text
hamburger-shop/ 
│
├── server.js
└── public/
	└── index.html
```


### 코드
#### 서버코드(server.js)
```javascript
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 메뉴 데이터
const menu = {
	"햄버거": 5000,
	"치즈버거": 5500,
	"치킨버거": 6000
};

// 주문 목록
let orders = [];

// GET 요청 처리 (메뉴 조회)
app.get('/menu', (req, res) => {
	res.json(menu);
});

// POST 요청 처리 (주문하기)
app.post('/order', (req, res) => {
	const order = req.body;
	orders.push(order);
	res.status(201).json({ message: "주문이 완료되었습니다.", order: order });
});

app.listen(port, () => {
	console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
```

1. 필요한 모듈을 불러온다.
	- `express`: 웹 서버 프레임워크
	- `cors`: Cross-Origin Resource Sharing을 허용하기 위한 미들웨어
1. Express 앱을 생성하고 미들웨어를 설정한다.
	- `cors()`: 모든 출처에서의 요청을 허용한다.
	- `express.json()`: JSON 형식의 요청 본문을 파싱한다.
	- `express.static('public)`: 정적 파일을 제공한다.
1. 메뉴와 주문 데이터를 저장할 변수를 선언한다.
2. GET 요청 처리기를 만들어 메뉴를 반환한다.
3. POST 요청 처리기를 만들어 주문을 받고 처리한다.
4. 서버를 지정된 포트에서 실행한다.


#### 클라이언트 코드(public/index.html)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>햄버거 가게</title>
</head>
<body>
	<h1>햄버거 가게</h1>
	<button onclick="getMenu()">메뉴 보기</button>
	<button onclick="placeOrder()">주문하기</button>
	<div id="result"></div>
	
	<script>
		function getMenu() {
			fetch('http://localhost:3000/menu')
				.then(response => response.json())
				.then(data => {
					document.getElementById('result').innerHTML = '메뉴: ' + JSON.stringify(data);
				})
				.catch(error => console.error('에러:', error));
		}

		function placeOrder() {
			fetch('http://localhost:3000/order', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					"햄버거": 2,
					"치즈버거": 1,
					"음료": "콜라"
				}),
			})
			.then(response => response.json())
			.then(data => {
				document.getElementById('result').innerHTML = '주문 결과: ' + JSON.stringify(data);
			})
			.catch(error => console.error('에러:', error));
		}
	</script>
</body>
</html>
```

1. 간단한 HTML 구조를 만들고 두 개의 버튼을 추가한다.
2. JavaScript 함수를 정의한다.
	- `getMenu()`: 서버에 GET 요청을 보내 메뉴를 가져온다.
	- `placeOrder()`: 서버에 POST 요청을 보내 주문을 한다.
1. `fetch()` 함수를 사용하여 서버와 통신한다.
2. 응답 결과를 페이지에 표시한다.
### 실행
1. `server.js` 파일을 실행한다.
```bash
node server.js
```
2. 웹 브라우저를 열고 `htttp://localhost:3000`으로 접속한다.
3. "메뉴 보기" 버튼을 클릭하여 GET 요청을 테스트한다.
4. "주문하기" 버튼을 클릭하여 POST 요청을 테스트한다.

---
## 구조 파악

### GET 메서드 구조
GET 메서드는 마치 햄버거 가게의 <mark style="background: #FF5582A6;">메뉴판</mark>을 보는 것과 같다.
1. 구조: URL을 통해 <mark style="background: #FF5582A6;">데이터를 요청</mark>한다. 예를 들어, 
	- 'https://hamburger.com/menu?item=cheeseburger'
2. 데이터 전송: URL의 <mark style="background: #FF5582A6;">쿼리 문자열</mark>에 데이터를 포함한다.
	- '?key1=value1&key2=value2' 형식이다.
3. 길이 제한: URL 길이에 제한이 있어 일반적으로 2,000자 미만으로 사용한다.
4. 가시성: <mark style="background: #FF5582A6;">URL에 모든 데이터가 노출</mark>되어 누구나 볼 수 있다.
5. 캐싱: 브라우저나 서버에서 캐시할 수 있어 동일한 요청의 <mark style="background: #FF5582A6;">응답 속도가 빨라</mark>질 수 있다.
6. 브라우저 히스토리: URL에 데이터가 포함되어 있어 브라우저 히스토리에 남는다.
7. 데이터 타입: ASCII 문자열에만 전송 가능하다.
8. 보안: URL에 데이터가 노출되므로 비밀번호 같은 <mark style="background: #FF5582A6;">민감한 정보 전송에는 부적합</mark>하다.
9. 멱등성: 동일한 요청을 여러 번 보내도 결과가 같다.
10. 응답 코드: 성공 시 일반적으로 <mark style="background: #FF5582A6;">HTTP 상태 코드 200</mark>을 반환한다.

### POST 메서드
POST 메서드는 햄버거 가게에서 <mark style="background: #ADCCFFA6;">주문서</mark>를 작성하여 제출하는 것과 비슷하다.
1. 구조: 요청 본문(body)에 데이터를 포함하여 <mark style="background: #ADCCFFA6;">전송</mark>한다.
2. 데이터 전송: 요청 본문에 데이터를 담아 전송한다. 다양한 형식(form-data, JSON 등) 사용 가능하다.
3. 길이 제한: 요청 본문의 크기에 제한이 없어 대용량 데이터 전송이 가능하다.
4. 가시성: URL에 데이터가 노출되지 않아 <mark style="background: #ADCCFFA6;">GET보다 보안성이 높다</mark>.
5. 캐싱: 일반적으로 캐시되지 않는다. 필요시 별도 설정이 필요하다.
6. 브라우저 히스토리: 데이터가 URL에 포함되지 않아 브라우저 히스토리에 남지 않는다.
7. 데이터 타입: 문자열뿐만 아니라 <mark style="background: #ADCCFFA6;">바이너리 데이터도 전송 가능</mark>하다.
8. 보안: 데이터가 URL에 노출되지 않아 <mark style="background: #ADCCFFA6;">민감한 정보 전송에 적합</mark>하다.
9. 멱등성: 동일한 요청을  여러 번 보내면 여러 번의 작업이 수행될 수 있다.
10. 응답 코드: 성공적으로 생성된 경우 일반적으로 <mark style="background: #ADCCFFA6;">HTTP 상태 코드 201</mark>을 반환한다.

---
## HTTP 요청 구조

### GET 요청
우리가 작성한 기본 GET 요청 코드
```javascript
fetch('http://localhost:3000/menu')
```

이 코드가 실행될 때 실제로 생성되는 HTTP 요청 구조는 다음과 같다.
```text
GET /menu HTTP/1.1 
Host: localhost:3000 
User-Agent: Mozilla/5.0 
Accept: application/json 
Accept-Language: ko-KR,ko 
Accept-Encoding: gzip, deflate 
Connection: keep-alive
```


### POST 요청
```javascript
fetch('http://localhost:3000/order', { 
	method: 'POST', 
	headers: { 
		'Content-Type': 'application/json', 
	}, 
	body: JSON.stringify({ 
		"햄버거": 2, 
		"치즈버거": 1, 
		"음료": "콜라" 
	}), 
})
```

이 코드가 실행될 때 생성되는 실제 HTTP 요청 구조는 다음과 같다.
```text
POST /order HTTP/1.1 
Host: localhost:3000 
Content-Type: application/json 
Accept: application/json 
Accept-Language: ko-KR,ko 
Content-Length: 89 
Connection: keep-alive 

{ 
	"햄버거": 2, 
	"치즈버거": 1, 
	"음료": "콜라" 
}
```


우리가 `fetch()`로 작성한 간단한 코드는 브라우저에 의해 자동으로 완전한 HTTP 요청 구조로 변환된다. 개발자가 직접 모든 헤더를 작성할 필요 없이, 브라우저가 필요한 기본 헤더들을 자동으로 추가해준다.


### 주요 구성 요소
#### HTTP 요청의 기본 구조
HTTP 요청은 다음과 같은 주요 구성 요소로 이루어진다.
1. HTTP 메서드(The HTTP Method)
	- GET, POST, PUT, DELETE 등의 <mark style="background: #FF5582A6;">요청 방식</mark>을 지정한다.
2. 리소스 경로(Path to the source)
	- 웹 서버에서 요청하고자 하는 리소스의 경로다.
	- 예: 'hamburger.com'
3. 매개변수(Parameters)
	- 서버로 전달하는 <mark style="background: #FF5582A6;">추가 정보</mark>다.
	- GET 방식의 경우: '?item=cheeseburger' 와 같이 URL에 포함된다.
4. 프로토콜 버전(Protocol Version)
	- 사용하는 HTTP 프로토콜의 버전이다.
	- 예: 'HTTP/1.1'

#### 요청 헤더(Request Headers)
요청 헤더는 <mark style="background: #ADCCFFA6;">클라이언트가 서버에 전달하는 부가 정보</mark>를 포함한다.
1. Host
	- 요청하는 서버의 도메인 이름
	- 예: 'localhost:3000 '
1. User-Agent
	 - 클라이언트 프로그램 정보
	 - 예: 'Mozilla/5.0'
1. Accept
	- 클라이언트가 <mark style="background: #ADCCFFA6;">처리할 수 있는 컨텐츠 타입</mark>
	- 예: 'text/xml, text/html, text/plain, image/jpeg'
1. Accept-Language
	- 클라이언트가 선호하는 언어
	- 예: 'ko-KR,ko', 'en-US,en;q=0.5'
	- 여기서 'q=0.5'는 <mark style="background: #ADCCFFA6;">가중치</mark>를 의미하고, 1.0이 가장 높은 선호도다.
	- 'en-US,en;q=0.5'만 놓고 볼 경우, 미국 영어를 가장 선호하고, 그 다음으로 일반 영어를 선호한다는 의미이다.
1. Accept-Encoding
	- 클라이언트가 처리할 수 있는 인코딩 방식
	- 예: 'gzip, deflate, br, zstd'
2. Accept-Charset
	- 클라이언트가 지원하는 문자 인코딩
	- 예: 'ISO-8859-1, utf-8'
	- 현재는 거의 사용되지 않는다. <mark style="background: #FF5582A6;">UTF-8이 표준</mark> 되었기 때문이다.
1. Keep-Alive
	- 연결 유지 시간(초)
	- 예: 'timeout=5'
	- timeout: 연결을 5초 동안 유지
1. Connetion
	- 클라이언트와 서버 간의 연결 방식
	- 현재 연결이 끝난 후 네트워크 <mark style="background: #ADCCFFA6;">연결을 유지할지 결정</mark>하는 헤더
	- 예: 'Keep-alive'
	- Keep-alive의 경우 연결을 유지한다.



---


### 블로그 내 관련 문서
- [[HTTP 상태 코드]]

---
### 참고 자료
출처 :
- <a href="https://www.baeldung.com/cs/http-get-vs-post" target="_blank">baeldung</a>
- <a href="https://www.guru99.com/difference-get-post-http.html" target="_blank">guru99</a>
- <a href="https://www.akto.io/academy/get-vs-post" target="_blank">akto</a>
- <a href="https://www.geeksforgeeks.org/difference-between-http-get-and-post-methods/" target="_blank">geeksforgeeks</a>
- <a href="https://stackoverflow.com/questions/3477333/what-is-the-difference-between-post-and-get" target="_blank">stackoverflow</a>
- <a href="https://blog.postman.com/what-are-http-methods/" target="_blank">postman</a>
- <a href="https://apidog.com/blog/http-methods/" target="_blank">apidog</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET" target="_blank">mdn-get</a>
- <a href="https://http.dev/post" target="_blank">.dev-post</a>
- <a href="https://http.dev/get" target="_blank">.dev-get</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST." target="_blank">mdn-post</a>
- <a href="https://http.dev/accept" target="_blank">.dev-accept</a>
- <a href="https://www.holisticseo.digital/technical-seo/http-header/content-negotiation/accept-language/" target="_blank">holisticseo</a>
- <a href="https://www.geeksforgeeks.org/http-headers-keep-alive/" target="_blank">geeksforgeeks-keep-alive</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive" target="_blank">mdn-keep-alive</a>
- <a href="https://etloveguitar.tistory.com/137" target="_blank">쿼카러버의 기술 블로그</a>
- <a href="https://http.dev/accept-charset" target="_blank">.dev-accept-charset</a>
- <a href="https://http.dev/accept-encoding" target="_blank">.dev-accept-encoding</a> 