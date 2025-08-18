let currentPage = 1;
const itemsPerPage = 3;
let filteredBooks = books.reverse();
let isSearching = false;

window.alert = function(name){
    var iframe = document.createElement("IFRAME");
    iframe.style.display="none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
};

let bookMark = {
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
    z: "Z 综合性图书，含丛书百科、年鉴期刊"
}

function book_clc(mark,bookname,clc,lcc){
    mark = mark.slice(0,1).toLowerCase();

    const dialogMark = document.createElement('div');
    dialogMark.className = 'bookmarkdialog';
    dialogMark.innerHTML = `

    <div id="dialogs">
        <div class="js_dialog" role="dialog"  aria-hidden="true" aria-modal="true" aria-labelledby="js_title1" id="dialogMark" style="display: none;">
            <div class="weui-mask"></div>
            <div class="weui-dialog">
                <div class="weui-dialog__hd"><strong class="weui-dialog__title" id="js_title1">`+bookname+`</strong></div>
                <div class="weui-dialog__bd">`+bookMark[mark]+`<br /><br />中图分类号：`+clc+`<br />美国国会图书馆分类号：`+lcc+`</div>
                <div class="weui-dialog__ft">
                    <a role="button" onclick="dialogClose();" href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">确定</a>
                </div>
            </div>
        </div>
    </div>

    `;
    $('body').append(dialogMark);
    $('#dialogMark').fadeIn(0);
    $('#dialogMark').attr('aria-hidden','false');
    $('#dialogMark').attr('tabindex','0');
    $('#dialogMark').trigger('focus');

    event.stopPropagation(); // 阻止事件冒泡

    //alert("根据中国图书馆分类法，《"+bookname+"》属于如下分类：\n\n"+bookMark[mark]+"\n\n具体类别："+clc+"，对应美国国会图书馆类别："+lcc+"。");
}

function dialogClose(){
    $('.js_dialog').fadeOut(0);
    $('.js_dialog').attr('aria-hidden','true');
    $('.js_dialog').removeAttr('tabindex');
    $('#dialogs').remove();
}

function showGallery(img){
    $gallery = $("#gallery");
    $galleryImg = $("#galleryImg");
    $gallery.attr('aria-hidden','false');
    $gallery.fadeIn(100);
    setTimeout(function(){
        $galleryImg.attr({
            "tabindex":'-1',
            "style":'background-image:url(' + img.getAttribute('src') + ')'
        }).trigger('focus');
    },200);
}

function hideGallery(){
    $gallery = $("#gallery");
    $galleryImg = $("#galleryImg");
    $gallery.attr('aria-hidden','true');
    $gallery.fadeOut(100);
    $galleryImg.attr({
        "tabindex":'0',
        "style":''
    });
}

function displayBooks(books) {
    const bookCards = document.getElementById('book-cards');
    bookCards.innerHTML = '';

    books.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        const card_mark = book.book_cnClassification.slice(0,3).replace(/\d+/g, '').replace('-', '');
        card.innerHTML = `
            <h2><span class="card_mark" onclick="book_clc('`+card_mark+`','${book.book_name}','${book.book_cnClassification}','${book.book_usClassification}')">`+card_mark+`</span>${book.book_name}<label>Id.${book.id}</label></h2>
            <div class="book-details">
                <p><strong>主观评级：</strong style="vertical-align:middle"> <span class="book-star">${createStars(book.book_star)}</span></p>
                <div class="thumbnail"><img onclick="showGallery(this);" onerror="$(this).attr('src','./img/nocover.jpg');" src="./img/${book.book_isbn}.jpg" /></div>
                
                ${book.book_summary ? `<p><strong>内容简介：</strong> ${book.book_summary}</p>` : ''}
                ${book.book_dadsay ? `<p><strong>爸爸说：</strong> ${book.book_dadsay}</p>` : ''}
                ${book.book_momsay ? `<p><strong>妈妈说：</strong> ${book.book_momsay}</p>` : ''}

                <p><strong>图书信息：</strong>本书作者为 <big>${book.book_author}</big>，由 <big>${book.book_press}</big> 出版，${book.book_presstime ? `在架版次为 <big>${book.book_presstime}</big> 。` : ''}${book.book_isbn ? `ISBN/书号/OCLC为 <big>${book.book_isbn}</big> 。` : ''}</p>
                <p><strong>上架信息：</strong>本书${book.book_gettime ? `于 <big>${book.book_gettime}</big> ` : ''}在 <big>${book.book_getcity}</big> ${book.book_getway ? `通过 <big>${book.book_getway}</big> ` : ''}获得。${book.book_price ? `定价为 <big>${book.book_pricecurrent} ${book.book_price} 元</big> ，` : ''}${book.book_getprice ? `获得价格为 <big>${book.book_getpricecurrent} ${book.book_getprice} 元</big> ，` : ''}${book.book_count ? `实存 <big>${book.book_count}</big> 册，` : ''}${book.book_keepcity && book.book_count != 0 ? `现存放于 <big>${book.book_keepcity}</big> ，` : ''}状态 <big>${book.book_status}</big> 。</p>
                <p><strong>建议分类：</strong><big>${book.book_class}</big></p>
                ${book.book_count == 0 ? `<img src="./mark.svg" style="position:absolute; width:18rem; left:50%; margin-left:-9rem; top:15%; pointer-events:none; opacity:.9" />` : ''}
            </div>
        `;
        if(book.book_count == 0){
            card.style = 'background-color:#eee; filter:grayscale(100%)';
        }
        card.addEventListener('click', () => {
            toggleCardDetails(card);
        });
        bookCards.appendChild(card);
    });

    updatePagination();
}

