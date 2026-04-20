/***********************
 * 状态管理
 ***********************/
const state = {
  currentPage: 1,
  itemsPerPage: 3,
  books: [...books].reverse(),
  filtered: [],
  isSearching: false,
};
state.filtered = state.books;

/***********************
 * 安全 alert
 ***********************/
window.alert = function (msg) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = "data:text/plain,";
  document.body.appendChild(iframe);
  iframe.contentWindow.alert(msg);
  iframe.remove();
};

/***********************
 * 分类映射
 ***********************/
const bookMark = {
  a: "A 马克思主义、列宁主义、毛泽东思想、邓小平理论",
  b: "B 哲学、宗教，含美学、心理学",
  c: "C 社会科学总论，含统计学、管理学",
  d: "D 政治、法律，含社会运动、外交关系",
  e: "E 军事",
  f: "F 经济，含财政、金融",
  g: "G 文化、科学、教育、体育，含科研、传播",
  h: "H 语言、文字",
  i: "I 文学",
  j: "J 艺术",
  k: "K 历史、地理，含人物传记、考古风俗",
  n: "N 自然科学总论",
  o: "O 数理科学和化学",
  p: "P 天文学、地球科学",
  q: "Q 生物科学",
  r: "R 医药、卫生",
  s: "S 农业科学",
  t: "T 工业技术",
  u: "U 交通运输",
  v: "V 航空、航天",
  x: "X 环境科学、安全科学",
  z: "Z 综合性图书",
};

/***********************
 * 分类弹窗
 ***********************/
