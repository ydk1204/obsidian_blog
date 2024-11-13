---
title: HTTPS와 TLS에 대해
description: HTTPS와 TLS 핸드셰이크의 상세한 과정 및 관련 개념들
date: 2024-09-27
tags:
  - 컴퓨터공학
  - 네트워크
  - 프로토콜
  - HTTP
  - HTTPS
  - TLS
disqus: true
---
## HTTPS와 TLS 핸드셰이크의 상세한 과정 및 관련 개념들

### TLS 핸드셰이크의 기본 개념

- **TLS (Transport Layer Security)**: 인터넷 상의 통신을 위한 개인 정보와 데이터 보안을 제공하는 보안 프로토콜로, 이전의 SSL(Secure Socket Layer) 프로토콜에서 발전한 것이다. TLS는 암호화, 인증, 및 무결성을 제공한다.

---
### TLS 핸드셰이크 과정

TLS 핸드셰이크는 클라이언트와 서버가 안전한 통신을 설정하기 위해 수행하는 일련의 단계다. <br>
아래는 이 과정의 설명이다.

#### 1. **Client Hello**
- 클라이언트가 서버에게 <mark style="background: #FF5582A6;">Client Hello</mark> 메시지를 전송한다. 이 메시지에는 클라이언트가 지원하는 TLS 버전, 지원되는 암호화 알고리즘(Cipher Suites), 클라이언트 무작위 데이터, 세션 ID, 및 서버명(SNI)이 포함된다.

#### 2. **Server Hello**
- 서버는 <mark style="background: #FF5582A6;">Server Hello</mark> 메시지를 클라이언트에게 전송한다. 이 메시지에는 서버가 선택한 TLS 버전, 선택한 암호화 알고리즘, 서버 무작위 데이터, 및 서버의 TLS 인증서가 포함된다.

