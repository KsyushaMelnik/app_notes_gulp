const $addBtn = document.querySelector('.add-btn');
const $containerNotes = document.querySelector('.container__notes');
const $containerModal = document.querySelector('.container__modal');
const noteWidth = 250;
const noteHeight = 300;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

let $currentNote = null;
let currentNoteIndex = null;
let notes = null;
let date = '';
let text = '';
let isAction = false;

let startCoords = {
    x: 0,
    y: 0
}
let currentCoords = {
    x: 0,
    y: 0
}

let deltaCoords = {
    x: 0,
    y: 0
}

if (localStorage.getItem('noteCoords')) {
    notes = JSON.parse(localStorage.getItem('noteCoords'));
    noteGenerator(notes);

    console.log(notes);
}

function noteGenerator(list) {
    let template = '';
    for (let i = 0; i < list.length; i++) {
        template += '<div class="note" data-index="' + i + '" style="left: ' + list[i].x + 'px; top: ' + list[i].y + 'px;">' +
        '<div class="note__content" style="background-color:'+list[i].color+'">' +
        '<div class="btn"><span class="del-btn" data-delete="'+i+'">X</span></div>' +
        '<div class="note__date"><p>Дата:</p><input class="input-date" data-date="'+i+'" type="date" value="'+list[i].date+'"></div>' +
        '<div class="note__text"><textarea class="note-textarea" data-text="'+i+'" rows="10">'+list[i].text+'</textarea></div>' +
        '</div></div>';

    }
    $containerNotes.innerHTML = template;
}

function confirmGenerator(list) {
    let template = '';
    template += '<div class="overlay"></div>' +
    '<div class="modal"><p class="modal__header">Подтвердите действие</p><p class="modal__text">Точно хотите удалить?</p>'+
    '<div class="modal__btn"><div class="btn btnYes">Да</div><div class="btn btnCancel">Отмена</div></div>' +
    '</div>'
    $containerModal.innerHTML = template;
}

function moveController(coords) {
    $currentNote.style.cssText = 'left: ' + coords.x + 'px; top: ' + coords.y + 'px';    
}

document.querySelector('body').addEventListener('click', function(e){
    //Считываем выбранную дату + записываем в LocalStorage
    if(e.target.classList.contains('input-date')){
        $currentNote = e.target;
        currentNoteIndex = $currentNote.getAttribute('data-date');
        $currentNote.addEventListener('input', function(){
            date = this.value;
            notes[currentNoteIndex].date = date;
            localStorage.setItem('noteCoords', JSON.stringify(notes));
        });
    }
    //Считываем текст с textarea + записываем в LocalStorage
    if(e.target.classList.contains('note-textarea')){
        $currentNote = e.target;
        currentNoteIndex = $currentNote.getAttribute('data-text');
        $currentNote.addEventListener('input', function(){
            text = this.value;
            notes[currentNoteIndex].text = text;
            localStorage.setItem('noteCoords', JSON.stringify(notes));
        });
    }
    //Удаление карточки и обновление LocalStorage
    if(e.target.classList.contains('del-btn')){
        $currentNote = e.target;
        currentNoteIndex = $currentNote.getAttribute('data-delete');
        confirmGenerator();
        document.querySelector('.container__modal').classList.add('active');
        
        document.querySelector('.btnCancel').addEventListener('click', function(){
            document.querySelector('.container__modal').classList.remove('active');
        }); 
        document.querySelector('.overlay').addEventListener('click', function(){
            document.querySelector('.container__modal').classList.remove('active');
        });    
    } 
    if(e.target.classList.contains('BtnYes'))
});


document.querySelector('body').addEventListener('mousedown', function (e) {
    if (e.target.classList.contains('note')) {
        $currentNote = e.target;
        currentNoteIndex = $currentNote.getAttribute('data-index');
        isAction = true;
        startCoords.x = e.clientX;
        startCoords.y = e.clientY;
    }
});

document.querySelector('body').addEventListener('mouseup', function (e) {
    isAction = false;
    if (e.target.classList.contains('note')) {
        notes[currentNoteIndex].x = deltaCoords.x;
        notes[currentNoteIndex].y = deltaCoords.y; 
        
        localStorage.setItem('noteCoords', JSON.stringify(notes));
    }
});

document.querySelector('body').addEventListener('mousemove', function (e) {
    if (isAction == true) {
        currentCoords.x = e.clientX;
        currentCoords.y = e.clientY;

        deltaCoords.x = notes[currentNoteIndex].x + (currentCoords.x - startCoords.x);
        deltaCoords.y = notes[currentNoteIndex].y + (currentCoords.y - startCoords.y);

        if (deltaCoords.x <= 0) deltaCoords.x = 0;
        if (deltaCoords.x >= (windowWidth - noteWidth)) deltaCoords.x = windowWidth - noteWidth;

        if (deltaCoords.y <= 0) deltaCoords.y = 0;
        if (deltaCoords.y >= (windowHeight - noteHeight)) deltaCoords.y = windowHeight - noteHeight;

        moveController(deltaCoords);
    }
});

$addBtn.addEventListener('click', function () {
    let bgColor = '#' + (Math.random().toString(16) + 'ffffff').substring(2,8);
    if (notes) {
        notes.push({
            x: 0,
            y: 0,
            date: '',
            text: '',
            color: bgColor 
        });
    } else {
        notes = [
            {
                x: 0,
                y: 0,
                date: '',
                text: '',
                color: bgColor 
            }
        ]
    }
    noteGenerator(notes);
});