function book_clc(mark, bookname, clc, lcc) {
  const key = mark[0].toLowerCase();

  const dialog = document.createElement("div");
  dialog.className = "bookmarkdialog";

  dialog.innerHTML = `
    <div id="dialogs">
      <div class="js_dialog">
        <div class="weui-mask"></div>
        <div class="weui-dialog">
          <div class="weui-dialog__hd">
            <strong>${bookname}</strong>
          </div>
          <div class="weui-dialog__bd">
            ${bookMark[key] || "未知分类"}<br /><br />
            中图分类号：${clc}<br />
            美国国会图书馆分类号：${lcc}
          </div>
          <div class="weui-dialog__ft">
            <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">确定</a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
  dialog.querySelector(".weui-dialog__btn").onclick = () => dialog.remove();
}

/***********************
 * 图册
 ***********************/
function showGallery(img) {
  const gallery = document.getElementById("gallery");
  const galleryImg = document.getElementById("galleryImg");

  gallery.style.display = "block";
  gallery.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    galleryImg.style.backgroundImage = `url(${img.src})`;
  }, 200);
}

function hideGallery() {
  const gallery = document.getElementById("gallery");
  const galleryImg = document.getElementById("galleryImg");

  gallery.style.display = "none";
  gallery.setAttribute("aria-hidden", "true");
  galleryImg.style.backgroundImage = "";
}

/***********************
 * 星级（保留 book-star）
 ***********************/
function createStars(stars = 0) {
  const full = `<svg fill="#f3b04b" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  const empty = `<svg fill="#dadada" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  return `<span class="book-star">${full.repeat(stars) + empty.repeat(5 - stars)}</span>`;
}

/***********************
 * 创建卡片（保留所有 class）
 ***********************/
function createCard(book) {
  const card = document.createElement("div");
  card.className = "book-card";

  const cardMark = book.book_cnClassification
    .slice(0, 3)
    .replace(/\d+/g, "")
    .replace("-", "");

  if (book.book_count == 0) {
    card.style = "background-color:#eee; filter:grayscale(100%)";
  }

  card.innerHTML = `
    <h2>
      <span class="card_mark" data-mark="${cardMark}">${cardMark}</span>
      ${book.book_name}<label>Id.${book.id}</label>
    </h2>

    <div class="book-details">
      <p><strong>主观评级：</strong>${createStars(book.book_star)}</p>

      <div class="thumbnail">
        <img loading="lazy"
             src="./assets/isbn/${book.book_isbn}.jpg"
             onerror="this.src='./assets/isbn/nocover.jpg';" />
      </div>

      ${book.book_summary ? `<p><strong>内容简介：</strong>${book.book_summary}</p>` : ""}
      ${book.book_dadsay ? `<p><strong>爸爸说：</strong>${book.book_dadsay}</p>` : ""}
      ${book.book_momsay ? `<p><strong>妈妈说：</strong>${book.book_momsay}</p>` : ""}

      <p><strong>图书信息：</strong>
        作者 <big>${book.book_author}</big>，
        出版社 <big>${book.book_press}</big>，
        ISBN <big>${book.book_isbn}</big>
      </p>

      <p><strong>上架信息：</strong>
        ${book.book_gettime || ""} 在 ${book.book_getcity || ""} 获取，
        状态 <big>${book.book_status}</big>
      </p>

      <p><strong>建议分类：</strong><big>${book.book_class}</big></p>

      ${
        book.book_count == 0
          ? `<img src="./assets/images/mark.svg"
               style="position:absolute;width:18rem;left:50%;margin-left:-9rem;top:15%;pointer-events:none;opacity:.9" />`
          : ""
      }
    </div>
  `;

  return card;
}

/***********************
 * 渲染（优化）
 ***********************/
function displayBooks() {
  const container = document.getElementById("book-cards");
  container.innerHTML = "";

  const fragment = document.createDocumentFragment();

  const start = (state.currentPage - 1) * state.itemsPerPage;
  const end = start + state.itemsPerPage;

  state.filtered.slice(start, end).forEach((b) => {
    fragment.appendChild(createCard(b));
  });

  container.appendChild(fragment);

  updatePagination();
}

/***********************
 * 分页
 ***********************/
function updatePagination() {
  const total = state.filtered.length;
  const pages = Math.max(1, Math.ceil(total / state.itemsPerPage));

  document.getElementById("page-info").textContent =
    `${state.currentPage} / ${pages}`;

  document.getElementById("prev-page").disabled = state.currentPage === 1;
  document.getElementById("next-page").disabled =
    state.currentPage === pages;
}

function changePage(step) {
  const max = Math.ceil(state.filtered.length / state.itemsPerPage);

  state.currentPage = Math.min(max, Math.max(1, state.currentPage + step));
  displayBooks();
}

/***********************
 * 搜索（优化）
 ***********************/
function searchBooks() {
  const q = document.getElementById("search-input").value.toLowerCase();

  state.filtered = state.books.filter((b) =>
    [
      b.book_name,
      b.book_author,
      b.book_press,
      b.book_class,
      b.book_isbn,
      b.book_cnClassification,
      b.book_status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );

  state.currentPage = 1;
  state.isSearching = true;

  displayBooks();
}

/***********************
 * 分类筛选
 ***********************/
function classifyBooks() {
  weui.picker(
    [
      { label: "不限类别", value: "ALL" },
      ...Object.entries(bookMark).map(([k, v]) => ({
        label: v,
        value: k.toUpperCase(),
      })),
    ],
    {
      onConfirm(res) {
        if (res === "ALL") return resetSearch();

        state.filtered = state.books.filter((b) =>
          b.book_cnClassification.startsWith(res)
        );

        state.currentPage = 1;
        displayBooks();
      },
      title: "筛选图书类别",
    }
  );
}

/***********************
 * 工具
 ***********************/
function resetSearch() {
  state.filtered = [...state.books];
  state.currentPage = 1;
  state.isSearching = false;
  displayBooks();
}

function randomSearch() {
  state.filtered = [...state.books].sort(() => Math.random() - 0.5);
  state.currentPage = 1;
  displayBooks();
}

function sortSearch() {
  state.filtered = [...state.books].sort((a, b) => b.id - a.id);
  state.currentPage = 1;
  displayBooks();
}

/***********************
 * 防抖
 ***********************/
function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

document
  .getElementById("search-input")
  .addEventListener("input", debounce(searchBooks));

/***********************
 * 事件委托（关键优化）
 ***********************/
document.getElementById("book-cards").addEventListener("click", (e) => {
  const card = e.target.closest(".book-card");
  if (!card) return;

  document.querySelectorAll(".book-card").forEach((c) =>
    c.classList.remove("expanded")
  );
  card.classList.add("expanded");

  if (e.target.classList.contains("card_mark")) {
    const mark = e.target.dataset.mark;
    const title = card.querySelector("h2").innerText;
    book_clc(mark, title);
  }

  if (e.target.tagName === "IMG") {
    showGallery(e.target);
  }
});

/***********************
 * 初始化
 ***********************/
displayBooks();