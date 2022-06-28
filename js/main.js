function basketVisibility(basket, basketIdList) {
    const basketCountForm = document.querySelector('.side_menu-backet-count');
    let basketCount = 0;
    basket.forEach((el) => {
        basketCount += el.count;
    });
    basketCountForm.textContent = basketCount;

    const sidebarBacket = document.querySelector('.side_menu-backet');
    if (basketIdList.length > 0) {
        sidebarBacket.classList.remove('empty_basket');
    }
    else {
        sidebarBacket.classList.add('empty_basket');
    }
}

function fillDishesList(data, basket, basketIdList) {
    for (i=0; i<data.dishes.length; i++) {
        const dishIsVisible = Boolean(data.dishes[i].visible);
        const dishIsDelete = Boolean(data.dishes[i].deleted);
        if ((dishIsVisible) && (!dishIsDelete)) {
            const sideMenuCategory = String(document.querySelector('.side_menu-list-active').textContent);
            const dishCategory = String(data.dishes[i].category);
            if (sideMenuCategory.toLowerCase() === dishCategory.toLowerCase()) {
                const emptyDishForm = document.querySelector('.empty_dish_item').cloneNode(true);
                document.querySelector('.dishes').appendChild(emptyDishForm);

                const dish = document.querySelector('.empty_dish_item');
                // dish.style.display = 'none';
                dish.className = 'dish_item';
                dish.dataset.id = data.dishes[i].id;
                dish.querySelector('.dish_item-img').src = `../sp/img/dishes/${data.dishes[i].id}.jpeg`;
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
                // dish.style.display = 'flex';
            }
        }
    }
    clickSideMenu(data, basket, basketIdList);
    clickBuyBtn(basket, basketIdList);
    clickDishCounter(basket, basketIdList);
    basketVisibility(basket, basketIdList);
}

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
                    dish.remove();
                }
                fillDishesList(data, basket, basketIdList);
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
            basketVisibility(basket, basketIdList);
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
                            item.count = Number(count.textContent);
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
            basketVisibility(basket, basketIdList);
        }
    });
}

function modalBasket(data, basket, basketIdList) {
    const modalClose = document.querySelector('.modal_basket-close');
    const modalBasketWindow = document.querySelector('.modal_basket');
    modalClose.onclick = function(event) {
        //производим действия
        event.preventDefault();
        modalBasketWindow.classList.remove('modal_basket-visible');
        const modalBasketItems = document.querySelectorAll('.modal_basket-item');
        for (let item of modalBasketItems) {
            item.remove();
        }
        const dishItems = document.querySelectorAll('.dish_item');
        for (let dish of dishItems) {
            dish.remove();
        }
        fillDishesList(data, basket, basketIdList);
    }

    const modalCounter = document.querySelectorAll('.modal_basket-item-counter svg');
    modalCounter.forEach(function(el) {
        //вешаем событие
        el.onclick = function(event) {
            //производим действия
            event.preventDefault();
            const count = this.closest('.modal_basket-item-counter').querySelector('.modal_basket-item-counter-count');
            if (this.classList.value.includes('modal_basket-item-counter-inc')) {
                count.textContent = Number(count.textContent) + 1;
            }
            else {
                count.textContent = Number(count.textContent) - 1;
            }

            const modalPrice = this.closest('.modal_basket-item').querySelector('.modal_basket-item-price-number');
            for (i=0; i<data.dishes.length; i++) {
                if (Number(data.dishes[i].id) === Number(this.closest('.modal_basket-item').dataset.id)) {
                    const price = Number(data.dishes[i].price) * Number(count.textContent);
                    modalPrice.textContent = price;
                }
            }

            const modalBasketItem = this.closest('.modal_basket-item');
            basket.forEach((item, index, array) => {
                if (item.id === Number(modalBasketItem.dataset.id)) {
                    if (count.textContent > 0) {
                        item.count = Number(count.textContent);
                    }
                    else {
                        basket.splice(index, 1);
                        basketIdList.splice(index, 1);
                        modalBasketItem.remove();
                    }
                }
            });

            const allElements = document.querySelectorAll('.modal_basket-item');
            let resultPrice = 0;
            allElements.forEach(el => {
                resultPrice += Number(el.querySelector('.modal_basket-item-price-number').textContent);
            });
            document.querySelector('.modal_basket-result-price').textContent = resultPrice;
        }
        orderBtn();
    });
}

