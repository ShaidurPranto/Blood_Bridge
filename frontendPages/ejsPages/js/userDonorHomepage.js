let lastStatus = ''; // Variable to store the last status
let isVisible = false;

var notificationWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second .card-wrapper
async function toggleNotifications() {
    if (isVisible) {
        // If notification wrapper is visible, hide it
        notificationWrapper.classList.remove('show');
    } else {
        // If notification wrapper is hidden, show it and fetch data
        notificationWrapper.classList.add('show');
    }
    
    // Toggle the visibility state
    isVisible = !isVisible;
}
function toggleBloodRequest() {
    var bloodBankLists = document.getElementById('bloodBankLists');
    var donorLists = document.getElementById('donorLists');
    
    // Toggle the display style of the bottom two lists
    if (bloodBankLists.style.display === 'none' && donorLists.style.display === 'none') {
        bloodBankLists.style.display = 'block';
        donorLists.style.display = 'block';
    } else {
        bloodBankLists.style.display = 'none';
        donorLists.style.display = 'none';
    }
}

let donationid;
let donorid;

async function checkDonationStatusAndNotify() {
      console.log(userid);
   const response = await fetch(`/userHomePage/getAppointmentData/${userid}`);
    const appointmentData = await response.json();
    donationid=appointmentData.donationid;
    donorid=appointmentData.donorid;
    console.log("/////////////////////"+donorid);
    // Store the current status
    let currentStatus = appointmentData.Status;
    console.log(currentStatus);
    
    
    
    if(currentStatus==="no"||currentStatus==="ENDED"||currentStatus==="CANCELED")
    
    {    

        document.getElementById('noAppointmentMessage').style.display = 'block';
        document.getElementById('bname').style.display = 'none'; 
    document.getElementById('acceptMessage').style.display = 'none';
        document.getElementById('pendingMessage').style.display = 'none';
        document.getElementById('cancelAppointmentButton').style.display = 'none';
        document.getElementById('cancelAppointmentButton2').style.display = 'none';
       
       

       
        
    const secondCardWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second card wrapper
    const cardElement = secondCardWrapper.querySelector('.card'); // Accessing a child element with the class '.card'
   
   
        cardElement.style.display = 'none'; // Hide the second card wrapper
    
  
        document.getElementById('successMessage').style.display = 'none';
        console.log(currentStatus);
    }


    
   
    else if(currentStatus==="PENDING") {
         
         document.getElementById('acceptMessage').style.display = 'none';
         document.getElementById('bname').style.display = 'none';
         document.getElementById('noAppointmentMessage').style.display = 'none';
        document.getElementById('pendingMessage').style.display = 'block';
        document.getElementById('cancelAppointmentButton2').style.display = 'none';
      
       
    // If the current status is different from the last status, update the card
    if (currentStatus !== lastStatus) {
        // Update the last status

        lastStatus = currentStatus;
        const secondCardWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second card wrapper
//secondCardWrapper.style.display = 'flex'; // Hide the second card wrapper

        console.log(appointmentData.bankName);
        // Select the card wrapper element
        document.getElementById('bankName').textContent = appointmentData.bankName;
        document.getElementById('status').textContent = appointmentData.Status;
        document.getElementById('appointmentDate').textContent = appointmentData.donationDate;
        document.getElementById('appointmentTime').textContent = appointmentData.appointmentTime;
        
        document.getElementById('cancelAppointmentButton').style.display = 'block';

      
    }


   
}

else if(currentStatus==="SUCCESSFUL") {
    document.getElementById('acceptMessage').style.display = 'none';
    document.getElementById('noAppointmentMessage').style.display = 'none';
    document.getElementById('pendingMessage').style.display = 'none';
    document.getElementById('bname').style.display = 'block';
    document.getElementById('bname').textContent ='With Love~ '+appointmentData.bankName;
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('bankMessage').textContent =appointmentData.bankReview; // Example placeholder, replace with actual data
    document.getElementById('cancelAppointmentButton').style.display = 'none';
    document.getElementById('cancelAppointmentButton2').style.display = 'none';
   
// If the current status is different from the last status, update the card
if (currentStatus !== lastStatus) {
    // Update the last status

    lastStatus = currentStatus;
    const secondCardWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second card wrapper
    const cardElement = secondCardWrapper.querySelector('.card'); // Accessing a child element with the class '.card'

        cardElement.style.display = 'none'; // Hide the second card wrapper

           
  
}

}
else {
    document.getElementById('bname').style.display = 'none'; 
    document.getElementById('pendingMessage').style.display = 'none';
     document.getElementById('noAppointmentMessage').style.display = 'none';

     document.getElementById('acceptMessage').style.display = 'block';
     document.getElementById('cancelAppointmentButton').style.display = 'none';
     
// If the current status is different from the last status, update the card
if (currentStatus !== lastStatus) {
    // Update the last status
     
    lastStatus = currentStatus;
    const secondCardWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second card wrapper
//secondCardWrapper.style.display = 'flex'; // Hide the second card wrapper


    // Select the card wrapper element
    document.getElementById('bankName').textContent = appointmentData.bankName;
    document.getElementById('status').textContent = appointmentData.Status;
    document.getElementById('appointmentDate').textContent = appointmentData.donationDate;
    document.getElementById('appointmentTime').textContent = appointmentData.appointmentTime;
    
    document.getElementById('cancelAppointmentButton2').style.display = 'block';

  
}

}
}




