import { app } from "./app.js";

const port = 3000;

//  3000번 포트로 실행 대기.
app.listen(port, () => {
  console.log(`API server: http://localhost:${port}`);
});
