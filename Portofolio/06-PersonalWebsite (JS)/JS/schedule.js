function addToTable() {
  //Get the values from the form
  let date = document.getElementById("date").value;
  let timeStart = document.getElementById("time_start").value;
  let timeEnd = document.getElementById("time_end").value;
  let activity = document.getElementById("activity").value;
  let place = document.getElementById("place").value;
  let type = document.getElementById("type").value;
  let notes = document.getElementById("notes").value;
  let flag = document.getElementById("flag").value || "#ffffff"; 

  //Get the status (busy or free)
  let status = "";
  let radios = document.getElementsByName("status");
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      status = radios[i].value;
    }
  }

  //Select the table
  let table = document.getElementById("scheduleTable").getElementsByTagName('tbody')[0];

  //Insert a new row at the end of the table
  let newRow = table.insertRow();

  //Insert new cells for each value
  newRow.insertCell(0).innerHTML = date;
  newRow.insertCell(1).innerHTML = timeStart;
  newRow.insertCell(2).innerHTML = timeEnd;
  newRow.insertCell(3).innerHTML = activity;
  newRow.insertCell(4).innerHTML = place;
  newRow.insertCell(5).innerHTML = type;
  newRow.insertCell(6).innerHTML = notes;

  //Status
  let cellStatus = newRow.insertCell(7);
  if (status === "busy") {
    cellStatus.innerHTML = "<img src='./images/busy_icon.png' alt='Busy Icon' width='80'>";
  } else if (status === "free") {
    cellStatus.innerHTML = "<img src='./images/free_icon.png' alt='Free Icon' width='80'>";
  } 

  //Clear the form after submission
  document.getElementById("form").reset();
}

function confirmReset() {
  document.getElementById("form").reset();
  $('#exampleModal').modal('hide');
}
