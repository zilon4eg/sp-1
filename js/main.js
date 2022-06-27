function clickSideMenu(data, basket, basketIdList) {
    const sideMenu = document.querySelectorAll('.side_menu-list li');
    sideMenu.forEach(function(el) {
        //вешаем событие
        el.onclick = function(event) {
            //производим действия
            event.preventDefault();


            
            if (!this.className.includes('side_menu-list-active')) {
                sideMenu.forEach(function(el) {
                    if (el.className.includes('side_menu-list-active')) {
                        el.className = '';
                    }
                });
                this.className = 'side_menu-list-active';
                const dishes = document.querySelectorAll('.dish_item');
                for (const dish of dishes) {
                    console.log(dish);
                    dish.remove();
                }

            }

            for (i=0; i<data.dishes.length; i++) {
                const dishIsVisible = Boolean(data.dishes[i].visible);
                const dishIsDelete = Boolean(data.dishes[i].deleted);
                if ((dishIsVisible) && (!dishIsDelete)) {
                    const sideMenuCategory = String(this.textContent);
                    const dishCategory = String(data.dishes[i].category);
                    if (sideMenuCategory.toLowerCase() === dishCategory.toLowerCase()) {
                        const emptyDishForm = document.querySelector('.empty_dish_item').cloneNode(true);
                        document.querySelector('.dishes').appendChild(emptyDishForm);

                        const dish = document.querySelector('.empty_dish_item');
                        dish.style.display = 'none';
                        dish.className = 'dish_item';
                        dish.dataset.id = data.dishes[i].id;
                        dish.querySelector('.dish_item-title').textContent = data.dishes[i].title;
                        dish.querySelector('.dish_item-weight-number').textContent = data.dishes[i].weight;
                        dish.querySelector('.dish_item-structure').textContent = data.dishes[i].description;
                        dish.querySelector('.dish_item-price-number').textContent = data.dishes[i].price;
                        if (basketIdList.includes(Number(data.dishes[i].id))) {
                            dish.querySelector('.dish_item-btn').classList.remove('dish_item-btn-visible');
                            dish.querySelector('.dish_item-counter').classList.add('dish_item-counter-visible');
                            basket.forEach((el) => {
                                if (Number(el.id) === Number(data.dishes[i].id)) {
                                    dish.querySelector('.dish_item-counter-count').textContent = el.count;
                                }
                            });
                        }
                        dish.style.display = 'flex';
                    }
                }
            }
        }
    });
}

function clickBuyBtn(basket, basketIdList) {
    const buyBtn = document.querySelectorAll('.dish_item-btn');
    buyBtn.forEach(function(el) {
        //вешаем событие
        el.onclick = function(event) {
            //производим действия
            event.preventDefault();
            this.classList.remove('dish_item-btn-visible');
            this.closest('.dish_item-price-btn').querySelector('.dish_item-counter').classList.add('dish_item-counter-visible');
            let count = this.closest('.dish_item-price-btn').querySelector('.dish_item-counter-count');
            count.textContent = 1;

            const dish = this.closest('.dish_item');
            basket.push({
                id: Number(dish.dataset.id),
                count: 1
            });
            basketIdList.push(Number(dish.dataset.id));
        }
    });
}

function clickDishCounter(basket, basketIdList) {
    const dishCounter = document.querySelectorAll('.dish_item-counter svg');
    dishCounter.forEach(function(el) {
        //вешаем событие
        el.onclick = function(event) {
            //производим действия
            event.preventDefault();
            const count = this.closest('.dish_item-counter').querySelector('.dish_item-counter-count');
            if (this.classList.value.includes('dish_item-counter-inc')) {
                count.textContent = Number(count.textContent) + 1;
            }
            else {
                count.textContent = Number(count.textContent) - 1;
                if (Number(count.textContent) < 1) {
                    const counter = this.closest('.dish_item-counter');
                    const buyBtn = this.closest('.dish_item-price-btn').querySelector('.dish_item-btn');
                    counter.classList.remove('dish_item-counter-visible');
                    buyBtn.classList.add('dish_item-btn-visible');
                }
            }
            
            const dish = this.closest('.dish_item');
            if (basketIdList.includes(Number(dish.dataset.id))) {
                basket.forEach((item, index, array) => {
                    if (item.id === Number(dish.dataset.id)) {
                        if (count.textContent > 0) {
                            item.count = count.textContent;
                        }
                        else {
                            basket.splice(index, 1);
                            basketIdList.splice(index, 1);
                        }
                    }
                });
            }
            else {
                basket.push({
                    id: Number(dish.dataset.id),
                    count: Number(count.textContent)
                });
                basketIdList.push(Number(dish.dataset.id));
            }
        }
    });
}

(async () => {
    const baseUrl = 'https://zilon4eg.github.io/sp/';
    const filePath = 'data/dishes.json';
    const dataUrl = `${baseUrl}${filePath}`;

    const response = await fetch(dataUrl);
    const data = await response.json();  // читаем ответ в формате JSON
    console.log(data);

    var basket = [];  // корзина
    var basketIdList = [];

    clickSideMenu(data, basket, basketIdList);
    clickBuyBtn(basket, basketIdList);
    clickDishCounter(basket, basketIdList);
  })()