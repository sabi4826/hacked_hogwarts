"use strict";

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
    let fullnameRemoveDoubleSpaces = jsonObject.fullname.replaceAll("  ", " ");
    let trimFullname = fullnameRemoveDoubleSpaces.trim();
    let trimHouse = jsonObject.house.trim();

    console.log(`trimFullname is:_${trimFullname}_`); // no spaces: it works

    // make lets for the desired categories:
    // FIRST NAME:
    let firstname = trimFullname.substring(0, jsonObject.fullname.indexOf(" ")); // finds first word from [0] to first " ".
    let firstnameTrim = firstname.trim();
    let firstToUpperCase = firstnameTrim.substring(0, 1).toUpperCase(); // takes first letter and makes it uppercase.
    let firstToLowerCase = firstnameTrim.substring(1).toLowerCase(); // takes the rest of the word and makes it lowercase.
    firstname = `${firstToUpperCase}${firstToLowerCase}`; //puts the two substrings together.
    console.log("firstname is:", firstname);

    // MIDDLE NAME:
    let middlename = trimFullname.substring(jsonObject.fullname.indexOf(" ") + 1, jsonObject.fullname.lastIndexOf(" ")); // finds name between the first and second " ".
    if (jsonObject.fullname.indexOf(" ") === jsonObject.fullname.lastIndexOf(" ")) {
      console.log("Middlename is undefined");
    } else {
      let middlenameTrim = middlename.trim(); // neccesary to trim after all the previous trimming??
      let middleToUpperCase = middlenameTrim.substring(0, 1).toUpperCase();
      let middleToLowerCase = middlenameTrim.substring(1).toLowerCase();
      middlename = `${middleToUpperCase}${middleToLowerCase}`;
      console.log("middlename is:", middlename);
    }

    // LAST NAME:
    let lastname = trimFullname.substring(jsonObject.fullname.lastIndexOf(" ")); // finds word after last " ".
    let lastnameTrim = lastname.trim();
    let lastToUpperCase = lastnameTrim.substring(0, 1).toUpperCase();
    let lastToLowerCase = lastnameTrim.substring(1).toLowerCase();
    lastname = `${lastToUpperCase}${lastToLowerCase}`;
    console.log("lastname is:", lastname);

    // NICK NAME:
    //if (jsonObject.fullname.indexOf("\\"))
    //let nickname = trimFullname.substring(jsonObject.fullname.indexOf("\\") + 2, jsonObject.fullname.lastIndexOf("\\")); // a double backslash equals one i " "
    //console.log("nickname is:", nickname);

    // IMAGE:
    // HOW TO SOLVE THIS???
    //console.log(image);

    // HOUSE:
    let houseToUpperCase = trimHouse.substring(0, 1).toUpperCase();
    let houseToLowerCase = trimHouse.substring(1).toLowerCase();
    let studentHouse = `${houseToUpperCase}${houseToLowerCase}`;
    console.log("House is:", studentHouse);

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

  displayList();
}

// FILTERING:

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  filterList(filter);
}

function filterList(filter) {
  console.log("filterList loaded");
  let filteredList = allStudents;

  // see which filter was picked:
  if (filter === "expelled") {
    filteredList = allStudents.filter(isExpelled);
  } else if (filter === "inrolled") {
    filteredList = allStudents.filter(isInrolled);
  } else if (filter === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (filter === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (filter === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (filter === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  }

  console.log("filteredList is", filteredList);

  displayList(filteredList);
}

function isExpelled(student) {
  // TO DO: make expelled(?) a property in object, so I can use it here and see it in pop-up:
  return student.expelled === "expelled";
}

function isInrolled(student) {
  // TO DO: make expelled(?) a property in object, so I can use it here and see it in pop-up:
  return student.inrolled === "inrolled";
}

function isGryffindor(student) {
  console.log("isGryffindor loaded");
  return student.house === "gryffindor";
}

function isRavenclaw(student) {
  return student.house === "ravenclaw";
}

function isHufflepuff(student) {
  return student.house === "hufflepuff";
}

function isSlytherin(student) {
  return student.slytherin === "slytherin";
}

// SORTING:

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  console.log(`User selected ${sortBy}`);
  sortList(sortBy);
}

function sortList(sortBy) {
  let sortedList = allStudents;
}

//  --------------------- VIEW --------------------------

function displayList(filter) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
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
