const dropdown=document.getElementById("dropdown");
const submitButton = document.getElementById("submitButton");
const text = document.getElementById("text");

submitButton.addEventListener("click", processInput);
async function processInput() {
    var selectedOption = dropdown.options[dropdown.selectedIndex];
    var selectedValue = selectedOption.value;
    var parts = selectedValue.split('');

    // Separate the parts into individual variables
    var bloodType = parts[0];
    var rhFactor = parts[1];
    const response = await fetch(`/donor/${bloodType}/${rhFactor}`);
    const data = await response.json();

    console.log(data.DONORID);
    text.textContent=`Hello ${data.DONORID}`;

}