/* ==========================================
   xleborez.ru — JavaScript
   Корзина (LocalStorage), навигация, тосты
   ========================================== */

(function() {
  'use strict';

  // ========== CART MODULE ==========
  const Cart = {
    STORAGE_KEY: 'xleborez_cart',

    get() {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
      } catch {
        return [];
      }
    },

    save(items) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      this.updateBadge();
      this.updateCartPage();
    },

    add(product) {
      const items = this.get();
      const existing = items.find(item => item.id === product.id);
      if (existing) {
        existing.qty += product.qty || 1;
      } else {
        items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || '',
          qty: product.qty || 1,
        });
      }
      this.save(items);
      Toast.show('Товар добавлен в корзину', 'success');
    },

    remove(productId) {
      const items = this.get().filter(item => item.id !== productId);
      this.save(items);
      Toast.show('Товар удалён из корзины', 'success');
    },

    updateQty(productId, qty) {
      const items = this.get();
      const item = items.find(item => item.id === productId);
      if (item) {
        if (qty <= 0) {
          this.remove(productId);
          return;
        }
        item.qty = qty;
        this.save(items);
      }
    },

    getTotal() {
      return this.get().reduce((sum, item) => sum + item.price * item.qty, 0);
    },

    getCount() {
      return this.get().reduce((sum, item) => sum + item.qty, 0);
    },

    clear() {
      localStorage.removeItem(this.STORAGE_KEY);
      this.updateBadge();
      this.updateCartPage();
    },

    updateBadge() {
      document.querySelectorAll('.cart-btn__count').forEach(el => {
        const count = this.getCount();
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
      });
    },

    updateCartPage() {
      const container = document.getElementById('cart-items');
      if (!container) return;

      const items = this.get();
      if (items.length === 0) {
        container.innerHTML = `
          <div class="text-center" style="padding: 3rem 0;">
            <p style="font-size: 1.2rem; color: var(--color-gray-500); margin-bottom: 1.5rem;">
              Корзина пуста
            </p>
            <a href="/catalog/nozhi/" class="btn btn--primary">Перейти в каталог</a>
          </div>
        `;
        document.getElementById('cart-summary-block')?.remove();
        return;
      }

      let html = `
        <table class="cart-table">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Сумма</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
      `;

      items.forEach(item => {
        html += `
          <tr data-id="${item.id}">
            <td>
              <div class="cart-table__product">
                <div class="cart-table__thumb">
                  <img src="${item.image || '/img/products/placeholder.svg'}" alt="${item.name}" loading="lazy">
                </div>
                <div>
                  <strong>${item.name}</strong>
                </div>
              </div>
            </td>
            <td>${item.price.toLocaleString('ru-RU')} ₽</td>
            <td>
              <div class="quantity-selector">
                <button class="qty-minus" data-id="${item.id}">−</button>
                <input type="number" value="${item.qty}" min="1" data-id="${item.id}" readonly>
                <button class="qty-plus" data-id="${item.id}">+</button>
              </div>
            </td>
            <td><strong>${(item.price * item.qty).toLocaleString('ru-RU')} ₽</strong></td>
            <td>
              <span class="cart-table__remove" data-id="${item.id}">Удалить</span>
            </td>
          </tr>
        `;
      });

      html += `</tbody></table>`;
      container.innerHTML = html;

      // Summary
      const total = this.getTotal();
      const summaryHtml = `
        <div id="cart-summary-block" class="cart-summary">
          <div class="cart-summary__row">
            <span>Товаров:</span>
            <span>${this.getCount()} шт.</span>
          </div>
          <div class="cart-summary__row cart-summary__total">
            <span>Итого:</span>
            <span>${total.toLocaleString('ru-RU')} ₽</span>
          </div>
          <a href="/checkout/" class="btn btn--primary btn--lg" style="width:100%;margin-top:1rem;">
            Оформить заказ
          </a>
        </div>
      `;

      // Find existing summary
      let summaryBlock = document.getElementById('cart-summary-block');
      if (summaryBlock) {
        summaryBlock.outerHTML = summaryHtml;
      } else {
        container.insertAdjacentHTML('afterend', summaryHtml);
      }

      // Bind cart events
      this.bindCartEvents();
    },

    bindCartEvents() {
      document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.removeEventListener('click', this._onMinus);
        btn.addEventListener('click', this._onMinus);
      });

      document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.removeEventListener('click', this._onPlus);
        btn.addEventListener('click', this._onPlus);
      });

      document.querySelectorAll('.cart-table__remove').forEach(btn => {
        btn.removeEventListener('click', this._onRemove);
        btn.addEventListener('click', this._onRemove);
      });
    },

    _onMinus(e) {
      const id = e.currentTarget.dataset.id;
      const input = document.querySelector(`input[data-id="${id}"]`);
      const val = parseInt(input.value) - 1;
      Cart.updateQty(id, val);
    },

    _onPlus(e) {
      const id = e.currentTarget.dataset.id;
      const input = document.querySelector(`input[data-id="${id}"]`);
      const val = parseInt(input.value) + 1;
      Cart.updateQty(id, val);
    },

    _onRemove(e) {
      const id = e.currentTarget.dataset.id;
      Cart.remove(id);
    }
  };

  // ========== TOAST MODULE ==========
  const Toast = {
    show(message, type = 'success') {
      // Remove existing toast
      const existing = document.querySelector('.toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = `toast toast--${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);

      // Trigger animation
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  };

  // ========== NAVIGATION ==========
  function initNav() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.header__nav');

    if (burger && nav) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
      });

      // Close on link click
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          burger.classList.remove('active');
          nav.classList.remove('open');
        });
      });
    }
  }

  // ========== QUANTITY SELECTORS (detail page) ==========
  function initQuantity() {
    document.querySelectorAll('.quantity-selector').forEach(group => {
      const minus = group.querySelector('.qty-minus');
      const plus = group.querySelector('.qty-plus');
      const input = group.querySelector('input');

      if (minus && input) {
        minus.addEventListener('click', () => {
          const val = parseInt(input.value) - 1;
          if (val >= 1) input.value = val;
        });
      }

      if (plus && input) {
        plus.addEventListener('click', () => {
          const val = parseInt(input.value) + 1;
          input.value = val;
        });
      }
    });
  }

  // ========== ADD TO CART BUTTONS ==========
  function initAddToCart() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', function() {
        const product = {
          id: this.dataset.id,
          name: this.dataset.name,
          price: parseFloat(this.dataset.price),
          image: this.dataset.image || '',
        };

        const qtyEl = document.querySelector('.quantity-selector input');
        if (qtyEl) product.qty = parseInt(qtyEl.value) || 1;

        Cart.add(product);
      });
    });

    // Also handle cards "В корзину" buttons
    document.querySelectorAll('.product-card__btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.product-card');
        if (!card) return;

        const product = {
          id: card.dataset.id || Math.random().toString(36).substr(2, 9),
          name: card.querySelector('.product-card__title')?.textContent || 'Товар',
          price: parseFloat(card.dataset.price) || 0,
          image: card.querySelector('img')?.src || '',
        };
        Cart.add(product);
      });
    });
  }

  // ========== CHECKOUT FORM ==========
  function initCheckout() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    // Load cart total
    const total = Cart.getTotal();
    const totalEl = document.getElementById('checkout-total');
    if (totalEl) totalEl.textContent = total.toLocaleString('ru-RU') + ' ₽';

    const itemsEl = document.getElementById('checkout-items');
    if (itemsEl) {
      const items = Cart.get();
      if (items.length === 0) {
        itemsEl.innerHTML = '<p style="color:var(--color-gray-500)">Корзина пуста</p>';
        return;
      }
      itemsEl.innerHTML = items.map(item =>
        `<div style="display:flex;justify-content:space-between;padding:4px 0;">
          <span>${item.name} × ${item.qty}</span>
          <span>${(item.price * item.qty).toLocaleString('ru-RU')} ₽</span>
        </div>`
      ).join('');
    }

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем...';

      const formData = new FormData(form);
      const orderItems = Cart.get();
      const orderTotal = Cart.getTotal();

      const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        delivery: formData.get('delivery'),
        address: formData.get('address'),
        comment: formData.get('comment'),
        items: orderItems,
        total: orderTotal,
      };

      try {
        const response = await fetch('/api/send-order.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          Cart.clear();
          Toast.show('Заказ оформлен! Мы свяжемся с вами в ближайшее время.', 'success');
          form.reset();
          if (totalEl) totalEl.textContent = '0 ₽';
          if (itemsEl) itemsEl.innerHTML = '<p style="color:var(--color-gray-500)">Корзина пуста</p>';
        } else {
          Toast.show('Ошибка при отправке. Попробуйте позже.', 'error');
        }
      } catch (err) {
        Toast.show('Ошибка соединения. Попробуйте позже.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Оформить заказ';
      }
    });
  }

  // ========== CALLBACK FORM ==========
  function initCallback() {
    document.querySelectorAll('.callback__form').forEach(form => {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправляем...';

        const formData = new FormData(form);
        const data = {
          name: formData.get('name'),
          phone: formData.get('phone'),
        };

        try {
          const response = await fetch('/api/send-callback.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          const result = await response.json();

          if (result.success) {
            Toast.show('Спасибо! Мы перезвоним вам в течение 30 минут.', 'success');
            form.reset();
          } else {
            Toast.show('Ошибка при отправке. Попробуйте позже.', 'error');
          }
        } catch (err) {
          Toast.show('Ошибка соединения.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Отправить';
        }
      });
    });
  }

  // ========== IMAGE GALLERY (detail page) ==========
  function initGallery() {
    const mainImg = document.getElementById('main-product-image');
    const thumbs = document.querySelectorAll('.product-detail__thumb');

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (!img || !mainImg) return;

        mainImg.src = img.dataset.big || img.src;
        thumbs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  // ========== INIT ==========
  document.addEventListener('DOMContentLoaded', function() {
    // Init cart badge first
    Cart.updateBadge();

    // Check current page
    const page = document.body.dataset.page;

    initNav();
    initQuantity();
    initAddToCart();
    initCallback();
    initGallery();

    if (page === 'cart') {
      Cart.updateCartPage();
    }

    if (page === 'checkout') {
      initCheckout();
    }

    // Active nav link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.header__nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPath.startsWith(href) && href !== '/') {
        link.classList.add('active');
      } else if (href === '/' && currentPath === '/') {
        link.classList.add('active');
      }
    });
  });

  // Expose Cart globally for inline use
  window.Cart = Cart;
  window.Toast = Toast;

})();
