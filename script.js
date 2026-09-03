document.addEventListener("DOMContentLoaded", async function (){
const startButton = document.getElementById("startButton");
const flashcontent = document.getElementById("flashcard-content");
const options = document.getElementById("options");
const createcard = document.getElementById("createcard");
const userInputscreen = document.getElementById("userInputscreen");
const cardForm = document.getElementById("cardForm");
const collection = document.getElementById("collection");
const cardTextInput= document.getElementById("cardText");
const notesContainer = document.getElementById("notesContainer");
const dogphoto = document.getElementById("dogphoto");
const dogHead = document.getElementById("dogHead");
const dogLegs = document.getElementById("dogLegs");
const backbtn0=document.getElementById("backbutton0");
const backbtn1=document.getElementById("backbutton1");
const backbtn2 = document.getElementById("backbutton2");
const backbtn3= document.getElementById("backbutton3");
const backbtn4= document.getElementById("backbutton4");
const backbtn5 = document.getElementById("backbutton5");
const startpractice = document.getElementById("startpractice");
const scrollcards =document.getElementById("scrollcards");
const masterFilter=document.getElementById("masterFilter");
const langscreen= document.getElementById("langscreen");
const langoptions=document.getElementById("langoptions");
const addlangbtn= document.getElementById("addlangbtn");
const deletelangbtn= document.getElementById("deletelangbtn");
const cardCategory = document.getElementById("cardCategory");
const categoryButtons = document.querySelectorAll(".category-btn");
const categoryButtonsContainer = document.querySelector(".category-buttons");
const cardPronunciationInput = document.getElementById("cardPronunciation");
const cardSettingsButton = document.getElementById("cardSettingsButton");
const createCardSubmitButton = document.getElementById("createCardSubmitButton");
const cardSettingsPanel = document.getElementById("cardSettingsPanel");
const showPronunciationSetting = document.getElementById("showPronunciationSetting");
const showCategorySetting = document.getElementById("showCategorySetting");
// Adjust these values to fine-tune each frame on the main board.
// left: move right (+) or left (-); top: move down (+) or up (-).
const dogFrames = [
    { head: "Doghead1.png", legs: "Dogleg1.png",  headWidth: 330, headLeft: 90, headTop: -5,  legsWidth: 240, legsLeft: 135, legsTop: 417 },
    { head: "Doghead2.png", legs: "Dogleg2.png",  headWidth: 330, headLeft: 90, headTop: 0,  legsWidth: 240, legsLeft: 135, legsTop: 417 },
    { head: "Doghead3.png", legs: "Dogleg3.png",  headWidth: 330, headLeft: 90, headTop: -10,  legsWidth: 240, legsLeft: 135, legsTop: 416 },
    { head: "Doghead4.png", legs: "Doglegs4.png", headWidth: 330, headLeft: 90, headTop: -19, legsWidth: 240, legsLeft: 135, legsTop: 416 },
    { head: "Doghead5.png", legs: "Dogleg5.png",  headWidth: 330, headLeft: 95, headTop: -10,  legsWidth: 240, legsLeft: 135, legsTop: 416 },
    { head: "Doghead6.png", legs: "Dogleg6.png",  headWidth: 330, headLeft: 90, headTop: -15,  legsWidth: 240, legsLeft: 135, legsTop: 416 },
    { head: "Doghead7.png", legs: "Doglegs7.png", headWidth: 360, headLeft: 90, headTop: -84, legsWidth: 260, legsLeft: 130, legsTop: 405 }
];
const errorMessage = document.getElementById("errorMessage");
const deletedContainer = document.getElementById("deletedContainer");
const searchBar = document.getElementById("searchBar");
const successMessage = document.getElementById("successMessage");
const ketchupMeterContainer = document.getElementById("ketchupMeterContainer");
const setsScreen = document.getElementById("setsScreen");
const setsContainer = document.getElementById("setsContainer");
const addSetBtn = document.getElementById("addSetBtn");
const deleteSetBtn = document.getElementById("deleteSetBtn");
const deletePopup = document.getElementById("deletePopup");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const mainBoard=document.getElementById("mainBoard");
const redBoard=document.getElementById("redBoard");
const leafOnRedBoard = document.getElementById("leafOnRedBoard");
const collectionViewToggle = document.getElementById("collectionViewToggle");
const gridViewBtn = document.getElementById("gridViewBtn");
const tableViewBtn = document.getElementById("tableViewBtn");
const calendarViewBtn = document.getElementById("calendarViewBtn");
const goalAchievement = document.getElementById("goalAchievement");
const achievementGif = document.getElementById("achievementGif");
const returnToOptionsBtn = document.getElementById("returnToOptionsBtn");
const keepPracticingBtn = document.getElementById("keepPracticingBtn");

let currentDogIndex=0;
let currentLanguage=null;
let currentSet = null;
let collectionView = "grid";
let collectionCalendarMonth = null;
let achievementPlaying = false;
let dailyGoalReached = false;

const loadedData = await window.flashcardStorage.initialize();

let sessionGoal = loadedData.settings.sessionGoal;   // user sets this
let sessionProgress = 0; // how many cards studied (reveal clicks)
let tomatoes = loadedData.settings.tomatoes;
let showPronunciationField = loadedData.settings.showPronunciationField !== false;
let showCategoryField = loadedData.settings.showCategoryField !== false;
let showTablePronunciationColumn = loadedData.settings.showTablePronunciationColumn !== false;
let showTablePropertyColumn = loadedData.settings.showTablePropertyColumn !== false;
let practiceReverseSides = loadedData.settings.practiceReverseSides === true;
let practiceShowPronunciation = loadedData.settings.practiceShowPronunciation === true;
let practiceShowCategory = loadedData.settings.practiceShowCategory === true;
let goalCompletionDates = Array.isArray(loadedData.settings.goalCompletionDates)
    ? loadedData.settings.goalCompletionDates
    : [];

function saveSession() {
    saveAppData();
}

const tomatoText = document.getElementById("tomatoText");

tomatoText.addEventListener("click", () => {
    const newGoal = prompt("How many cards would you like to study?", sessionGoal);

    if (newGoal === null) return;

    const goal = Math.floor(Number(newGoal));

    if (!Number.isFinite(goal) || goal < 1) {
        alert("Please enter a whole number of at least 1.");
        return;
    }

    sessionGoal = goal;
    dailyGoalReached = false;
    saveSession();
    updateMeter();
});

function updateDog(){
     dogphoto.classList.add("dog-fade");
    setTimeout(()=>{

    currentDogIndex =(currentDogIndex+1)%dogFrames.length;
     setDogFrame(currentDogIndex);
     dogphoto.classList.remove("dog-fade");
    },50);
    
}
function subtractDog(){
     dogphoto.classList.add("dog-fade");
    setTimeout(()=>{

    currentDogIndex =(currentDogIndex-1+dogFrames.length)%dogFrames.length;
     setDogFrame(currentDogIndex);
     dogphoto.classList.remove("dog-fade");
    },50);
    
}

function setDogFrame(index){
    const frame = dogFrames[index];
    dogHead.src = frame.head;
    dogLegs.src = frame.legs;

    dogphoto.style.setProperty("--head-width", `${frame.headWidth}px`);
    dogphoto.style.setProperty("--head-left", `${frame.headLeft}px`);
    dogphoto.style.setProperty("--head-top", `${frame.headTop}px`);
    dogphoto.style.setProperty("--legs-width", `${frame.legsWidth}px`);
    dogphoto.style.setProperty("--legs-left", `${frame.legsLeft}px`);
    dogphoto.style.setProperty("--legs-top", `${frame.legsTop}px`);
}

function showMainBoardDog(){
    currentDogIndex = 0;
    setDogFrame(currentDogIndex);
    dogphoto.classList.remove("hidden-dog");
}
let cards=loadedData.cards;
let languages=loadedData.languages;

const categoryAliases = {
    object: "noun",
    action: "verb",
    describe: "adjective",
    feeling: "adverb",
    everyday: "other"
};

function normalizeCategory(category) {
    const value = String(category || "other").trim().toLowerCase();
    return categoryAliases[value] || value;
}

if (!Array.isArray(languages)) {
    languages = ["Spanish"];
}

cards = cards.map(card => {
  return {
    ...card,
    id: card.id || crypto.randomUUID(),
    status: card.status || "new",
    set: card.set || "Default Set",
    category: normalizeCategory(card.category),
    pronunciation: card.pronunciation || ""
  };
});

const savedMasterFilter = normalizeCategory(loadedData.settings?.masterFilterValue || "all");
masterFilter.value = ["all", "noun", "verb", "adjective", "adverb", "other", "mastered"].includes(savedMasterFilter)
    ? savedMasterFilter
    : "all";
saveCards(); // save cards with consistent IDs

masterFilter.classList.add("hidden-Filter");
ketchupMeterContainer.classList.add("hidden-meter");

function getAppData(){
    return {
        languages,
        cards,
        settings: {
            sessionGoal,
            tomatoes,
            masterFilterValue: masterFilter.value,
            goalCompletionDates,
            showPronunciationField,
            showCategoryField,
            showTablePronunciationColumn,
            showTablePropertyColumn,
            practiceReverseSides,
            practiceShowPronunciation,
            practiceShowCategory
        }
    };
}

function applyAppData(data){
    languages = Array.isArray(data.languages) ? data.languages : [];
    cards = Array.isArray(data.cards)
        ? data.cards.map(card => ({ ...card, category: normalizeCategory(card.category) }))
        : [];
    sessionGoal = Number(data.settings?.sessionGoal) || 10;
    tomatoes = Number(data.settings?.tomatoes) || 0;
    goalCompletionDates = Array.isArray(data.settings?.goalCompletionDates)
        ? data.settings.goalCompletionDates
        : [];
    showPronunciationField = data.settings?.showPronunciationField !== false;
    showCategoryField = data.settings?.showCategoryField !== false;
    showTablePronunciationColumn = data.settings?.showTablePronunciationColumn !== false;
    showTablePropertyColumn = data.settings?.showTablePropertyColumn !== false;
    practiceReverseSides = data.settings?.practiceReverseSides === true;
    practiceShowPronunciation = data.settings?.practiceShowPronunciation === true;
    practiceShowCategory = data.settings?.practiceShowCategory === true;
    applyCardFieldSettings();
    const savedMasterFilter = normalizeCategory(data.settings?.masterFilterValue || "all");
    masterFilter.value = ["all", "noun", "verb", "adjective", "adverb", "other", "mastered"].includes(savedMasterFilter)
        ? savedMasterFilter
        : "all";
    currentLanguage = null;
    currentSet = null;
    renderlanguagebtns();
    renderSets();
    renderCards(masterFilter.value);
    updateMeter();
}

startButton.addEventListener("click", async ()=> {
if (window.flashcardStorage.needsFolderConnection()) {
    try {
        const folderData = await window.flashcardStorage.useFolder(getAppData());
        applyAppData(folderData);
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error(error);
            alert(error.message || "The flashcard folder could not be opened.");
        }
    }
}
startButton.hidden = true;
langscreen.classList.remove("mainscreenlang");
renderlanguagebtns();
backbtn1.classList.remove("back-button1");
ketchupMeterContainer.classList.add("hidden-meter");
})

createcard.addEventListener("click",()=> {
options.classList.add("hidden");
userInputscreen.classList.remove("hidden2");
backbtn2.classList.remove("back-button2");
backbtn1.classList.add("back-button1");

})

backbtn0.addEventListener("click",()=>{
    langscreen.classList.add("mainscreenlang");
    startButton.hidden=false;
    setsScreen.classList.add("hiddensetsScreen");
})

//from setscreen back to langscreen
backbtn5.addEventListener("click",()=>{
    langscreen.classList.remove("mainscreenlang");
    setsScreen.classList.add("hiddensetsScreen");
})


backbtn1.addEventListener("click",()=>{
    options.classList.add("hidden");
    setsScreen.classList.remove("hiddensetsScreen");
    renderSets();
    backbtn1.classList.add("back-button1")

})

backbtn2.addEventListener("click",()=>{
    options.classList.remove("hidden");
    userInputscreen.classList.add("hidden2");
    backbtn2.classList.add("back-button2");
    backbtn1.classList.remove("back-button1")
})

backbtn4.addEventListener("click",()=>{
    hideGoalAchievement();
    options.classList.remove("hidden");
    mainBoard.classList.remove("hide-board");
    backbtn4.classList.add("back-button4");
    backbtn1.classList.remove("back-button1");
    scrollcards.classList.add("scroll-cards");
    showMainBoardDog();
    ketchupMeterContainer.classList.add("hidden-meter");

})

backbtn3.addEventListener("click",()=>{
    options.classList.remove("hidden");
    mainBoard.classList.remove("hide-board");
    backbtn3.classList.add("back-button3");
    notesContainer.classList.add("card-grid-hidden"); 
    document.body.classList.remove("alt-bg");
    backbtn1.classList.remove("back-button1");
    showMainBoardDog();
    masterFilter.classList.add("hidden-Filter");
    searchBar.style.display="none";
    collectionViewToggle.hidden = true;
    deletePopup.classList.add("popup-hidden");
    leafOnRedBoard.classList.remove("hidden");
})

collection.addEventListener("click",()=>{
    options.classList.add("hidden");
    notesContainer.classList.remove("card-grid-hidden"); 
    dogphoto.classList.add("hidden-dog");
    document.body.classList.add("alt-bg");
    backbtn3.classList.remove("back-button3");
    masterFilter.classList.remove("hidden-Filter");
    renderCards(masterFilter.value);
    searchBar.style.display="block";
    collectionViewToggle.hidden = false;
    mainBoard.classList.add("hide-board");
    leafOnRedBoard.classList.add("hidden");

})
gridViewBtn.addEventListener("click", () => {
    collectionView = "grid";
    gridViewBtn.classList.add("active-view");
    tableViewBtn.classList.remove("active-view");
    calendarViewBtn.classList.remove("active-view");
    renderCards(masterFilter.value);
});

tableViewBtn.addEventListener("click", () => {
    collectionView = "table";
    tableViewBtn.classList.add("active-view");
    gridViewBtn.classList.remove("active-view");
    calendarViewBtn.classList.remove("active-view");
    renderCards(masterFilter.value);
});

calendarViewBtn.addEventListener("click", () => {
    collectionView = "calendar";
    collectionCalendarMonth = null;
    calendarViewBtn.classList.add("active-view");
    gridViewBtn.classList.remove("active-view");
    tableViewBtn.classList.remove("active-view");
    renderCards(masterFilter.value);
});

let historyIndex=-1;
let studyQueue=[];
let cardTransitionRunning=false;

function shuffle(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

startpractice.addEventListener("click",()=>{
    if (!currentLanguage) return;
    dailyGoalReached = false;
    hideGoalAchievement();
    console.log("Practice clicked");
    console.log("currentSet:", currentSet);
    console.log("currentLanguage:", currentLanguage);
    console.log("cards:", cards);
    console.log("filtered:", cards.filter(c => c.language === currentLanguage));
    options.classList.add("hidden");
    mainBoard.classList.remove("hide-board");
    dogphoto.classList.remove("hidden-dog");
    scrollcards.classList.remove("scroll-cards"); 
    backbtn4.classList.remove("back-button4");
    ketchupMeterContainer.classList.remove("hidden-meter");
    currentDogIndex=0;
    setDogFrame(currentDogIndex);
    const languagecards = cards.filter(c => c.language === currentLanguage);
    const reviewCards = languagecards.filter(c => c.status === "mastered");
    const newCards = languagecards.filter(c => c.status === "new" || !c.status);

studyQueue = shuffle(
    cards
        .filter(c =>
            c.language === currentLanguage &&
            c.set === currentSet && 
            !c.hidden &&
            c.status !== "mastered"
        )
        .map(c => c.id)
);

if (studyQueue.length === 0) {
    scrollcards.innerHTML = "<p class=\"no-study-cards\">no cards to study...</p>";
    resetMeter();
    ketchupMeterContainer.classList.add("hidden-meter");
    return;
}

historyIndex = 0;
sessionProgress = 0;
renderstudyCards(studyQueue[historyIndex]);
});

function chooseCategory(button) {
    categoryButtons.forEach((btn) => {
        btn.classList.remove("selected-category");
        btn.setAttribute("aria-pressed", "false");
    });

    button.classList.add("selected-category");
    button.setAttribute("aria-pressed", "true");
    cardCategory.value = button.dataset.category;
}

function applyCardFieldSettings() {
    showPronunciationSetting.checked = showPronunciationField;
    showCategorySetting.checked = showCategoryField;
    cardForm.classList.toggle(
        "all-card-fields-visible",
        showPronunciationField && showCategoryField
    );
    cardForm.classList.toggle("category-field-visible", showCategoryField);
    cardForm.classList.toggle(
        "basic-card-fields-only",
        !showPronunciationField && !showCategoryField
    );
    cardPronunciationInput.hidden = !showPronunciationField;
    cardPronunciationInput.classList.toggle("optional-card-field", !showPronunciationField);
    categoryButtonsContainer.hidden = !showCategoryField;
    categoryButtonsContainer.classList.toggle("optional-card-field", !showCategoryField);

    if (!showPronunciationField) cardPronunciationInput.value = "";
    if (!showCategoryField) {
        cardCategory.value = "";
        categoryButtons.forEach((button) => {
            button.classList.remove("selected-category");
            button.setAttribute("aria-pressed", "false");
        });
    }
}

function closeCardSettings() {
    cardSettingsPanel.hidden = true;
    cardSettingsButton.setAttribute("aria-expanded", "false");
}

cardSettingsButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = cardSettingsPanel.hidden;
    cardSettingsPanel.hidden = !willOpen;
    cardSettingsButton.setAttribute("aria-expanded", String(willOpen));
});

