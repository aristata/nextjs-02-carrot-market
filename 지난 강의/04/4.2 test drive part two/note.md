![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/54b3369a-b26e-41b4-ae49-112de6e7fc66/Untitled.png)

- 이번 강의에서 배운 내용은 다음과 같다
  - 원을 그리는 방법
  - relative
  - 음수(-) 마진

### 원을 그리는 방법

- `rounded-full`
- 사이즈는 `h-24 w-24` 이런식으로 줄수 있다
- 색상은 `bg-red-400`

### relative

- **요소 자기 자신의 원래 위치(static일 때의 위치)를 기준으로 배치**한다
- 원래 위치를 기준으로 위쪽(top), 아래쪽(bottom), 왼쪽(left), 오른쪽(right)에서 얼마만큼 떨어질 지 결정한다.
- 위치를 이동하면서 다른 요소에 영향을 주지 않는다.
- 문서 상 원래 위치가 그대로 유지된다.
- [https://creamilk88.tistory.com/197](https://creamilk88.tistory.com/197)

### 음수 마진

- 마진의 값을 음수로 주어서 역방향으로 엘리먼트를 이동시키거나 사이즈를 변경할 수 있다

  ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/907394ba-0882-4aa7-b446-34a3fb9b4f2b/Untitled.png)

- Tony Molloy 라고 적혀 있는 div 영역에 마이너스 마진을 주면 다음과 같이 사이즈가 줄어든다

  ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fbe2cc87-c8f5-4fb9-9550-6fdd6db5cc16/Untitled.png)

    ```tsx
    <div className={"relative flex flex-col items-center -mt-10 -mb-5"}>
        <span className={"text-lg font-medium"}>Tony Molloy</span>
        <span className={"text-sm text-gray-500"}>미국</span>
    </div>
    ```
