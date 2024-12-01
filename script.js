document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const cards = document.querySelectorAll('.card');

    document.getElementById("date").textContent = "Heute ist der " + today + ". Dezember";

    console.log(today);
    console.log(month);
    console.log(year);

    if(month !== 12 || year !== 2024) {
        document.getElementsByTagName("body")[0].innerHTML = "<h1>Nicht verfügbar!</h1>";
        return;
    }

    cards.forEach(card => {
        const day = parseInt(card.getAttribute('data-day'), 10);
        card.addEventListener('click', () => {
            if (day <= today) {
                if(card.classList.contains('flipped')) {
                    card.classList.remove('flipped');
                } else {
                    card.classList.add('flipped');
                    setTimeout(() => {
                        card.classList.remove('flipped');
                    }, 10000);
                }
            }
        });
    });
});