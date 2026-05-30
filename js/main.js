
const endpoints = [
  {
    method:'GET', path:'/api/products',
    response:`{
  <span class="t-key">"success"</span>: <span class="t-bool">true</span>,
  <span class="t-key">"data"</span>: [
    {
      <span class="t-key">"_id"</span>: <span class="t-str">"64f3b2a1c8d4e5f6a7b8c9d0"</span>,
      <span class="t-key">"name"</span>: <span class="t-str">"Mechanical Keyboard RGB"</span>,
      <span class="t-key">"sku"</span>: <span class="t-str">"KB-001"</span>,
      <span class="t-key">"price"</span>: <span class="t-num">89.99</span>,
      <span class="t-key">"stock"</span>: <span class="t-num">47</span>,
      <span class="t-key">"active"</span>: <span class="t-bool">true</span>,
      <span class="t-key">"tags"</span>: [<span class="t-str">"gaming"</span>, <span class="t-str">"rgb"</span>]
    }
  ],
  <span class="t-key">"pagination"</span>: {
    <span class="t-key">"total"</span>: <span class="t-num">24</span>,
    <span class="t-key">"page"</span>: <span class="t-num">1</span>,
    <span class="t-key">"limit"</span>: <span class="t-num">10</span>,
    <span class="t-key">"totalPages"</span>: <span class="t-num">3</span>
  }
}`
  },
  {
    method:'GET', path:'/api/products/:id',
    response:`{
  <span class="t-key">"success"</span>: <span class="t-bool">true</span>,
  <span class="t-key">"data"</span>: {
    <span class="t-key">"_id"</span>: <span class="t-str">"64f3b2a1c8d4e5f6a7b8c9d0"</span>,
    <span class="t-key">"name"</span>: <span class="t-str">"Mechanical Keyboard RGB"</span>,
    <span class="t-key">"sku"</span>: <span class="t-str">"KB-001"</span>,
    <span class="t-key">"price"</span>: <span class="t-num">89.99</span>,
    <span class="t-key">"stock"</span>: <span class="t-num">47</span>,
    <span class="t-key">"category"</span>: {
      <span class="t-key">"_id"</span>: <span class="t-str">"64f3a1b2c3d4e5f6a7b8c900"</span>,
      <span class="t-key">"name"</span>: <span class="t-str">"Electronics"</span>,
      <span class="t-key">"slug"</span>: <span class="t-str">"electronics"</span>
    },
    <span class="t-key">"createdAt"</span>: <span class="t-str">"2024-09-12T10:22:33.000Z"</span>
  }
}`
  },
  {
    method:'POST', path:'/api/products',
    response:`<span class="t-comment">// Request body:</span>
{
  <span class="t-key">"name"</span>: <span class="t-str">"Wireless Mouse"</span>,
  <span class="t-key">"sku"</span>: <span class="t-str">"MS-003"</span>,
  <span class="t-key">"price"</span>: <span class="t-num">34.99</span>,
  <span class="t-key">"stock"</span>: <span class="t-num">100</span>,
  <span class="t-key">"category"</span>: <span class="t-str">"64f3a1b2c3d4e5f6a7b8c900"</span>
}

<span class="t-comment">// Response 201 Created:</span>
{
  <span class="t-key">"success"</span>: <span class="t-bool">true</span>,
  <span class="t-key">"data"</span>: {
    <span class="t-key">"_id"</span>: <span class="t-str">"64f3c4d5e6f7a8b9c0d1e2f3"</span>,
    <span class="t-key">"name"</span>: <span class="t-str">"Wireless Mouse"</span>,
    <span class="t-key">"sku"</span>: <span class="t-str">"MS-003"</span>,
    <span class="t-key">"price"</span>: <span class="t-num">34.99</span>,
    <span class="t-key">"stock"</span>: <span class="t-num">100</span>,
    <span class="t-key">"active"</span>: <span class="t-bool">true</span>
  }
}`
  },
  {
    method:'PUT', path:'/api/products/:id',
    response:`<span class="t-comment">// Request body (partial update ok):</span>
{
  <span class="t-key">"price"</span>: <span class="t-num">79.99</span>,
  <span class="t-key">"stock"</span>: <span class="t-num">30</span>
}

<span class="t-comment">// Response 200 OK:</span>
{
  <span class="t-key">"success"</span>: <span class="t-bool">true</span>,
  <span class="t-key">"data"</span>: {
    <span class="t-key">"_id"</span>: <span class="t-str">"64f3b2a1c8d4e5f6a7b8c9d0"</span>,
    <span class="t-key">"name"</span>: <span class="t-str">"Mechanical Keyboard RGB"</span>,
    <span class="t-key">"price"</span>: <span class="t-num">79.99</span>,
    <span class="t-key">"stock"</span>: <span class="t-num">30</span>,
    <span class="t-key">"updatedAt"</span>: <span class="t-str">"2024-09-15T14:05:12.000Z"</span>
  }
}`
  },
  {
    method:'PATCH', path:'/api/products/:id/stock',
    response:`<span class="t-comment">// Request body:</span>
{ <span class="t-key">"stock"</span>: <span class="t-num">85</span> }

<span class="t-comment">// Response 200 OK:</span>
{
  <span class="t-key">"success"</span>: <span class="t-bool">true</span>,
  <span class="t-key">"data"</span>: {
    <span class="t-key">"_id"</span>: <span class="t-str">"64f3b2a1c8d4e5f6a7b8c9d0"</span>,
    <span class="t-key">"name"</span>: <span class="t-str">"Mechanical Keyboard RGB"</span>,
    <span class="t-key">"stock"</span>: <span class="t-num">85</span>
  }
}`
  },
  {
    method:'DELETE', path:'/api/products/:id',
    response:`<span class="t-comment">// Soft delete — sets active: false</span>

{
  <span class="t-key">"success"</span>: <span class="t-bool">true</span>,
  <span class="t-key">"message"</span>: <span class="t-str">"Product deactivated successfully"</span>
}

<span class="t-comment">// Product is hidden from public listings</span>
<span class="t-comment">// but preserved in the database</span>`
  },
  {
    method:'POST', path:'/api/auth/login',
    response:`<span class="t-comment">// Request body:</span>
{
  <span class="t-key">"email"</span>: <span class="t-str">"admin@stockpilot.com"</span>,
  <span class="t-key">"password"</span>: <span class="t-str">"Admin1234"</span>
}

<span class="t-comment">// Response 200 OK:</span>
{
  <span class="t-key">"success"</span>: <span class="t-bool">true</span>,
  <span class="t-key">"token"</span>: <span class="t-str">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."</span>,
  <span class="t-key">"user"</span>: {
    <span class="t-key">"id"</span>: <span class="t-str">"64f3a0b1c2d3e4f5a6b7c800"</span>,
    <span class="t-key">"name"</span>: <span class="t-str">"Admin"</span>,
    <span class="t-key">"role"</span>: <span class="t-str">"admin"</span>
  }
}`
  },
  {
    method:'GET', path:'/api/categories',
    response:`{
  <span class="t-key">"success"</span>: <span class="t-bool">true</span>,
  <span class="t-key">"data"</span>: [
    {
      <span class="t-key">"_id"</span>: <span class="t-str">"64f3a1b2c3d4e5f6a7b8c900"</span>,
      <span class="t-key">"name"</span>: <span class="t-str">"Electronics"</span>,
      <span class="t-key">"slug"</span>: <span class="t-str">"electronics"</span>,
      <span class="t-key">"active"</span>: <span class="t-bool">true</span>
    },
    {
      <span class="t-key">"_id"</span>: <span class="t-str">"64f3a1b2c3d4e5f6a7b8c901"</span>,
      <span class="t-key">"name"</span>: <span class="t-str">"Office Supplies"</span>,
      <span class="t-key">"slug"</span>: <span class="t-str">"office-supplies"</span>,
      <span class="t-key">"active"</span>: <span class="t-bool">true</span>
    }
  ]
}`
  }
];

const methodClass={GET:'get',POST:'post',PUT:'put',DELETE:'del',PATCH:'patch'};

function buildEpList(){
  const list=document.getElementById('epList');
  endpoints.forEach((ep,i)=>{
    const item=document.createElement('div');
    item.className='ep-item'+(i===0?' active':'');
    item.innerHTML=`<span class="ep-badge ${methodClass[ep.method]}">${ep.method}</span><span class="ep-path">${ep.path}</span>`;
    item.onclick=()=>selectEp(i,item);
    list.appendChild(item);
  });
  renderResponse(0);
}

function selectEp(i,el){
  document.querySelectorAll('.ep-item').forEach(e=>e.classList.remove('active'));
  el.classList.add('active');
  renderResponse(i);
}

function renderResponse(i){
  const ep=endpoints[i];
  document.getElementById('resTitle').textContent=`${ep.method} ${ep.path}`;
  document.getElementById('resBody').innerHTML=ep.response;
}

buildEpList();

// Scroll reveal
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting)e.target.classList.add('visible');
  });
},{threshold:0.1});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