function submitReview() {
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;
    console.log(`Rating: ${rating}, Review: ${review}`);
    
    // Create a data object to send to the server
    const data = {
        rating: rating,
        review: review,
        donationid: donationid
    };
    
    // Make a POST request to the backend endpoint
    const response=fetch('/userHomePage/appoinmentEnded', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    //correct the mistake
    try {
        if (response.ok) {
            alert("Successfully submitted your review");
        } else {
            alert("Error submitting the review");  // Handle error, if needed
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error, if needed
    }
    
}
function showConfirmation() {
    document.getElementById('confirmationBox').style.display = 'block';
}

function hideConfirmation() {
    document.getElementById('confirmationBox').style.display = 'none';
}

function cancelAppointment()
{     document.getElementById('confirmationBox').style.display = 'none';
    const data = {
        donorid:donorid,
        donationid: donationid
    };
    
    // Make a POST request to the backend endpoint
    try {
        const response =fetch('/userHomePage/appoinmentCancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        
            alert("Canceled successfully");
    } catch (error) {
        console.error('Error:', error);
        alert("Cancellation failed due to an error"); 
    }
}

// Function to show the confirmation box
function showConfirmation2() {
    var confirmationBox = document.getElementById("confirmationBox2");
    confirmationBox.style.display = "block";
}

// Function to hide the confirmation box
function hideConfirmation2() {
    var confirmationBox = document.getElementById("confirmationBox2");
    confirmationBox.style.display = "none";
}

// Function to handle cancel appointment action
function cancelAppointment2() {
    // Get the selected reason for cancellation
    var cancelReason = document.getElementById("cancelReason").value;

    // Perform actions to cancel appointment based on the reason
    const data = {
        donorid:donorid,
        donationid: donationid,
        description: cancelReason
    };

    try {
        const response =fetch('/userHomePage/appoinmentCancelAccepted', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        
            alert("Canceled successfully!");
    } catch (error) {
        console.error('Error:', error);
        alert("Cancellation failed due to an error"); 
    }
    // You can add more logic here as needed

    // Hide the confirmation box after action
    hideConfirmation2();
}


/////////////////////////////////qna part starts

document.addEventListener('DOMContentLoaded', async () => {
    await makeQNAdiv();
});

let createQNAdiv;
let showQNAdiv;
let yourQuestionsDiv;

async function makeQNAdiv(){
    const qnaDiv = document.getElementById('qnaDiv');
    qnaDiv.classList.add('qna-div');
    qnaDiv.innerHTML = '';

    createQNAdiv = await makeCreateQNAdiv();
    yourQuestionsDiv = await makeYourQuestionsDiv();
    showQNAdiv = await makeShowQNAdiv();
    
    qnaDiv.appendChild(yourQuestionsDiv);
    qnaDiv.appendChild(createQNAdiv);
    qnaDiv.appendChild(showQNAdiv);
}
// 1
async function makeYourQuestionsDiv(){
    const yourQuestionsDiv = document.createElement('div');
    yourQuestionsDiv.classList.add('your-questions-div');

    const yq1 = await makeYQ1();
    yourQuestionsDiv.appendChild(yq1);

    return yourQuestionsDiv;
}

async function makeYQ1(){
    const div = document.createElement('div');
    div.classList.add('your-questions-state1');

    const p = document.createElement('p');
    p.innerText = 'Your Previously Asked Questions';
    div.addEventListener('click', async () => {
        createQNAdiv.style.display = 'none';
        showQNAdiv.style.display = 'none';
        const yq2 = await makeYQ2();
        div.replaceWith(yq2);
    });

    div.appendChild(p);

    return div;
}

async function makeYQ2(){
    const div = document.createElement('div');
    div.classList.add('your-questions-state2');

    //create a div , that contains close button and a div that contains all the questions
    const closeButtonDiv = document.createElement('div');
    closeButtonDiv.classList.add('close-button-div');
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', async () => {
        const yq1 = await makeYQ1();
        div.replaceWith(yq1);
        createQNAdiv.style.display = 'block';
        showQNAdiv.style.display = 'block';
    });

    closeButtonDiv.appendChild(closeButton);


    const questionsDiv = document.createElement('div');
    questionsDiv.classList.add('questions-div');
    const questions = await getQuestions();
    questions.forEach(async (question) => {
        const qna = await makeYQoneQna(question);
        questionsDiv.appendChild(qna);
    });

    div.appendChild(closeButtonDiv);
    div.appendChild(questionsDiv);

    return div;
}

async function getQuestions(){
    //send userid parameter as query parameter
    const response = await fetch(`/userQNA/getQNAofAuser?userid=${userid}`);
    const questions = await response.json();
    console.log("response from getQuestions");
    console.log(questions);
    
    return questions;
}


async function makeYQoneQna(qna){
    console.log("making yq one qna");
    console.log("the qna is ",qna);


    const oneQnaDiv = document.createElement('div');
    oneQnaDiv.classList.add('one-qna-div');

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-div');
    const question = document.createElement('p');
    question.innerText = "Q: "+qna.QUESTION;
    questionDiv.appendChild(question);
    oneQnaDiv.appendChild(questionDiv);

    console.log("the photo is ",qna.PHOTO);
    if(qna.PHOTO !== null){
        const photoDiv = document.createElement('div');
        photoDiv.classList.add('photo-div-your-questions');
        const photo = await getPhoto(qna.PHOTO);
        photoDiv.style.backgroundImage = `url(${photo})`;

        oneQnaDiv.appendChild(photoDiv);
    }
    else{
        console.log("no photo");
    }

    const answersDiv = document.createElement('div');
    answersDiv.classList.add('answers-div');
    //for each answer create a div
    qna.ANSWERS.forEach(async (answer) => {
        if(answer.ANSWER && answer.ANSWER !== 'null' && answer.ANSWER !== '' && answer.ANSWER !== ' '){
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answer-div');

            const userdiv = document.createElement('div');
            userdiv.classList.add('user-div');
            const user = document.createElement('p');
            //user.innerText = 'User: '+answer.USERID;
            const result = await fetch(`/userQNA/getName?userid=${answer.USERID}`);
            const name = await result.text();
            user.innerText = name;
            userdiv.appendChild(user);

            const answerPDiv = document.createElement('div');
            answerPDiv.classList.add('answer-p-div');
            const answerP = document.createElement('p');
            answerP.innerText = "A: " + answer.ANSWER;
            answerPDiv.appendChild(answerP);

            answerDiv.appendChild(userdiv);
            answerDiv.appendChild(answerPDiv);

            answersDiv.appendChild(answerDiv);
        }
    });
    const answers = qna.ANSWERS;
    if(answers === null || answers.length === 0){
        console.log("fffffffffff got triggered");
        const noAnswerDiv = document.createElement('div');
        noAnswerDiv.classList.add('no-answer-div');
        const noAnswerP = document.createElement('p');
        noAnswerP.innerText = 'No answer to this question yet';
        noAnswerDiv.appendChild(noAnswerP);
        answersDiv.appendChild(noAnswerDiv);
    }

    oneQnaDiv.appendChild(answersDiv);

    return oneQnaDiv;
}


async function getPhoto(photo){
    const response = await fetch(`/userQNA/getPhoto?photo=${photo}`);
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);

    return objectURL;
}

// 2
async function makeCreateQNAdiv() {
    const createQNAdiv = document.createElement('div');
    createQNAdiv.classList.add('create-qna');

    const askQuestion = document.createElement('p');
    askQuestion.innerText = 'Ask a question';
    createQNAdiv.appendChild(askQuestion);
    
    createQNAdiv.addEventListener('click', async (event) => {
        const qnaForm = await makeQNAform();
        createQNAdiv.replaceWith(qnaForm);

        yourQuestionsDiv.style.display = 'none';
        showQNAdiv.style.display = 'none';
    });

    return createQNAdiv;
}

let file;

async function makeQNAform() {
    file = null;

    const createQNAdiv = document.createElement('div');
    createQNAdiv.classList.add('create-qna-form');

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-div');
    const input = document.createElement('textarea');
    input.type = 'text';
    input.placeholder = 'Ask a question';
    input.classList.add('qna-input');
    questionDiv.appendChild(input);
    createQNAdiv.appendChild(questionDiv);

    const attachPhoto = createAttachPhoto();

    const makeQNAbuttonDiv = document.createElement('div');
    makeQNAbuttonDiv.classList.add('make-qna-button-div');

    const submitButton = document.createElement('button');
    submitButton.innerText = 'Create';
    submitButton.classList.add('btn', 'btn-outline-primary');
    submitButton.addEventListener('click', async () => {
        if(input.value === ''){
            alert('Please ask a question');
            return;
        }

        const question = input.value;
        await createQNA(question, file);

        yourQuestionsDiv.style.display = 'block';
        showQNAdiv.style.display = 'block';
    });

    //cancel button
    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'Cancel';
    cancelButton.classList.add('btn', 'btn-outline-danger');
    cancelButton.addEventListener('click', async () => {
        // replce the form with createQNAdiv
        const createQNAdiv2 = await makeCreateQNAdiv();
        createQNAdiv.replaceWith(createQNAdiv2);

        yourQuestionsDiv.style.display = 'block';
        showQNAdiv.style.display = 'block';
    });

    makeQNAbuttonDiv.appendChild(submitButton);
    makeQNAbuttonDiv.appendChild(cancelButton);

    createQNAdiv.appendChild(input);
    createQNAdiv.appendChild(attachPhoto);
    createQNAdiv.appendChild(makeQNAbuttonDiv);

    return createQNAdiv;
}

//functions for attaching photo
function createAttachPhoto(){
    const attachPhoto = document.createElement('div');
    attachPhoto.classList.add('attach-photo');
    attachPhoto.innerText = 'Attach a photo';
    attachPhoto.addEventListener('click', () => {
        const input = document.createElement('input');
        input.classList.add('photo-input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', (event) => {
            const photo = event.target.files[0];
            file = photo;
            const selectedPhoto = showChoosenPhoto(photo);
            attachPhoto.replaceWith(selectedPhoto);
        });
        input.click();
    });

    return attachPhoto;
}
function showChoosenPhoto(photo){
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('selected-photo');
    
    const photoDiv = document.createElement('div');
    photoDiv.classList.add('photo');
    photoDiv.style.backgroundImage = `url(${URL.createObjectURL(photo)})`;

    const removeButtonDiv = document.createElement('div');
    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remove Photo';
    removeButton.classList.add('remove-photo');
    removeButton.addEventListener('click', () => {
        const attachPhoto = createAttachPhoto();
        imageDiv.replaceWith(attachPhoto);
    });
    removeButtonDiv.appendChild(removeButton);

    imageDiv.appendChild(photoDiv);
    imageDiv.appendChild(removeButtonDiv);

    return imageDiv;
}



async function createQNA(question, file){
    console.log("crateing qna with file "+file);
    console.log("crateing qna with question "+question);
    console.log("crateing qna with userid "+userid);

    const data = new FormData();
    data.append('userid', userid);
    data.append('question', question);
    data.append('file', file);

    let response;
    if(file){
        // If the file exists, make a POST request with the file
        response = await fetch('/userQNA/createQNA', {
            method: 'POST',
            body: data
        });
    }else{
        const data2 = {
            userid: userid,
            question: question
        };
        // If the file does not exist, make a POST request without the file
        response = await fetch('/userQNA/createQNAnoPhoto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2),
        });
    }
    // Check if the request was successful
    if(response.ok){
        alert('QNA created successfully');
        await makeQNAdiv();
    }
    else{
        alert('QNA creation failed');
        await makeQNAdiv();
    }
}

