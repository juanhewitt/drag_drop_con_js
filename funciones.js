const dropArea = document.querySelector(".contenedor");
const dragTexto = dropArea.querySelector("h2");
const boton = dropArea.querySelector("button");
const input = dropArea.querySelector("#input-file");
let files;

boton.addEventListener("click", (e) => {
    input.click()
});

input.addEventListener("change", e => {

    files = this.files[0];
    dropArea.classList.add("active");
    showFiles(files)
    dropArea.classList.remove("active");
})

dropArea.addEventListener("dragover", e => {
    e.preventDefault();
    dropArea.classList.add("active");
    dragTexto.textContent = "suelta para subir los achivos"
});
dropArea.addEventListener("dragleave", e => {
    e.preventDefault();
    dropArea.classList.remove("active");
    dragTexto.textContent = "Arrastra y suelta las imagenes";
}); 
dropArea.addEventListener("drop", event => {
    event.preventDefault();
    files = event.dataTransfer.files;
    showFiles(files);   
    dropArea.classList.remove("active");
    dragTexto.textContent = "Arrastra y suelta las imagenes";
});

function showFiles(files) {

    if (files.length === undefined) {
        processFile(files);
    } else {
        for (const file of files) {
            processFile(file);
        }
    }

}

function processFile(file) {
    const doctype = file.type;
    const validar = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (validar.includes(doctype)) {
        const fileReader = new FileReader();
        const id = `file-${Math.random().toString(32).substring(7)}`;

        fileReader.addEventListener("load", (e) => {
            const fileUrl = fileReader.result;
            const image = `
                   <div id = "${id}" class = "file-container">
                       <img src = "${fileUrl}" alt = "${file.name}" width = "50">
                   <div class = "status">
                           <span>${file.name}</span>
                           <span class = "status-text">
                           cargando...
                         </span>
                       </div>
                     </div>
                   `;
            const html = document.querySelector("#preview").innerHTML;
            document.querySelector("#preview").innerHTML = image + html;
        });

        fileReader.readAsDataURL(file)
        uploadFile(file, id);
    } else {
        alert("no es un archivo compatible");
    }

}
function uploadFile(file,id) {
    const formdata = new FormData();
    formdata.append("file", file);
    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: "POST",
            body: formdata,
        })

        const responseText = await response.text;

        document.querySelector(`#${id} .status-text`).innerHTML = `<span class = "success">Archivo subido correctamente</span>`

    } catch {
        document.querySelector(`#${id} .status-text`).innerHTML = `<span class = "failure">el archivo no se pudo subir</span>`;
    }
}