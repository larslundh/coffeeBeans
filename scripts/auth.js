var currentUser;

// listen for auth status changes
auth.onAuthStateChanged(user => {
    currentUser = user;
    if(user){
        //get data for the logged in user
        db.collection('beans').where("creatorId", "==", user.uid).onSnapshot((snapshot) => {
        setupBeans(snapshot.docs); // setup with data
        setupUI(user);
        }, err => {
            console.log(err.message);
        });
    }else{
        console.log('user logged out');
        setupBeans([]); // setup empty
        setupUI();
    }
})

//create new Bean
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('beans').add({
        creatorId: currentUser.uid,
        name: createForm['name'].value,
        nationality: createForm['nationality'].value,
        grind: createForm['grind'].value,
        flavor: createForm['flavor'].value,
        score: createForm['score'].value,
        photo: createForm['photo'].value
    }).then(() =>{
        // close the modal and reset form
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    }).catch(err => {
        console.log(err);
    });
});

//edit excisting bean
const editForm = document.querySelector('#edit-form');
editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('beans').doc(editId).update({
        name: editForm['editName'].value,
        nationality: editForm['editNationality'].value,
        grind: editForm['editGrind'].value,
        flavor: editForm['editFlavor'].value,
        score: editForm['editScore'].value,
        photo: editForm['editPhoto'].value
    }).then(() =>{
        // close the modal and reset form
        clearEditForm(); // remove preloaded values
        editId = ""; //clear it for no reason... edit is done
        const modal = document.querySelector('#modal-edit');
        M.Modal.getInstance(modal).close();
        editForm.reset();
    }).catch(err => {
        console.log(err);
    });
})

//sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    // get user info 
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    //sign up user - this returns cred and *uid
    auth.createUserWithEmailAndPassword(email,password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            username: signupForm['signup-Username'].value,
            email: signupForm['signup-email'].value
            // add additional user information here?
        });
    }).then(() =>{
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault(); //prevent reloading
    auth.signOut();
});

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); //prevent reloading
    //get userinfo
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value
    //sign in
    auth.signInWithEmailAndPassword(email,password).then(cred => {
        //close the login modal and reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    });
});

