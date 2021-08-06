const todoInput = document.querySelector('input')
const list = document.querySelector('ul')
const todoInfo = document.querySelector('.todoInfo')
const underLines = document.querySelector('.underLines')
const itemNumber = document.querySelector('.itemNumber')
const inputArrow = document.querySelector('.arrow')
const clearBtn = document.querySelector('.clearCompleatedBtn')

let todoList = [{
    value: 'hello',
    id: Date.now(),
    done: false
}]

const deleteTodoItem = (todoId) => {
    setTodoList(todoList.filter(elem => elem.id !== +todoId))
}

const addTodoItem = (itemValue) =>{
    setTodoList([...todoList, {
        value: itemValue,
        id: Date.now(),
        done: false
    }])
}

const changeItemStatus = (id, status) => {
    let newTodoList  

    newTodoList = todoList.map( item => id === item.id ? {...item, done: status} : item)
    setTodoList(newTodoList)
}

const itemRender = () => {
    list.innerText = ''

    todoList.forEach( elem => {
        const li = document.createElement('li')
        const delBtn = document.createElement('div')
        const label = document.createElement('label')
        const checkInput = document.createElement('input')
        const checkmark = document.createElement('span')
        const itemText = document.createElement('p')
        const itemInput = document.createElement('input')

        itemInput.classList.add('itemInput')
        itemText.classList.add('itemText')
        checkInput.setAttribute('type', 'checkBox')
        label.classList.add('container')
        checkmark.classList.add('checkmark')
        
        li.dataset.todoId = elem.id
       
    
        const editItem = editItemClosure(itemInput)

        li.addEventListener('click',() => {
            editItem()
        })

        checkInput.addEventListener('change',(e) => {
            const id = +e.target.parentElement.parentElement.dataset.todoId
            const status = e.target.checked
            changeItemStatus(id, status)
        })
        
        if(!elem.done){
            itemText.classList.add('active')
        } else { 
            checkInput.setAttribute('checked', 'checked')
            itemText.classList.add('notActive')
        }

        delBtn.classList.add('delBtn')
        delBtn.addEventListener('click', ({target:{parentElement:{dataset:{todoId}}}}) => deleteTodoItem(todoId) )

        itemText.textContent = elem.value
        label.append(checkInput, checkmark)
        li.append(label,itemText,itemInput,delBtn)
        list.append(li) 
    })    

    todoInput.value = ''
}

const editItemClosure = (input) => {    // редактирование созданного item по клику.С этим пунктом я еще не закончил .Не знаю как правильно называть замыкание
    let lastClick = 0
    return () => {

        input.addEventListener('click', (e)=>{
            e.stopPropagation()
        }) 

        const d = Date.now();

        if(d - lastClick < 400) {
            input.classList.add('itemInputVisible')    
        } else {
            input.classList.remove('itemInputVisible')
        }
        lastClick = d;
     } 
}


todoInput.addEventListener('keydown', (keyPressed) => {
    const itemValue = todoInput.value.trim()
      
    if(!itemValue){
        todoInput.value = ''
        return
    }

    if (keyPressed.key === 'Enter') {
        addTodoItem(itemValue) 
    }
})

const clearCompleated = () => { // очистка всех выполненых задач 
    const checkedItems = []
    todoList.map(item=>{
       if(item.done === false){
            return checkedItems.push(item)
        }
    })

    setTodoList(checkedItems)
}

const updateClearBtn = () => {
    const someItemStatus = todoList.some(item=>{
        return item.done === true
    })

    if(someItemStatus){
        clearBtn.classList.add('clearCompleatedBtnVisible')
    } else {
        clearBtn.classList.remove('clearCompleatedBtnVisible')
    }
}

clearBtn.addEventListener('click', clearCompleated)


inputArrow.addEventListener('click', ()=>{  // изменение статуса всех items по клику. Нужно немного доделать
    const allItemsStatus = todoList.every(item => {
       return item.done === true
    })
    changeAllItemsStatus(allItemsStatus)
    changeInputArrowColor(allItemsStatus)
    
})

const changeAllItemsStatus = (allItemsStatus) => {
    let newTodoList

    if(allItemsStatus){        
        newTodoList = todoList.map(item => {
            return {...item, done: false}
        })
    } else {
        newTodoList = todoList.map(item => {
           return {...item, done: true}
        })
    }
    setTodoList(newTodoList)
}

const changeInputArrowColor = allItemsStatus => {
    
    if(allItemsStatus){
        inputArrow.classList.remove('arrowDark') 
    } else {
        inputArrow.classList.add('arrowDark')
    }
}

const updateTodoInfo = () => {
    if(todoList.length === 1){
        itemNumber.textContent = `${todoList.length} item left`
    }else{
        itemNumber.textContent = `${todoList.length} items left`
    }

    if(!todoList.length){
        todoInfo.classList.add('todoInfoHide')
        underLines.classList.add('underLinesHide')
    } else {
        todoInfo.classList.remove('todoInfoHide')
        underLines.classList.remove('underLinesHide')
    }
}

const updateInputArrow = () => {
    if(todoList.length){
        inputArrow.classList.add('arrowVisible')
    } else{
        inputArrow.classList.remove('arrowVisible') 
    }
}

const setTodoList = newTodoList => {
    todoList = newTodoList
    itemRender()
    
    updateClearBtn()
    updateTodoInfo()
    updateInputArrow()
}

setTodoList(todoList)