function createModalBasketList(data, basket, basketIdList) {
    let resultPrice = 0;
    basket.forEach(el => {
        const emptyBasketForm = document.querySelector('.empty_modal_basket-item').cloneNode(true);
        document.querySelector('.modal_basket-list').appendChild(emptyBasketForm);
        const basketForm = document.querySelector('.empty_modal_basket-item');
        basketForm.dataset.id = el.id;
        basketForm.querySelector('.modal_basket-item-counter-count').textContent = el.count;
        for (i=0; i<data.dishes.length; i++) {
            if (Number(data.dishes[i].id) === Number(el.id)) {
                basketForm.querySelector('.modal_basket-item-img img').src = `../sp/img/dishes/${data.dishes[i].id}.jpeg`;
                basketForm.querySelector('.modal_basket-item-title').textContent = data.dishes[i].title;
                basketForm.querySelector('.modal_basket-item-structure').textContent = data.dishes[i].description;
                basketForm.querySelector('.modal_basket-item-weight-number').textContent = data.dishes[i].weight;
                const price = Number(data.dishes[i].price) * Number(el.count);
                basketForm.querySelector('.modal_basket-item-price-number').textContent = price;
                resultPrice += price;
                break;
            }
        }
        basketForm.className = 'modal_basket-item';
    });
    document.querySelector('.modal_basket-result-price').textContent = resultPrice;
}

function orderBtn() {
    const modalOrderBtn = document.querySelector('.modal_basket-btn');
    modalOrderBtn.onclick = function(event) {
        //производим действия
        event.preventDefault();
        const items = document.querySelectorAll('.modal_basket-item');
        let body = 'Здравствуйте,\nПримите пожалуйста заказ:\n';
        items.forEach(item => {
            const title = item.querySelector('.modal_basket-item-title').textContent;
            const count = item.querySelector('.modal_basket-item-counter-count').textContent;
            body = body + `${title} - ${count}шт.\n`
        });
        
        window.open(`mailto:zakaz@sferapitania.ru?subject=Заказ&body=${encodeURIComponent(body)}`);
    }
}

function sideMenuBasketBtn(data, basket, basketIdList) {
    const modalBasketWindow = document.querySelector('.modal_basket');

    const basketBtn = document.querySelector('.side_menu-backet');
    basketBtn.onclick = function(event) {
        //производим действия
        event.preventDefault();
        modalBasketWindow.classList.add('modal_basket-visible');
        createModalBasketList(data, basket, basketIdList);
        modalBasket(data, basket, basketIdList);
    }

    const basketCount = document.querySelector('.side_menu-backet-count');
    basketCount.onclick = function(event) {
        //производим действия
        event.preventDefault();
        modalBasketWindow.classList.add('modal_basket-visible');
        createModalBasketList(data, basket, basketIdList);
        modalBasket(data, basket, basketIdList);
    }
}


(async () => {
    const baseUrl = 'https://zilon4eg.github.io/sp/';
    const filePath = 'data/dishes.json';
    const dataUrl = `${baseUrl}${filePath}`;

    const response = await fetch(dataUrl);
    const data = await response.json();  // читаем ответ в формате JSON

    var basket = [];  // корзина
    var basketIdList = [];

    fillDishesList(data, basket, basketIdList);
    clickSideMenu(data, basket, basketIdList);
    clickBuyBtn(basket, basketIdList);
    clickDishCounter(basket, basketIdList);
    sideMenuBasketBtn(data, basket, basketIdList);
  })()