// 3
async function makeShowQNAdiv(){
    const showQNAdiv = document.createElement('div');
    showQNAdiv.classList.add('show-qna-div');

    const qna = await getQNA();
    qna.forEach(async (qna) => {
        const oneDiv = await makeOneDiv(qna);
        showQNAdiv.appendChild(oneDiv);
    });

    return showQNAdiv;
}

async function makeOneDiv(qna){
    console.log("making one div for qna: ",qna);

    const div = document.createElement('div');
    div.classList.add('one-qna-div');

    const makerDiv = document.createElement('div');
    makerDiv.classList.add('maker-div');
    const maker = document.createElement('p');
    const result = await fetch(`/userQNA/getName?userid=${qna.MAKER}`);
    const name = await result.text();
    maker.innerText = name;
    makerDiv.appendChild(maker);
    div.appendChild(makerDiv);

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-div');
    const question = document.createElement('p');
    question.innerText = "Q: " + qna.QUESTION;
    questionDiv.appendChild(question);
    div.appendChild(questionDiv);

    console.log("the photo is ",qna.PHOTO);
    if(qna.PHOTO !== null){
        const photoDiv = document.createElement('div');
        photoDiv.classList.add('photo-div');
        const photo = await getPhoto(qna.PHOTO);
        photoDiv.style.backgroundImage = `url(${photo})`;
        div.appendChild(photoDiv);
    }

    const answersDiv = document.createElement('div');
    answersDiv.classList.add('answers-div');
    //if there is an answer , create a div that contains that answer
    const answers = qna.ANSWERS;

    console.log("answers for qnaid "+qna.QNAID+" is ",answers);
    console.log("answers length for qnaid "+qna.QNAID+" is ",answers.length);

    if(answers.length > 0){
        const moreAnswersDiv = await makeMoreAnswersDiv(answers);
        answersDiv.appendChild(moreAnswersDiv);
    }
    else{
        const noAnswerDiv = document.createElement('div');
        noAnswerDiv.classList.add('no-answer-div');
        const noAnswerP = document.createElement('p');
        noAnswerP.innerText = 'No answer to this question yet';
        noAnswerDiv.appendChild(noAnswerP);
        answersDiv.appendChild(noAnswerDiv);
    }
    div.appendChild(answersDiv);

    const addAnswerDiv = document.createElement('div');
    addAnswerDiv.classList.add('add-answer-div');
    //now show a text area and a button to add an answer
    const answerInput = document.createElement('textarea');
    answerInput.type = 'text';
    answerInput.placeholder = 'Add an answer';
    answerInput.classList.add('answer-input');
    addAnswerDiv.appendChild(answerInput);
    const answerButton = document.createElement('button');
    answerButton.innerText = 'Add';
    answerButton.classList.add('answer-button');
    answerButton.addEventListener('click', async () => {
        if(answerInput.value === ''){
            alert('Please add an answer');
            return;
        }

        const answer = answerInput.value;
        await answerToQuestion(qna.QNAID, answer);
    });

    addAnswerDiv.appendChild(answerButton);
    div.appendChild(addAnswerDiv);

    return div;
}