cardSettingsPanel.addEventListener("click", (event) => event.stopPropagation());

showPronunciationSetting.addEventListener("change", () => {
    showPronunciationField = showPronunciationSetting.checked;
    applyCardFieldSettings();
    saveCards();
});

showCategorySetting.addEventListener("change", () => {
    showCategoryField = showCategorySetting.checked;
    applyCardFieldSettings();
    saveCards();
});

document.addEventListener("click", closeCardSettings);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !cardSettingsPanel.hidden) {
        closeCardSettings();
        cardSettingsButton.focus();
    }
});

applyCardFieldSettings();

function parseWordAndDefinition(value) {
    const rawValue = value.trim();
    const separatorIndex = rawValue.indexOf("=");

    if (separatorIndex < 1) return null;

    const word = rawValue.slice(0, separatorIndex).trim();
    const definition = rawValue.slice(separatorIndex + 1).trim();

    return word && definition ? { word, definition } : null;
}

function updateCreateCardSubmitState() {
    const canCreateCard = Boolean(parseWordAndDefinition(cardTextInput.value));
    createCardSubmitButton.disabled = !canCreateCard;
    createCardSubmitButton.setAttribute("aria-disabled", String(!canCreateCard));
}

updateCreateCardSubmitState();

cardTextInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    if (showPronunciationField) {
        cardPronunciationInput.focus();
    } else if (showCategoryField) {
        chooseCategory(categoryButtons[0]); // Noun is the default.
        categoryButtons[0].focus();
    } else {
        cardForm.requestSubmit();
    }
});

cardPronunciationInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (showCategoryField) {
        chooseCategory(categoryButtons[0]);
        categoryButtons[0].focus();
    } else {
        cardForm.requestSubmit();
    }
});

cardTextInput.addEventListener("input", () => {
    errorMessage.classList.add("error-message-hidden");
    cardTextInput.setCustomValidity("");
    updateCreateCardSubmitState();
});

categoryButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        chooseCategory(button);
    });

    button.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            event.stopPropagation();
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const nextIndex = (index + direction + categoryButtons.length) % categoryButtons.length;
            const nextButton = categoryButtons[nextIndex];

            chooseCategory(nextButton);
            nextButton.focus();
        }

        if (event.key === "Enter") {
            event.preventDefault();
            chooseCategory(button);
            cardForm.requestSubmit();
        }
    });
});

cardForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    // hide both first
    errorMessage.classList.add("error-message-hidden");
    successMessage.classList.add("success-message-hidden");
    const parsedCardText = parseWordAndDefinition(cardTextInput.value);
    const category = showCategoryField && cardCategory.value ? cardCategory.value : "other";
    const pronunciation = showPronunciationField ? cardPronunciationInput.value.trim() : "";

    if (!parsedCardText) {
        cardTextInput.setCustomValidity("Enter a word and definition separated by =.");
        cardTextInput.reportValidity();
        updateCreateCardSubmitState();
        return;
    }

    const { word, definition } = parsedCardText;
    const exists=cards.some(card=>
        !card.hidden &&
        card.language===currentLanguage && 
        card.set === currentSet &&
        String(card.word || "").trim().toLowerCase()===word.toLowerCase()
    );
if(exists){
    // hide success message
    successMessage.classList.add("success-message-hidden");

    // show error
    errorMessage.classList.remove("error-message-hidden");

    cardTextInput.focus();
    cardTextInput.select();

    return;
};
    const newCard = {id:crypto.randomUUID(),word,definition,pronunciation,category, language: currentLanguage,set:currentSet, status:"new"};
    cards.unshift(newCard);
    saveCards();
    cardTextInput.value = "";
    cardPronunciationInput.value = "";
    cardCategory.value = "";
    updateCreateCardSubmitState();

categoryButtons.forEach((button) => {
    button.classList.remove("selected-category");
    button.setAttribute("aria-pressed", "false");
});
    cardTextInput.focus();
    renderCards(masterFilter.value);
        successMessage.classList.remove("success-message-hidden");

    setTimeout(() => {
        successMessage.classList.add("success-message-hidden");
    }, 2500);
});



function renderlanguagebtns(){
    langoptions.innerHTML="";

    if (languages.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "no-languages-message";
        emptyMessage.textContent = "no languages yet...";
        langoptions.appendChild(emptyMessage);
        return;
    }

    languages.forEach((lang) => {
        const langbtn=document.createElement('button');
        langbtn.textContent=lang;
        langbtn.classList.add("lang-btn");
        langbtn.draggable=true;
        langbtn.addEventListener("click",()=>{
            currentLanguage=lang;
            langscreen.classList.add("mainscreenlang");
            setsScreen.classList.remove("hiddensetsScreen");
            renderSets();
            backbtn1.classList.remove("back-button1");
        });
        langoptions.appendChild(langbtn);
    }
)}

let draggedLang= null;
let draggedSet = null;
let wasDragging = false;