function createStars(stars) {
    let starHtml = '';
    for (let i = 0; i < stars; i++) {
        starHtml += `<svg fill="#f3b04b" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    }
    for (let i = 0; i < 5 - stars; i++) {
        starHtml += `<svg fill="#dadada" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    }
    return starHtml;
}

function updatePagination() {
    const totalItems = filteredBooks.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const bookCount = filteredBooks.reduce((sum, book) => sum + parseInt(book.book_count, 10), 0);
    const pageInfo = document.getElementById('page-info');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const bookTotal = document.getElementById('book-total');
    const searchResultTotal = document.getElementById('search-result-total');

    if (isSearching) {
        searchResultTotal.textContent = `找到${totalItems}部 (${bookCount}册) 图书`;
        bookTotal.style.display = 'none';
        searchResultTotal.style.display = 'block';
    } else {
        bookTotal.textContent = `找到${totalItems}部 (${bookCount}册) 图书`;
        bookTotal.style.display = 'block';
        searchResultTotal.style.display = 'none';
    }

    pageInfo.textContent = `${currentPage} / ${totalPages}`;

    if (currentPage === 1) {
        prevPageButton.disabled = true;
    } else {
        prevPageButton.disabled = false;
    }

    if (currentPage === totalPages || totalPages == 0) {
        nextPageButton.disabled = true;
    } else {
        nextPageButton.disabled = false;
    }
}

function changePage(direction) {
    currentPage += direction;
    displayBooks(filteredBooks);
}

function searchBooks() {
    $('#classify').text('类别');
    const query = document.getElementById('search-input').value.toLowerCase();
    filteredBooks = books.filter(book => 
        book.book_name.toLowerCase().includes(query) ||
        book.book_press.toLowerCase().includes(query) ||
        book.book_author.toLowerCase().includes(query) ||
        book.book_gettime.toString().includes(query) ||
        book.book_getway.toString().includes(query) ||
        book.book_status.toString().includes(query) ||
        book.book_class.toLowerCase().includes(query) ||
        book.book_isbn.includes(query) ||
        book.book_cnClassification.toString().includes(query) ||
        book.book_usClassification.toString().includes(query)
    );

    isSearching = true;
    currentPage = 1;
    displayBooks(filteredBooks);
}

