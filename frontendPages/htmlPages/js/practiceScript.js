const dropdown=document.getElementById("dropdown");
const submitButton = document.getElementById("submitButton");
 const text = document.getElementById("text");
 const table = document.getElementById("table");
// const mail = document.getElementById("Email");
// const pass = document.getElementById("Password");

// const CreateUserButton = document.getElementById("CreateUserButton");
submitButton.addEventListener("click", processInput);
// CreateUserButton.addEventListener("click", processInput2);


async function processInput() {
    var selectedOption = dropdown.options[dropdown.selectedIndex];
    var selectedValue = selectedOption.value;
    var parts = selectedValue.split('');
    var bloodType = parts[0];
    var rhFactor = parts[1];
    console.log(bloodType);
    console.log(rhFactor);

    
    const response = await fetch(`/donor/${bloodType}/${rhFactor}`);
    const data = await response.json();
   
    console.log(data);
    var content='';

    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    for (var info of data) {
        // content += `${info}<br>`;

        var row = table.insertRow(-1);
        
        var properties = [0,1,2,3,4,5];

        for (var prop of properties) {
            var cell = row.insertCell(-1);
            cell.textContent = info[prop];
        }

    }

  

}



