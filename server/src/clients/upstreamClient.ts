import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

// 외부 api 주소
const upstreamBaseUrl = "https://live.ecomm-data.com";

export const upstreamApi = {
  items: `${upstreamBaseUrl}/api/assignment/list`,
  categories: `${upstreamBaseUrl}/api/home/gnb`,
  domain: "live.ecomm-data.com",
};

// 쿠키 저장소
const cookieJar = new CookieJar();
const upstreamClient = wrapper(
  axios.create({
    jar: cookieJar,
    withCredentials: true,
    validateStatus: () => true,
  }),
);

//외부 api  호출
export async function postUpstreamJson<ResponseData>(
  url: string,
  body: object,
): Promise<ResponseData> {

  const response = await upstreamClient.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      domain: upstreamApi.domain,
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`외부 API 실패: ${response.status}`);
  }

  return response.data as ResponseData;
}
