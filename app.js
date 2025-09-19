let currentPage = 1;
const itemsPerPage = 3;
let filteredBooks = [...books].reverse();
let isSearching = false;

// 自定义 alert（iframe hack）
window.alert = function (msg) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = "data:text/plain,";
  document.body.appendChild(iframe);
  iframe.contentWindow.alert(msg);
  iframe.remove();
};

// 图书分类映射
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
  n: "N 自然科学总论，含情报学",
  o: "O 数理科学和化学",
  p: "P 天文学、地球科学",
  q: "Q 生物科学，含人类学",
  r: "R 医药、卫生",
  s: "S 农业科学，含农林牧副渔",
  t: "T 工业技术，含信息产业",
  u: "U 交通运输",
  v: "V 航空、航天",
  x: "X 环境科学、安全科学",
  z: "Z 综合性图书，含丛书百科、年鉴期刊",
};

// =======================
// 骨架屏控制
// =======================
function showSkeleton() {
  const skeleton = document.getElementById("skeleton");
  if (skeleton) skeleton.style.display = "grid";
}

function hideSkeleton() {
  const skeleton = document.getElementById("skeleton");
  if (skeleton) skeleton.style.display = "none";
}

// =======================
// 分类弹窗 & 图册
// =======================
function book_clc(mark, bookname, clc, lcc) {
  const key = mark[0].toLowerCase();
  const dialog = document.createElement("div");
  dialog.className = "bookmarkdialog";
  dialog.innerHTML = `
    <div id="dialogs">
      <div class="js_dialog" role="dialog" aria-hidden="true" aria-modal="true" aria-labelledby="js_title1" id="dialogMark">
        <div class="weui-mask"></div>
        <div class="weui-dialog">
          <div class="weui-dialog__hd">
            <strong class="weui-dialog__title" id="js_title1">${bookname}</strong>
          </div>
          <div class="weui-dialog__bd">
            ${bookMark[key] ?? "未知分类"}<br /><br />
            中图分类号：${clc}<br />
            美国国会图书馆分类号：${lcc}
          </div>
          <div class="weui-dialog__ft">
            <a role="button" href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" data-close>确定</a>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  const dlg = dialog.querySelector(".js_dialog");
  dlg.style.display = "block";
  dlg.setAttribute("aria-hidden", "false");
  dlg.focus();
  dlg.querySelector("[data-close]").onclick = dialogClose;
}

function dialogClose() {
  const wrapper = document.getElementById("dialogs");
  if (wrapper) wrapper.remove();
}

function showGallery(img) {
  const gallery = document.getElementById("gallery");
  const galleryImg = document.getElementById("galleryImg");
  gallery.style.display = "block";
  gallery.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    galleryImg.style.backgroundImage = `url(${img.src})`;
    galleryImg.focus();
  }, 200);
}

function hideGallery() {
  const gallery = document.getElementById("gallery");
  const galleryImg = document.getElementById("galleryImg");
  gallery.style.display = "none";
  gallery.setAttribute("aria-hidden", "true");
  galleryImg.style.backgroundImage = "";
}

// =======================
// 星级 & 卡片展开
// =======================
function createStars(stars = 0) {
  const full = `<svg fill="#f3b04b" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  const empty = `<svg fill="#dadada" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  return full.repeat(stars) + empty.repeat(5 - stars);
}

function toggleCardDetails(card) {
  document.querySelectorAll(".book-card").forEach((c) => c.classList.remove("expanded"));
  card.classList.add("expanded");
}

// =======================
// 渲染图书
// =======================
function displayBooks(list) {
  const bookCards = document.getElementById("book-cards");
  bookCards.innerHTML = "";
  showSkeleton();

  setTimeout(() => {
    list.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .forEach((book) => {
        const card = document.createElement("div");
        card.className = "book-card";
        const cardMark = book.book_cnClassification.slice(0, 3).replace(/\d+/g, "").replace("-", "");
        card.innerHTML = `
          <h2>
            <span class="card_mark" onclick="book_clc('${cardMark}','${book.book_name}','${book.book_cnClassification}','${book.book_usClassification}')">${cardMark}</span>
            ${book.book_name}<label>Id.${book.id}</label>
          </h2>
          <div class="book-details">
            <p><strong>主观评级：</strong><span class="book-star">${createStars(book.book_star)}</span></p>
            <div class="thumbnail"><img onclick="showGallery(this);" onerror="this.src='./img/nocover.jpg';" src="./img/${book.book_isbn}.jpg" /></div>
            ${book.book_summary ? `<p><strong>内容简介：</strong> ${book.book_summary}</p>` : ""}
            ${book.book_dadsay ? `<p><strong>爸爸说：</strong> ${book.book_dadsay}</p>` : ""}
            ${book.book_momsay ? `<p><strong>妈妈说：</strong> ${book.book_momsay}</p>` : ""}
            <p><strong>图书信息：</strong>本书作者为 <big>${book.book_author}</big>，由 <big>${book.book_press}</big> 出版，${book.book_presstime ? `在架版次为 <big>${book.book_presstime}</big> 。` : ""}${book.book_isbn ? `ISBN/书号/OCLC为 <big>${book.book_isbn}</big> 。` : ""}</p>
            <p><strong>上架信息：</strong>本书${book.book_gettime ? `于 <big>${book.book_gettime}</big> ` : ""}在 <big>${book.book_getcity}</big> ${book.book_getway ? `通过 <big>${book.book_getway}</big> ` : ""}获得。${book.book_price ? `定价为 <big>${book.book_pricecurrent} ${book.book_price} 元</big> ，` : ""}${book.book_getprice ? `获得价格为 <big>${book.book_getpricecurrent} ${book.book_getprice} 元</big> ，` : ""}${book.book_count ? `实存 <big>${book.book_count}</big> 册，` : ""}${book.book_keepcity && book.book_count != 0 ? `现存放于 <big>${book.book_keepcity}</big> ，` : ""}状态 <big>${book.book_status}</big> 。</p>
            <p><strong>建议分类：</strong><big>${book.book_class}</big></p>
            ${book.book_count == 0 ? `<img src="./mark.svg" style="position:absolute; width:18rem; left:50%; margin-left:-9rem; top:15%; pointer-events:none; opacity:.9" />` : ""}
          </div>
        `;
        if (book.book_count == 0) card.style = "background-color:#eee; filter:grayscale(100%)";
        card.addEventListener("click", () => toggleCardDetails(card));
        bookCards.appendChild(card);
      });
    hideSkeleton();
    updatePagination();
  }, 300); // 延迟模拟骨架屏
}

// =======================
// 分页 & 搜索
// =======================
function updatePagination() {
  const totalItems = filteredBooks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const bookCount = filteredBooks.reduce((sum, b) => sum + (parseInt(b.book_count, 10) || 0), 0);

  const pageInfo = document.getElementById("page-info");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const bookTotal = document.getElementById("book-total");
  const searchTotal = document.getElementById("search-result-total");

  if (isSearching) {
    searchTotal.textContent = `找到${totalItems}部 (${bookCount}册) 图书`;
    bookTotal.style.display = "none";
    searchTotal.style.display = "block";
  } else {
    bookTotal.textContent = `找到${totalItems}部 (${bookCount}册) 图书`;
    bookTotal.style.display = "block";
    searchTotal.style.display = "none";
  }

  pageInfo.textContent = `${currentPage} / ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalItems === 0;
}

