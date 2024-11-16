---
title: Base64
description: Base64란 무엇인가?
date: 2024-11-16
tags:
  - 컴퓨터공학
  - 네트워크
  - 인코딩
disqus: true
---
## Base64란 무엇인가?

Base64는 이진 데이터를 텍스트로 인코딩하는 방식이다. 컴퓨터의 세계에서 이진 데이터(0과 1로 이루어진 데이터)를 사람이 읽을 수 있는 텍스트로 변환하는 도구라고 생각하면 된다.

### 장점
1. 데이터 호환성 향상
	- 바이너리 데이터를 텍스트 기반 프로토콜에서 안전하게 전송할 수 있다.
	- 이메일 첨부 파일이나 HTML/CSS에 이미지를 임베딩할 때 유용하다.
1. 프로토콜 제한 우회
	- 일부 레거시 시스템에서 7비트 또는 6비트 데이터만 허용하는 경우, Base64를 사용하여 8비트 데이터를 전송할 수 있다.
2. HTTP 요청 감소
	- 작은 이미지를 Base64로 인코딩하여 HTML에 직접 포함시키면, 별도의 HTTP 요청이 필요 없어 페이지 로딩 시간을 줄일 수 있다.
3. 데이터 무결성
	- 인코딩 과정에서 정보 손실이 없어 원본 데이터를 그대로 보존할 수 있다.
4. 크로스 플랫폼 호환성
	- 대부분의 프로그래밍 언어에서 Base64 인코딩/디코딩 기능을 제공하여 시스템 간 호환성이 높다.

### 단점
1. 데이터 크기 증가
	- 인코딩된 데이터는 원본보다 약 33% 더 커진다. 이는 저장 공간과 대역폭 사용량을 증가 시킨다.
2. 성능 저하
	- 인코딩과 디코딩 과정에서 추가적인 CPU 리소스가 필요하다.
	- 대량의 Base64 데이터를 포함하면 페이지 로딩 시간이 늘어날 수 있다.
3. 캐싱 문제
	- Base64로 인코딩된 이미지는 HTML이나 CSS에 직접 포함되어 브라우저 캐싱의 이점을 활용할 수 없다.
4. SEO 및 사용성 저하
	- Base64로 인코딩된 이미지는 별도의 URL이 없어 검색 엔진 최적화(SEO)에 불리할 수 있다.
5. 보안 취약성
	- Base64는 인코딩 방식일 뿐 암호화가 아니므로, 민감한 정보 보호에는 적합하지 않다
6. 브라우저 호환성
	- 일부 구형 브라우저에서는 Base64 인코딩을 지원하지 않을 수 있다.
7. 디버깅 어려움
	- Base64로 인코딩된 데이터는 사람이 읽기 어려워 디버깅이 복잡해질 수 있다.


---
## 작동 원리

Base64는 64개의 안전한 문자(A-Z, a-z, 0-9, +, /)를 사용하여 모든 종류의 데이터를 표현한다. 이는 마치 우리가 26개의 알파벳으로 모든 단어를 만드는 것과 비슷하다. <br/>

작동 과정을 간단히 설명하면 다음과 같다.
1. 데이터를 <mark style="background: #FF5582A6;">3바이트씩</mark> 나눈다.
2. 각 3바이트(24비트)를 <mark style="background: #FF5582A6;">6비트씩 4개 그룹</mark>으로 나눈다.
3. 각 6비트 그룹을 Base64 문자로 변환한다.
<br/>
예를 들어, "Cat" 이라는 단어를 인코딩 한다고 생각해보자.
1. C = 01000011
2. a = 01100001
3. t = 01110100
이를 6비트씩 나누면: 010000 110110 000101 110100
<br/>
이제 각 6비트를 Base64 문자로 변환하면: Q2F0 <br/>
따라서 "Cat"은 Base64로 "Q2F0"가 된다.<br/>

다시 한번 정리하면,
1. 64개의 안전한 문자 사용: Base64 A-Z, a-z, 0-9, 그리고 '+'와 '/'를 사용한다. 총 64개의 문자로 이루어져 있어서 'Base64'라고 부른다.
2. 3바이트씩 나눈 뒤 그룹화: 3바이트(24비트)의 데이터를 6비트씩 4개 그룹으로 나눈다. 각 그룹은 0~63 사이의 값을 가지게 되고, 이 값에 해당하는 Base64 문자로 변환된다.
3. 패딩 처리: 입력 데이터의 길이가 3의 배수로 떨어지지 않는 경우 <mark style="background: #FF5582A6;">패딩</mark> 표시를 한다.

