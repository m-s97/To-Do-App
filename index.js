class Item{
    title;
    id;
    date;
    constructor(title,id,date){
        this.title = title;
        this.id = id+1;
        this.date = date;
    }
}
const titleInput = document.querySelector('#textItem');
const submitButton = document.querySelector('.addNewButton');
const addClearButton = document.querySelector('.addClearButton');
const listItem = document.querySelector('.addItem');
const rowAdd = document.querySelector('.rowAdd');
const eventParent = document.querySelector('.eventParent');
const lastDate = document.querySelector('#lastDate');
const rowArchieve = document.querySelector('.rowArchieve');

class ItemList{
    #items = [];
    #archieves = [];
    constructor(){
        // render local storage
        this._renderLocalStorage();

        // render the table
        this._buildTable();

        if(this.#items.length != 0)
        {
            addClearButton.style.display = 'inline-block';
        }

        this._buildArchieve();

        submitButton.addEventListener('click',this._addToList.bind(this));

        addClearButton.addEventListener('click',this._clearList.bind(this));

        eventParent.addEventListener('click',this._rowClicked.bind(this));
    }
    _rowClicked(e){
        let actionItem = e.target.id.split('-');
        console.log(actionItem[0]+' '+(actionItem[1]));

        if(actionItem[0] === 'complete'){
            alert('Task completed');
            // To Remove from list
            this._removeRow(actionItem[1]);
        }else if(actionItem[0] === 'clear'){
            if (confirm("You have not completed the task, do you still want to remove it from list?")) {
                // To Remove from list
                this._removeRow(actionItem[1]);
              } else {
              }
        }
    }
    _removeRow(id){
       // eventParent.removeChild(`#item-${id}`);
       document.querySelector(`#item-${id}`).remove();
        var tempItem = [];
        if(this.#items.length == 1){
            tempItem = [];
        }
        else{
            tempItem = this.#items.slice(0,id-1);
            for(var i = id;i<this.#items.length;i++){
                let item = new Item(this.#items[i].title,tempItem.length,this.#items[i].date);
                tempItem.push(item);
            }
        }
        this.#items = tempItem;
        localStorage.setItem("itemList", JSON.stringify(this.#items));
        location.reload();
    }
    _clearList(){
        this.#items = [];
        localStorage.setItem("itemList", JSON.stringify(this.#items));
        addClearButton.style.display = 'none';
        location.reload();
    }
    _renderLocalStorage(){
        var tempItem = JSON.parse(localStorage.getItem("itemList"));
        if(tempItem){
            //console.log(JSON.parse(tempItem));
            /*for(var i = 0;i<tempItem.length;i++){
                let item = new Item(tempItem[i].title,tempItem[i].id);
                this.#items.push(item);
            }*/
            this.#items = tempItem;
            console.log(this.#items);
        }
    }
    _addToList(){
        var itemTitle = titleInput.value;
        var date = lastDate.value;

        var diff = (new Date(date) - new Date())/1000;
        let days = Math.floor (diff / (60 * 60 * 24))+1;

        if(itemTitle && date && days > -1){
            item = new Item(itemTitle,this.#items.length,date);
            this.#items.push(item);
    
            // put it in local storage
            localStorage.setItem("itemList", JSON.stringify(this.#items));

            // clear the input
            titleInput.value = '';
            lastDate.value = '';

            // render in Table
            this._renderItem(item);
        }
        else{
            alert("Please Enter Item and Future Date to complete!");
        }
    }
    _buildTable(){
        this.#items.forEach(it => {
            this._renderItem(it);
        });
    }
    _renderItem(item){
        var diff = (new Date(item.date) - new Date())/1000;
        let days = Math.floor (diff / (60 * 60 * 24)) + 1;  
        let leftDays;
        if(days <= 0){
            // add to archieve
            leftDays = 'Deadline crossed';
        }
        else if(days == 1 && (new Date(item.date).getDate() == new Date().getDate())){
            //days
            days = 0;
        }
         
         if(days == 0){
             leftDays = 'You have time till Today 23:59.';
         }else if(days > 0){
            leftDays = `You have ${days} left to Complete task.`;
         }
        let html = `<div class="viewItem viewItem-${item.id}" id="item-${item.id}">${item.id} ${item.title}
        <div class="btn-group"> ${leftDays} <button class="clearToDo" id="clear-${item.id}">clear</button>
            <button class="completeToDo" id="complete-${item.id}">Completed</button></div></div>`;
         
        if(item.id == 1)
        rowAdd.insertAdjacentHTML('afterend',html);
        else
            document.querySelector(`.viewItem-${+item.id-1}`).insertAdjacentHTML('afterend',html);
        addClearButton.style.display = 'inline-block';

        if(leftDays == 'Deadline crossed'){
            this._addToArchieve(item);
            this._removeRow(item.id);
        }
    }
    _addToArchieve(item){
        var tempItem = [];
        if(JSON.parse(localStorage.getItem("archieveList")) != null)
            tempItem = JSON.parse(localStorage.getItem("archieveList"));
        this.#archieves = tempItem;
        this.#archieves.push(item);
        localStorage.setItem("archieveList", JSON.stringify(this.#archieves));
        this.#archieves.forEach(it => {
            this._renderArchieve(it);
        });
    }
    _buildArchieve(){
        this.#archieves = JSON.parse(localStorage.getItem("archieveList"));
        if(this.#archieves != null){
            this.#archieves.forEach(it => {
                this._renderArchieve(it);
            });
        }
    }
    _renderArchieve(item){
        let html = `<p class="fas fa-angle-right" id="arc"> ${item.title}</p><br>`;
        rowArchieve.insertAdjacentHTML('afterend',html);
    }
}

item = new ItemList();