document.addEventListener("dragstart",(e)=>{
    if (e.target.classList.contains("lang-btn")){
        draggedLang=e.target.textContent;

    }
})

deletelangbtn.addEventListener("dragover",(e)=>{
    e.preventDefault();
});


deletelangbtn.addEventListener("drop",()=>{
    if(!draggedLang) return;

    // store what we want to delete
    deleteTarget.type = "language";
    deleteTarget.id = draggedLang;

    // show confirmation popup
    deletePopup.classList.remove("popup-hidden");

    // clear dragged item
    draggedLang = null;

    /*if(!draggedLang) return
    languages=languages.filter(lang=>lang !==draggedLang);
    localStorage.setItem("languages", JSON.stringify(languages));
    cards= cards.filter(card=> card.language !==draggedLang);
    saveCards();

    if (currentLanguage===draggedLang){
        currentLanguage=null;
        options.classList.add("hidden");
        langscreen.classList.remove("mainscreenlang")

    }
    renderlanguagebtns();
    renderCards(masterFilter.value)
    draggedLang=null;
    */
})

addlangbtn.addEventListener("click",()=>{
    const newLang = prompt("enter language name:");
    if(!newLang) return;
    if (languages.includes(newLang)){
        alert("language already exists!");
        return;
    }
    languages.push(newLang);
    saveAppData();
    renderlanguagebtns();
}) 

document.addEventListener("dragstart", (e) => {

    if (e.target.classList.contains("set-btn")) {

        draggedSet = e.target.textContent;
        wasDragging = true;
    }
});

document.addEventListener("dragend", () => {

    setTimeout(() => {
       wasDragging = false;
    }, 50);

});

deleteSetBtn.addEventListener("dragover", (e) => {
    e.preventDefault(); // IMPORTANT (removes red icon)
});

deleteSetBtn.addEventListener("dragenter", (e) => {
    e.preventDefault();
    deleteSetBtn.classList.add("drag-over");
});

deleteSetBtn.addEventListener("dragleave", () => {
    deleteSetBtn.classList.remove("drag-over");
});

deleteSetBtn.addEventListener("drop", () => {
    deleteSetBtn.classList.remove("drag-over");
});

deleteSetBtn.addEventListener("drop", () => {
        deleteSetBtn.classList.remove("drag-over");

    if (!draggedSet) return;
    // just store what we want to delete
    deleteTarget.type = "set";
    deleteTarget.id = draggedSet;

    // show popup (THIS is the key missing line)
    deletePopup.classList.remove("popup-hidden");

    draggedSet = null;
});




function renderSets() {

    setsContainer.innerHTML = "";

    // get all unique sets for current language
    const sets = [...new Set(
        cards
        .filter(card => card.language === currentLanguage)
        .map(card => card.set)
    )];
    if (sets.length === 0) {

        setsContainer.innerHTML = `
            <p class="no-sets-message">
                no sets yet...
            </p>
        `;

        return;
    }

    sets.forEach(setName => {

        const setBtn = document.createElement("button");

        setBtn.classList.add("set-btn");

        setBtn.textContent = setName;

        setBtn.draggable = true;

        setBtn.addEventListener("click", () => {
    
                if (wasDragging) return;

            currentSet = setName;

            setsScreen.classList.add("hiddensetsScreen");

            options.classList.remove("hidden");
            backbtn1.classList.remove("back-button1");
        });

        setsContainer.appendChild(setBtn);
    });
}


addSetBtn.addEventListener("click", () => {

    const setName = prompt("Enter set name:");

    if (!setName) return;

    // create placeholder card
    cards.push({
        id: crypto.randomUUID(),
        word: "_placeholder_",
        definition: "__placeholder__",
        category: "all",
        language: currentLanguage,
        set: setName,
        hidden: true,
        status: "new"
    });

    saveCards();

    renderSets();
});


function fitPracticeText(element, maximumFontSize) {
    if (!element || element.classList.contains("hidden-definition")) return;

    const minimumFontSize = 8;
    let low = minimumFontSize;
    let high = maximumFontSize;
    let bestFit = minimumFontSize;

    // Find the largest whole-pixel font size that fits this text box.
    while (low <= high) {
        const size = Math.floor((low + high) / 2);
        element.style.fontSize = `${size}px`;

        if (element.scrollWidth <= element.clientWidth &&
            element.scrollHeight <= element.clientHeight) {
            bestFit = size;
            low = size + 1;
        } else {
            high = size - 1;
        }
    }

    element.style.fontSize = `${bestFit}px`;
}

function fitCurrentPracticeCard() {
    const currentCard = scrollcards.querySelector(".current-scroll-card");
    if (!currentCard) return;

    fitPracticeText(currentCard.querySelector(".word"), 24);
    fitPracticeText(currentCard.querySelector("#hiddef"), 19);
}

function fitCollectionText(element, maximumFontSize) {
    if (!element) return;

    const minimumFontSize = 8;
    let low = minimumFontSize;
    let high = maximumFontSize;
    let bestFit = minimumFontSize;

    while (low <= high) {
        const size = Math.floor((low + high) / 2);
        element.style.fontSize = `${size}px`;

        if (element.scrollWidth <= element.clientWidth &&
            element.scrollHeight <= element.clientHeight) {
            bestFit = size;
            low = size + 1;
        } else {
            high = size - 1;
        }
    }

    element.style.fontSize = `${bestFit}px`;
}

function fitCollectionCard(cardElement) {
    if (!cardElement) return;
    fitCollectionText(cardElement.querySelector(".note-card-word"), 19);
    fitCollectionText(cardElement.querySelector(".note-card-definition"), 16);
}

// Re-measure after the web font swaps in so its final glyph widths are used.
document.fonts?.addEventListener("loadingdone", () => {
    notesContainer.querySelectorAll(".note-card-details").forEach(fitCollectionCard);
});


function renderstudyCards(cardId){
    scrollcards.innerHTML="";
    const card=cards.find(c => c.id === cardId);
    if (!card){
        scrollcards.innerHTML="<p>No cards for this language yet!</p>";
        return;
    }
    const promptText = practiceReverseSides ? card.definition : card.word;
    const answerText = practiceReverseSides ? card.word : card.definition;
    const answerLabel = practiceReverseSides ? "word" : "definition";
    const practiceDetails = [];

    if (practiceShowPronunciation && String(card.pronunciation || "").trim()) {
        practiceDetails.push(`<span>${card.pronunciation}</span>`);
    }

    if (practiceShowCategory && String(card.category || "").trim()) {
        practiceDetails.push(`<span>${normalizeCategory(card.category)}</span>`);
    }

    const cardDiv=document.createElement("div");
        cardDiv.className="current-scroll-card";
        cardDiv.classList.toggle("has-practice-details", practiceDetails.length > 0);
        cardDiv.classList.toggle("has-two-practice-details", practiceDetails.length === 2);
        cardDiv.dataset.cardId = card.id;
        cardDiv.innerHTML=`
        <h2 class="word">${promptText}</h2>
        <h3 class="hidden-definition" id="hiddef">${answerText}</h3>
        <button type="button" class="settings-btn" aria-label="Open practice settings" aria-expanded="false" aria-controls="practiceSettingsPanel">
        <img src="settingsbutton.png" alt="">
        </button>
        <div id="practiceSettingsPanel" class="practice-settings-panel" hidden>
            <h3>Study Settings</h3>
            <button type="button" class="practice-reverse-toggle" data-practice-reverse aria-pressed="${practiceReverseSides}">
                <span>Reverse cards</span>
                <span class="practice-toggle-track" aria-hidden="true"><span class="practice-toggle-knob"></span></span>
            </button>
            <label><input type="checkbox" data-practice-setting="pronunciation" ${practiceShowPronunciation ? "checked" : ""}> Pronunciation</label>
            <label><input type="checkbox" data-practice-setting="category" ${practiceShowCategory ? "checked" : ""}> Word category</label>
        </div>
        <button type="button" class="reveal-btn" aria-label="Reveal ${answerLabel}">
        <img src="revealbone.png" id="revealthiscard" alt="cross">
        </button>
        ${practiceDetails.length ? `<div class="practice-card-details" data-detail-count="${practiceDetails.length}">${practiceDetails.join("")}</div>` : ""}
        <button class="mastered-btn ${card.status === "mastered" ? "active-mastered" : ""}">
    <img
        src="${card.status === "mastered"
            ? "goldstar.png"
            : "pinkstar.png"}"
        class="master-scrollcardstar-img"
        alt="mastery star">
</button>
        <button type="button" class="nextcard-btn">
        <img src="fork.png" id="nextfork" alt="fork">
        </button>
        <button type="button" class="previouscard-btn">
        <img src="spoon.png" id="prevspoon" alt="spoon">
</button>`
        scrollcards.appendChild(cardDiv);

        requestAnimationFrame(fitCurrentPracticeCard);
        document.fonts?.ready.then(fitCurrentPracticeCard);
}

