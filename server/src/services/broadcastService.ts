import { postUpstreamJson, upstreamApi } from "../clients/upstreamClient.js";
import type {
  CategoryResponse,
  FormattedStartDatetime,
  HomeShoppingItem,
  ItemRow,
  ItemType,
  ItemsApiResponse,
  LiveBroadcastItem,
  MetricValue,
} from "../types/broadcast.js";

let cachedCategories: CategoryResponse["cats"] | null = null;

async function getItems(type: ItemType): Promise<ItemsApiResponse> {
  return postUpstreamJson<ItemsApiResponse>(upstreamApi.items, { type });
}

async function getCategories(): Promise<CategoryResponse["cats"]> {
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

function formatMetric(value: MetricValue | undefined): string {
  if (value === null || value === undefined) {
    return "🔒 로그인";
  }

  return String(value);
}

function getFormattedStartDatetime(datetime: string): FormattedStartDatetime {
  const year = Number(datetime.slice(datetime.length - 10, -8));
  const month = Number(datetime.slice(-8, -6));
  const day = Number(datetime.slice(-6, -4));
  const hour = datetime.slice(-4, -2);
  const minute = datetime.slice(-2);

  const date = new Date(year, month - 1, day);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[date.getDay()];

  return {
    date: `${String(year)}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} (${weekday})`,
    time: `${hour}:${minute}`,
  };
}

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

function liveToRow(
  item: LiveBroadcastItem,
  categories: CategoryResponse["cats"],
): ItemRow {
  const startDatetime = getFormattedStartDatetime(item.datetime_start);

  return {
    objectID: item.objectID,
    platform_id: item.platform_id,
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

export async function getBroadcastRows(type: ItemType): Promise<ItemRow[]> {
  const itemsResponse = await getItems(type);
  const categories = await getCategories();

  return makeItemRows(type, itemsResponse, categories);
}
