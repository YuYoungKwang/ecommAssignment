import axios from "axios";
import { useEffect, useState } from "react";

type ItemType = "lb" | "hs";

interface ItemsResponse {
  type: ItemType;
}

const apiItemsUrl = "http://localhost:3000/api/items";

async function requestItems(type: ItemType) {
  await axios.post<ItemsResponse>(apiItemsUrl, { type });

}

function App(){

  const [type, setType] = useState<ItemType>("lb");

  useEffect(() => {
    async function loadItems() {

      try {
         await requestItems(type);
       
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

    </main>
  )
}

export default App;