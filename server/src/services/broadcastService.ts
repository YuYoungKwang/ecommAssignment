import { postUpstreamJson, upstreamApi } from "../clients/upstreamClient.js";
import type {
  PlatformInfo,
  CategoryResponse,
  FormattedStartDatetime,
  HomeShoppingItem,
  ItemRow,
  ItemType,
  ItemsApiResponse,
  LiveBroadcastItem,
  MetricValue,
} from "../types/broadcast.js";

// 카테고리가 메모리에 있는지 확인
let cachedCategories: CategoryResponse["cats"] | null = null;

// 라방 / 홈쇼핑 데이터를 가져오는 함수
async function getItems(type: ItemType): Promise<ItemsApiResponse> {
  return postUpstreamJson<ItemsApiResponse>(upstreamApi.items, { type });
}

// 카테고리 목록을 가져오는 함수
async function getCategories(): Promise<CategoryResponse["cats"]> {
  // null인경우 false처럼 취급
  if (cachedCategories) {
    return cachedCategories;
  }

  const data = await postUpstreamJson<CategoryResponse>(
    upstreamApi.categories,
    {},
  );

  cachedCategories = data.cats;
  return cachedCategories;
}

// 데이터가 마스킹되어 있는경우 "🔒 로그인"로 변경
function formatMetric(value: MetricValue | undefined): string {
  if (value === null || value === undefined) {
    return "🔒 로그인";
  }

  return String(value);
}

// 방송 날짜 포멧 변경
function getFormattedStartDatetime(datetime: string): FormattedStartDatetime {
  const year = Number(datetime.slice(datetime.length - 10, -8));
  const month = Number(datetime.slice(-8, -6));
  const day = Number(datetime.slice(-6, -4));
  const hour = datetime.slice(-4, -2);
  const minute = datetime.slice(-2);

  const date = new Date(year+2000, month - 1, day);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[date.getDay()];

  return {
    date: `${String(year)}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} (${weekday})`,
    time: `${hour}:${minute}`,
  };
}

// 최상위 카테고리 가져오는 함수
function getTopCategoryName(
  cid: number,
  categories: CategoryResponse["cats"],
) {
  let category = categories[String(cid)];

  if (!category) {
    return String(cid);
  }

  while (category.pid !== null) {
    const parent = categories[String(category.pid)];

    if (!parent) {
      break;
    }

    category = parent;
  }

  return category.name;
}

// 102nmyir71hrs.js
// 플렛폼 네임 정보
const platforms: Record<string, PlatformInfo> = {
        baemin: {
            name: "배민라이브",
            no_crawl: true
        },
        cjonstyle: {
            name: "CJ온스타일",
            short_name: "온스타일"
        },
        coupang: {
            name: "쿠팡라이브",
            no_crawl: true
        },
        eland: {
            name: "이랜드몰"
        },
        gmarket: {
            name: "G라이브",
            short_name: "G마켓"
        },
        grip: {
            name: "그립"
        },
        gsshop: {
            name: "지에스샵 샤피라이브",
            short_name: "샤피라이브"
        },
        himart: {
            name: "롯데하이마트"
        },
        hmall: {
            name: "현대Hmall 쇼라",
            short_name: "현대Hmall"
        },
        homeplus: {
            name: "홈플러스"
        },
        interpark: {
            name: "인터파크TV",
            short_name: "인터파크"
        },
        kakao: {
            name: "카카오쇼핑LIVE",
            short_name: "카카오"
        },
        live11: {
            name: "11번가 라이브11",
            short_name: "11번가"
        },
        live24_ect: {
            name: "라이브24"
        },
        live24_nhl: {
            name: "농협 라이블리"
        },
        live24_sshm: {
            name: "삼삼해물"
        },
        lotteD: {
            name: "롯데백라이브"
        },
        lotteON: {
            name: "롯데온라이브"
        },
        naver: {
            name: "네이버쇼핑LIVE",
            short_name: "네이버"
        },
        sauce: {
            name: "소스라이브"
        },
        ssg: {
            name: "쓱라이브"
        },
        tmon: {
            name: "티몬플레이"
        },
        vogo: {
            name: "보고플레이",
            short_name: "보고"
        },
        wmp: {
            name: "위메프"
        },
        lotteimall: {
            name: "롯데홈쇼핑",
            no_crawl: true
        },
        nsmall: {
            name: "NS홈쇼핑"
        },
        pang_live: {
            name: "팡라이브",
            no_crawl: true
        },
        ssg_live: {
            name: "신세계쇼핑라이브"
        },
        lotte_100: {
            name: "롯데백라이브"
        },
        lotte_on: {
            name: "롯데온라이브"
        },
        skstoa: {
            name: "SK스토아"
        },
        olive: {
            name: "올리브영"
        },
        gongyoung: {
            name: "공영라방"
        }
};

// 플렛폼 네임을 가져오는 함수
function getPlatformName(platformId: string): string {
  return platforms[platformId]?.name ?? "-";
}

// 라방 데이터를 프론트엔드 테이블 모양으로 바꾸는 함수
function liveToRow(
  item: LiveBroadcastItem,
  categories: CategoryResponse["cats"],
): ItemRow {
  const startDatetime = getFormattedStartDatetime(item.datetime_start);

  return {
    objectID: item.objectID,
    platform_id: getPlatformName(item.platform_id),
    start_date: startDatetime.date,
    start_time: startDatetime.time,
    product_cnt: item.product_cnt,
    visit_cnt: formatMetric(item.visit_cnt),
    sales_cnt: formatMetric(item.sales_cnt),
    sales_amt: formatMetric(item.sales_amt),
    title: item.title,
    cid: item.cid,
    category_name: getTopCategoryName(item.cid, categories),
  };
}

// 홈쇼핑 데이터를 프론트엔드 테이블 모양으로 바꾸는 함수
function homeShoppingToRow(
  item: HomeShoppingItem,
  categories: CategoryResponse["cats"],
): ItemRow {
  const startDatetime = getFormattedStartDatetime(item.hsshow_datetime_start);

  return {
    objectID: item.hsshow_id,
    platform_id: item.platform_name,
    start_date: startDatetime.date,
    start_time: startDatetime.time,
    product_cnt: item.item_cnt,
    visit_cnt: formatMetric(item.visit_cnt),
    sales_cnt: formatMetric(item.sales_cnt),
    sales_amt: formatMetric(item.sales_amt),
    title: item.hsshow_title,
    cid: item.cid,
    category_name: getTopCategoryName(item.cid, categories),
  };
}

//응답받은 데이터를 10개로 잘라서 프론트엔드 테이블에 맞게 데이터를 가공하는 함수를 호출
function makeItemRows(
  type: ItemType,
  itemsResponse: ItemsApiResponse,
  categories: CategoryResponse["cats"],
): ItemRow[] {
  const topTenItems = itemsResponse.list.slice(0, 10);

  if (type === "hs") {
    return topTenItems.map((item) =>
      homeShoppingToRow(item as HomeShoppingItem, categories),
    );
  }

  return topTenItems.map((item) =>
    liveToRow(item as LiveBroadcastItem, categories),
  );
}

//메인 함수
//방송, 카테고리 데이터를 받은뒤 프론트엔드 테이블 형식으로 가공 후 반환
export async function getBroadcastRows(type: ItemType): Promise<ItemRow[]> {
  const itemsResponse = await getItems(type);
  const categories = await getCategories();

  return makeItemRows(type, itemsResponse, categories);
}