async function answerToQuestion(qnaid, answer){
    console.log("answering to qnaid "+qnaid+" with answer"+answer);
    const data = {
        qnaid: qnaid,
        userid: userid,
        answer: answer
    };
    const response = await fetch('/userQNA/answerToQuestion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if(response.ok){
        alert('Answered successfully');
        await makeQNAdiv();
    }
    else{
        alert('Answering failed');
        await makeQNAdiv();
    }
}



async function makeMoreAnswersDiv(answers){
    console.log("making more answers div");
    console.log("answers are ",answers);

    const moreAnswersDiv = document.createElement('div');
    moreAnswersDiv.classList.add('more-answers-div');

 
    //make a div containing the first answer
    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer-div');
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-div');
    const user = document.createElement('p');
    const result = await fetch(`/userQNA/getName?userid=${answers[0].REPLIER}`);
    const name = await result.text();
    user.innerText = name;
    userDiv.appendChild(user);

    const answerPDiv = document.createElement('div');
    answerPDiv.classList.add('answer-p-div');
    const answerP = document.createElement('p');
    answerP.innerText = answers[0].ANSWER;
    answerPDiv.appendChild(answerP);

    answerDiv.appendChild(userDiv);
    answerDiv.appendChild(answerPDiv);

    moreAnswersDiv.appendChild(answerDiv);

    //create a div containing show more button
    const showMoreDiv = document.createElement('div');
    showMoreDiv.classList.add('show-more-div');
    const showMoreButton = document.createElement('button');
    showMoreButton.innerText = 'Show more';
    showMoreButton.classList.add('show-more-button');
    showMoreButton.addEventListener('click', async () => {
        moreAnswersDiv.innerHTML = '';
        const allAnswersDiv = await makeAllAnswersDiv(answers);
        moreAnswersDiv.replaceWith(allAnswersDiv);
    });
    showMoreDiv.appendChild(showMoreButton);
    moreAnswersDiv.appendChild(showMoreDiv);

    return moreAnswersDiv;
}