---
## 패딩?
6비트씩 4개 그룹으로 완전히 나눠지지 않는 경우에 패딩(padding)이 필요하다.

Base64 인코딩은 3바이트(24비트)의 데이터를 4개의 6(bit)비트 그룹으로 변환하는 것을 기본으로 한다. 하지만 실제 데이터의 길이가 항상 <mark style="background: #FF5582A6;">3의 배수인 바이트</mark>(byte)로 떨어지지는 않는다. 이런 경우에 패딩(=)이 필요하다.

### 패딩 처리 방법
- 2바이트만 남은 경우:
	- 16비트의 데이터가 남는다.(1바이트(byte) = 8비트(bit))
	- 이를 6비트씩 나누면 6비트, 6비트, 4비트가 된다.
	- 마지막 4비트에 2개의 0을 추가해 6비트로 만든다.
	- 결과적으로 3개의 Base64 문자가 생성되고, 마지막에 '=' 하나를 추가한다.
- 1바이트만 남은 경우:
	- 8비트의 데이터가 남는다.
	- 이를 6비트로 나누면 6비트와 2비트가 된다.
	- 마지막 2비트에 4개의 0을 추가해 6비트로 만든다.
	- 결과적으로 2개의 Base64 문자가 생성되고, 마지막에 '=' 두개를 추가한다.
### 패딩 예시
"Cat"과 "Hello" 라는 단어로 예시를 만들어 보자.
#### Cat 예시
"Cat"은 3바이트이므로 패딩이 필요없다.

```text
C        a        t 
67       97       116 (ASCII 값) 
01000011 01100001 01110100 (2진수) 
010000110110000101110100   (모든 비트 연결)
010000 110110 000101 110100 (6비트씩 나눔) 
Q 2 F 0 (Base64 인코딩)
```


#### Hello 예시
```text
H        e        l        l        o
72       101      108      108      111 (ASCII 값) 
01001000 01100101 01101100 01101100 01101111 (2진수)
0100100001100101011011000110110001101111 (모든 비트 연결)
010010 000110 010101 101100 011011 000110 1111 (6비트씩 나눔) 
010010 000110 010101 101100 011011 000110 111100 (마지막 그룹에 0추가해서 6비트)
SGVsbG8= (Base64 인코딩)
```

"Hello"는 5바이트(40비트)이다. Base64 인코딩은 3바이트(24비트)씩 처리하므로, 마지막에 2비트가 남는다.
- 앞의 3바이트(24비트)는 완전히 처리된다: SGVs
- <mark style="background: #FF5582A6;">남은 2바이트</mark>(16비트)와 추가된 2비트의 0:
	- 16비트: 0110111101101111
	- 추가된 2비트: 00
	- 총 18비트: 011011110110111100
	- 이를 6비트씩 나누면: 011011 110110 111100
	- 변환 결과: bG8
마지막 6비트 그룹(111100)은 원래 데이터에 없던 2비트의 0이 추가된 것이다. 이를 표시하기 위해 패딩 문자 '='를 하나 추가한다.


#### 만약 C만 있다면(1바이트)
```text
C 
67 (ASCII 값) 
01000011 (2진수) 
010000 110000 (6비트로 나누고, 마지막에 4비트 추가) 
Q w = = (Base64 인코딩, 마지막에 '==' 추가)
```


### 패딩의 의미
패딩 문자 '='는 디코더에게 중요한 정보를 제공한다.
- '=' 하나는 원본 데이터의 <mark style="background: #FF5582A6;">마지막 그룹이 2바이트</mark>였음을 의미한다.
- '=' 두 개는 원본 데이터의 <mark style="background: #FF5582A6;">마지막 그룹이 1바이트</mark>였음을 의미한다.
이를 통해 디코더는 정확히 몇 비트가 의미 있는 데이터인지 알 수 있고, 나머지 패딩 비트는 무시할 수 있다.


