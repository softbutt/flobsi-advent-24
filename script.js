let todaysDayOfMonth = 1;
let testModeEnabled = false;


document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const testMode = urlParams.get('test');
    if(testMode === "true") {
        testModeEnabled = true;
    }

    await initToday();
    await initPresents();
});

const initToday = async () => {
    const viennaTimeResponse = await fetch("https://timeapi.io/api/time/current/zone?timeZone=Europe/Vienna");
    const viennaTimeData = JSON.parse(await viennaTimeResponse.text());
    const today = new Date(viennaTimeData.dateTime);

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    if(month !== 12 || year !== 2024) {
        document.getElementsByTagName("body")[0].innerHTML = "<h1>Nicht verfügbar!</h1>";
        return;
    }

    todaysDayOfMonth = today.getDate();
    document.getElementById("date").textContent = "am " + todaysDayOfMonth + ". Dezember";
}

const initPresents = async () => {
    const presents = await loadPresents();
    const shuffledPresents = shuffle(presents);

    const container = document.getElementsByClassName("calendar")[0];

    const cloneMaster = document.getElementById("clone-master");
    for(const present of shuffledPresents) {
        createCard(cloneMaster, container, present);
    }
    container.removeChild(cloneMaster);
    container.classList.remove("loading");
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
        if (!testModeEnabled && present.day > todaysDayOfMonth) {
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

const shuffle = (array) => {
    const newArray = JSON.parse(JSON.stringify(JSON.parse(array)));
    let currentIndex = newArray.length;
    let temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = newArray[currentIndex];
        newArray[currentIndex] = newArray[randomIndex];
        newArray[randomIndex] = temporaryValue;
    }
    return newArray;
}

const loadPresents = async () => {
    const presentsResponse = await fetch('./presents.json');
    const presents = await presentsResponse.text();
    return presents;
}