async function makeAllAnswersDiv(answers){
    console.log("making all answers div");
    console.log("answers are ",answers);


    const allAnswersDiv = document.createElement('div');
    allAnswersDiv.classList.add('all-answers-div');
    //create a div containing show less button
    const lessAnswersDiv = document.createElement('div');
    lessAnswersDiv.classList.add('less-answers-div');
    const lessAnswersButton = document.createElement('button');
    lessAnswersButton.innerText = 'Show less';
    lessAnswersButton.classList.add('less-answers-button');
    lessAnswersButton.addEventListener('click', async () => {
        allAnswersDiv.innerHTML = '';
        const moreAnswersDiv = await makeMoreAnswersDiv(answers);
        allAnswersDiv.replaceWith(moreAnswersDiv);
    });
    lessAnswersDiv.appendChild(lessAnswersButton);
    allAnswersDiv.appendChild(lessAnswersDiv);

    answers.forEach(async (answer) => {
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('answer-div');
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-div');
        const user = document.createElement('p');
        const result = await fetch(`/userQNA/getName?userid=${answer.REPLIER}`);
        const name = await result.text();
        user.innerText = name;
        userDiv.appendChild(user);

        const answerPDiv = document.createElement('div');
        answerPDiv.classList.add('answer-p-div');
        const answerP = document.createElement('p');
        answerP.innerText = answer.ANSWER;
        answerPDiv.appendChild(answerP);

        answerDiv.appendChild(userDiv);
        answerDiv.appendChild(answerPDiv);

        allAnswersDiv.appendChild(answerDiv);
    });

    return allAnswersDiv;
}

async function getQNA(){
    //send userid parameter as query parameter
    const response = await fetch(`/userQNA/getQNA?userid=${userid}`);
    const qna = await response.json();
    console.log(qna);

    return qna;
}

//qna part ends



setInterval(checkDonationStatusAndNotify, 1000*60*10); //10 minutes