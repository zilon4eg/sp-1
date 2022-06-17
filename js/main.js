const popup = document.getElementById('modal_main');

popup.className = 'modal modal_active';

const closeBtn = document.querySelectorAll('.modal__close');

closeBtn.forEach(function(el) {
    //вешаем событие
    el.onclick = function() {

        //производим действия
        console.log(this);
        this.closest('.modal').className = 'modal';
        if (this.className.includes('btn_danger')) {
            document.getElementById('modal_success').className = 'modal modal_active';
        }

    }
});