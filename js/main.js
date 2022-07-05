function scrollTo(blockClass, position) {
    if (blockClass.includes('.')) {
        var className = blockClass;
    } else {
        var className = `.${blockClass}`;
    }

    if (String(position).toLocaleLowerCase() === 'center') {
        var blockPosition = {behavior: 'smooth', block: "center", inline: "center"};
    } else {
        var blockPosition = {behavior: 'smooth'};
    }
    document.querySelector(className).scrollIntoView(blockPosition);
}

function modalBackgroundResize() {
    const modBackground = document.querySelector('.modal_windows');
    modBackground.style.height = '';

    const modWindowSize = document.querySelector('.modal_basket').offsetHeight;
        // const modBackground = document.querySelector('.modal_windows');
        if (Number(modBackground.offsetHeight) < (Number(modWindowSize) + 50)) {
            modBackground.style.height = `${Number(modWindowSize) + 50}px`;
            scrollTo('modal_windows', 'top');
        } else {
            modBackground.style.height = '';
            scrollTo('modal_basket-list', 'center');
        }
}

function modalBasketFormReset() {
    const modalBasketItems = document.querySelectorAll('.modal_basket-item');
    for (let item of modalBasketItems) {
        item.remove();
    }

    const modBackground = document.querySelector('.modal_windows');
    modBackground.style.height = '';
}

function dishesListReset() {
    const dishItems = document.querySelectorAll('.dish_item');
        for (let dish of dishItems) {
            dish.remove();
        }
}

function modalBasket(data, basket) {
    const modalClose = document.querySelector('.modal_basket-close');
    const modalBasketWindow = document.querySelector('.modal_windows');
    modalClose.onclick = function(event) {
        //производим действия
        event.preventDefault();
        hiddenSwitch(modalBasketWindow);
        modalBasketFormReset();
        dishesListReset();
        fillDishesList(data, basket);
    }

    const modalCounter = document.querySelectorAll('.modal_basket-item-counter svg');
    modalCounter.forEach(function(el) {
        //вешаем событие
        el.onclick = function(event) {
            //производим действия
            event.preventDefault();
            const count = this.closest('.modal_basket-item-counter').querySelector('.modal_basket-item-counter-count');
            const modalBasketItem = this.closest('.modal_basket-item');
            if (this.classList.value.includes('modal_basket-item-counter-inc')) {
                count.textContent = Number(count.textContent) + 1;
                basket.add(Number(modalBasketItem.dataset.id), 1);
            }
            else {
                count.textContent = Number(count.textContent) - 1;
                basket.remove(Number(modalBasketItem.dataset.id), 1);
                if (count.textContent < 1) {
                    modalBasketItem.remove();
                    modalBackgroundResize();
                }
            }

            const modalPrice = this.closest('.modal_basket-item').querySelector('.modal_basket-item-price-number');
            for (i=0; i<data.dishes.length; i++) {
                if (Number(data.dishes[i].id) === Number(this.closest('.modal_basket-item').dataset.id)) {
                    const price = Number(data.dishes[i].price) * Number(count.textContent);
                    modalPrice.textContent = price;
                }
            }

            const allElements = document.querySelectorAll('.modal_basket-item');
            let resultPrice = 0;
            allElements.forEach((item, index, array) => {
                resultPrice += Number(item.querySelector('.modal_basket-item-price-number').textContent);
            });
            document.querySelector('.modal_basket-result-price').textContent = resultPrice;

            if (allElements.length < 1) {
                hiddenSwitch(modalBasketWindow);
                dishesListReset();
                fillDishesList(data, basket);
            }
        }
    });
}

