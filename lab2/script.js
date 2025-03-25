const workouts = [
    { title: "Кардіо для початківців", duration: 30 },
    { title: "Силове тренування", duration: 45 },
    { title: "Розтяжка", duration: 20 }
];

const workoutList = document.getElementById("workout-list");
const workoutLog = document.getElementById("workout-log");
const progressStats = document.getElementById("progress-stats");
let totalWorkouts = 0;
let totalMinutes = 0;

for (let i = 0; i < workouts.length; i++) {
    const workout = workouts[i];
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <h3>${workout.title}</h3>
        <p>Тривалість: ${workout.duration} хв</p>
        <button>Почати тренування</button>
    `;
    const button = card.querySelector("button");
    button.addEventListener("click", () => {
        totalWorkouts++;
        totalMinutes += workout.duration;
        progressStats.innerHTML = `Пройдені тренування: <strong>${totalWorkouts}</strong> | Загальний час: <strong>${totalMinutes} хв</strong>`;
        const logItem = document.createElement("li");
        logItem.textContent = `${workout.title} — ${workout.duration} хв`;
        workoutLog.appendChild(logItem);
        button.disabled = true;
        button.textContent = "Завершено";
        button.style.backgroundColor = "gray";
    });
    workoutList.appendChild(card);
}
