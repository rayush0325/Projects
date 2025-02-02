if(!localStorage.getItem("lists")){
    localStorage.setItem("lists",JSON.stringify([]));
}
let listKey = -1;
let taskKey = -1;
document.addEventListener("DOMContentLoaded",function(){
    viewLists();
    const listForm = document.querySelector("#listForm");
    const inputList = document.querySelector("#inputList");
    const submitList = document.querySelector("#addList");
    submitList.disabled = false;
    inputList.onkeyup = ()=>{
        submitList.disabled = (inputList.value.length>0)?false:true;
    }
    listForm.onsubmit = (e)=>{
        e.preventDefault();
        addList(inputList.value);
        inputList.value = "";
        submitList.disabled = true;
        return false;
    }
    function addList(listDesc){
        let lists = JSON.parse(localStorage.getItem("lists"));
        for(const list of lists){
            if(list.listDesc === listDesc){
                document.querySelector("output").textContent = `list ${listDesc} already exists`;
                setTimeout(()=>{
                    document.querySelector("output").textContent = "";
                },3000);
                return;
            }
        }
        const list = {
            listId : `${++listKey}`,
            listDesc : listDesc
        }
        lists.push(list);
        localStorage.setItem("lists",JSON.stringify(lists));
        localStorage.setItem(listKey,JSON.stringify([]));
        viewLists();
    }
    function deleteList(e){
        e.stopPropagation();
        let lists = JSON.parse(localStorage.getItem("lists"));
        const listId = e.target.value;

        lists = lists.filter((list)=>{
            return list.listId !== listId;
        });
        localStorage.setItem("lists",JSON.stringify(lists));
        localStorage.removeItem(listId);
        viewLists();
        const taskTable = document.querySelector("#taskTable");
        if(taskTable && taskTable.value === listId){
            viewTaskList(listId);
        }
    }
    function renameList(e){
        e.stopPropagation();
        // const addList = document.querySelector("#addList");
        // const del = document.querySelector("#deleteList");
        // const renameList = document.querySelector("#renameList");
        // addList.disabled = true;

        const edit = e.target;
        
        const updateListColm = e.target.parentNode;
        const buttons = updateListColm.querySelectorAll("button");
        for(const button of buttons){
            updateListColm.removeChild(button);
        }
        let buttons1 = document.querySelectorAll("button");
        for(const button of buttons1){
            button.disabled = true;
        }
        inputList.disabled  = true;

        // console.log(updateListColm);
        // updateListColm.removeChild(del);
        // updateListColm.removeChild(renameList);

        const form = document.createElement("form");
        updateListColm.appendChild(form);

        const input = document.createElement("input");
        form.appendChild(input);
        input.type = "text";
        input.autofocus;
        input.className="input"
        input.placeholder = "new Name";

        const submit = document.createElement("input");
        form.appendChild(submit);
        submit.type = "submit"
        submit.value  = "CHANGE";
        submit.className = "change";
        submit.disabled = true;
        input.onkeyup = ()=>{
            submit.disabled = (input.value.length>0)?false:true;
        }
        form.addEventListener("submit",formSubmit);

        function formSubmit(e){
            e.stopPropagation();
            
            const listId = edit.value;
        
            let lists  = JSON.parse(localStorage.getItem("lists"));

            // for(const list of lists){
            //     if(list.listDesc === input.value){
            //         input.value = `list ${list.listDesc} already exists`
            //         submitList.disabled = true; 
            //         setTimeout(()=>{
            //             input.value = "";
            //         },3000);
                    
            //     }
            // }
            lists = lists.map((list)=>{
                if(list.listId === listId){
                    list.listDesc = input.value;
                }
                return list;
            });
            
            localStorage.setItem("lists",JSON.stringify(lists));
            inputList.disabled = false;
            for(const button of buttons1){
                button.disabled = false;
            }
            viewLists();
            const taskTable  = document.querySelector("#taskTable");
            if(taskTable && taskTable.value === listId){
                viewTaskList(listId);
            }
        }



    }
    function viewLists(){

        const lists = JSON.parse(localStorage.getItem("lists"));

        let listTable = document.querySelector("#listTable");
        if(listTable){
            document.querySelector("#div2").removeChild(listTable);
            //document.body.removeChild(listTable);
        }

        listTable = document.createElement("table");
        document.querySelector("#div2").appendChild(listTable);
        //document.body.appendChild(listTable);
        listTable.id = "listTable";

        for(const list of lists){
            const listRow = document.createElement("tr");
            listTable.appendChild(listRow);
            listRow.id = list.listId;

            const desColm = document.createElement("td");
            listRow.appendChild(desColm);
            desColm.textContent = list.listDesc;
            desColm.id = "listDesColm"
            desColm.addEventListener("click",(e)=>{
                viewTaskList(e.target.parentNode.id);
            });

            const updateColm = document.createElement("td");
            listRow.appendChild(updateColm);

            const del = document.createElement("button");
            updateColm.appendChild(del);
            del.textContent = "DELETE";
            del.id = "deleteList";
            del.value = list.listId;
            del.addEventListener("click",deleteList);

            const edit = document.createElement("button");
            updateColm.appendChild(edit);
            edit.textContent = "RENAME";
            edit.id = "renameList";
            edit.value = list.listId;
            edit.addEventListener("click",renameList);
        }
    }

    function addTask(e){
        e.preventDefault();
        const listId = document.querySelector("#taskTable").value;
        const taskDesc = document.querySelector("#inputTask").value;
        let list = JSON.parse(localStorage.getItem(listId));


        const task = {
            taskId : `${++taskKey}`,
            taskDesc : taskDesc,
            status : "ToDo"
        }
        list.push(task);
        
        localStorage.setItem(listId,JSON.stringify(list));
        viewTaskList(listId);
        // return false;
    }
    function deleteTask(e){
        e.stopPropagation();

        const taskId = e.target.value;
        const listId = document.querySelector("#taskTable").value;
        let list = JSON.parse(localStorage.getItem(listId));
        list = list.filter((task)=>{
            return task.taskId !== taskId;
        });
        localStorage.setItem(listId,JSON.stringify(list));
        viewTaskList(listId);
    }
    function editTask(e){
        e.stopPropagation();
        const edit = e.target;
        const updateTaskColm = e.target.parentNode;
        const colmButtons = updateTaskColm.querySelectorAll("button");
        for(const button of colmButtons){
            updateTaskColm.removeChild(button);
        }
        const otherButtons = document.querySelectorAll("button");
        for(const button of otherButtons){
            button.disabled = true;
        }
        inputList.disabled = true;

        const form = document.createElement("form");
        updateTaskColm.appendChild(form);

        const input = document.createElement("input");
        form.appendChild(input);
        input.type = "text";
        input.autofocus;
        input.placeholder = "new Task";

        const submit = document.createElement("input");
        form.appendChild(submit);
        submit.type = "submit"
        submit.value  = "CHANGE";
        submit.className="change";
        form.addEventListener("submit",formSubmit); 
        
        function formSubmit(e){
            e.stopPropagation();

            const taskId = edit.value;
            const listId = document.querySelector("#taskTable").value;
            let list = JSON.parse(localStorage.getItem(listId));
            list = list.map((task)=>{
                if(task.taskId === taskId){
                    task.taskDesc = input.value;
                }
                return task;
            });
            localStorage.setItem(listId,JSON.stringify(list));
            for(const button of otherButtons){
                button.disabled = false;
            }
            inputList.disabled = false;
            viewTaskList(listId);
        }
    }
    function changeStatus(e){
        e.stopPropagation();
        const listId = document.querySelector("#taskTable").value;
        let list = JSON.parse(localStorage.getItem(listId));
        const taskId = e.target.value;

        let N = list.length;
        if(e.target.checked){
            let index = 0;
            while(index<N && list[index].taskId !== taskId){
                index++;
            }
            list[index].status = "done";
            const temp = list[index];
            while(index<N-1 && list[index+1].status !== "done"){
                list[index] = list[index+1];
                index++;
            }
            list[index] = temp;
        }
        else{
            let index = N-1;
            while(index>=0 && list[index].taskId !== taskId){
                index--;
            }
            list[index].status = "ToDo";
            const temp = list[index];
            while(index>0 && list[index-1].status === "done"){
                list[index] = list[index-1];
                index--;
            }

            list[index] = temp;
        }
        
        localStorage.setItem(listId,JSON.stringify(list));
        viewTaskList(listId);
    }

    function viewTaskList(listId){



        let form = document.querySelector("#taskForm");
        if(form){
            form.parentNode.removeChild(form);
        }
        let taskTable = document.querySelector("#taskTable");
        if(taskTable){
            taskTable.parentNode.removeChild(taskTable);
        }

        const list = JSON.parse(localStorage.getItem(listId));
        console.log(list);
        if(!list){ return; }

        const lists = JSON.parse(localStorage.getItem("lists"));
        let listName;
        for(const list of lists){
            if(list.listId === listId){
                listName = list.listDesc;
            }
        }
        form = document.createElement("form");
        document.querySelector("#div3").appendChild(form);
       // document.body.appendChild(form);
        form.id = "taskForm";
        //form.value = listId;

        const heading = document.createElement("h3");
        form.appendChild(heading);
        heading.textContent = listName;

        const input = document.createElement("input");
        form.appendChild(input);
        input.id = "inputTask";
        input.type = "text";
        input.autofocus;
        input.placeholder = "new Task";
        input.className = "input";

        const submit = document.createElement("input");
        form.appendChild(submit);
        submit.className = "ADD"
        submit.type = "submit"
        submit.value  = "ADD TASK";

        form.addEventListener("submit",addTask);

        taskTable = document.createElement("table");
        document.querySelector("#div4").appendChild(taskTable);
        taskTable.id = "taskTable";
        taskTable.value = listId;

        for(const task of list){

            const taskRow = document.createElement("tr");
            taskTable.appendChild(taskRow);

            const statusColm  = document.createElement("td");
            taskRow.appendChild(statusColm);

            const status = document.createElement("input");
            statusColm.appendChild(status);
            status.type = "checkbox";
            if(task.status === "done"){
                status.checked = true;
            }
            status.value = task.taskId;
            status.addEventListener("change",changeStatus);

            const desColm = document.createElement("td");
            taskRow.appendChild(desColm);
            desColm.id = "taskDesColm";
            desColm.textContent = task.taskDesc;
            if(task.status === "done"){
                desColm.style.color = "gray";
            }

            const updateColm = document.createElement("td");
            taskRow.appendChild(updateColm);
            updateColm.id = "taskUpdateColm"

            const del = document.createElement("button");
            updateColm.appendChild(del);
            del.textContent = "DELETE";
            del.value = task.taskId;
            del.addEventListener("click",deleteTask);

            if(task.status === "done"){ continue; }

            const edit = document.createElement("button");
            updateColm.appendChild(edit);
            edit.textContent = "EDIT";
            edit.value = task.taskId;
            edit.addEventListener("click",editTask);
        }
        
        

    }
});