function createModalBasketList(data, basket) {
    let resultPrice = 0;
    const dishes = basket.getAll();
    dishes.forEach(el => {
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
    modalBasket(data, basket);
}

function dishCardCounter(basket) {
    const dishCounter = document.querySelectorAll('.dish_item-counter svg');
    dishCounter.forEach(function(el) {
        //вешаем событие
        el.onclick = function(event) {
            //производим действия
            event.preventDefault();
            const dishCard = this.closest('.dish_item');
            const count = this.closest('.dish_item-counter').querySelector('.dish_item-counter-count');
            if (this.classList.value.includes('dish_item-counter-inc')) {
                count.textContent = Number(count.textContent) + 1;
                basket.add(Number(dishCard.dataset.id), 1)
            } else {
                count.textContent = Number(count.textContent) - 1;
                basket.remove(Number(dishCard.dataset.id), 1)
                if (Number(count.textContent) < 1) {
                    const counter = dishCard.querySelector('.dish_item-counter');
                    const buyBtn = dishCard.querySelector('.dish_item-btn');
                    hiddenSwitch(counter);
                    hiddenSwitch(buyBtn);
                }
            }
        }
    });
}

function basketBtn(data, basket) {
    const modalBasketWindow = document.querySelector('.modal_windows');

    const basketBtn = document.querySelectorAll('.side_menu-basket-btn');
    basketBtn.forEach(element => {
        element.onclick = function(event) {
            //производим действия
            event.preventDefault();
            modalBasketWindow.classList.remove('hidden');
            createModalBasketList(data, basket);
            modalBackgroundResize();
        }
    });
}

function buyBtnCard(basket) {
    const buyBtn = document.querySelectorAll('.dish_item-btn');
    buyBtn.forEach(function(el) {
        //вешаем событие
        el.onclick = function(event) {
            //производим действия
            event.preventDefault();
            hiddenSwitch(el);
            const counter = this.closest('.dish_item-price-btn').querySelector('.dish_item-counter');
            let count = this.closest('.dish_item-price-btn').querySelector('.dish_item-counter-count');
            count.textContent = 1;
            const dish = this.closest('.dish_item');
            basket.add(Number(dish.dataset.id), 1);
            hiddenSwitch(counter);
        }
    });
}

function fillDishesList(data, basket) {
    for (i=0; i<data.dishes.length; i++) {
        const dishIsVisible = Boolean(data.dishes[i].visible);
        const dishIsDelete = Boolean(data.dishes[i].deleted);
        if ((dishIsVisible) && (!dishIsDelete)) {
            const sideMenuCategory = String(document.querySelector('.side_menu-item-active').textContent);
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
                if (basket.includesId(Number(data.dishes[i].id))) {
                    hiddenSwitch(dish.querySelector('.dish_item-btn'));
                    hiddenSwitch(dish.querySelector('.dish_item-counter'));
                    const basketList = basket.getAll();
                    basketList.forEach((el) => {
                        if (Number(el.id) === Number(data.dishes[i].id)) {
                            dish.querySelector('.dish_item-counter-count').textContent = el.count;
                        }
                    });
                }
            }
        }
    }
    clickHandler(data, basket);
}

function hiddenSwitch(el) {
    if (el.className.includes('hidden')) {
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

function sideMenu(data, basket) {
    const sideMenuList = document.querySelectorAll('.side_menu-list li');
    sideMenuList.forEach(function(el) {
        //вешаем событие
        el.onclick = function(event) {
            //производим действия
            event.preventDefault();
            if (!this.className.includes('side_menu-item-active')) {
                sideMenuList.forEach(function(el) {
                    if (el.className.includes('side_menu-item-active')) {
                        el.classList.remove('side_menu-item-active');
                    }
                });
                this.classList.add('side_menu-item-active');
                const dishes = document.querySelectorAll('.dish_item');
                for (const dish of dishes) {
                    dish.remove();
                }
                fillDishesList(data, basket);
            }
        }
    });
}

function burgerMenu() {
    const burgerMenuMibile = document.querySelector('.side_menu-burger-mobile');
    const sideMenuBasketMobile = document.querySelector('.side_menu-basket-mobile');
    const sideMenu = document.querySelector('.side_menu');
    const dishesList = document.querySelector('.dishes_list');
    burgerMenuMibile.addEventListener('click', () => {
        burgerMenuMibile.style.display = 'none';
        sideMenuBasketMobile.style.display = 'none';
        sideMenu.style.display = 'flex';
        dishesList.style.width = 'calc(100% - 200px)';
        document.querySelector('html').scrollIntoView({behavior: 'smooth'});
    });

    const burgerMenu = document.querySelector('.side_menu-burger');
    burgerMenu.addEventListener('click', () => {
        burgerMenuMibile.style.display = '';
        sideMenuBasketMobile.style.display = '';
        sideMenu.style.display = 'none';
        dishesList.style.width = '';
    });
}

function orientationChange() {
    // Прослушка события смены ориентации
    window.addEventListener("orientationchange", function() {
        // Выводим числовое значение ориентации
        // this.alert(window.orientation);
        if (Number(window.orientation) != 0) {
            const burgerMenuMibile = document.querySelector('.side_menu-burger-mobile');
            const sideMenuBasketMobile = document.querySelector('.side_menu-basket-mobile');
            const sideMenu = document.querySelector('.side_menu');
            const dishesList = document.querySelector('.dishes_list');
            burgerMenuMibile.style.display = 'none';
            sideMenuBasketMobile.style.display = 'none';
            sideMenu.style.display = 'flex';
            dishesList.style.width = 'calc(100% - 200px)';
        }
    }, false);
}

function clickHandler(data, basket) {
    sideMenu(data, basket);
    buyBtnCard(basket);
    basketBtn(data, basket);
    dishCardCounter(basket);
    burgerMenu();
    orientationChange();
}

class Backet {
    #basket = [];
    #basketIdList = [];

    add(id, count) {
        if (this.#basket.length === 0) {
            this.#basket.push({id: id, count: count});
            this.#basketIdList.push(id);
        } else {
            if (this.#basketIdList.includes(Number(id))) {
                this.#basket.forEach((item, index, array) => {
                    if (item.id === Number(id)) {
                        item.count += Number(count);
                    }
                });
            } else {
                this.#basket.push({id: Number(id), count: Number(count)});
                this.#basketIdList.push(Number(id));
            }
        }
        this.#button();
    }

    remove(id, count) {
        if (this.#basket.length > 0) {
            if (this.#basketIdList.includes(Number(id))) {
                this.#basket.forEach((item, index, array) => {
                    if (item.id === Number(id)) {
                        item.count -= Number(count);
                        if (item.count < 1) {
                            this.#basket.splice(index, 1);
                            this.#basketIdList.splice(index, 1);
                        }
                    }
                });
            }
        }
        this.#button();
    }

    getAll() {
        return Object.values(this.#basket);
    }

    includesId(id) {
        if (this.#basketIdList.includes(Number(id))) {
            return true;
        } else {
            return false;
        }
    }

    #button() {
        if (this.#basket.length < 1) {
            document.querySelector('.side_menu-basket-count').textContent = 0;
            document.querySelector('.side_menu-basket').classList.add('hidden');
            document.querySelector('.side_menu-basket-mobile').classList.add('hidden');
        } else {
            let count = 0;
            this.#basket.forEach(el => {
                count += el.count;
            });
            document.querySelectorAll('.side_menu-basket-count').forEach(element => {
                element.textContent = count;
            });
            document.querySelector('.side_menu-basket').classList.remove('hidden');
            document.querySelector('.side_menu-basket-mobile').classList.remove('hidden');
        }
    }
}

class Data {
    static async getJson() {
        const response = await fetch('https://sferapitaniya.github.io/sp/data/dishes.json');
        return await response.json();
    }
}


(async () => {
// ===============================
const data = await Data.getJson();
const dataList = data.dishes;
let basket = new Backet();
fillDishesList(data, basket);
// ===============================
})();