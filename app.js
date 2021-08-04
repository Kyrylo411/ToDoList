const addInput = document.querySelector('input')
const list = document.querySelector('ul')

const todoList = [{
    value: 'hello',
    id: Date.now(),
    status: true
}]

const deleteTodoItem = ({target:{parentElement}}) => {
    const index = todoList.findIndex(elem => {
        return elem.id == parentElement.dataset.todoId
    
    });

    if (index !== -1) {
        todoList.splice(index, 1);
        render()
    }
}

const addTodoItem = () =>{
    if(addInput.value.trim() == ''){
        addInput.value = ''
        return
    }
    todoList.push({
        value: addInput.value.trim(),
        id: Date.now(),
        status: true
    })
    render()
}

const render = () => {
    list.innerText = ''
    const todoInfo = document.createElement('div')
    const allBtn = document.createElement('button')
    const activeBtn = document.createElement('button')
    const completedBtn = document.createElement('button')
    const btnInfoWrapper = document.createElement('div')
    const itemNumber = document.createElement('p')

    if(todoList.length == 1){
        itemNumber.textContent = `${todoList.length} item left`
    }else{
        itemNumber.textContent = `${todoList.length} items left`
    }

    btnInfoWrapper.classList.add('btnInfoWrapper')
    allBtn.classList.add('button')
    activeBtn.classList.add('button')
    completedBtn.classList.add('button')
    allBtn.innerText = 'All'
    activeBtn.textContent = 'Active'
    completedBtn.textContent = 'Completed'

    todoList.forEach( elem => {
        const li = document.createElement('li')
        const delBtn = document.createElement('div')
        const label = document.createElement('label')
        const checkInput = document.createElement('input')
        const checkmark = document.createElement('span')

        checkInput.setAttribute('type', 'checkBox')
        label.classList.add('container')
        checkmark.classList.add('checkmark')
        
        li.dataset.todoId = elem.id

        checkInput.addEventListener('change', statusToggle)
        
        if(elem.status){
            label.classList.add('active')
        } else{
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

    todoInfo.classList.add('todoInfo')

    if(!todoList.length){
        todoInfo.classList.add('todoInfoHide')
    } 

    btnInfoWrapper.append(allBtn, activeBtn, completedBtn)
    todoInfo.append(itemNumber,btnInfoWrapper)
    list.append(todoInfo)

    addInput.value = ''
}

const statusToggle = ({target:{parentElement:{parentElement}}}) => {
    todoList.forEach( item => {
        if(parentElement.dataset.todoId == item.id){
            item.status = !item.status
        }
        render()
    })   
}

addInput.addEventListener('keydown', (keyPressed) => {
    if (keyPressed.key === 'Enter') {
        addTodoItem() 
    }
})

render()