function changePage(direction) {
  currentPage += direction;
  displayBooks(filteredBooks);
}

function searchBooks() {
  document.getElementById("classify").textContent = "类别";
  const query = document.getElementById("search-input").value.toLowerCase();
  filteredBooks = books.filter((b) =>
    [b.book_name, b.book_press, b.book_author, b.book_class].some((f) => f?.toLowerCase().includes(query)) ||
    [b.book_gettime, b.book_getway, b.book_status, b.book_cnClassification, b.book_usClassification].some((f) => f?.toString().includes(query)) ||
    b.book_isbn.includes(query)
  );
  isSearching = true;
  currentPage = 1;
  displayBooks(filteredBooks);
}

// =======================
// 初始化
// =======================
function refreshBooks(newList, searching = false) {
  document.getElementById("classify").textContent = "类别";
  filteredBooks = newList;
  isSearching = searching;
  currentPage = 1;
  displayBooks(filteredBooks);
  document.getElementById("search-input").value = "";
}

function randomSearch() {
  refreshBooks([...books].sort(() => Math.random() - 0.5));
}
function sortSearch() {
  refreshBooks([...books].sort((a, b) => b.id - a.id));
}
function resetSearch() {
  refreshBooks([...books].reverse());
}

displayBooks(filteredBooks);