#### 3. **인증서 전달 및 인증**
- 서버는 자신의 TLS 인증서를 클라이언트에게 전달한다. 이 인증서는 서버의 공개 키와 도메인 소유자에 대한 정보를 포함하며, [CA(Certificate Authority)](#ca)가 서명한 것이다. 클라이언트는 이 인증서를 사용하여 서버의 신원을 확인한다. 클라이언트는 내장된 CA 공개 키로 인증서를 복호화하여 정상적으로 발급된 것인지 확인한다.

#### 4. **키 교환 (Key Exchange)**
- 클라이언트와 서버는 키 교환 알고리즘을 사용하여 대칭키(세션 키)를 생성한다.
  - **RSA 키 교환**: 클라이언트는 `premaster secret`을 생성하고, 이를 서버의 공개 키로 암호화하여 전송한다. 서버는 자신의 개인 키로 이를 복호화한다.
  - **Diffie-Hellman (DH) 및 ECDHE**: 클라이언트와 서버는 DH 매개변수를 교환하여 동일한 `premaster secret`을 생성한다. ECDHE는 타원곡선 암호를 사용한 DH 알고리즘으로, 보안성이 높고 효율적이다.

#### 5. **세션 키 생성**
- 클라이언트와 서버는 클라이언트 무작위 데이터, 서버 무작위 데이터, 및 `premaster secret`을 사용하여 대칭키인 세션 키를 생성한다. 이 세션 키는 이후의 통신에서 데이터를 암호화하고 복호화하는 데 사용된다.

#### 6. **Change Cipher Spec**
- 클라이언트와 서버는 <mark style="background: #FF5582A6;">Change Cipher Spec</mark> 메시지를 전송하여 이후의 모든 패킷이 협상된 알고리즘과 키를 사용하여 암호화됨을 알린다.

#### 7. **Finished**
- 클라이언트와 서버는 <mark style="background: #FF5582A6;">Finished</mark> 메시지를 전송하여 TLS 핸드셰이크가 성공적으로 완료되었음을 확인한다. 이제부터 모든 통신은 세션 키를 사용하여 암호화된다.

---
### 추가적인 개념들

#### Cipher Suites
- **Cipher Suites**는 클라이언트와 서버가 사용할 수 있는 암호화 알고리즘의 집합을 의미한다. 클라이언트는 <mark style="background: #FF5582A6;">Client Hello</mark> 메시지에서 지원하는 Cipher Suites를 서버에게 전송하고, 서버는 <mark style="background: #FF5582A6;">Server Hello</mark> 메시지에서 선택한 Cipher Suite를 클라이언트에게 전송한다.

#### DH 매개변수와 키 교환 알고리즘
- **Diffie-Hellman (DH)**: DH 알고리즘은 클라이언트와 서버가 공개적으로 매개변수들을 교환하여 동일한 대칭키를 생성하는 방식이다. ECDHE는 타원곡선 암호를 사용한 DH 알고리즘으로, 보안성이 높고 효율적이다.

#### 인증서와 CA
- 서버의 TLS 인증서는 서버의 공개 키와 도메인 소유자에 대한 정보를 포함하며, CA가 서명한 것이다. 클라이언트는 이 인증서를 사용하여 서버의 신원을 확인한다.

#### CA
CA는 단순 서명만 하는 것이 아니라, 인증서의 발급, 관리 및 신뢰성을 보장하는 중요한 역할을 수행한다.<br>
이는 인터넷 상의 안전한 통신과 트랜잭션을 지원하는 데 필수적인 요소이다.
##### CA의 주요역할
1. 신원확인
	- CA는 인증서를 요청하는 엔티티의 신원을 확인한다.
	- 이는 도메인 소유권, 조직 정보, 개인 정보 등 다양한 검증을 통해 이루어진다.
2. 인증서 발급
	- 인증서 요청자가 자신의 신원을 확인한 후, CA는 해당 엔티티에게 디지털 인증서를 발급한다.
	- 이 인증서에는 엔티티의 공개 키와 기타 정보가 포함되며, CA의 개인 키로 디지털 서명한다.
3. 디지털 서명
	- CA는 발급한 인증서에 디지털 서명을 한다.
	- 이 디지털 서명은 인증서의 유효성과 무결성을 보장하며, 브라우저나 다른 클라이언트가 인증서를 신뢰할 수 있도록 한다.
4. 인증서 관리
	- CA는 인증서의 전체 수명주기를 관리한다.
	- 이는 인증서의 발급, 갱신 및 해지 등을 포함한다.
	- 예를 들어, 인증서가 만료되거나 취소될 경우, CA는 이를 관리하고 알림을 제공한다.
5. 공개 키 인프라 (PKI) 유지
	- CA는 공개 키 인프라를 기반으로 운영되며, 루트 인증서와 중간 인증서를 포함한 계층 구조를 유지한다.
	- 이 계층 구조는 브라우저와 다른 클라이언트가 CA에서 발급한 인증서를 신뢰할 수 있도록 한다.

##### CA의 서명 과정
- 인증서 서명 요청 (CSR) 생성:
	- 클라이언트는 자신의 공개 키와 개인 키 쌍을 생성하고, 공개 키와 기타 정보를 포함한 CSR을 생성한다.
- CA에 요청 제출:
	- 클라이언트는 CSR을 CA에 제출하고, CA는 요청자의 신원을 확인한다.
- 인증서 발급:
	- 신원이 확인된 후, CA는 인증서를 발급하고, 자신의 개인 키로 디지털 서명을 한다.
	- 이로써 인증서가 유효하고 신뢰할 수 있음을 보장한다.

#### RSA의 취약점
- RSA 키 교환 알고리즘은 이전 버전의 TLS에서 사용되었지만, 현재는 보안 취약점으로 인해 TLS 1.3에서는 지원하지 않는다[1][6].

#### 0-RTT (Zero Round-Trip Time Resumption)
- TLS 1.3에서 도입된 기능으로, 이전에 설정된 세션을 재사용하여 초기 핸드셰이크를 생략하고 즉시 데이터 전송을 시작할 수 있다. 이는 성능을 개선하는 데 도움이 된다.

#### 해싱 알고리즘
- 해싱 알고리즘은 데이터의 무결성을 확인하는 데 사용된다. 예를 들어, SHA-256 등의 해싱 알고리즘은 원본 데이터가 변경되지 않았는지 확인하는 데 사용된다. TLS 핸드셰이크 과정에서 해싱 알고리즘은 인증서의 서명 검증과 데이터의 무결성을 확인하는 데 사용된다.

#### TLS 패킷 분석
- TLS 패킷을 분석하여 통신의 보안성을 확인할 수 있다. 예를 들어, Wireshark와 같은 도구를 사용하여 TLS 패킷을 캡처하고 디코딩할 수 있다.

---
### 예제와 도구

#### OpenSSL을 사용한 TLS 핸드셰이크 확인
- OpenSSL을 사용하여 TLS 핸드셰이크 과정을 직접 확인할 수 있다. 예를 들어, 다음 명령어를 사용하여 Google의 TLS 정보를 확인할 수 있다:

```bash
openssl s_client -connect google.com:443
```

이 명령어를 실행하면, TLS 핸드셰이크 과정이 출력되며, 사용된 프로토콜 버전, 암호화 알고리즘, 세션 정보 등을 확인할 수 있다

#### DH 매개변수 생성
- OpenSSL을 사용하여 DH 매개변수를 생성할 수 있다. 예를 들어, 다음 명령어를 사용하여 DH 매개변수를 생성할 수 있다:

```bash
openssl dhparam -out dhparams.pem 2048
```

이 명령어는 2048비트의 DH 매개변수를 생성하여 `dhparams.pem` 파일에 저장한다

---
### 중요 개념 요약

- **Cipher Suites**: 클라이언트와 서버가 사용할 수 있는 암호화 알고리즘의 집합.
- **키 교환 알고리즘**: RSA, DHE, ECDHE 등이 있으며, 각 알고리즘의 보안성과 효율성을 고려하여 선택한다.
- **인증서와 CA**: 서버의 신원을 확인하는 데 사용되는 인증서와 CA의 역할.
- **RSA의 취약점**: RSA 키 교환 알고리즘의 보안 취약점으로 인해 TLS 1.3에서는 지원하지 않는다.
- **0-RTT**: 이전에 설정된 세션을 재사용하여 초기 핸드셰이크를 생략하고 즉시 데이터 전송을 시작할 수 있는 기능.
- **해싱 알고리즘**: 데이터의 무결성을 확인하는 데 사용되는 알고리즘.
- **TLS 패킷 분석**: TLS 통신의 보안성을 확인하는 데 사용되는 도구와 방법.

---
### 블로그 내 관련 문서
- [[HTTP에 대해2]]

---
### 참고 자료
출처 : <br>
- <a href="https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/" target="_blank">cloudflare</a>
- <a href="https://velog.io/@seyoung755/TLS-handshake%EA%B0%80-%EC%9D%BC%EC%96%B4%EB%82%98%EB%8A%94-%EA%B3%BC%EC%A0%95 " target="_blank">seyoung755</a>
- <a href="https://brunch.co.kr/@sangjinkang/38 " target="_blank">sangjinkang</a>
- <a href="https://lesstif.gitbooks.io/web-service-hardening/content/ssl-tls-https.html " target="_blank">견고한 웹 서비스 만들기</a>
- <a href="https://aws-hyoh.tistory.com/39 " target="_blank">네트워크엔지니어환영의기술블로그</a>
- <a href="https://velog.io/@developerwan/TLS-1.2%EC%97%90%EC%84%9C-%ED%95%B8%EB%93%9C-%EC%89%90%EC%9D%B4%ED%81%AC-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8F%99%EC%9E%91%ED%95%A0%EA%B9%8C " target="_blank">developerwan</a>
- <a href="https://sunrise-min.tistory.com/entry/TLS-Handshake는-어떻게-진행되는가" target="_blank">내가보기위한기록</a>
- <a href="https://docs.netapp.com/ko-kr/e-series/vcenter-plugin/vc-olh-use-ca-signed-certificates.html" target="_blank">NetApp</a>
- <a href="https://www.digicert.com/kr/faq/code-signing-trust/what-is-code-signing" target="_blank">digicert</a>
- <a href="https://docs.netapp.com/ko-kr/e-series/vcenter-plugin/vc-olh-use-ca-signed-certificates.html" target="_blank">NetApp</a>
- <a href="https://guide.ncloud-docs.com/docs/privateca-info" target="_blank">ncloud</a>
- <a href="https://www.digicert.com/kr/faq/compliance/what-is-a-certificate-authority-ca" target="_blank">digicert2</a>