function showPracticeCalendar() {
    const months = [
        ["January", "January.png"],
        ["February", "Feburary.png"],
        ["March", "March.png"],
        ["April", "April.png"],
        ["May", "May.png"],
        ["June", "June.png"],
        ["July", "July.png"],
        ["August", "August.png"],
        ["September", "September.png"],
        ["October", "October.png"],
        ["November", "November.png"],
        ["December", "December.png"]
    ];

    scrollcards.innerHTML = `
        <div class="practice-calendar" aria-label="Calendar months">
            ${months.map(([month, image], index) => `
                <button type="button" class="calendar-month-btn" data-month="${month}" data-days="${[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][index]}" aria-label="${month}" title="${month}">
                    <img src="${image}" alt="">
                    <span class="calendar-month-number" aria-hidden="true">${index + 1}</span>
                </button>
            `).join("")}
            <h2 class="practice-calendar-title">calender</h2>
        </div>
    `;
    ketchupMeterContainer.classList.add("hidden-meter");
}

scrollcards.addEventListener("click", (e) => {
    const settingsBtn = e.target.closest(".settings-btn");
    const reverseToggle = e.target.closest("[data-practice-reverse]");
    const settingsPanel = scrollcards.querySelector(".practice-settings-panel");

    if (settingsBtn) {
        const willOpen = settingsPanel?.hidden ?? false;
        if (settingsPanel) settingsPanel.hidden = !willOpen;
        settingsBtn.setAttribute("aria-expanded", String(willOpen));
        return;
    }

    if (reverseToggle) {
        practiceReverseSides = reverseToggle.getAttribute("aria-pressed") !== "true";
        const currentCardId = reverseToggle.closest(".current-scroll-card")?.dataset.cardId;
        saveCards();
        if (!currentCardId) return;

        renderstudyCards(currentCardId);
        const refreshedPanel = scrollcards.querySelector(".practice-settings-panel");
        if (refreshedPanel) refreshedPanel.hidden = false;
        scrollcards.querySelector(".settings-btn")?.setAttribute("aria-expanded", "true");
        return;
    }

    if (settingsPanel && !e.target.closest(".practice-settings-panel")) {
        settingsPanel.hidden = true;
        scrollcards.querySelector(".settings-btn")?.setAttribute("aria-expanded", "false");
    }
});

scrollcards.addEventListener("change", (event) => {
    const setting = event.target.closest("[data-practice-setting]");
    if (!setting) return;

    if (setting.dataset.practiceSetting === "pronunciation") {
        practiceShowPronunciation = setting.checked;
    } else if (setting.dataset.practiceSetting === "category") {
        practiceShowCategory = setting.checked;
    }

    const currentCardId = setting.closest(".current-scroll-card")?.dataset.cardId;
    saveCards();
    if (!currentCardId) return;

    renderstudyCards(currentCardId);
    const refreshedPanel = scrollcards.querySelector(".practice-settings-panel");
    if (refreshedPanel) refreshedPanel.hidden = false;
    scrollcards.querySelector(".settings-btn")?.setAttribute("aria-expanded", "true");
});

scrollcards.addEventListener("click", (e) => {
    const monthBtn = e.target.closest(".calendar-month-btn");
    if (!monthBtn) return;

    const month = monthBtn.dataset.month;
    const numberOfDays = Number(monthBtn.dataset.days);
    const dayNumbers = Array.from(
        { length: numberOfDays },
        (_, index) => `<span class="calendar-day">${index + 1}</span>`
    ).join("");

    scrollcards.innerHTML = `
        <div class="selected-calendar" aria-label="${month} calendar">
            <div class="calendar-sheet">
                <img src="calendar.png" alt="">
                <h2 class="selected-calendar-month">${month}</h2>
                <div class="calendar-days">${dayNumbers}</div>
            </div>
        </div>
    `;
});

scrollcards.addEventListener("click",(e)=>{
    const revealBtn=e.target.closest(".reveal-btn");
  if (revealBtn){
     console.log("Reveal button clicked");
   const scrollc=e.target.closest(".current-scroll-card");
   const def= scrollc.querySelector(".hidden-definition");
   const revealRect = revealBtn.getBoundingClientRect();

   def.classList.remove("hidden-definition");
   def.style.transform = "none";
   fitCurrentPracticeCard();

   const answerRect = def.getBoundingClientRect();
   const moveX = revealRect.left + revealRect.width / 2 - (answerRect.left + answerRect.width / 2);
   const moveY = revealRect.top + revealRect.height / 2 - (answerRect.top + answerRect.height / 2);
   def.style.transform = `translate(${moveX}px, ${moveY}px)`;
   revealBtn.style.display="none";

       // 🎯 SESSION PROGRESS LOGIC
    sessionProgress += 1;
    tomatoes += 1;

    saveSession();
    updateMeter();
}
})

scrollcards.addEventListener("click", (e) => {
    const prevBtn=e.target.closest(".previouscard-btn");
    if (!prevBtn) return;

    moveToPreviousValidCard();
});


document.addEventListener("keydown", (e) => {
    if (scrollcards.classList.contains("scroll-cards")) return;
    if (cardTransitionRunning) return;

    // only allow controls in study mode
    // 👉 SPACE = reveal
    if (e.code === "Space") {
        e.preventDefault();
        document.querySelector(".reveal-btn")?.click();
    }

    // 👉 RIGHT = next
    if (e.code === "ArrowRight") {
        document.querySelector(".nextcard-btn")?.click();
    }

    // 👉 LEFT = previous
    if (e.code === "ArrowLeft") {
        document.querySelector(".previouscard-btn")?.click();
    }
});


scrollcards.addEventListener("click",(e)=>{
    const nextBtn = e.target.closest(".nextcard-btn");
   if (!nextBtn) return;

      moveToNextValidCard();
});