### 주의사항
1. 패딩은 인코딩된 문자열의 길이가 항상 <mark style="background: #FF5582A6;">4의 배수</mark>가 되도록 보장한다.
2. 일부 Base64 구현에서는 패딩을 생략하기도 한다. 이 경우, 디코더는 문자열의 길이를 기반으로 원본 데이터의 길이를 추론해야 한다.
3. JWT(JSON Web Token)와 같은 일부 응용 프로그램에서는 URL 안전 Base64 변형을 사용하며, 여기서는 '+' 대신 '-', '/' 대신 "아래밑줄"를 사용한다.
#### URL-safe Base64의 패딩
URL-safe Base64에서 패딩을 제거할 경우, 디코딩 과정에서 원래 데이터의 길이를 정확하게 복원하는 문제는 다음과 같이 해결된다.
1. 문자열 길이를 이용한 추론: 인코딩된 문자열의 길이를 통해 원본 데이터의 길이를 추론할 수 있다. Base64로 인코딩된 데이터의 길이는 항상 4의 배수임으로, 이를 이용해 패딩의 수를 유추할 수 있다.
2. 추가 정보 제공: 일부 구현에서는 원본 데이터의 길이 정보를 별도로 전달하거나, 인코딩된 문자열에 추가 정보를 포함시킨다.
3. 컨텍스트 기반 해석: 많은 경우, 디코딩 된 데이터의 형식이나 구조가 미리 알려져 있어, 이를 바탕으로 정확한 길이를 유추할 수 있다.
4. 패딩 문자 대체: 일부 구현에서는 패딩 문자 '='를 URL에 안전한 다른 문자(예:'.')로 대체하여 사용한다.
5. 길이 정보 인코딩: 일부 고급 구현에서는 원본 데이터의 길이 정보를 인코딩된 문자열의 일부로 포함시킨다.

### 패딩의 중요성
1. 길이 정보 제공: 패딩은 디코더에게 원본 데이터의 정확한 길이를 알려준다. 'SGVsbG8='에서 '='는 마지막 그룹에 2비트가 추가되었음을 의미한다.
2. 그룹화 유지: Base64는 4글자 단위로 그룹화된다. 패딩은 이 그룹화를 유지하여 디코딩 과정을 단순화 한다.
3. 데이터 무결성: 패딩은 인코딩된 데이터가 완전한지 확인하는 데 도움을 준다. 패딩이 잘못되면 데이터가 손상되었을 가능성이 있다.
4. 호환성: 일부 시스템은 패딩이 있는 Base64만 처리할 수 있다. 패딩을 사용함으로써 다양한 시스템과의 호환성을 보장한다.


---

## Base64 사용

### JWT에서 사용

JWT(JSON Web Token)에서 Base64는 중요한 역할을 한다.
1. 헤더와 페이로드 인코딩: JWT의 헤더와 페이로드 부분은 <mark style="background: #ABF7F7A6;">Base64Url(URL 안전 버전의 Base64)</mark>로 인코딩 된다.
2. 가독성과 전송 용이성: Base64 인코딩은 JWT를 URL에 포함시키거나 HTTP 헤더로 전송할 때 안전하고 편리하게 만든다.
3. 데이터 무결성: Base64 인코딩은 JWT의 서명 부분과 함께 사용되어 <mark style="background: #ABF7F7A6;">토큰의 무결성</mark>을 보장한다.


### 웹 개발
Base64를 HTML이나 CSS에 직접 이미지를 삽입할 때 사용하는데 이유는 여러 가지 있다.
1. URL 안전성: Base64는 <mark style="background: #ADCCFFA6;">URL에 안전한 문자만 사용</mark>한다. 이는 특수 문자나 공백 등으로 인한 URL 인코딩 문제를 피할 수 있게 해준다.
2. 데이터 무결성: 이미지 데이터를 Base64로 인코딩하면 텍스트 형태로 변환되어 HTML이나 CSS 파일에 직접 포함될 수 있다. 이는 <mark style="background: #ADCCFFA6;">데이터의 무결성</mark>을 보장하며, 네트워크 전송 중 데이터 손실 위험을 줄인다.
3. HTTP 요청 감소: 이미지를 Base64로 인코딩하여 HTML이나 CSS에 직접 포함시키면, 별도의 HTTP 요청 없이 이미지를 로드할 수 있다. 이는 특히 작은 이미지나 아이콘의 경우 성능 향상에 도움이 될 수 있다.
4. 브라우저 호환성: Data URL 형식으로 이미지를 포함시키는 것은 현재 대부분의 브라우저에서 지원된다.
5. 파일 관리 간소화: 이미지를 HTML이나 CSS에 직접 포함시키면 별도의 이미지 파일을 관리할 필요가 없어진다.

