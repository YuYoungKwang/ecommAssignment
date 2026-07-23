//라방, 홈쇼핑 목록
export type ItemType = "lb" | "hs";

// 특정 cid 카테고리 응답 내부
export interface Category {
  // pid가 null일 경우 최상위 카테고리
  pid: number | null;
  name: string;
}

// 카테고리 전체 응답 
export interface CategoryResponse {
  cats: {
    [cid: string]: Category;
  };
}

// 날짜 시간 포멧 변경 저장
export interface FormattedStartDatetime {
  date: string;
  time: string;
}

// 마스킹된 데이터 타입관리
export type MetricValue = string | number | null;

// 라방(lb) 데이터 목록
export interface LiveBroadcastItem {
  objectID: string;
  platform_id: string;
  datetime_start: string;
  product_cnt: number;
  visit_cnt?: MetricValue;
  sales_cnt?: MetricValue;
  sales_amt?: MetricValue;
  title: string;
  cid: number;
}

// 홈쇼핑(hs) 데이터 목록
export interface HomeShoppingItem {
  hsshow_id: string;
  platform_name: string;
  hsshow_datetime_start: string;
  item_cnt: number;
  visit_cnt?: MetricValue;
  sales_cnt?: MetricValue;
  sales_amt?: MetricValue;
  hsshow_title: string;
  cid: number;
}

// 외부 목록 API 응답입니다.
// 데이터 목록 배열 정리
export interface ItemsApiResponse {
  list: Array<LiveBroadcastItem | HomeShoppingItem>;
  mask?: boolean;           // 마스킹 여부
}

// 벡엔드 -> 프론트 반환 형식
export interface ItemRow {
  objectID: string;         // 방송id
  platform_id: string;      // 플랫폼
  start_date: string;       // 방송날짜
  start_time: string;       // 방송시간
  product_cnt: number;      // 상품수
  visit_cnt: string;        // 조회수
  sales_cnt: string;        // 판매량
  sales_amt: string;        // 매출액
  title: string;            // 방송정보
  cid: number;              // 카테고리 id
  category_name: string;
}

// 방송 플랫폼 정보
export interface PlatformInfo {
  name: string;
  short_name?: string;
  no_crawl?: boolean;
}