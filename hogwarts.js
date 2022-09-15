"use strict";

// ------------------ MODEL ---------------------

window.addEventListener("DOMContentLoaded", start);

// empty array for cloning new Object:
const allStudents = [];

// Make prototype (capital first letter) with empty properties:
const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  nickname: "",
  image: "",
  house: "",
  // flag on expelled or not, set to false:
  isExpelled: false,
  // prefect or squad as flags in object?
  // isPrefect: false;
  // isSquad: false;
};

function start() {
  console.log("Ready");

  // eventlisteners on filter buttons:
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

  // eventlisteners on sort buttons:
  document.querySelectorAll("[data-action = 'sort']").forEach((button) => button.addEventListener("click", selectSort));

  loadJSON();
}

function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    // create new object with cleaned data - and store that in the allStudents array

    // create object from prototype:
    const student = Object.create(Student);

    // TRIM WHITE SPACE + REMOVE DOUBLE WHITE SPACE:
    let trimFullname = jsonObject.fullname.trim();
    let fullName = trimFullname.replaceAll("  ", " ");
    let trimHouse = jsonObject.house.trim();

    console.log(`trimFullname is:_${trimFullname}_`); // no spaces: it works

    // make lets for the desired categories:
    // FIRST NAME:
    let firstname = fullName.substring(0, fullName.indexOf(" ")); // finds first word from [0] to first " ".
    let firstnameTrim = firstname.trim();
    let firstToUpperCase = firstnameTrim.substring(0, 1).toUpperCase(); // takes first letter and makes it uppercase.
    let firstToLowerCase = firstnameTrim.substring(1).toLowerCase(); // takes the rest of the word and makes it lowercase.
    firstname = `${firstToUpperCase}${firstToLowerCase}`; //puts the two substrings together.

    // MIDDLE NAME:
    let middlename = fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" ")); // finds name between the first and second " ".
    if (fullName.indexOf(" ") === fullName.lastIndexOf(" ")) {
      console.log("Middlename is undefined");
    } else {
      let middleToUpperCase = middlename.substring(0, 1).toUpperCase();
      let middleToLowerCase = middlename.substring(1).toLowerCase();
      middlename = `${middleToUpperCase}${middleToLowerCase}`;
      //console.log("middlename is:", middlename);
    }

    // LAST NAME:
    let lastname = fullName.substring(fullName.lastIndexOf(" ")); // finds word after last " ".
    let lastnameTrim = lastname.trim();
    let lastToUpperCase = lastnameTrim.substring(0, 1).toUpperCase();
    let lastToLowerCase = lastnameTrim.substring(1).toLowerCase();
    lastname = `${lastToUpperCase}${lastToLowerCase}`;

    // NICK NAME:
    //if (fullName.indexOf("\\"))
    //let nickname = fullName.substring(fullName.indexOf("\\") + 2, fullName.lastIndexOf("\\")); // a double backslash equals one i " "
    //console.log("nickname is:", nickname);

    // IMAGE:
    // HOW TO SOLVE THIS???
    //console.log(image);

    // HOUSE:
    let houseToUpperCase = trimHouse.substring(0, 1).toUpperCase();
    let houseToLowerCase = trimHouse.substring(1).toLowerCase();
    let studentHouse = `${houseToUpperCase}${houseToLowerCase}`;

    // set new properties to object values (the new object (student) created from prototype) - kan også gøres direkte uden lets først:
    student.firstname = firstname;
    student.middlename = middlename;
    student.lastname = lastname;
    //student.nickname = nickname;
    // student.image = image;
    student.house = studentHouse;

    // push to empty array allStudents:
    allStudents.push(student);
  });

  displayList(allStudents);
}

// ----------------- CONTROLLER -------------------

// FILTERING:

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  filterList(filter);
}

function filterList(filter) {
  let filteredList = allStudents;

  // see which filter was picked: ("gryffindor" etc. comes from data-filter in filter in HTML):
  if (filter === "expelled") {
    filteredList = allStudents.filter(isExpelled);
  } else if (filter === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (filter === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (filter === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (filter === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (filter === "prefect") {
    filteredList = allStudents.filter(isPrefect);
  } else if (filter === "squad") {
    filteredList = allStudents.filter(isSquad);
  }

  console.log("filteredList is", filteredList);

  displayList(filteredList);
}

function isExpelled(student) {
  // isExpelled set as flag in Object, set to false by default:
  return student.isExpelled === true;
  // TO DO: call function here that removes student from all list? Or do it here?
}

function isGryffindor(student) {
  // big capital letter because that's how it's spelled in student.house:
  return student.house === "Gryffindor";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isPrefect(student) {
  return student.isPrefect === true;
}

function isSquad(student) {
  return student.isSquad === true;
}

// SORTING:

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDirect = event.target.dataset.sortDirection;

  // toggle sort direction:
  if (sortDirect === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  sortList(sortBy, sortDirect);
}

function sortList(sortBy, sortDirect) {
  let sortedList = allStudents;

  // let for direction:
  let direction = 1;
  if (sortDirect === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  //list is generated by generel function:
  sortedList = sortedList.sort(sortByProperty);

  // closure so the function can use the parameter sortBy:
  function sortByProperty(studentA, studentB) {
    // if return -1 A comes first:
    if (studentA[sortBy] < studentB[sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  displayList(sortedList);
}

//  --------------------- VIEW --------------------------

// function that clears existing list and builds new with "neutral" parameter studentList (that is fed a new array each time):
function displayList(studentList) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list - studentList is the parameter, receives different arrays:
  studentList.forEach(displayStudent);
}

function displayStudent(student) {
  console.log("displayStudent loaded");
  // create clone
  const clone = document.querySelector("#hogwarts_template").content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=firstname]").textContent = student.firstname;
  clone.querySelector("[data-field=middlename]").textContent = student.middlename;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
  clone.querySelector("[data-field=nickname]").textContent = student.nickname;
  // clone.querySelector("[data-field=image]").textContent = student.image;
  clone.querySelector("[data-field=house]").textContent = student.house;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
