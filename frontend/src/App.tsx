import axios from "axios";
import { useEffect, useState } from "react";

// 라방, 홈쇼핑 토글시 서버에 보내는 타입
type ItemType = "lb" | "hs";

// 서버에서 응답 받는 테이블 row
interface ItemRow {
  objectID: string;
  platform_id: string;
  start_date : string;
  start_time : string;
  product_cnt: number;
  visit_cnt: string;
  sales_cnt: string;
  sales_amt: string;
  title: string;
  cid: number;
  category_name: string;
}

// 서버에서 응답
interface ItemsResponse {
  type: ItemType;
  items: ItemRow[];
}

// 방송 데이터 요청 주소
const apiItemsUrl = "http://localhost:3000/api/items";

// 데이터 요청 함수 리턴 : ItemRow[]
async function requestItems(type: ItemType): Promise<ItemRow[]> {
  const response = await axios.post<ItemsResponse>(apiItemsUrl, { type });
   return response.data.items;
}

function App(){
  // 초기 토글 라방으로 설정
  const [type, setType] = useState<ItemType>("lb");

  // 서버에서 받아온 방송 데이터 row
  const [items, setItems] = useState<ItemRow[]>([]);

  // 데이터를 불러오는 중인지 저장
  const [isLoading, setIsLoading] = useState(true);

  // 에러가 났을 때 화면에 보여줄 메시지
  const [errorMessage, setErrorMessage] = useState("");

  // 에러메세지가 있을경우 true
  const hasError = errorMessage !== "";

  // 데이터 row가 있는경우 true
  const hasItems = items.length > 0;

  // 라방, 홈쇼핑 탭 토글시 데이터 받아오기
  useEffect(() => {
    async function loadItems() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const nextItems = await requestItems(type);
        setItems(nextItems);
      } catch (error) {
        console.error(error);
        setItems([]);
        setErrorMessage("목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    loadItems();
  }, [type]);
  return(
    <main>
      <div>
        <h1>라방 · 홈쇼핑 랭킹 (채용 과제)</h1>
      </div>

      <div>
        <button
          className={type === "lb" ? "active" : ""}
          onClick={() => setType("lb")}
          type="button"
        >
          라방
        </button>

        <button
          className={type === "hs" ? "active" : ""}
          onClick={() => setType("hs")}
          type="button"
        >
          홈쇼핑
        </button>
      </div>
        {isLoading && <p className="state">불러오는 중입니다.</p>}

        {!isLoading && hasError && (
          <p className="state error">{errorMessage}</p>
        )}

        {!isLoading && !hasError && !hasItems && (
          <p className="state">표시할 데이터가 없습니다.</p>
        )}

        {!isLoading && !hasError && hasItems && (
      <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>방송정보</th>
                  <th>분류</th>
                  <th>방송시간</th>
                  <th className="number">조회수</th>
                  <th className="number">판매량</th>
                  <th className="number">매출액</th>
                  <th className="number">상품수</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.objectID}>
                    <td className="title">
                      {item.title}
                      <br />
                      {item.platform_id}
                    </td>
                    <td>{item.category_name}</td>
                    <td>
                      {item.start_date}
                      <br/>
                      {item.start_time}
                    </td>
                    <td className="number">{item.visit_cnt}</td>
                    <td className="number">{item.sales_cnt}</td>
                    <td className="number">{item.sales_amt}</td>
                    <td className="number">{item.product_cnt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>)}
    </main>
  )
}

export default App;