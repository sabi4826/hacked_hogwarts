"use strict";

// ------------------ MODEL ---------------------

window.addEventListener("DOMContentLoaded", start);

// empty array for cloning new Object:
const allStudents = [];

// other arrays:
const allExpelled = [];
const allCurrent = [];

let student;
const sabineAsStudent = {
  firstname: "Sabine",
  lastname: "Ovesen",
  gender: "hacker",
  house: "Slytherin",
  image: ".../files/ovesen_s.png",
};

let isHackedFlag = false;

// consts and lets:
// for the JSON:
let jsonBlood;
let theJSONData;
let numberOfJsonFilesLoaded = 0;

// for the search field:
let searchInput;

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
  // flags on isExpelled/isPrefect/isSquad set to false:
  isExpelled: false,
  isPrefect: false,
  isSquad: false,
};

function start() {
  // eventlisteners on filter buttons:
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

  // eventlisteners on sort buttons:
  document.querySelectorAll("[data-action = 'sort']").forEach((button) => button.addEventListener("click", selectSort));

  // eventlistener on hacking button:
  document.querySelector("#hack_site").addEventListener("click", hackTheSystem);

  loadJSON();

  loadBloodJSON("https:petlatkea.dk/2021/hogwarts/families.json");

  // eventlistener on search field and search for first and last name:
  searchInput = document.querySelector("#search");
  searchInput.addEventListener("input", (e) => {
    const inputSearchValue = e.target.value.toLowerCase();
    const searchArray = allStudents.filter((student) => {
      return student.firstname.toLowerCase().includes(inputSearchValue) || student.lastname.toLowerCase().includes(inputSearchValue);
    });
    displayList(searchArray);
  });
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
  theJSONData.forEach((jsonObject) => {
    // create new object with cleaned data - and store that in the allStudents array

    // create object from prototype:
    student = Object.create(Student);

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

    // set new properties to object values (the new object (student) created from prototype) - kan ogs?? g??res direkte uden lets f??rst:
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

// FIND NICKNAME: (Ernie skal v??re med stort!!)
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

  // if hacked, insert my image: NOT WORKING!
  else if (isHackedFlag === true && student.firstname === "Sabine") {
    return (imgSrc = `../images/ovesen_s.png`);
  }

  // return img2;
  return imgSrc;
}

// prepare blood status:
function prepareBloodStatus(student) {
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
    // send array for expelled students:
    filteredList = allExpelled;
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

  displayList(filteredList);
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

// ADD STUDENTS TO SQUAD:

function addToSquad(student) {
  // isSquad set to true:
  student.isSquad = !student.isSquad;

  displayList(allStudents);

  // IF HACKED: remove added squad members:
  if (isHackedFlag === true) {
    setTimeout(squadAnimation, 1500);
  }

  function squadAnimation() {
    // animation not working, but medal comes of after 1,5 seconds:
    document.querySelector("#button_make_squad").classList.add("remove_squad_member_container");
    student.isSquad = false;
    displayList(allStudents);
  }

  // remove eventlistener:
  //document.querySelector("#button_make_squad").removeEventListener("click", () => addToSquad(student));
}

function removeSquad(student) {
  // set to false again:
  student.isSquad = !student.isSquad;

  // remove eventlistener:
  popup.querySelector("#button_remove_squad").removeEventListener("click", () => removeSquad(student));

  displayList(allStudents);
  hideSquadButton(student);
}

function hideSquadButton(student) {
  //console.log("hideSquadButton loaded");
  popup.querySelector("#button_remove_squad").classList.add(".hide");
  // send to update list again:
  showPopUp(student);
}

// ADD PREFECTS:

function addPrefect(student) {
  // check only two prefects per house:
  testForNumberOfPrefects(student);

  // remove eventlistener:
  document.querySelector("#button_make_prefect").removeEventListener("click", () => addPrefect(student));
}

// for remove button on pop up:
function removePrefect(student) {
  console.log("removePrefect loaded");
  // set to false again:
  //student.isPrefect = !student.isPrefect;
  student.isPrefect = false;

  // remove eventlistener:
  popup.querySelector("#button_remove_prefect").removeEventListener("click", () => removePrefect(student));

  hidePrefectButton(student);
  displayList(allStudents);
}

function hidePrefectButton(student) {
  console.log("hidePrefectButton loaded");
  popup.querySelector("#button_remove_prefect").classList.add(".hide");
  // send to update list again:
  showPopUp(student);
}

// CHECK FOR TWO PREFECTS - FROM WINNER VIDEOS:

function testForNumberOfPrefects(selectedStudent) {
  // list of selected prefects:
  const prefectList = allStudents.filter((student) => student.isPrefect);

  // find other prefects from same house:
  let otherPrefectsFromHouse = prefectList.filter((student) => student.house === selectedStudent.house);

  // if there is another prefect from same house:
  if (otherPrefectsFromHouse.length >= 2) {
    removeOtherPrefect(otherPrefectsFromHouse[0], otherPrefectsFromHouse[1]);
  } else {
    makePrefect(selectedStudent);
  }

  // closure:
  function removeOtherPrefect(otherPrefect1, otherPrefect2) {
    // ask user to remove others or ignore:
    // show warning:
    document.querySelector("#remove_a_or_b").classList.remove("hide_warnings");

    // eventlisteners on buttons:
    document.querySelector("#remove_a_or_b .close_prefect_warning1").addEventListener("click", closeDialog);
    document.querySelector("#remove_a_or_b .remove_a_prefect").addEventListener("click", removePrefectA);
    document.querySelector("#remove_a_or_b .remove_b_prefect").addEventListener("click", removePrefectB);

    // show names on buttons:
    document.querySelector("#remove_a_or_b [data-field=prefectA]").textContent = otherPrefect1.firstname;
    document.querySelector("#remove_a_or_b [data-field=prefectB]").textContent = otherPrefect2.firstname;

    // if ignore, do nothing:
    // closure in closure? - close warning box:
    function closeDialog() {
      document.querySelector("#remove_a_or_b").classList.add("hide_warnings");

      // remove eventlisteners:
      document.querySelector("#remove_a_or_b .close_prefect_warning1").removeEventListener("click", closeDialog);
      document.querySelector("#remove_a_or_b .remove_a_prefect").removeEventListener("click", removePrefectA);
      document.querySelector("#remove_a_or_b .remove_b_prefect").removeEventListener("click", removePrefectB);
    }

    // if remove, do:
    function removePrefectA() {
      otherPrefect1.isPrefect = false;
      makePrefect();
      closeDialog();
    }

    // if remove, do:
    function removePrefectB() {
      otherPrefect2.isPrefect = false;
      makePrefect();
      closeDialog();
    }
  }

  // closure:
  function makePrefect() {
    // set isPrefect to true:
    selectedStudent.isPrefect = true;

    displayList(allStudents);
  }
}

// EXPEL STUDENT:

function expelStudent(student, event) {
  console.log("expelStudent func loaded");
  // set isExpelled to true:
  student.isExpelled = true;

  // removes expelled student from list:
  //console.log("event.target.parentNode.parentNode", event.target.parentNode.parentNode);
  event.target.parentNode.parentNode.style.display = "none";

  // use findIndex() to find students index, use splice() to remove from AllStudents array, use push to add student to allExpelled array.

  // followed example from Andrea:

  console.log("expelledStudentToFind", student);
  const index = allStudents.findIndex((element) => {
    if (element.firstname === student.firstname && element.lastname === student.lastname) {
      return true;
    }
    return false;
  });

  if (index !== -1) {
    const spliceArray = allStudents.splice(index, 1);
    //console.log("spliceArray", spliceArray);
    const foundElement = spliceArray[0];
    //console.log("foundElement", foundElement);

    // add to array allExpelled:
    allExpelled.push(foundElement);
  }
}

// HACKING, HACKING, HACKING!!!

function hackTheSystem() {
  console.log(`You got hacked, bitch!`);

  isHackedFlag = true;

  // enter myself in array:
  allStudents.push(sabineAsStudent);

  displayList(allStudents);

  // make sure, I can't be expelled: yes (no expel button for me).

  // remove squad members after added: not pretty, but yes.

  // fuck up blood status: yes, but not for purebloods.

  // remove eventlistener(?):
  // document.querySelector("#hack_site").addEventListener("click", hackTheSystem);
}

// fuck up blood status:
function fuckBloodStatus() {
  if (jsonBlood.half.includes(student.lastname)) {
    return `pure blood`;
  } else if (jsonBlood.half && jsonBlood.pure !== student.lastname) {
    return `pure blood`;
  }

  // MISSING: math for purebloods:
  // else if (jsonBlood.pure.includes(student.lastname) {
  //   some Math.random here...
  // };
}

//  --------------------- VIEW --------------------------

// SHOW LISTS ON FRONTPAGE:
// function that clears existing list and builds new with "neutral" parameter studentList (that is fed a new array each time):
function displayList(studentList) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // show number of students on each list:
  document.querySelector(".list_numbers").textContent = `Number of students:${studentList.length}`;

  // build a new list - studentList is the parameter, receives different arrays:
  studentList.forEach(displayStudent);
}

function displayStudent(student) {
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
  clone.querySelector("#button_expel").addEventListener("click", (event) => expelStudent(student, event));

  // IF STATEMENTS HERE:

  // eventlisteners on squad buttons on Slytherins or purebloods:
  if (jsonBlood.half.includes(student.lastname) === false && jsonBlood.pure.includes(student.lastname)) {
    clone.querySelector("#button_make_squad").addEventListener("click", () => addToSquad(student));
  } else if (student.house === "Slytherin") {
    clone.querySelector("#button_make_squad").addEventListener("click", () => addToSquad(student));
  } else {
    clone.querySelector("#button_make_squad").classList.add("hide");
  }

  // if hacking:
  if (isHackedFlag === true && student.firstname === "Sabine") {
    clone.querySelector("#button_expel").classList.add("hide");
  }

  if (isHackedFlag === true) {
    student.bloodStatus = fuckBloodStatus();
  }

  // ADD SYMBOLS FOR PREFECTS AND SQUAD:
  if (student.isPrefect === true) {
    clone.querySelector("[data-field=prefect]").textContent = "????";
  } else {
    clone.querySelector("[data-field=prefect]").textContent = "????";
  }

  if (student.isSquad === true) {
    clone.querySelector("[data-field=squad]").textContent = "????";
  } else {
    clone.querySelector("[data-field=squad]").textContent = "????";
  }

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

  // eventlisteners on buttons for prefects and squads:
  if (student.isSquad === true) {
    popup.querySelector("#button_remove_squad").addEventListener("click", () => removeSquad(student));
  } else {
    popup.querySelector("#button_remove_squad").classList.add("hide");
  }

  if (student.isPrefect === true) {
    popup.querySelector("#button_remove_prefect").addEventListener("click", () => removePrefect(student));
  } else {
    popup.querySelector("#button_remove_prefect").classList.add("hide");
  }

  // eventlistener for close button:
  document.querySelector("#pop_close_button").addEventListener("click", () => (popup.style.display = "none"));

  // remove eventlisteners:
  document.querySelector("[data-field=firstname]").removeEventListener("click", () => showPopUp(student));
  document.querySelectorAll("student.firstname").forEach((name) => name.removeEventListener("click", showPopUp));
}
