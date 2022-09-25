"use strict";

// ------------------ MODEL ---------------------

window.addEventListener("DOMContentLoaded", start);

// empty array for cloning new Object:
const allStudents = [];

// other arrays:
const allExpelled = [];
const allCurrent = [];

let prefectCount = 0;
let houseCount = 0;

// houses:
const gryffyHouse = [];
const ravyHouse = [];
const huffyHouse = [];
const slythyHouse = [];

// consts and lets:
// for the JSON:
let jsonBlood;
let theJSONData;
let numberOfJsonFilesLoaded = 0;

// for the search field:
const searchInput = document.querySelector("[data-search]");
let arrayForSearch = [];

// Make prototype (capital first letter) with empty properties:
const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  nickname: "",
  image: "",
  house: "",
  gender: "",
  bloodStatus: "",
  // flag on isExpelled/isPrefect/isSquad/isHacked, set to false:
  isExpelled: false,
  isPrefect: false,
  isSquad: false,
  isHacked: false,
};

function start() {
  console.log("Ready");

  // eventlisteners on filter buttons:
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

  // eventlisteners on sort buttons:
  document.querySelectorAll("[data-action = 'sort']").forEach((button) => button.addEventListener("click", selectSort));

  loadJSON();

  loadBloodJSON("https:petlatkea.dk/2021/hogwarts/families.json");
}

// fetch JSON for students:
function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      theJSONData = jsonData;
      numberOfJsonFilesLoaded++;
      // check if file is loaded, call prepare func from there:
      jsonFileLoaded();
    });
}

// fetch JSON for blood status:
async function loadBloodJSON(url) {
  const response = await fetch(url);
  jsonBlood = await response.json();
  numberOfJsonFilesLoaded++;
  jsonFileLoaded();
  //
}

// function checks if both JSON files are loaded before it starts:
function jsonFileLoaded() {
  if (numberOfJsonFilesLoaded === 2) {
    // start det hele her hvor begge JSON filer er loadede
    console.log("BEGGE JSON FILER ER LOADEDE", jsonBlood);
    prepareObjects(theJSONData);
  }
}
// prepare JSON for students:
function prepareObjects(theJSONData) {
  // from search bar video: add arrayForSearch [] + remove forEach and replace with .map:
  arrayForSearch = theJSONData.map((jsonObject) => {
    // create new object with cleaned data - and store that in the allStudents array

    // create object from prototype:
    const student = Object.create(Student);

    // eventlistener on search field + anonymous function:
    searchInput.addEventListener("input", (e) => {
      const inputSearchValue = e.target.value.toLowerCase();
      arrayForSearch.forEach((search) => {
        const isVisible = student.firstname.toLowerCase().includes(inputSearchValue) || student.lastname.toLowerCase().includes(inputSearchValue);
        search.element.classList.toggle("hide", !isVisible);
      });
    });

    // make new arrays for each house:
    // gryffyHouse = allStudents.map();
    //console.log("gryffyHouse", gryffyHouse);

    // ravyHouse =

    // huffyHouse =

    // slythyHouse =

    // TRIM WHITE SPACE + REMOVE DOUBLE WHITE SPACE:
    let trimFullname = jsonObject.fullname.trim();
    let fullName = trimFullname.replaceAll("  ", " ");
    let trimHouse = jsonObject.house.trim();
    let gender = jsonObject.gender.trim();

    // MAKE LETS FOR DESIRED CATEGORIES:

    // FIRST NAME:
    let firstname = prepareFirstname(fullName);

    // MIDDLE NAME:
    let middlename = prepareMiddlename(fullName);

    // LAST NAME:
    let lastname = prepareLastname(fullName);

    // NICK NAME:
    let nickname = prepareNickName(fullName);

    // IMAGES:
    // return values from function haveImg: code from Nancy:
    let image = haveImg(fullName);

    // HOUSE:
    let houseToUpperCase = trimHouse.substring(0, 1).toUpperCase();
    let houseToLowerCase = trimHouse.substring(1).toLowerCase();
    let studentHouse = `${houseToUpperCase}${houseToLowerCase}`;

    // set new properties to object values (the new object (student) created from prototype) - kan også gøres direkte uden lets først:
    student.firstname = firstname;
    student.middlename = middlename;
    student.lastname = lastname;
    student.nickname = nickname;
    student.image = image;
    student.house = studentHouse;
    student.gender = gender;
    // BLOOD STATUS:
    let theBloodStatus = prepareBloodStatus(student);
    student.bloodStatus = theBloodStatus;

    // eventlisteners on all students for popup:
    document.querySelectorAll("student.firstname").forEach((name) => name.addEventListener("click", showPopUp));

    // push to empty array allStudents:
    allStudents.push(student);

    // for search bar: return values: removed: element: student/td/template - NOT WORKING!!!
    return { firstname: student.firstname, lastname: student.lastname, element: "template" };
  });

  displayList(allStudents);
}

// DELEGATED FUNCTIONS THAT RETURN NAMES ETC.:

