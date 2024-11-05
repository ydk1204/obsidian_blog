Built with Next.js, Deployed on Cloudflare Pages

## 옵시디안 블로그

해당 프로젝트는 블로그 포스트를 작성하기 위한 프로젝트입니다.
이 블로그는 옵시디안 앱을 이용하여 마크다운 파일을 작성하고, 이를 빌드하여 배포하는 방식으로 운영됩니다.
이 블로그의 UI는 quartz 프로젝트를 참고하여 만들어졌습니다.
Next.js를 사용하여 빌드하고, Cloudflare Pages에 배포하였습니다.

---

## 옵시디안 블로그 주요 기능

해당 블로그는 왼쪽 패널(사이드바), 본문, 오른쪽 패널(사이드바)로 구성되어 있습니다.

### 왼쪽 패널(사이드바)
- 블로그 로고가 있습니다. 클릭 시 메인 페이지로 이동합니다.
- 검색 기능이 있습니다.
  - 제목, 내용, 태그 등을 입력하여 검색 결과를 확인하고 이동할 수 있습니다.
- 폴더 구조를 탐색할 수 있습니다.
  - 폴더 내 포스트를 탐색할 수 있습니다.

### 본문
- 해당 포스트의 폴더 구조를 확인할 수 있습니다.
  - 폴더 클릭 시 해당 폴더 페이지로 이동합니다.
- 해당 포스트의 제목과 날짜가 표시됩니다.
- 해당 포스트에서 사용하는 태그를 확인할 수 있습니다.
  - 태그 클릭 시 해당 태그 페이지로 이동합니다.
- 코드블럭의 복사 버튼을 이용하여 코드를 복사할 수 있습니다.
- 콜아웃의 경우 열기, 닫기 기능을 사용할 수 있습니다.
- 블로그 내 관련 문서(백링크)를 확인할 수 있습니다.
- 참고한 자료의 출처를 확인하고 클릭 시 새로운 탭에서 열립니다.
- 댓글 작성이 가능합니다.
- 라이트/다크 테마 변경 버튼이 있습니다.

### 오른쪽 패널(사이드바)
- 해당 포스트의 제목을 기반으로 Table of Contents를 생성합니다.
  - 제목 클릭 시 해당 제목의 위치로 스크롤 이동합니다.
- Graph View를 통해 해당 포스트와 관련 문서를 확인할 수 있습니다.
  - 해당 포스트와 관련된 문서란 해당 포스트의 백링크와 같은 태그를 사용하는 포스트를 의미합니다.
  - 메인 페이지의 경우 모든 포스트를 대상으로 그래프를 생성합니다.
  - 폴더 페이지의 경우 해당 폴더 내 포스트를 대상으로 그래프를 생성합니다.
  - 태그 페이지의 경우 해당 태그를 사용하는 모든 포스트를 대상으로 그래프를 생성합니다.
  - 그래프 내 노드를 클릭 시 해당 노드의 포스트로 이동합니다.
  - Graph View는 마우스 조작을 통해 확대/축소, 이동을 할 수 있습니다.
  - Graph View UI 하단에 Zoom을 표시하여 현재 확대/축소 백분율을 확인할 수 있습니다.
  - Graph View UI 하단에 Full Graph View 버튼이 있습니다. 클릭 시 전체 그래프 뷰로 확대하여 확인할 수 있습니다.
- 백링크를 통해 해당 포스트와 관련 문서를 확인할 수 있습니다.
  - 백링크 클릭 시 해당 포스트로 이동합니다.

---

## 옵시디안 블로그 추가 기능

데스크톱에서 기본적으로 확인할 수 있는 왼쪽, 오른쪽 패널(사이드바)의 경우 모바일 화면에서는 다른 방식으로 확인할 수 있습니다.

### 스와이프(스크롤) 제스처
- 왼쪽 패널(사이드바)는 왼쪽 스와이프 제스처를 통해 확인할 수 있습니다.
  - 왼쪽에서 오른쪽으로 스와이프 시 왼쪽 패널(사이드바)가 열립니다.
  - 오른쪽에서 왼쪽으로 스와이프 시 왼쪽 패널(사이드바)이 닫힙니다.
- 오른쪽 패널(사이드바)는 오른쪽 스와이프 제스처를 통해 확인할 수 있습니다.
  - 오른쪽에서 왼쪽으로 스와이프 시 오른쪽 패널(사이드바)이 열립니다.
  - 왼쪽에서 오른쪽으로 스와이프 시 오른쪽 패널(사이드바)이 닫힙니다.

패널(사이드바)를 통한 기능은 모두 데스크톱과 동일하게 작동합니다.