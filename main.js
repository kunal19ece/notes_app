const app = document.querySelector(".app");
const addButton = document.querySelector(".add_button");


class clickAndHold {
    constructor(target, callback) {
        this.target = target;
        this.callback = callback;
        this.isHeld = false;
        this.activeholdTimeoutId = null;


        ["mousedown", "touchstart"].forEach(type => {
            this.target.addEventListener(type,
                this._onHoldstart.bind(this))
        })
    }
    _onHoldstart() {
        this.isHeld = true;
        this.activeholdTimeoutId = setTimeout(() => {
            if (this.isHeld) {
                this.callback();
            }
        }, 1000);
    }
    _onHoldEnd() {
        this.isHeld = false;
        clearTimeout(this.activeholdTimeoutId);
    }
}





addButton.addEventListener("click", () => {
    addNotes();
});


getNotes().forEach(note => {
    const newElem = createElement(note.id, note.content);
    app.insertBefore(newElem, addButton);
})



function getNotes() {
    return JSON.parse(localStorage.getItem("notes-data") || "[]");
}

function saveNotes(noteTosave) {
    localStorage.setItem("notes-data", JSON.stringify(noteTosave));
}

function createElement(id, content) {
    const area = document.createElement("textarea");
    area.classList.add("note");
    area.placeholder = "empty sticky note";
    area.value = content;
    area.readOnly = true;
    area.addEventListener("change", () => {
        area.readOnly = true;
        updateNotes(id, area.value);
    });
    area.addEventListener("click", () => {
        setTimeout(() => {
            area.readOnly = false;

        }, 1000)
    })
    area.addEventListener("dblclick", () => {
        const doDelete = confirm("are you sure you wish to delete this sticky note ?");
        if (doDelete) {
            deleteNotes(id, area);
        }
        else {
            alert("ok");
        }
    })
    return area;
}



function addNotes() {
    const notes = getNotes();
    const noteObj = {
        id: Math.floor(Math.random() * 1000),
        content: ""
    }
    const element = createElement(noteObj.id, noteObj.content);
    app.insertBefore(element, addButton);
    notes.push(noteObj);
    saveNotes(notes);
}

function updateNotes(id, newContent) {
    const notes = getNotes();
    const targetnote = notes.filter(note => note.id == id)[0];

    targetnote.content = newContent;
    saveNotes(notes);
}

function deleteNotes(id, element) {
    const notes = getNotes().filter(note => note.id != id);
    saveNotes(notes);
    app.removeChild(element);

}