// MAKE FIRSTNAME:
function prepareFirstname(fullName) {
  let firstname1 = fullName.substring(0, fullName.indexOf(" ")); // finds first word from [0] to first " ".
  let firstnameTrim = firstname1.trim();
  let firstToUpperCase = firstnameTrim.substring(0, 1).toUpperCase(); // takes first letter and makes it uppercase.
  let firstToLowerCase = firstnameTrim.substring(1).toLowerCase(); // takes the rest of the word and makes it lowercase.
  return `${firstToUpperCase}${firstToLowerCase}`; //puts the two substrings together.
}

// MAKE MIDDLENAME:
function prepareMiddlename(fullName) {
  if (fullName.indexOf(" ") === fullName.lastIndexOf(" ")) {
    return ` `;
  } else if (fullName.includes("Ernie")) {
    return ` `;
  } else {
    let middlename1 = fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" ")); // finds name between the first and second " ".
    let middleToUpperCase = middlename1.substring(0, 1).toUpperCase();
    let middleToLowerCase = middlename1.substring(1).toLowerCase();
    return `${middleToUpperCase}${middleToLowerCase}`;
  }
}

// MAKE LASTNAME:
function prepareLastname(fullName) {
  let lastname1 = fullName.substring(fullName.lastIndexOf(" ")); // finds word after last " ".
  let lastnameTrim = lastname1.trim();
  let lastToUpperCase = lastnameTrim.substring(0, 1).toUpperCase();
  let lastToLowerCase = lastnameTrim.substring(1).toLowerCase();
  return `${lastToUpperCase}${lastToLowerCase}`;

  // (fullName.includes("-"))
}

// FIND NICKNAME: (Ernie skal være med stort!!)
function prepareNickName(fullName) {
  let bloodyNickName;
  if (fullName.includes("Ernie")) {
    bloodyNickName = fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" "));
  } else {
    bloodyNickName = " ";
  }
  return bloodyNickName;
}
// PREPARE IMAGE:
function haveImg(fullName) {
  // images are displayed with the last name and first letter of the first name:
  let imgSrc = `../images/${fullName.substring(fullName.lastIndexOf(" ") + 1).toLowerCase()}_${fullName.substring(0, 1).toLowerCase()}.png`;

  // for special cases:

  // if img has no lastname:
  if (fullName === "Leanne") {
    return (imgSrc = `No_Image`);
    //
  }

  // if it includes "-" name:
  else if (fullName.includes("-")) {
    return (imgSrc = `../images/${fullName.substring(fullName.lastIndexOf("-") + 1).toLowerCase()}_${fullName.substring(0, 1).toLowerCase()}.png`);
  }

  // include two surname patil:
  else if (fullName.toLowerCase().includes("patil")) {
    return (imgSrc = `../images/${fullName.substring(fullName.lastIndexOf(" ") + 1).toLowerCase()}_${fullName.substring(0, fullName.indexOf(" ")).toLowerCase()}.png`);
  }

  // return img2;
  return imgSrc;
}

// prepare blood status:
function prepareBloodStatus(student) {
  /* console.log("Name", student.lastname);
  console.log("is half", jsonBlood.half.includes(student.lastname));
  console.log("is pure", jsonBlood.pure.includes(student.lastname));
  console.log("**************************"); */

  if (jsonBlood.half.includes(student.lastname)) {
    return `half blood`;
  } else if (jsonBlood.pure.includes(student.lastname)) {
    return `pure blood`;
  } else {
    return `muggle`;
  }
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
  } else if (filter === "inrolled") {
    filteredList = allStudents.filter(isCurrent);
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
}

// SHOULD THIS BE DELETED/CHANGED WHEN EXPEL STUDENT IS WORKING PROPERLY??
function isCurrent(student) {
  // here students set to "not expelled" will be shown in current list:
  return student.isExpelled === false;
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
  prefectCount++; // says unreachable code?
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

// ADD PREFECTS AND TO SQUAD:

function addPrefect(student) {
  console.log("addPrefect func loaded");

  // set isPrefect to true:
  student.isPrefect = !student.isPrefect;
  // check only two prefects per house:

  // change text so the button can be used again for removing prefect? OR REMOVE FROM POP-UP?
}

function addToSquad(student) {
  console.log("addToSquad func loaded");

  // isSquad set to true:
  student.isSquad = !student.isSquad;

  // MAYBE I CAN HAVE A REMOVE FROM SQUAD BUTTON ON POP UP????
  // FIX THIS: CHANGE TEXT ON CLICKED BUTTON TO "REMOVE FROM SQUAD":
  // let clickedSquadButton = event.target.value;
  // let textSquadButton = document.querySelector("#button_make_squad");
  // clickedSquadButton.textContent = "Remove from squad";
  // document.querySelector("#button_make_squad").forEach((textSquadButton) => (textSquadButton.textContent = "Remove from squad"));
}

// remove squad button doesn't exit anymore, soooo...
/* function removeSquad(student) {
  // set to false again:
  student.isSquad = !student.isSquad;
} */

// EXPEL STUDENT:

function expelStudent(student) {
  console.log("expelStudent func loaded");
  // set isExpelled to true:
  student.isExpelled = !student.isExpelled;

  // use findIndex() to find students index, use splice() to remove from AllStudents array, use push to add student to allExpelled array.

  // followed example from Andrea:
  // how to acces the student clicked?? event.target not working I think...

  /* let expelledStudentToFind = event.target.value;
  console.log("expelledStudentToFind", expelledStudentToFind);
  const index = allStudents.findIndex((element) => {
    if (element.firstname === expelledStudentToFind.firstname) {
      return true;
    }
    return false;
  });

  console.log("index expelled student", index);

  if (index !== -1) {
    const spliceArray = allStudents.splice(index, 1);
    console.log("spliceArray", spliceArray);
    const foundElement = spliceArray[0];
    console.log("foundElement", foundElement);

    allExpelled.push(foundElement);
  } */
}

//  --------------------- VIEW --------------------------

// SHOW LISTS ON FRONTPAGE:
// function that clears existing list and builds new with "neutral" parameter studentList (that is fed a new array each time):
function displayList(studentList) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // show number of students on each list in input field:
  document.querySelector(".list_numbers").value = studentList.length;

  // build a new list - studentList is the parameter, receives different arrays:
  studentList.forEach(displayStudent);
}

