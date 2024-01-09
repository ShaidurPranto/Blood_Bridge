const dropdown=document.getElementById("dropdown");
const submitButton = document.getElementById("submitButton");
const text = document.getElementById("text");

submitButton.addEventListener("click", processInput);
async function processInput() {
    var selectedOption = dropdown.options[dropdown.selectedIndex];
    var selectedValue = selectedOption.value;
    var parts = selectedValue.split('');
    var bloodType = parts[0];
    var rhFactor = parts[1];
    console.log(bloodType);
    console.log(rhFactor);

    if(rhFactor == '+') rhFactor = 'positive';
    if(rhFactor == '-') rhFactor = 'negative';
    console.log(rhFactor);
    
    const response = await fetch(`/donor/${bloodType}/${rhFactor}`);
    const data = await response.json();
   
    console.log(data);

    text.textContent = `Hello ${data[0]}`;

}