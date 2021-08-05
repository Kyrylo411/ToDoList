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

const delTodoItem = ({target:{parentElement}}) => {
    const index = todoList.findIndex(elem => elem.id === +parentElement.dataset.todoId);
    
    if (index !== -1) {
        todoList.splice(index, 1);
    }
    setTodoList(todoList)
}

const addTodoItem = () =>{
    const itemValue = todoInput.value.trim()

    if(!itemValue){
        todoInput.value = ''
        return
    }
    todoList.push({
        value: itemValue,
        id: Date.now(),
        done: false
    })
    setTodoList(todoList)
}

const itemRender = (newTodoList = todoList ) => {
    list.innerText = ''

    newTodoList.forEach( elem => {
        const li = document.createElement('li')
        const delBtn = document.createElement('button')
        const label = document.createElement('label')
        const checkInput = document.createElement('input')
        const checkmark = document.createElement('span')
        const itemText = document.createElement('p')

        itemText.classList.add('itemText')
        checkInput.setAttribute('type', 'checkBox')
        label.classList.add('container')
        checkmark.classList.add('checkmark')
        
        li.dataset.todoId = elem.id

        checkInput.addEventListener('change', changeItemStatus)
        
        if(!elem.done){
            itemText.classList.add('active')
        } else { 
            checkInput.setAttribute('checked', 'checked')
            itemText.classList.add('notActive')
        }

        delBtn.classList.add('delBtn')
        delBtn.addEventListener('click', delTodoItem)

        itemText.textContent = elem.value
        label.append(checkInput, checkmark)
        li.append(label,itemText,delBtn)
        list.append(li) 
    })    

    todoInput.value = ''
}

const changeItemStatus = ({target:{parentElement:{parentElement}}}) => {
    todoList.forEach( item => {
        if(+parentElement.dataset.todoId === item.id){
            item.done = !item.done
            console.log(todoList)
        }
        setTodoList(todoList)
    })   
}

todoInput.addEventListener('keydown', (keyPressed) => {
    if (keyPressed.key === 'Enter') {
        addTodoItem() 
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
    itemRender(newTodoList)
    showTodoInfo()
}

setTodoList(todoList)
