const todoInput = document.querySelector('input')
const list = document.querySelector('ul')
const todoInfo = document.querySelector('.todoInfo')
const underLines = document.querySelector('.underLines')
const itemNumber = document.querySelector('.itemNumber')

let todoList = [{
    value: 'hello',
    id: Date.now(),
    done: false
}]

const delTodoItem = (todoId) => {
    const newTodoList = todoList.filter(elem => elem.id !== +todoId)
    setTodoList(newTodoList)
}

const addTodoItem = (itemValue, newTodoList) =>{
    newTodoList.push({
        value: itemValue,
        id: Date.now(),
        done: false
    })
    setTodoList(newTodoList)
}

const changeItemStatus = (id, status) => {
    todoList.map( item => {
        if(id === item.id){
            return item.done = status          
        } 
    })
    setTodoList(todoList)
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

        itemText.classList.add('itemText')
        checkInput.setAttribute('type', 'checkBox')
        label.classList.add('container')
        checkmark.classList.add('checkmark')
        
        li.dataset.todoId = elem.id

        checkInput.addEventListener('change',(e) => {
            const id = +e.target.parentElement.parentElement.dataset.todoId
            const status = e.target.checked
            changeItemStatus(id, status)
        } 
        )
        
        if(!elem.done){
            itemText.classList.add('active')
        } else { 
            checkInput.setAttribute('checked', 'checked')
            itemText.classList.add('notActive')
        }

        delBtn.classList.add('delBtn')
        delBtn.addEventListener('click', ({target:{parentElement:{dataset:{todoId}}}}) => delTodoItem(todoId) )

        itemText.textContent = elem.value
        label.append(checkInput, checkmark)
        li.append(label,itemText,delBtn)
        list.append(li) 
    })    

    todoInput.value = ''
}

todoInput.addEventListener('keydown', (keyPressed) => {
    const itemValue = todoInput.value.trim()
    const newTodoList = todoList.slice() // не уверен, нужно это или нет. Так я создаю независимый массив и не мутирую исходный.
    
    if(!itemValue){
        todoInput.value = ''
        return
    }

    if (keyPressed.key === 'Enter') {
        addTodoItem(itemValue, newTodoList) 
    }
})

const showTodoInfo = () => {
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

const setTodoList = newTodoList => {
    todoList = newTodoList
    itemRender()

    showTodoInfo()
}

setTodoList(todoList)


// 1. setTodoList
// 2. checkbox checked
// 3. delete, add функции переделай так, чтобы в них передавалась информация, которая относится к их предназначению, т. е. для удаления это будет id, а для добавление label. Также убери логику, которая не относится к тому, для чего они предназначены, т. е. какие-то проверки и т. п.
// Это нужно сделать, потому что каждая функция не должна ничего большего делать, кроме того, что ожидается
// Проверки, вытаскивание айди из ивента ты можешь делать в самих обработчиках