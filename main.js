// Получаем ссылки на элементы DOM
const productGrid = document.getElementById("productGrid"); // контейнер для карточек товаров
const cartItems = document.getElementById("cartItems");     // список товаров в корзине (<ul>)
const cartTotal = document.getElementById("cartTotal");     // элемент для вывода суммы

// Массив для хранения товаров корзины
let cart = [];

// ======================= ЗАГРУЗКА ТОВАРОВ =======================

// Асинхронная функция для запроса товаров из API
async function fetchProducts() {
  try {
    // Делаем HTTP-запрос к API (берём только 10 товаров)
    const res = await fetch("https://fakestoreapi.com/products?limit=10");

    // Преобразуем ответ в JSON (await ждёт пока загрузится)
    const products = await res.json();

    // Отрисовываем товары на странице
    renderProducts(products);
  } catch (error) {
    // Если что-то пошло не так — покажем ошибку в консоли
    console.error("Ошибка загрузки товаров:", error);
  }
}

// ======================= РЕНДЕР ТОВАРОВ =======================

// Принимает массив товаров и вставляет их карточки в HTML
function renderProducts(products) {
  // Создаём HTML для всех карточек через .map()
  productGrid.innerHTML = products.map((p, i) => `
    <div class="card">
      <!-- Картинка товара -->
      <img src="${p.image}" alt="${p.title}">
      
      <!-- Название -->
      <h3>${p.title}</h3>
      
      <!-- Описание -->
      <p>${p.description}</p>
      
      <!-- Цена -->
      <div class="price">$${p.price}</div>
      
      <!-- Кнопка "Добавить в корзину" -->
      <button onclick="addToCart(${i}, '${p.title}', ${p.price})">
        Add to Cart
      </button>
    </div>
  `).join(""); // .join("") объединяет массив строк в одну большую строку
}

// ======================= КОРЗИНА =======================

// Функция добавления товара в корзину
function addToCart(index, name, price) {
  // Добавляем объект товара (название и цена) в массив cart
  cart.push({ name, price });

  // Перерисовываем корзину
  renderCart();
}

// Функция рендера корзины
function renderCart() {
  // Для каждого товара создаём <li> с кнопкой "x" для удаления
  cartItems.innerHTML = cart.map((item, i) => `
    <li>
      ${item.name} - $${item.price}
      <button class="remove-btn" onclick="removeFromCart(${i})">x</button>
    </li>
  `).join("");

  // Считаем итоговую сумму через reduce
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // Показываем итог (с двумя знаками после запятой)
  cartTotal.textContent = "Total: $" + total.toFixed(2);
}

// Функция удаления одного товара из корзины
function removeFromCart(index) {
  // Удаляем товар по индексу
  cart.splice(index, 1);

  // Перерисовываем корзину
  renderCart();
}

// Функция очистки всей корзины
function clearCart() {
  // Просто делаем пустой массив
  cart = [];

  // Перерисовываем корзину
  renderCart();
}

// ======================= СТАРТ =======================

// Загружаем товары сразу при запуске скрипта
fetchProducts();