scrollcards.addEventListener("click", (e) => {
    const btn = e.target.closest(".mastered-btn");
    if (!btn) return;

    const cardId = studyQueue[historyIndex];
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    card.status = "mastered";
    btn.innerHTML = `
        <img src="goldstar.png" class="master-scrollcardstar-img" alt="mastery star">
    `;
    btn.classList.add("active-mastered");
    saveCards();

    studyQueue = studyQueue.filter(id => id !== cardId);
    if (historyIndex >= studyQueue.length) {
        historyIndex = studyQueue.length - 1;
    }

    if (studyQueue.length === 0) {
        scrollcards.innerHTML = "<p>🎉 Session complete!</p>";
        resetMeter();
        renderCards(masterFilter.value);
        return;
    }

    setTimeout(() => {
        renderstudyCards(studyQueue[historyIndex]);
        updateDog();
    }, 400);
    renderCards(masterFilter.value);
});

  
function moveToNextValidCard() {
    if (achievementPlaying) return;
    if (cardTransitionRunning) return;

    const previousCardId = studyQueue[historyIndex];
    let i = historyIndex + 1;

    while (i < studyQueue.length) {
        const card = cards.find(c => c.id === studyQueue[i]);

        // skip deleted or invalid
        if (card) break;

        i++;
    }

    if (i < studyQueue.length) {
        historyIndex = i;
        renderstudyCards(studyQueue[historyIndex]);
        updateDog();
        playTomatoShake();
   } else {

    // reshuffle ONLY non-mastered cards
    studyQueue = shuffle(
        cards
            .filter(c =>
                c.language === currentLanguage &&
                c.set === currentSet &&
                !c.hidden &&
                c.status !== "mastered"
            )
            .map(c => c.id)
    );

    // Do not immediately repeat the card shown before wrapping the queue.
    if (studyQueue.length > 1 && studyQueue[0] === previousCardId) {
        const nextDifferentIndex = studyQueue.findIndex(id => id !== previousCardId);
        [studyQueue[0], studyQueue[nextDifferentIndex]] = [studyQueue[nextDifferentIndex], studyQueue[0]];
    }

    // if everything is mastered
    if (studyQueue.length === 0) {
        scrollcards.innerHTML = "<p>🎉 All cards mastered!</p>";
        resetMeter();
        return;
    }

    // restart from beginning
    historyIndex = 0;
    renderstudyCards(studyQueue[historyIndex]);
    updateDog();
    playTomatoShake();
}
}

function playTomatoShake() {
    cardTransitionRunning = true;
    redBoard.classList.remove("tomato-shake");
    void redBoard.offsetWidth;
    redBoard.classList.add("tomato-shake");

    window.setTimeout(() => {
        redBoard.classList.remove("tomato-shake");
        cardTransitionRunning = false;
    }, 450);
}

function moveToPreviousValidCard() {
    if (achievementPlaying) return;
    if (cardTransitionRunning) return;

    let i = historyIndex - 1;

    while (i >= 0) {
        const card = cards.find(c => c.id === studyQueue[i]);
        if (card) break;
        i--;
    }

    if (i >= 0) {
        historyIndex = i;
        renderstudyCards(studyQueue[historyIndex]);
        subtractDog();
    }
}

function updateMeter() {
    const percent = Math.min((sessionProgress / sessionGoal) * 100, 100);

    document.getElementById("tomatoFill").style.width = percent + "%";

    document.getElementById("tomatoText").textContent =
        `${sessionProgress} / ${sessionGoal}`;

    if (sessionProgress >= sessionGoal) {
        meterComplete();
    }
}

function resetMeter() {
    sessionProgress = 0;

    const fill = document.getElementById("tomatoFill");
    fill.style.width = "0%";
    fill.style.background =
        "linear-gradient(to right, #F7B6B2, #F3A08F, #E98578)";
    fill.style.boxShadow = "none";

    document.getElementById("tomatoText").textContent =
        `0 / ${sessionGoal}`;
}

function meterComplete() {

    if (achievementPlaying || dailyGoalReached) return;
    achievementPlaying = true;
    dailyGoalReached = true;
    recordDailyGoalCompletion();

    const fill = document.getElementById("tomatoFill");

    // little completion glow
    fill.style.background =
         "linear-gradient(to right, #F7B6B2, #F3A08F, #E98578)"

    fill.style.boxShadow = "0 0 12px #ff4d4d";

    // Restart the GIF, hide the practice card, and show the celebration.
    scrollcards.classList.add("goal-card-hidden");
    ketchupMeterContainer.classList.add("hidden-meter");
    currentDogIndex = 0;
    setDogFrame(currentDogIndex);
    achievementGif.src = `achievedit.gif?play=${Date.now()}`;
    goalAchievement.hidden = false;

}

function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function recordDailyGoalCompletion() {
    const today = getLocalDateKey(new Date());
    if (goalCompletionDates.includes(today)) return;

    goalCompletionDates.push(today);
    saveAppData();
}

function hideGoalAchievement() {
    goalAchievement.hidden = true;
    scrollcards.classList.remove("goal-card-hidden");
    achievementPlaying = false;
}

keepPracticingBtn.addEventListener("click", () => {
    hideGoalAchievement();
    ketchupMeterContainer.classList.add("hidden-meter");
    moveToNextValidCard();
});

returnToOptionsBtn.addEventListener("click", () => {
    hideGoalAchievement();
    resetMeter();
    backbtn4.click();
});

function renderCards(filterCategory="all"){
    if (!currentLanguage) return;
    const searchValue = searchBar.value.trim().toLowerCase();
    notesContainer.innerHTML="";
    notesContainer.classList.toggle("table-view", collectionView === "table");
    notesContainer.classList.toggle("calendar-view", collectionView === "calendar");

    if (collectionView === "calendar") {
        renderCollectionCalendar();
        return;
    }

    const matchingCards = cards.filter((card) => {
        const isInSelectedPlace =
            card.language === currentLanguage &&
            card.set === currentSet &&
            !card.hidden;

        const matchesCategory =
            filterCategory === "all" ||
            (filterCategory === "mastered"
                ? card.status === "mastered"
                : normalizeCategory(card.category) === filterCategory);

        const matchesSearch =
            (card.word || "").toLowerCase().includes(searchValue) ||
            (card.definition || "").toLowerCase().includes(searchValue) ||
            (card.pronunciation || "").toLowerCase().includes(searchValue);

        return isInSelectedPlace && matchesCategory && matchesSearch;
    });

    if (collectionView === "table") {
        renderCardsTable(matchingCards);
        return;
    }

    if (matchingCards.length === 0) {
        notesContainer.innerHTML = "<p class=\"no-matching-cards\">no matching cards found ...</p>";
        return;
    }

    matchingCards.forEach((card) => {
         const cardElement=document.createElement("div");
         cardElement.className ="note-card-details";
         cardElement.dataset.id=card.id;
         cardElement.innerHTML=`
          <div class="note-card-text">
            <h3 class="note-card-word">${card.word}</h3>
            <p class="note-card-definition">${card.definition}</p>
          </div>
         <button class="master-toggle-btn ${card.status === "mastered" ? "active-mastered" : ""}">
         <img src="${card.status === "mastered" ? "goldstar.png" : "pinkstar.png"}" class="master-star-img" alt="mastery star">
        </button>
           <button type="button" class="delete-btn">
           <img src="deleteleaf.png" id="deletethiscard" alt="tomatostem">
           </button>
           <select value="filterSelect" id="filter-group" class="filter-select">
            <option value="noun">noun</option>
            <option value="verb">verb</option>
            <option value="adjective">adjective</option>
            <option value="adverb">adverb</option>
            <option value="other">other</option>
            </select>
             </div>`
        
           const select=cardElement.querySelector(".filter-select");
           select.value = normalizeCategory(card.category);
           select.addEventListener("change",()=>{
            card.category = normalizeCategory(select.value);
            saveCards()
            renderCards(masterFilter.value);
            
           });
             notesContainer.appendChild(cardElement);
             fitCollectionCard(cardElement);
        });

}

const collectionMonths = [
    ["January", "January.png"],
    ["February", "Feburary.png"],
    ["March", "March.png"],
    ["April", "April.png"],
    ["May", "May.png"],
    ["June", "June.png"],
    ["July", "July.png"],
    ["August", "August.png"],
    ["September", "September.png"],
    ["October", "October.png"],
    ["November", "November.png"],
    ["December", "December.png"]
];

