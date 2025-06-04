// ------------------- ТРЕНУВАННЯ -------------------
if (document.getElementById('workout-list')) {
    const workouts = [
        { title: "Кардіо для початківців", duration: 30, image: "images/cardio.jpg" },
        { title: "Силове тренування",       duration: 45, image: "images/silove.jpg" },
        { title: "Розтяжка",                duration: 20, image: "images/roztyah.jpg" }
      ];
      
  
    const workoutList   = document.getElementById("workout-list");
  
    workouts.forEach(workout => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${workout.image}" alt="${workout.title}">
        <h3>${workout.title}</h3>
        <p>Тривалість: ${workout.duration} хв</p>
        <button>Почати тренування</button>
      `;
      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        // зчитуємо попередній лог або створюємо новий
        const log = JSON.parse(localStorage.getItem('workoutLog') || '[]');
        log.push(workout);
        localStorage.setItem('workoutLog', JSON.stringify(log));
        btn.disabled = true;
        btn.textContent = "Завершено";
      });
      workoutList.appendChild(card);
    });
  }
  
  // ------------------- ПРОГРЕС -------------------
  if (document.getElementById('progress-stats')) {
    const statsEl = document.getElementById('progress-stats');
    const logUl   = document.getElementById('workout-log');
  
    function renderProgress() {
      const log = JSON.parse(localStorage.getItem('workoutLog') || '[]');
      logUl.innerHTML = '';
      let total = 0;
      log.forEach((w, i) => {
        total += w.duration;
        const li = document.createElement('li');
        li.textContent = `${w.title} — ${w.duration} хв`;
        // кнопка видалити
        const del = document.createElement('button');
        del.textContent = '🗑️';
        del.addEventListener('click', () => {
          log.splice(i, 1);
          localStorage.setItem('workoutLog', JSON.stringify(log));
          renderProgress();
        });
        li.appendChild(del);
        logUl.appendChild(li);
      });
      statsEl.innerHTML = `Пройдені тренування: <strong>${log.length}</strong> | Загальний час: <strong>${total} хв</strong>`;
    }
  
    renderProgress();
  }
  