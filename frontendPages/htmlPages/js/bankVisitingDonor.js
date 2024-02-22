const urlParams = new URLSearchParams(window.location.search);

const donorId = urlParams.get('donorid');

console.log('Donor ID:', donorId);

document.addEventListener('DOMContentLoaded', initialState);

function initialState(){
    //header

    //picture
    const pictureDiv = document.getElementById('pictureDiv');
    loadPicture(pictureDiv);

    //bio
    const bioDiv = document.getElementById('bioDiv');
    loadBio(bioDiv);

    //bank reviews
    const bankReviewsDiv = document.getElementById('bankReviewsDiv');
    loadBankReviews(bankReviewsDiv);

    //user reviews
    const userReviewsDiv = document.getElementById('userReviewsDiv');
    loadUserReviews(userReviewsDiv);
}

//getting the donor details
async function getDonorDetails() {
    const response = await fetch(`http://localhost:3000/donor/${donorId}`);
    const data = await response.json();
    console.log(data);
    return data;
}

async function getDonorBankReviews() {
    const response = await fetch(`http://localhost:3000/donor/${donorId}/bankreviews`);
    const data = await response.json();
    console.log(data);
    return data;
}

async function getDonorUserReviews() {
    const response = await fetch(`http://localhost:3000/donor/${donorId}/userreviews`);
    const data = await response.json();
    console.log(data);
    return data;
}


async function loadPicture(container){
    // const donorDetails = await getDonorDetails();
    // const picture = document.createElement('img');
    // picture.src = donorDetails.picture;
}

async function loadBio(container){
    // const donorDetails = await getDonorDetails();
    // const bio = document.createElement('p');
    // bio.innerHTML = donorDetails.bio;
}

async function loadBankReviews(container){
    // const donorBankReviews = await getDonorBankReviews();
    // donorBankReviews.forEach(async (review) => {
    //     const bankReview = document.createElement('div');
    //     bankReview.innerHTML = review;
    //     container.appendChild(bankReview);
    // });
}

async function loadUserReviews(container){
    // const donorUserReviews = await getDonorUserReviews();
    // donorUserReviews.forEach(async (review) => {
    //     const userReview = document.createElement('div');
    //     userReview.innerHTML = review;
    //     container.appendChild(userReview);
    // });
}

function returnToBankHome(){
    window.location.href = `bankHome.html`;
}