function renderCollectionCalendar() {
    const year = new Date().getFullYear();

    if (collectionCalendarMonth === null) {
        notesContainer.innerHTML = `
            <section class="collection-calendar-months" aria-labelledby="collectionCalendarTitle">
                <h2 id="collectionCalendarTitle" class="collection-calendar-title">Consistency Calendar <span>${year}</span></h2>
                <div class="collection-month-grid">
                    ${collectionMonths.map(([month, image], index) => `
                        <button class="collection-month-btn" type="button" data-collection-month="${index}" aria-label="Open ${month} ${year}">
                            <img src="${image}" alt="">
                            <span class="collection-month-number" aria-hidden="true">${index + 1}</span>
                        </button>
                    `).join("")}
                </div>
            </section>
        `;
        return;
    }

    const monthIndex = collectionCalendarMonth;
    const monthName = collectionMonths[monthIndex][0];
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const numberOfDays = new Date(year, monthIndex + 1, 0).getDate();
    const blankDays = Array.from({ length: firstWeekday }, () => "<span class=\"collection-calendar-blank\" aria-hidden=\"true\"></span>").join("");
    const dayNumbers = Array.from({ length: numberOfDays }, (_, index) => {
        const day = index + 1;
        const dateKey = getLocalDateKey(new Date(year, monthIndex, day));
        const goalWasReached = goalCompletionDates.includes(dateKey);

        if (goalWasReached) {
            return `
                <span class="collection-calendar-day earned-tomato" aria-label="${monthName} ${day}: daily goal achieved" title="Daily goal achieved">
                    <img src="tomato.PNG" alt="">
                    <span class="visually-hidden">${day}</span>
                </span>
            `;
        }

        return `<span class="collection-calendar-day">${day}</span>`;
    }).join("");

    notesContainer.innerHTML = `
        <section class="collection-calendar-detail" aria-labelledby="selectedCollectionMonth">
            <button class="collection-calendar-back" type="button" aria-label="Back to all months">&larr; Months</button>
            <div class="collection-calendar-art">
                <img src="calendar.png" alt="">
                <h2 id="selectedCollectionMonth">${monthName}</h2>
                <div class="collection-calendar-days">
                    ${blankDays}${dayNumbers}
                </div>
            </div>
        </section>
    `;
}

notesContainer.addEventListener("click", (event) => {
    const monthButton = event.target.closest("[data-collection-month]");
    if (monthButton) {
        collectionCalendarMonth = Number(monthButton.dataset.collectionMonth);
        renderCollectionCalendar();
        return;
    }

    if (event.target.closest(".collection-calendar-back")) {
        collectionCalendarMonth = null;
        renderCollectionCalendar();
    }
});

function renderCardsTable(matchingCards) {
    const toolbar = document.createElement("div");
    toolbar.className = "collection-table-toolbar";

    const columnOptions = document.createElement("div");
    const columnOptionsTitle = document.createElement("span");
    columnOptions.className = "table-column-options";
    columnOptionsTitle.className = "table-column-options-title";
    columnOptionsTitle.textContent = "Columns:";
    columnOptions.appendChild(columnOptionsTitle);

    function addColumnOption(labelText, checked, onChange) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = checked;
        checkbox.addEventListener("change", () => onChange(checkbox.checked));
        label.append(checkbox, document.createTextNode(labelText));
        columnOptions.appendChild(label);
    }

    addColumnOption("Pronunciation", showTablePronunciationColumn, (checked) => {
        showTablePronunciationColumn = checked;
        saveCards();
        renderCards(masterFilter.value);
    });

    addColumnOption("Property", showTablePropertyColumn, (checked) => {
        showTablePropertyColumn = checked;
        saveCards();
        renderCards(masterFilter.value);
    });

    const deleteSelectedBtn = document.createElement("button");
    deleteSelectedBtn.type = "button";
    deleteSelectedBtn.className = "delete-selected-btn";
    deleteSelectedBtn.textContent = "Delete selected";
    deleteSelectedBtn.disabled = true;
    toolbar.append(columnOptions, deleteSelectedBtn);

    const tableWrap = document.createElement("div");
    tableWrap.className = "collection-table-wrap";

    const table = document.createElement("table");
    table.className = "collection-table";
    const optionalColumnCount = Number(showTablePronunciationColumn) + Number(showTablePropertyColumn);
    table.classList.add(`table-optional-columns-${optionalColumnCount}`);

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const selectHeader = document.createElement("th");
    const selectHeaderLabel = document.createElement("label");
    const selectAll = document.createElement("input");

    selectAll.type = "checkbox";
    selectAll.className = "select-all-cards";
    selectAll.disabled = matchingCards.length === 0;
    selectAll.setAttribute("aria-label", "Select all visible cards");
    selectHeaderLabel.appendChild(selectAll);
    selectHeader.appendChild(selectHeaderLabel);
    selectHeader.className = "table-select-column";
    headerRow.appendChild(selectHeader);

    const tableHeadings = [
        { label: "", className: "table-master-column" },
        { label: "Word", className: "table-word-column" },
        { label: "Definition", className: "table-definition-column" }
    ];

    if (showTablePronunciationColumn) {
        tableHeadings.push({ label: "Pronunciation", className: "table-pronunciation-column" });
    }

    if (showTablePropertyColumn) {
        tableHeadings.push({ label: "Property", className: "table-property-column" });
    }

    tableHeadings.forEach(({ label, className }) => {
        const th = document.createElement("th");
        th.textContent = label;
        th.className = className;
        if (!label) th.setAttribute("aria-label", "Mastered");
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    if (matchingCards.length === 0) {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        const emptyMessage = document.createElement("p");
        emptyCell.colSpan = 4 + optionalColumnCount;
        emptyCell.className = "table-empty-cell";
        emptyMessage.className = "table-empty-message";
        emptyMessage.textContent = "no matching cards found ...";
        emptyCell.appendChild(emptyMessage);
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
    }

    matchingCards.forEach((card) => {
        const row = document.createElement("tr");
        row.dataset.id = card.id;

        const selectCell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "table-card-select";
        checkbox.dataset.cardId = card.id;
        checkbox.setAttribute("aria-label", `Select ${card.word}`);
        selectCell.appendChild(checkbox);
        selectCell.className = "table-select-column";
        row.appendChild(selectCell);

        const masteredCell = document.createElement("td");
        const starButton = document.createElement("button");
        const star = document.createElement("img");
        const isMastered = card.status === "mastered";
        starButton.type = "button";
        starButton.className = "table-master-toggle";
        starButton.setAttribute(
            "aria-label",
            isMastered ? `Mark ${card.word} as not mastered` : `Mark ${card.word} as mastered`
        );
        star.src = isMastered ? "goldstar.png" : "pinkstar.png";
        star.alt = isMastered ? "mastered" : "not mastered";
        star.className = "table-master-star";
        starButton.appendChild(star);
        masteredCell.appendChild(starButton);
        masteredCell.className = "table-master-column";
        row.appendChild(masteredCell);

        starButton.addEventListener("click", () => {
            card.status = card.status === "mastered" ? "new" : "mastered";
            saveCards();
            renderCards(masterFilter.value);
        });

        const editableFields = ["word", "definition"];
        if (showTablePronunciationColumn) editableFields.push("pronunciation");

        editableFields.forEach((field) => {
            const cell = document.createElement("td");
            const input = document.createElement("input");

            input.type = "text";
            input.className = "table-card-edit";
            input.value = card[field] || "";
            input.setAttribute("aria-label", `Edit ${field} for ${card.word}`);

            input.addEventListener("change", () => {
                const updatedValue = input.value.trim();

                if (!updatedValue && field !== "pronunciation") {
                    input.value = card[field] || "";
                    return;
                }

                card[field] = updatedValue;
                saveCards();
            });

            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    input.blur();
                }
            });

            cell.appendChild(input);
            cell.className = `table-${field}-cell`;
            row.appendChild(cell);
        });

        if (showTablePropertyColumn) {
        const propertyCell = document.createElement("td");
        const propertyDropdown = document.createElement("div");
        const propertyButton = document.createElement("button");
        const propertyMenu = document.createElement("div");
        const currentProperty = normalizeCategory(card.category);

        propertyDropdown.className = "table-property-dropdown";
        propertyButton.type = "button";
        propertyButton.className = "table-property-select";
        propertyButton.textContent = currentProperty;
        propertyButton.setAttribute("aria-label", `Edit property for ${card.word}`);
        propertyButton.setAttribute("aria-haspopup", "listbox");
        propertyButton.setAttribute("aria-expanded", "false");
        propertyMenu.className = "table-property-options";
        propertyMenu.setAttribute("role", "listbox");
        propertyMenu.hidden = true;

        ["noun", "verb", "adjective", "adverb", "other"].forEach((property) => {
            const option = document.createElement("button");
            option.type = "button";
            option.className = "table-property-option";
            option.textContent = property;
            option.setAttribute("role", "option");
            option.setAttribute("aria-selected", String(property === currentProperty));

            option.addEventListener("click", () => {
                card.category = property;
                propertyButton.textContent = property;
                propertyMenu.hidden = true;
                propertyButton.setAttribute("aria-expanded", "false");
                saveCards();

                if (masterFilter.value !== "all") {
                    renderCards(masterFilter.value);
                }
            });

            propertyMenu.appendChild(option);
        });

        propertyButton.addEventListener("click", () => {
            const willOpen = propertyMenu.hidden;

            table.querySelectorAll(".table-property-options").forEach((menu) => {
                menu.hidden = true;
                menu.previousElementSibling?.setAttribute("aria-expanded", "false");
            });

            propertyMenu.hidden = !willOpen;
            propertyButton.setAttribute("aria-expanded", String(willOpen));
        });

        propertyDropdown.addEventListener("focusout", (event) => {
            if (!propertyDropdown.contains(event.relatedTarget)) {
                propertyMenu.hidden = true;
                propertyButton.setAttribute("aria-expanded", "false");
            }
        });

        propertyDropdown.append(propertyButton, propertyMenu);
        propertyCell.appendChild(propertyDropdown);
        propertyCell.className = "table-property-column";
        row.appendChild(propertyCell);
        }

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableWrap.appendChild(table);
    notesContainer.append(toolbar, tableWrap);

    const rowCheckboxes = [...tbody.querySelectorAll(".table-card-select")];

    function updateTableSelection() {
        const selectedCount = rowCheckboxes.filter((checkbox) => checkbox.checked).length;
        selectAll.checked = selectedCount === rowCheckboxes.length;
        selectAll.indeterminate = selectedCount > 0 && selectedCount < rowCheckboxes.length;
        deleteSelectedBtn.disabled = selectedCount === 0;
    }

    selectAll.addEventListener("change", () => {
        rowCheckboxes.forEach((checkbox) => {
            checkbox.checked = selectAll.checked;
        });
        updateTableSelection();
    });

    rowCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", updateTableSelection);
    });

    deleteSelectedBtn.addEventListener("click", () => {
        const selectedIds = rowCheckboxes
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.dataset.cardId);

        if (selectedIds.length === 0) return;

        deleteTarget.type = "cards";
        deleteTarget.id = selectedIds;
        deletePopup.classList.remove("popup-hidden");
    });
}


