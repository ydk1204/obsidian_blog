---
title: HTTP2와 HTTP3
description: HTTP/2와 HTTP/3에 대해 알아보자
date: 2024-09-27
tags:
  - 컴퓨터공학
  - 네트워크
  - HTTP
  - 프로토콜
disqus: true
---

# HTTP/2

## HTTP/2 개요

- HTTP/2는 HTTP/1.1의 단점을 보완하고 새로운 기능을 추가하여 웹 성능을 향상 시키기 위해 개발된 프로토콜이다. 이는 구글의 SPDY 프로토콜을 기반으로 표준화되었다.

- HTTP/2는 TCP 프로토콜 위에서 동작하며, 여러 개의 데이터 요청을 하나의 TCP 연결을 통해 병렬로 전송할 수 있는 멀티플렉싱을 지원한다.
## HTTP/2 장점

- **멀티플렉싱**: 여러 개의 요청과 응답을 하나의 TCP 연결에서 동시에 전송할 수 있어, Head-of-Line Blocking(HOLB) 문제를 부분적으로 해결한다. 이는 여러 스트림을 통해 데이터를 전송할 수 있게 해준다.

- **헤더 압축**: HTTP 메시지의 헤더를 압축하여 전송하는 HPACK 알고리즘을 사용한다. 이는 중복되는 헤더 값을 테이블에 저장하고 참고하는 방식으로, 헤더의 크기를 줄여준다.

- **바이너리 프로토콜**: 텍스트 프로토콜에서 바이너리 프로토콜로 전환되어, 명령어를 더 단순하게 구현할 수 있다.

- **서버 푸시**: 서버는 요청되지 않았지만 향후 요청에서 예상되는 추가 정보를 클라이언트에 전송할 수 있다.
## HTTP/2 단점

- **TCP의 한계**: TCP 프로토콜을 사용하기 떄문에, TCP의 핸드셰이크 과정과 패킷 손실에 따른 재전송 지연 등이 여전히 존재한다. 이는 HOLB 문제를 완전히 해결하지 못 한다.

- **패킷 손실**: 하나의 TCP 연결에서 여러 개의 스트림이 동작하기 때문에, 패킷 손실이 발생하면 전체 연결이 영향을 받을 수 있다.

---
# HTTP/3

## HTTP/3 개요

- HTTP/3은 HTTP/2의 장점들을 유지하면서 TCP가 가지는 원초적인 단점을 보완하기 위해 개발된 프로토콜이다. HTTP/3은 QUIC(Quick UDP Internet Connections)프로토콜을 기반으로 한다.

- QUIC는 UDP를 사용하여 통신하며, 이는 TCP의 핸드셰이크 과정과 패킷 손실에 따른 재전송 지연을 줄이는 데 중점을 두었다.
## HTTP/3 장점

- **QUIC 기반**: UDP를 사용하여 통신하기 때문에, TCP의 핸드셰이크 과정과 HOLB 문제를 완전히 해결할 수 있다. 이는 연결 설정에 필요한 정보와 데이터를 첫 전째 핸드셰이크 때 함께 보내서 RTT(Round Trip Time)를 줄인다.

- **빠른 패킷 손실 감지**: QUIC는 패킷 손실을 빠르게 감지하고 재전송할 수 있어, 전반적인 통신 속도를 향상시킨다.

- **연결 유지**: 사용자 IP가 변경되더라도 연결을 유지할 수 있다.

- **보안 강화**: QUIC 내에 TLS가 기본적으로 포함되어 있어, 헤더 영역도 암호화 된다.
## HTTP/3 단점

- **도입 초기 단계**: 현재 HTTP/3은 아직 도입 초기 단계에 있으며, 더 많은 수정과 발전이 필요하다.

- **인프라 의존성**: 통신 인프라가 빈약한 지역에서는 큰 차이를 느낄 수 있지만, 잘 발달된 통신 인프라를 가진 지역에서는 체감할 수 있는 차이가 적을 수 있다.

---
# 주요 차이점

## 전송 프로토콜

- HTTP/2: TCP를 사용한다.

- HTTP/3: UDP를 기반으로 하는 QUIC 프로토콜을 사용한다.
## HOLB 문제

- HTTP/2: HOLB 문제를 부분적으로 해결하지만, TCP의 한계로 인해 완전히 해결하지 못 한다.

- HTTP/3: QUIC을 통해 HOLB 문제를 완전히 해결한다.
## 핸드셰이크 과정:

- HTTP/2: TCP와 TLS의 핸드셰이크 과정으로 인해 3RTT가 필요하다.

- HTTP/3: 첫 번째 핸드셰이크 때 연결 설정에 필요한 정보와 데이터를 함께 보내서 1RTT로 줄인다.
## 패킷 손실 대응:

- HTTP/2: TCP의 재전송 메커니즘으로 인해 패킷 손실이 발생하면 전체 연결이 영향 받을 수 있다.

- HTTP/3: QUIC를 통해 빠르게 패킷 손실을 감지하고 재전송할 수 있다.

---

# 추가로 알면 좋은 것들

## 멀티플레싱과 스트림:

- HTTP/2와 HTTP/3 모두 멀티플렉싱을 지원하여 여러 개의 요청과 응답을 하나의 연결에서 동시에 전송할 수 있다.

그러나 HTTP/3은 독립 스트림 방식으로 더 강화된 멀티플렉싱을 제공한다.

## 보안:

- HTTP/3은 QUIC 내에 TLS가 기본적으로 포함되어 있어, 보안을 더욱 강화한다.
## HTTPS:

- HTTP/2와 HTTP/3 모두 HTTPS를 필수로 사용한다. 따라서 보안 인증서 관리가 중요하다.

---
### 블로그 내 관련 문서
- [[HTTPS와 TLS]]

---
### 참고 자료
출처 : <br>
- <a href="https://woojinger.tistory.com/85" target="_blank">woojinger</a>
- <a href="https://inpa.tistory.com/entry/WEB-🌐-HTTP-30-통신-기술-이제는-확실히-이해하자#" target="_blank">inpa</a>
- <a href="https://github.com/dongkyun-dev/TIL/blob/master/web/HTTP1.1과%20HTTP2.0,%20그리고%20간단한%20HTTP3.0.md" target="_blank">dongkyun</a>
- <a href="https://evan-moon.github.io/2019/10/08/what-is-http3/" target="_blank">evan</a>
- <a href="https://blog.cloudflare.com/ko-kr/http3-the-past-present-and-future/" target="_blank">cloudflare</a>
- <a href="https://www.saturnsoft.net/network/2019/03/26/quic-http3-2/" target="_blank">saturnsoft</a>
- <a href="https://web.dev/articles/performance-http2?hl=ko" target="_blank">web.dev</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" target="_blank">mozilla</a>