const beanList = document.querySelector('#bean-list');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const searchBar = document.forms['search-beans'].querySelector('input');

let editId = "";

const setupUI = (user) => {
    if(user){
        // account info
        db.collection('users').doc(user.uid).get().then(doc =>{
            const html = `
            <div>Logged in as: ${doc.data().username}</div>
            <div>Email address: ${user.email}</div>
            `;
            accountDetails.innerHTML = html;
        })
        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    }else{
        // hide account info
        accountDetails.innerHTML = "";
        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}

// setup beans
const setupBeans = (data) => {
    if(data.length){
        let html = '';
        data.forEach(doc => {
            let remove = document.createElement('div');
            remove.innerHTML = '<i class="fa fa-trash"></i>';
            remove.className = "deleteBtn"
            let edit = document.createElement('div');
            edit.innerHTML = '<i class="fa fa-edit"></i>';
            edit.className = "editBtn";
            const bean = doc.data();
            let li = `<li data-id="${doc.id}" class="bean-list-item">
                <div class="titlesBox"> 
                    <span>Name</span>
                    <span>Nationality</span>
                    <span>Grind Setting</span>
                    <span>Flavor</span>
                    <span>Score</span>
                </div>
                <div class="valuesBox"> 
                    <span class="name" >${bean.name}</span>               
                    <span class="nationality" >${bean.nationality}</span>      
                    <span class="grind" >${bean.grind}</span>             
                    <span class="flavor" >${bean.flavor}</span>               
                    <span class="score" >${bean.score}</span>
                </div>
                <div class="photoBox"> 
                    <img class="photo" src="${bean.photo}" alt="Beans" width="200" height="200">
                </div>
                ${edit.outerHTML}
                ${remove.outerHTML}
            </li>`;
            html += li;
        });
        beanList.innerHTML = html;
        // Event listener for Edit
        let editButon = document.querySelectorAll('.editBtn');
        if(editButon.length)
        {
            editButon.forEach(element => {
                element.addEventListener('click', (e) => {
                    e.stopPropagation();
                    editId = e.target.parentElement.parentElement.getAttribute('data-id');
                    fillEditForm(editId);
                    // maybe add a if editId then click.. + error message if not
                    document.getElementById('edit-bean').click();
                });
            });
        }
         // Event listener for Delete
         let removeButon = document.querySelectorAll('.deleteBtn');
        if(removeButon.length)
        {
            removeButon.forEach(element =>{
                element.addEventListener('click', (e) =>{
                    e.stopPropagation();
                    const deleteId = e.target.parentElement.parentElement.getAttribute('data-id');
                    db.collection('beans').doc(deleteId).delete();
                });
            });
        }
    }else if(currentUser){
        beanList.innerHTML = '<h5 class="center-align">Add some beans!</h5>'
    }else{
        beanList.innerHTML = '<h5 class="center-align">Login to view your beans</h5>'
    }
}

function fillEditForm(editId){

    let temp = beanList;
    beanList.childNodes.forEach(beans =>{
        if(beans.getAttribute('data-id') == editId){
            beans.childNodes.forEach(item =>{
                if(item.className == 'valuesBox'){  
                    item.childNodes.forEach(value => {
                        if(value.className == 'name'){
                            document.querySelector('#editName').value = value.textContent;
                        }
                        if(value.className == 'nationality'){
                            document.querySelector('#editNationality').value = value.textContent;
                        }
                        if(value.className == 'grind'){
                            document.querySelector('#editGrind').value = value.textContent;
                        }
                        if(value.className == 'flavor'){
                            document.querySelector('#editFlavor').value = value.textContent;
                        }
                        if(value.className == 'score'){
                            document.querySelector('#editScore').value = value.textContent;
                        }
                    })                
                }
                if(item.className == 'photoBox'){
                    item.childNodes.forEach(value =>{
                        if(value.className == 'photo'){
                            document.querySelector('#editPhoto').value = value.src;
                        }
                    })
                }
            })
        }
    });
    
   // document.getElementById('editName').value="moo"
}

function clearEditForm(){
    document.querySelector('#editName').value = " ";
    document.querySelector('#editNationality').value = " ";
    document.querySelector('#editGrind').value = " ";
    document.querySelector('#editFlavor').value = " ";
    document.querySelector('#editScore').value = " ";
    document.querySelector('#editPhoto').value = " ";
}

//Search Bar
searchBar.addEventListener('keyup', function (e){
    const term = e.target.value.toLowerCase();
    var temp = "";
    beanList.childNodes.forEach(beanContainer =>{
        beanContainer.childNodes.forEach(div => {
            if(div.className == "valuesBox"){
                div.childNodes.forEach(beanValue => {
                    if(beanValue.nodeName != "#text"){
                        temp+=beanValue.textContent;
                    }
                });
            }
        });
        console.log(temp);
        if(temp.toLowerCase().indexOf(term) != -1 )
        {
            //show beans that pass this test
            beanContainer.style.display = 'block';
        }else{
            // dont show this bean
            beanContainer.style.display = 'none';
        }
        temp ="";
    });
});

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  });