let draggedCardId = null;

searchBar.addEventListener("input",()=>{
    renderCards(masterFilter.value);
});

masterFilter.addEventListener("change",()=>{
    saveAppData();
    renderCards(masterFilter.value);
});

renderCards(masterFilter.value);


let deleteTarget = {
    type: null,
    id: null
};

let highlightedDeleteBtn = null;

function clearDeleteHighlight() {
    highlightedDeleteBtn?.classList.remove("pending-delete");
    highlightedDeleteBtn = null;
}

notesContainer.addEventListener("click",function(e){
    const deleteBtn = e.target.closest(".delete-btn");
    if(!deleteBtn) return;
    const cardElement= deleteBtn.closest(".note-card-details");
    clearDeleteHighlight();
    highlightedDeleteBtn = deleteBtn;
    highlightedDeleteBtn.classList.add("pending-delete");
    deleteTarget.type="card";

    deleteTarget.id = cardElement.dataset.id;
    deletePopup.classList.remove("popup-hidden");
});

cancelDeleteBtn.addEventListener("click", () => {

    deletePopup.classList.add("popup-hidden");
    clearDeleteHighlight();
    
    deleteTarget.id = null;
    deleteTarget.type= null;
});

confirmDeleteBtn.addEventListener("click", () => {
    if(deleteTarget.type=== "card"){
             cards = cards.filter(card => String(card.id) !== String(deleteTarget.id));
             renderCards(masterFilter.value);
    }
    else if (deleteTarget.type === "cards") {
        const selectedIds = new Set(deleteTarget.id.map(String));
        cards = cards.filter(card => !selectedIds.has(String(card.id)));
        renderCards(masterFilter.value);
    }
    //DELETE SET
    else if (deleteTarget.type === "set") {

        cards = cards.filter(
            card => !(
                card.language === currentLanguage &&
                card.set === deleteTarget.id
            )
        );

        if (currentSet === deleteTarget.id) {
            currentSet = null;
        }

        renderSets();
    }
    else if(deleteTarget.type === "language"){

             // remove language
    languages = languages.filter(
        lang => lang !== deleteTarget.id
    );

    // remove all cards in that language
    cards = cards.filter(
        card => card.language !== deleteTarget.id
    );

    // reset selected language if deleted
    if(currentLanguage === deleteTarget.id){
        currentLanguage = null;
        currentSet = null;
    }

    // update language buttons
    renderlanguagebtns();

    // update cards
    renderCards(masterFilter.value);

    }
     deletePopup.classList.add("popup-hidden");
    clearDeleteHighlight();
    deleteTarget.type = null;
    deleteTarget.id = null;
    saveCards();
});

notesContainer.addEventListener("click", (e) => {
    const starBtn = e.target.closest(".master-toggle-btn");
    if (!starBtn) return;
        console.log("star clicked");

    const cardElement = starBtn.closest(".note-card-details");
    const id = cardElement.dataset.id;

    const card = cards.find(c => c.id === id);
    if (!card) return;

 // TOGGLE STATUS
    if (card.status === "mastered") {
        card.status = "new";

        // update button visually
        starBtn.innerHTML = `
<img
src="pinkstar.png"
class="master-star-img"
alt="mastery star">
`;
        starBtn.classList.remove("active-mastered");

    } else {
        card.status = "mastered";

        // update button visually
                starBtn.innerHTML = `
<img
src="goldstar.png"
class="master-star-img"
alt="mastery star">
`;
        starBtn.classList.add("active-mastered");
    }

    saveCards();

    // animation restart
    starBtn.classList.remove("stamp");
    void starBtn.offsetWidth;
    starBtn.classList.add("stamp");

});


function saveCards(){
    saveAppData();

};

function saveAppData(){
    window.flashcardStorage.save(getAppData()).catch(error => {
        console.error("Flashcard data could not be saved.", error);
    });

};

});
