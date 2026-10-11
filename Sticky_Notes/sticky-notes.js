const noteInput = document.getElementById("note-input");
const addButton = document.getElementById("add-button");
const notesContainer = document.getElementById("notes-container");
const inputCard = document.querySelector(".note-input");

function updateColors() {
  const notes = document.querySelectorAll(".note");
  notes.forEach((note, index) => {
    if (index % 2 === 0) {
      note.classList.remove("white");
      note.classList.add("blue");
    } else {
      note.classList.remove("blue");
      note.classList.add("white");
    }
  });
}

function addNote() {
  const text = noteInput.value;
  if (text.length === 0) return;

  const note = document.createElement("div");
  note.classList.add("note");

  const noteText = document.createElement("p");
  noteText.textContent = text; 

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => {
    note.remove();
    updateColors();
  });

  note.appendChild(deleteButton);
  note.appendChild(noteText);
  notesContainer.insertBefore(note, inputCard);

  updateColors();
  noteInput.value = "";
}
addButton.addEventListener("click", addNote);
