// Je kunt hier je JavaScript logica toevoegen
console.log('Vite + Tailwind CSS setup is klaar!');

// Voorbeeld: Simple interactie
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`${button.textContent} werd geklikt!`);
        });
    });
});