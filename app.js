const todoInput = document.querySelector('input')
const list = document.querySelector('ul')
const todoInfo = document.querySelector('.todoInfo')
const underLines = document.querySelector('.underLines')
const itemNumber = document.querySelector('.itemNumber')

const todoList = [{
    value: 'hello',
    id: Date.now(),
    done: false
}]

const deleteTodoItem = ({target:{parentElement}}) => {
    const index = todoList.findIndex(elem => elem.id === +parentElement.dataset.todoId);
    
    if (index !== -1) {
        todoList.splice(index, 1);
    }
    todoInfoToggle()
    itemRender()
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
    todoInfoToggle()
    itemRender()
}

const itemRender = () => {
    list.innerText = ''

    todoList.forEach( elem => {
        const li = document.createElement('li')
        const delBtn = document.createElement('button')
        const label = document.createElement('div')
        const checkInput = document.createElement('input')
        const checkmark = document.createElement('span')

        checkInput.setAttribute('type', 'checkBox')
        label.classList.add('container')
        checkmark.classList.add('checkmark')
        
        li.dataset.todoId = elem.id

        checkmark.addEventListener('click', statusToggle)
        
        if(!elem.done){
            label.classList.add('active')
        } else { 
            label.classList.add('notActive')
            checkInput.setAttribute('checked', 'checked')
        }

        delBtn.classList.add('delBtn')
        delBtn.addEventListener('click', deleteTodoItem)

        label.textContent = elem.value
        label.append(checkInput, checkmark)
        li.append(label,delBtn)
        list.append(li) 
    })    

    todoInput.value = ''
}

const statusToggle = ({target:{parentElement:{parentElement}}}) => {
    todoList.forEach( item => {
        if(+parentElement.dataset.todoId === item.id){
            item.done = !item.done
        }
        itemRender()
    })   
}

todoInput.addEventListener('keydown', (keyPressed) => {
    if (keyPressed.key === 'Enter') {
        addTodoItem() 
    }
})

const todoInfoToggle = () => {
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
todoInfoToggle()
itemRender()