>[!note] 프로젝트 만들 때 문제 생겼던 점
> 전에 프로젝트를 만들 때 서버에 이미지를 저장하고 다시 불러오는 상황마다
> 오류가 생겨서 문제를 못 찾아서 한참 헤매고 있던 때가 있었다. 여러 글을 찾아 보던 중,
> base64로 했더니 비슷한 문제를 해결했다는 글을 보고 따라 하니 신기하게도 문제가 풀렸는데, 
> 그 이유를 찾을 시간도 없이 급하게 후순위에 있던 다른 문제 해결과 기능을 제작 하는데 정신이 팔려, 
> 그때 알지 못 했던 문제와 해결 된 이유를 지금 알게 된 것 같다.

#### 웹 개발 시 base64 사용 단점
1. 파일 크기 증가: Base64 인코딩은 원본 데이터 크기를 약 <mark style="background: #FF5582A6;">33% 증가</mark> 시킨다.
2. 캐싱 문제: 이미지가 HTML이나 CSS에 직접 포함되면 개별적으로 캐시할 수 없다.
3. 성능 영향: 큰 이미지의 경우 Base64 인코딩이 오히려 <mark style="background: #FF5582A6;">성능을 저하</mark>시킬 수 있다.

---

## 코드 예시

브라우저 내장 함수인 `btoa()`와 `atob()`를 사용한다. 이 함수들은 현재 대부분의 브라우저에서 지원된다.
### app.js
```javascript
// Base64 인코딩 함수 
function encodeToBase64(str) { 
	try { 
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) { 
			return String.fromCharCode('0x' + p1); 
		})); 
	} catch (e) { 
		console.error('인코딩 중 오류 발생:', e); 
		return null; 
	} 
} 

// Base64 디코딩 함수 
function decodeFromBase64(str) { 
	try { 
		return decodeURIComponent(atob(str).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join('')); 
	} catch (e) { 
		console.error('디코딩 중 오류 발생:', e); 
		return null; 
	} 
} 

// 테스트 함수 
function testBase64() { 
	const originalText = "안녕하세요! Hello, こんにちは!"; 
	console.log("원본 텍스트:", originalText); 
	
	const encodedText = encodeToBase64(originalText); 
	console.log("인코딩된 텍스트:", encodedText); 
	
	const decodedText = decodeFromBase64(encodedText); 
	console.log("디코딩된 텍스트:", decodedText); 
	
	console.log("원본과 디코딩된 텍스트 일치 여부:", originalText === decodedText); 
} 

// 테스트 실행 
testBase64();
```
### 결과
```text
원본 텍스트: 안녕하세요! Hello, こんにちは!
인코딩된 텍스트: 7JWI64WV7ZWY7IS47JqUISBIZWxsbywg44GT44KT44Gr44Gh44GvIQ==
디코딩된 텍스트: 안녕하세요! Hello, こんにちは!
원본과 디코딩된 텍스트 일치 여부: true
```


### 부분 설명
#### encodeToBase64 함수
```javascript
function encodeToBase64(str) { 
	try { 
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) { 
			return String.fromCharCode('0x' + p1); 
		})); 
	} catch (e) { 
		console.error('인코딩 중 오류 발생:', e); 
		return null; 
	} 
} 
```

이 함수는 문자열을 Base64로 인코딩한다.
1. encodeURIComponent(str) : 먼저 입력 문자열을 <mark style="background: #FF5582A6;">URI 인코딩</mark>한다. 이는 유니코드 문자를 안전하게 처리하기 위해서이다.
2. replace() : URI 인코딩된 문자열에서 퍼센트 인코딩 된 부분을 찾아 실제 문자로 변환한다. 예를 들어, '%41'은 'A'로 변환된다.
3. btoa() : 최종적으로 변환된 문자열을 Base64로 인코딩 한다.
4. 오류 처리 : try-catch 문을 사용하여 인코딩 과정에서 발생할 수 있는 오류를 처리한다.


#### decodeFromBase64 함수
```javascript
function decodeFromBase64(str) { 
	try { 
		return decodeURIComponent(atob(str).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join('')); 
	} catch (e) { 
		console.error('디코딩 중 오류 발생:', e); 
		return null; 
	} 
} 
```

이 함수는 Base64로 인코딩된 문자열을 원래의 문자열로 디코딩한다.
1. atob(str) : Base64 문자열을 디코딩한다.
2. split().mpa() : 디코딩 된 문자열을 개별 문자로 분리하고, 각 문자를 16진수 형태의 퍼센트 인코딩으로 변환한다.
3. decodeURIComponent() : 최종적으로 URI 디코딩을 수행하여 원래의 문자열을 얻는다.
4. 오류 처리: try-catch 문을 사용하여 디코딩 과정의 오류를 처리한다.