function displayStudent(student) {
  console.log("displayStudent loaded");
  // create clone:
  const clone = document.querySelector("#hogwarts_template").content.cloneNode(true);
  // set clone data:
  clone.querySelector("[data-field=firstname]").textContent = student.firstname;
  clone.querySelector("[data-field=middlename]").textContent = student.middlename;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
  clone.querySelector("[data-field=nickname]").textContent = student.nickname;
  clone.querySelector("[data-field=image]").src = student.image;
  clone.querySelector("[data-field=house]").textContent = student.house;

  // eventlistener on pop up (firstname):
  clone.querySelector("[data-field=firstname]").addEventListener("click", () => showPopUp(student));
  // eventlisteners for buttons:
  clone.querySelector("#button_make_prefect").addEventListener("click", () => addPrefect(student));
  clone.querySelector("#button_expel").addEventListener("click", () => expelStudent(student));

  // IF STATEMENTS HERE:

  // squad buttons on Slytherins or purebloods: I think it works now
  if (jsonBlood.half.includes(student.lastname) === false && jsonBlood.pure.includes(student.lastname)) {
    clone.querySelector("#button_make_squad").addEventListener("click", () => addToSquad(student));
  } else if (student.house === "Slytherin") {
    clone.querySelector("#button_make_squad").addEventListener("click", () => addToSquad(student));
  } else {
    clone.querySelector("#button_make_squad").classList.add("hide");
  }

  // if statement here, if expelled write this on button, if not..:

  // check if PREFECT or not, change text on button:
  /*  if ((student.isPrefect = true)) {
    clone.querySelector("#button_make_prefect").textContent = "Make prefect";
  } else {
    clone.querySelector("#button_make_prefect").textContent = "Remove as prefect";
  } */

  // check if EXPELLED, change text on button: DOESN'T WORK!!
  /*   if ((student.isExpelled = true)) {
    clone.querySelector("#button_expel").textContent = "Expel student";
  } else {
    clone.querySelector("#button_expel").textContent = "Expelled";
  } */

  // eventlistener on button:   WHY WAS IT I SHOULD DO THIS??? IT FUCKS UP THE FILTERING!!!! :(
  /* clone.querySelector("#button_expel").addEventListener("click", clickExpel);

  function clickExpel() {
    if (student.isExpelled === true) {
      student.isExpelled = false;
    } else {
      student.isExpelled = true;
    }
  } */

  // check if SQUAD, change text on button: DOESN'T WORK!!
  /*   if ((student.isSquad = true)) {
    clone.querySelector("#button_make_squad").textContent = "Add to Inqusitorial Squad";
  } else {
    clone.querySelector("#button_make_squad").textContent = "Added to squad";
  } */

  // append clone to list:
  document.querySelector("#list tbody").appendChild(clone);
}

// SHOW POP UP:

function showPopUp(student) {
  console.log("showPopUp func loaded");
  // display popup:
  popup.style.display = "block";
  // define content:
  popup.querySelector(".art_h2").textContent = student.firstname + " " + student.lastname;
  popup.querySelector("[data-field=image]").src = student.image;
  popup.querySelector(".art_firstname").textContent = student.firstname;
  popup.querySelector(".art_middlename").textContent = student.middlename;
  popup.querySelector(".art_lastname").textContent = student.lastname;
  popup.querySelector(".art_nickname").textContent = student.nickname;
  popup.querySelector(".art_gender").textContent = student.gender;
  popup.querySelector(".art_house").textContent = student.house;
  popup.querySelector(".art_prefect").textContent = student.isPrefect;
  popup.querySelector(".art_squad").textContent = student.isSquad;
  popup.querySelector(".art_blood").textContent = student.bloodStatus;

  // eventlistener for close button:
  document.querySelector("#pop_close_button").addEventListener("click", () => (popup.style.display = "none"));
}
