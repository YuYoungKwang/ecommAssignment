import axios from "axios";
import { useEffect, useState } from "react";

type ItemType = "lb" | "hs";

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

interface ItemsResponse {
  type: ItemType;
  items: ItemRow[];
}

const apiItemsUrl = "http://localhost:3000/api/items";

async function requestItems(type: ItemType): Promise<ItemRow[]> {
  const response = await axios.post<ItemsResponse>(apiItemsUrl, { type });
   return response.data.items;
}

function App(){

  const [type, setType] = useState<ItemType>("lb");

  const [items, setItems] = useState<ItemRow[]>([]);
  useEffect(() => {
    async function loadItems() {

      try {
        const nextItems = await requestItems(type);
        setItems(nextItems);
      } catch (error) {
        console.error(error);
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
          </div>
    </main>
  )
}

export default App;