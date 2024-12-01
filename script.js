import presents from './presents.json' with { type: "json" };

const todayDate = new Date();
let testModeEnabled = false;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const testMode = urlParams.get('test');
    if(testMode === "true") {
        testModeEnabled = true;
    }

    initToday();
    initPresents();
});

const initToday = () => {
    const month = todayDate.getMonth() + 1;
    const year = todayDate.getFullYear();

    if(month !== 12 || year !== 2024) {
        document.getElementsByTagName("body")[0].innerHTML = "<h1>Nicht verfügbar!</h1>";
        return;
    }

    const today = todayDate.getDate();
    document.getElementById("date").textContent = "am " + today + ". Dezember";
}

const initPresents = () => {
    let currentIndex = presents.length;
    let temporaryValue, randomIndex;
    while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = presents[currentIndex];
    presents[currentIndex] = presents[randomIndex];
    presents[randomIndex] = temporaryValue;
    };

    const cloneMaster = document.getElementById("clone-master");
    const container = document.getElementsByClassName("calendar")[0];
    for(const present of presents) {
        createCard(cloneMaster, container, present);
    }
    container.removeChild(cloneMaster);

    return presents;
};

const createCard = (master, container, present) => {
    const clone = master.cloneNode(true);
    clone.removeAttribute("id");
    clone.setAttribute("data-day", present.day);
    clone.firstElementChild.innerHTML = present.day;
    clone.lastElementChild.getElementsByClassName("day")[0].textContent = "Tag " + present.day;
    clone.lastElementChild.getElementsByClassName("category")[0].innerHTML = getCategoryEmojy(present.category);
    clone.lastElementChild.getElementsByClassName("title")[0].textContent = present.title;
    clone.lastElementChild.getElementsByClassName("description")[0].textContent = present.description;
    clone.lastElementChild.getElementsByClassName("img")[0].src = "imgs/presents/" + present.img;
    clone.childNodes[0].innerHTML = present.day;

    clone.addEventListener('click', () => {
        if (!testModeEnabled && present.day > todayDate.getDate()) {
            return;
        }

        if(clone.classList.contains('flipped')) {
            clone.classList.remove('flipped');
        } else {
            clone.classList.add('flipped');
            setTimeout(() => {
                clone.classList.remove('flipped');
            }, 10000);
        }
    });

    container.prepend(clone);
};

const getCategoryEmojy = (category) => {
    switch(category) {
        case "beauty": return "&#129532;";
        case "sport": return "&#127947;&#127995;&#8205;&#9792;&#65039;";
        case "snack": return "&#127850;";
        case "spicy": return '&#128293;';
        case "datenight": return "&#128105;&#127995;&#8205;&#10084;&#65039;&#8205;&#128104;&#127995;";
        default: return "&#127873;";
    }
}