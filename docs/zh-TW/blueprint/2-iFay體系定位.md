## 2. iFay 體系定位

ICP 誕生於 iFay 體系，但其價值不局限於 iFay。本章闡明 ICP 在 iFay 生態中的架構位置，以及它作為獨立協議標準的通用價值。

### iFay 的分層架構與 ICP 的位置

iFay Framework 採用五層架構：

- **Context 層**（最上層）：負責模組化多模態訊息（Modular Multimodal Messages）的組裝、Prompt 翻譯、本地裝置 API、資料傳輸 API 和遠端 API 的對接
- **Protocol 層**：定義 iFay 與外部世界互動的協議集合
- **iFay 核心層**：包含憑證（Credentials）、感知（Sense）、行動（Action）、思維（Thought）四大能力模組，底層由自我模型（Ego Model）驅動
- **Virtual Runtime Environment 層**：iFay 的執行環境，支援電腦、具身機器人、容器、終端裝置、伺服器/雲端、應用內嵌等多種載體，底層由 FayGer 執行時管理
- **Global Merit Chain**（縱貫層）：貫穿全域的信譽與價值體系

ICP（Interactive Conversation Protocol）位於 Protocol 層，是 iFay 協議集合中的一員，與其他 5 個協議並列：

| 協議 | 職責 |
|------|------|
| Faying Protocol | iFay 之間的社交與身份協議 |
| **Interactive Conversation Protocol (ICP)** | **人機互動式對話的語義描述協議** |
| Telepathy Protocol | 意圖與心智狀態的傳遞協議 |
| Control Authority Protocol | 權限控制與授權協議 |
| Data Tunnel Protocol | 資料通道與傳輸協議 |
| Skill Sharing Protocol | 技能共享與呼叫協議 |

各協議的典型應用場景：

> **Faying Protocol**：當你的 iFay 需要與朋友的 iFay 建立聯繫時，Faying Protocol 負責身份驗證和社交關係的建立。例如，你說「幫我聯繫一下小王」，iFay 透過 Faying Protocol 找到小王的 iFay，驗證雙方身份後建立安全的通訊通道。

> **Telepathy Protocol**：當 iFay 需要理解你的深層意圖時，Telepathy Protocol 負責傳遞心智狀態。例如，你對 iFay 說「今天心情不太好」，Telepathy Protocol 將這個情緒狀態傳遞給相關的 coFay（如心理健康助手），使其能夠以更體貼的方式回應。

> **Control Authority Protocol**：在多個 Fay 或 Fay 與人類使用者之間協調終端資源的控制權分配與交接。例如，一架人工控制的無人機需要交接給某個 Fay 接管飛行控制，Control Authority Protocol 負責驗證權限、協商控制權轉移條件，並確保交接過程的安全性。

> **Data Tunnel Protocol**：當 iFay 需要在不同終端之間傳輸大量資料時，Data Tunnel Protocol 負責建立高效的資料通道。例如，你在手機上拍攝的現場照片需要即時傳輸到遠端專家的大螢幕上進行分析，DTP 負責建立點對點的資料通道並保證傳輸品質。

> **Skill Sharing Protocol**：當一個 Fay 需要借用另一個 Fay 的能力時，Skill Sharing Protocol 負責技能的發現、協商和呼叫。例如，你的 iFay 不具備法律諮詢能力，但可以透過 Skill Sharing Protocol 臨時呼叫一個法律 coFay 的專業技能來回答你的法律問題。

ICP 專注於「互動式對話」這一類人機互動場景——當 iFay 需要與使用者進行結構化的對話互動時，ICP 負責將語義內容根據當前終端的客觀語境，動態組裝成使用者友好的互動介面。ICP 的上層是 Context 層的 Modular Multimodal Messages，它消費 ICP 產出的結構化語義，將其組裝為最終呈現給使用者的模組化多模態訊息。

> 例如，iFay 需要提醒使用者「明天下午 3 點有一個專案評審會議」。iFay 核心層的 Thought 模組決定需要發出提醒，Action 模組透過 ICP 將這條資訊編碼為結構化語義——包含時間註解、參與者引用、日程操作按鈕等。Context 層接收 ICP 文件後，根據當前終端能力組裝為多模態訊息：在手機上呈現為一張帶有「加入日曆」按鈕的卡片；在智慧音箱上被朗讀並等待語音確認；在 AR 眼鏡上以浮動提示的形式出現在使用者視野中。

### iFay 的定義

iFay 是依附於自然人的個人 AI 代理（Personal AI Agent）。每個 iFay 與一個自然人一對一綁定，深度了解該使用者的偏好、習慣、社交關係和生活語境。iFay 的核心職責是代表個人處理資訊、管理互動、協調與外部世界的溝通。

你可以將 iFay 理解為一個真正了解你的數位助理——它不僅記住你說過什麼，還理解你的表達習慣、決策偏好和當前處境。

> 例如，你每天早上習慣先看天氣再決定穿什麼。iFay 記住了這個習慣，每天早上 7 點自動準備好天氣資訊和穿搭建議。當你出差到一個新城市時，iFay 會根據目的地的天氣、你的日程安排和衣櫃裡帶的衣服，主動調整建議內容——這不是簡單的鬧鐘提醒，而是基於對你個人語境的深度理解。

### coFay 的定義

coFay 是承擔社會公共職能的 AI 代理（Public Role AI Agent）。與 iFay 的個人屬性不同，coFay 扮演的是被定義的公共角色，如警察、醫生、教師、公務員、客服代表等。

iFay 與 coFay 的核心區別在於服務對象和職責邊界：

- iFay 服務於特定個人，了解該個人的全部語境，代表個人利益
- coFay 服務於公共職能，遵循角色規範和職業準則，代表公共利益

在 iFay 體系中，iFay 和 coFay 之間的溝通可以透過多種協議進行。當涉及互動式對話場景時，ICP 承擔語義描述的職責；而身份驗證走 Faying Protocol，權限控制走 Control Authority Protocol，資料傳輸走 Data Tunnel Protocol——各協議各司其職。

> 例如，你對 iFay 說「幫我掛一個明天下午的皮膚科號」。iFay 透過 Faying Protocol 找到醫院的掛號 coFay，透過 Control Authority Protocol 驗證你的健保身份和掛號權限，透過 ICP 將你的症狀描述（帶有時間、身體部位等註解）傳遞給掛號 coFay，coFay 透過 ICP 回傳可選的醫生列表（帶有專長標註、評分、可用時段等註解），最終在你的手機上渲染為一個可互動的預約表單。整個過程中，每個協議各司其職，ICP 負責的是人與 Fay 之間的語義互動部分。

### ICP 的獨立價值

雖然 ICP 誕生於 iFay 體系，但它被設計為一個獨立的語義描述協議，不依賴 iFay 即可使用。

任何需要結構化描述人機互動語義的系統都可以採用 ICP：聊天應用、語音助手、AR/VR 平台、企業協作工具、IoT 裝置控制面板——只要存在「人與機器之間需要傳遞帶語境的結構化資訊」的場景，ICP 就有用武之地。

ICP 因此具有雙重身份：

- 在 iFay 體系內，它是 Protocol 層中負責互動式對話的語義描述協議
- 在 iFay 體系外，它是一個通用的、包含語境的語義描述協議，適用於任何人機互動場景

> 例如，一個獨立的智慧客服系統（不使用 iFay）同樣可以採用 ICP 來描述客服對話中的結構化資訊：將使用者的問題標記為不同的語義類型（投訴、諮詢、建議），附加使用者的會話歷史和裝置資訊作為語境，然後根據客服終端的能力動態組裝回覆介面。