function classifyBooks(){
    weui.picker([{
        label: '不限类别',
        value: '类别'
    }, {
        label: 'A 马列主义、毛泽东思想、邓小平理论',
        value: 'A'
    }, {
        label: 'B 哲学、宗教，含美学、心理学',
        value: 'B'
    }, {
        label: 'C 社会科学总论，含统计学、管理学',
        value: 'C'
    },{
        label: 'D 政治、法律，含社会运动、外交关系',
        value: 'D'
    },{
        label: 'E 军事',
        value: 'E'
    },{
        label: 'F 经济，含财政、金融',
        value: 'F'
    },{
        label: 'G 文化、科学、教育、体育，含科研、传播',
        value: 'G'
    },{
        label: 'H 语言、文字',
        value: 'H'
    },{
        label: 'I 文学',
        value: 'I'
    },{
        label: 'J 艺术',
        value: 'J'
    },{
        label: 'K 历史、地理，含人物传记、考古风俗',
        value: 'K'
    },{
        label: 'N 自然科学总论，含情报学',
        value: 'N'
    },{
        label: 'O 数理科学和化学',
        value: 'O'
    },{
        label: 'P 天文学、地球科学',
        value: 'P'
    },{
        label: 'Q 生物科学，含人类学',
        value: 'Q'
    },{
        label: 'R 医药、卫生',
        value: 'R'
    },{
        label: 'S 农业科学，含农林牧副渔',
        value: 'S'
    },{
        label: 'T 工业技术，含信息产业',
        value: 'T'
    },{
        label: 'U 交通运输',
        value: 'U'
    },{
        label: 'V 航空、航天',
        value: 'V'
    },{
        label: 'X 环境科学、安全科学',
        value: 'X'
    },{
        label: 'Z 综合性图书，含丛书百科、年鉴期刊',
        value: 'Z'
    }], {
        onChange: function (result) {
            console.log(result);
        },
        onConfirm: function (result) {
            $('#classify').text(result);
            if(result == '类别'){
                sortSearch();
                resetSearch();
            }else{
                filteredBooks= books.filter(book => book.book_cnClassification.startsWith(result));
                bookCount = filteredBooks.reduce((sum, book) => sum + parseInt(book.book_count, 10), 0);
                currentPage = 1;
                displayBooks(filteredBooks);
                $('#book-total').hide();
                document.getElementById('search-result-total').textContent = '找到'+filteredBooks.length+'部 ('+bookCount+'册) 图书';
                document.getElementById('search-result-total').style.display = 'block';
                document.getElementById('search-input').value = '';
            }
        },
        title: '筛选图书类别'
    });

    updatePagination();
}

function randomSearch() {
    $('#classify').text('类别');
    for (let i = books.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  // 选择一个随机索引
        [books[i], books[j]] = [books[j], books[i]];  // 交换两个元素的位置
    }
    filteredBooks = books;
    isSearching = false;
    currentPage = 1;
    displayBooks(filteredBooks);
    document.getElementById('search-input').value = '';
}

function sortSearch(){
    $('#classify').text('类别');
    filteredBooks = books.sort((a, b) => b.id - a.id);
    isSearching = false;
    currentPage = 1;
    displayBooks(filteredBooks);
    document.getElementById('search-input').value = '';
}

function resetSearch() {
    $('#classify').text('类别');
    filteredBooks = books;
    isSearching = false;
    currentPage = 1;
    displayBooks(filteredBooks);
    document.getElementById('search-input').value = '';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleCardDetails(card) {
    const allCards = document.querySelectorAll('.book-card');
    allCards.forEach(c => c.classList.remove('expanded'));
    card.classList.add('expanded');
}

const touchprev = document.getElementById("prev-page");
const touchnext = document.getElementById("next-page");
let intervalId;
let isLongPress = false;


touchprev.ontouchstart = function(event) {
    // 设置一个定时器，3秒后开始长按操作
    const longPressTimer = setTimeout(() => {
        isLongPress = true;
        intervalId = setInterval(() => {
            if (currentPage === 1) {
                clearInterval(intervalId); // 当currentPage等于1时停止setInterval
                return;
            }
            changePage(-1);
        }, 50); // 每50毫秒执行一次
    }, 1000); // 3000毫秒即3秒
    // 存储定时器ID以便后续清除
    event.target.dataset.longPressTimer = longPressTimer;
};
touchnext.ontouchstart = function(event) {
    // 设置一个定时器，3秒后开始长按操作
    const longPressTimer = setTimeout(() => {
        isLongPress = true;
        intervalId = setInterval(() => {
            const totalItems = filteredBooks.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            if (currentPage === totalPages) {
                clearInterval(intervalId); // 当currentPage等于1时停止setInterval
                return;
            }
            changePage(1);
        }, 50); // 每50毫秒执行一次
    }, 1000); // 3000毫秒即3秒
    // 存储定时器ID以便后续清除
    event.target.dataset.longPressTimer = longPressTimer;
};

// 当用户手指离开屏幕时触发
touchprev.ontouchend = function(event) {
    // 清除定时器
    clearTimeout(event.target.dataset.longPressTimer);
    clearInterval(intervalId);
    isLongPress = false;
};
touchnext.ontouchend = function(event) {
    // 清除定时器
    clearTimeout(event.target.dataset.longPressTimer);
    clearInterval(intervalId);
    isLongPress = false;
};



// 初始化显示所有图书
displayBooks(books);
