let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");

document.getElementById("addTask").onclick = () => {
  const taskText = taskInput.value.trim();
  const dueDate = dateInput.value;

  if (!taskText) {
    showAlert("⚠️ Isi nama task terlebih dahulu!");
    return;
  }

  if (!dueDate) {
    showAlert("⚠️ Isi tanggal tugas terlebih dahulu!");
    return;
  }

  tasks.push({
    id: Date.now(),
    text: taskText,
    date: dueDate,
    completed: false
  });

  saveTasks();
  taskInput.value = "";
  dateInput.value = "";
  renderTasks();
  showAlert("✅ Task berhasil ditambahkan!");
};

document.getElementById("deleteAll").onclick = () => {
  if (tasks.length === 0) {
    showAlert("📭 Tidak ada task untuk dihapus.");
    return;
  }

  showConfirm("Yakin ingin menghapus semua task?", (confirmed) => {
    if (confirmed) {
      tasks = [];
      saveTasks();
      renderTasks();
      showAlert("🗑️ Semua task telah dihapus.");
    }
  });
};

filter.onchange = renderTasks;

function renderTasks() {
  let filtered = tasks;
  if (filter.value === "completed") {
    filtered = tasks.filter(t => t.completed);
  } else if (filter.value === "pending") {
    filtered = tasks.filter(t => !t.completed);
  }

  taskList.innerHTML = "";

  if (filtered.length === 0) {
    taskList.innerHTML = `<tr><td colspan="4">Tidak ada task</td></tr>`;
  } else {
    filtered.forEach(task => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${task.text}</td>
        <td>${task.date}</td>
        <td class="${task.completed ? 'status-completed' : 'status-pending'}">
          ${task.completed ? "Selesai" : "Belum"}
        </td>
        <td>
          <button class="btn-complete" onclick="toggleComplete(${task.id})">
            ${task.completed ? "Undo" : "Selesai"}
          </button>
          <button class="btn-delete" onclick="deleteTask(${task.id})">Hapus</button>
        </td>
      `;

      taskList.appendChild(tr);
    });
  }

  updateDashboard();
}

function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  showConfirm("Yakin ingin menghapus task ini?", (confirmed) => {
    if (confirmed) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
      showAlert("🗑️ Task telah dihapus.");
    }
  });
}

function updateDashboard() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById("totalTasks").innerText = total;
  document.getElementById("completedTasks").innerText = completed;
  document.getElementById("pendingTasks").innerText = pending;
}

function showAlert(message) {
  const alertBox = document.createElement("div");
  alertBox.innerText = message;
  alertBox.style.position = "fixed";
  alertBox.style.top = "20px";
  alertBox.style.right = "20px";
  alertBox.style.backgroundColor = message.includes("hapus") || message.includes("deleted") ? "#dc2626" : "#16a34a";
  alertBox.style.color = "white";
  alertBox.style.padding = "12px 20px";
  alertBox.style.borderRadius = "8px";
  alertBox.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  alertBox.style.zIndex = "9999";
  alertBox.style.opacity = "1";
  alertBox.style.transition = "opacity 0.5s ease-out";

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.style.opacity = "0";
    setTimeout(() => alertBox.remove(), 500);
  }, 2000);
}

function showConfirm(message, callback) {
  const box = document.createElement("div");
  box.className = "confirm-box";
  box.innerHTML = `
    <p>${message}</p>
    <button class="yes-btn">Ya</button>
    <button class="no-btn">Tidak</button>
  `;

  document.body.appendChild(box);

  box.querySelector(".yes-btn").onclick = () => {
    callback(true);
    box.remove();
  };

  box.querySelector(".no-btn").onclick = () => {
    callback(false);
    box.remove();
  };
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render saat pertama kali halaman dibuka
renderTasks();