#### URI 인코딩
URI 인코딩은 URL에서 사용할 수 없는 문자들을 안전하게 표현하기 위한 방법이다. 이는 URL 인코딩이라고도 불린다. URI 인코딩의 주요 특징과 목적은 다음과 같다.
1. 특수 문자 변환 : 
	- URL에서 특별한 의미를 가지는 문자들(예: '?', '&', '=', '#')과 URL에 직접 사용할 수 없는 문자들(예: 공백, 한글, 이모지)을 <mark style="background: #FF5582A6;">안전한 문자열</mark>로 변환한다.
2. 퍼센트 인코딩 : 
	- 변환 과정에서 특수 문자나 예약된 문자는 '%' 기호와 해당 문자의 ASCII 코드 16진수 값으로 대체된다. 예를 들어 공백 '%20'으로 변환된다.
3. 데이터 무결성 보장 :
	- URI 인코딩을 통해 모든 문자를 안전하게 URL에 포함시킬 수 있어, 데이터의 <mark style="background: #FF5582A6;">손실이나 변조 없이</mark> 전송할 수 있다.
4. 웹 애플리케이션 안정성 :
	- URI 인코딩은 웹 서버와 클라이언트 간의 안전한 데이터 전송을 가능하게 하여 웹 애플리케이션의 안정성을 높인다.
5. 보안 강화 :
	- 사용자 입력을 URL에 포함시키기 전에 인코딩함으로써 XSS(Cross-Site Scripting)와 같은 보<mark style="background: #FF5582A6;">안 취약점을 방지</mark>할 수 있다.
	- 여기서 사용자 입력을 URL에 포함시키는 경우란 HTML 폼에서 사용자 입력을 처리하는 경우와 사용자가 직접 URL을 조작하는 경우 모두 해당한다.
1. 다국어 지원 :
	- URI 인코딩을 통해 영어 외에 다른 언어 문자(예: 한글, 일본어, 중국어 등)도 URL에 안전하게 포함시킬 수 있다.

따라서 `encodeURIComponent(str)`에서 URI 인코딩은 입력된 문자열의 모든 특수 문자와 예약된 문자를 안전한 형태로 변환하는 과정을 의미한다. 이를 통해 어떤 문자열이든 URL의 일부로 안전하게 사용할 수 있게 된다.

---

### 블로그 내 관련 문서
- [[토큰 기반 인증]]
- [[리프레시 토큰]]

---
### 참고 자료
출처 :
- <a href="https://stackoverflow.com/questions/58341833/why-base64-is-used-in-jwts" target="_blank">stackoverflow</a>
- <a href="https://ko.wikipedia.org/wiki/%EB%B2%A0%EC%9D%B4%EC%8A%A464" target="_blank">wikipedia</a>
- <a href="https://www.ioriver.io/terms/base-64-encoding" target="_blank">ioriver</a>
- <a href="https://www.redhat.com/en/blog/base64-encoding" target="_blank">redhat</a>
- <a href="https://www.tutorialspoint.com/what-is-base64-encoding" target="_blank">tutorialspoint</a>
- <a href="https://bunny.net/blog/why-optimizing-your-images-with-base64-is-almost-always-a-bad-idea/" target="_blank">bunny.net</a>
- <a href="https://www.linode.com/docs/guides/javascript-base-64-decode/" target="_blank">Akamai</a>
- <a href="https://www.programiz.com/javascript/examples/encode-string-Base64" target="_blank">programiz</a>
- <a href="https://www.geeksforgeeks.org/javascript-encode-decode-a-string-to-base64/" target="_blank">geeksforgeeks</a>
- <a href="https://www.geeksforgeeks.org/explain-the-concept-of-url-encoding-describe-the-need-for-encoding-in-html/" target="_blank">geeksforgeeks2</a>
- <a href="https://www.freecodecamp.org/news/what-is-base64-encoding/" target="_blank">freecodecamp</a>
- <a href="https://dev.to/brianmmdev/what-is-base64-encoding-and-how-is-it-used-in-web-development-3p4e" target="_blank">dev.to</a>
- <a href="https://builtin.com/software-engineering-perspectives/base64-encoding" target="_blank">builtin</a>
- <a href="https://blog.shiftasia.com/base64-encode/" target="_blank">shiftasia</a>
- <a href="https://www.csscraft.dev/blog/integrating-base64-images-in-your-web-projects" target="_blank">csscraft</a>
