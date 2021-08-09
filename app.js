const todoInput = document.querySelector('input')
const list = document.querySelector('ul')
const todoInfo = document.querySelector('.todoInfo')
const underLines = document.querySelector('.underLines')
const itemNumber = document.querySelector('.itemNumber')
const inputArrow = document.querySelector('.arrow')
const clearBtn = document.querySelector('.clearCompleatedBtn')
const allBtn = document.querySelector('.allBtn')
const activeBtn = document.querySelector('.activeBtn')
const compleatedBtn = document.querySelector('.compleatedBtn')

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
    todoList.forEach( item => {
        const li = document.createElement('li')
        const delBtn = document.createElement('div')
        const label = document.createElement('label')
        const checkInput = document.createElement('input')
        const checkmark = document.createElement('span')
        const itemText = document.createElement('p')
        const itemInputWrapper = document.createElement('div')
        const itemInput = document.createElement('input')

        itemInputWrapper.classList.add('itemInputWrapper')
        itemInput.classList.add('itemInput')
        itemText.classList.add('itemText')
        checkInput.setAttribute('type', 'checkBox')
        label.classList.add('container')
        checkmark.classList.add('checkmark')
        
        li.dataset.todoId = item.id
       
    
        const editingTodoItem = editingItemClosure(itemInput, label, delBtn)

        li.addEventListener('click',() => {
            editingTodoItem()
        })

        checkInput.addEventListener('change',(e) => {
            const id = +e.target.parentElement.parentElement.dataset.todoId
            const status = e.target.checked
            changeItemStatus(id, status)
        })
        
        if(!item.done){
            itemText.classList.add('active')
        } else { 
            checkInput.setAttribute('checked', 'checked')
            itemText.classList.add('notActive')
        }

        delBtn.classList.add('delBtn')
        delBtn.addEventListener('click', ({target:{parentElement:{dataset:{todoId}}}}) => deleteTodoItem(todoId) )
        itemInputWrapper.append(itemInput)
        itemText.textContent = item.value
        itemInput.value = item.value
        label.append(checkInput, checkmark)
        li.append(label,itemText,itemInputWrapper,delBtn)
        list.append(li) 
    })    
    todoInput.value = ''
}

const editingItemClosure = (input, label, delBtn) => {	

    const changeItemValue = () => {
        const itemValue = input.value.trim()
        const parentId = +input.parentElement.parentElement.dataset.todoId
    
        const newTodoList = todoList.map(item => parentId === item.id ? {...item, value: itemValue} : item)
        setTodoList(newTodoList)
    }

    let lastClick = 0
	return () => {	
		input.addEventListener('click', (e)=>{
			e.stopPropagation()
		}) 

        input.addEventListener('blur', changeItemValue)

		input.addEventListener('keydown', keyPressed => {
			if (keyPressed.key === 'Enter') {
				changeItemValue()
			}
		})      

        let isDblClick 
        const d = Date.now();       

        d - lastClick < 400 ? isDblClick = true : isDblClick = false
        
        if(isDblClick){
            label.classList.add('containerHide')
            delBtn.classList.add('delBtnHide')
            input.classList.add('itemInputVisible')
        } else {
            label.classList.remove('containerHide')
            delBtn.classList.remove('delBtnHide')
            input.classList.remove('itemInputVisible')
        }

        input.focus()
        lastClick = d;   
    } 
}

todoInput.addEventListener('keydown', keyPressed => {
    const itemValue = todoInput.value.trim()
      
    if(!itemValue){
        todoInput.value = ''
        return
    }

    if (keyPressed.key === 'Enter') {
        addTodoItem(itemValue) 
    }
})

const clearCompleated = () => { 
    const uncheckedItems = todoList.filter(item => item.done === false)
    setTodoList(uncheckedItems)
}

const updateClearBtn = () => {
    const isChecked = todoList.some(item => item.done === true)

    clearBtn.classList.add("clearCompleatedBtn");
    clearBtn.classList[isChecked ? "add" : "remove"]("clearCompleatedBtnVisible");
}

clearBtn.addEventListener('click', clearCompleated)

const checkAllItems = arr => {
    const isCheckedAllItems = arr.every(item => {
       return item.done === true
    })
    return isCheckedAllItems
}

inputArrow.addEventListener('click', ()=>{    
    changeAllItemsStatus(checkAllItems(todoList))
})

const changeAllItemsStatus = (isCheckedAllItems) => {
    const newTodoList = todoList.map(item => {
        return isCheckedAllItems ? {...item, done: false} : {...item, done: true}
    })
    setTodoList(newTodoList)
}

const changeInputArrowColor = () => {
   inputArrow.classList[checkAllItems(todoList) ? 'add': 'remove']('arrowDark')
}

const updateTodoInfo = () => {   
    // const itemsDone = todoList.filter(item=>{
    //     return item.done === true
    // })
    // console.log(itemsDone)
  
    if(!todoList.length){
        todoInfo.classList.add('todoInfoHide')
        underLines.classList.add('underLinesHide')
    } else if(todoList.length === 1){
        itemNumber.textContent = `${todoList.length} item left`
        todoInfo.classList.remove('todoInfoHide')
        underLines.classList.remove('underLinesHide')
    } else {
        itemNumber.textContent = `${todoList.length} items left`
    }
}

const updateInputArrow = () => {
    inputArrow.classList[todoList.length ? 'add':'remove']('arrowVisible')
}

const setTodoList = newTodoList => {
    todoList = newTodoList
    itemRender()
    
    updateClearBtn()
    updateTodoInfo()
    updateInputArrow()
    changeInputArrowColor()

    chooseCurrentSection()
}


const chooseCurrentSection = () => {
    allBtn.classList.add('buttonActive')
}

setTodoList(todoList)



