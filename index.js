let running = false;

const parseTxt = (files) => {
    const reader = new FileReader();
    reader.onload = function (e) {
        const uploadEl = document.getElementById("upload");
        uploadEl.style.display = "none";

        const text = e.target.result;

        const parts = text.split("---");
        const metadata = {};
        parts[0].trim().split("\n").forEach(ln => {
            const props = ln.split(/:(.*)/);
            metadata[props[0].trim()] = props[1].trim();
        })
        document.title = metadata["title"]
        document.body.style.backgroundImage = `url('${metadata["image"]}')`;

        const textEl = document.getElementById("container");
        const buttonEl = document.getElementById("button");
        textEl.style.backgroundColor = metadata["background"];
        textEl.style.color = metadata["text"];
        textEl.style.display = "block";
        const paragraphs = parts[1].trim().split("\r\n\r\n");

        const handleParagraph = () => {
            if (!running && !!paragraphs.length) {
                const currentText = paragraphs.shift();
                if (currentText.match(/^\[([\s\S]+)\]$/)) {
                    buttonEl.style.display = "inline-block";
                    buttonEl.innerHTML = currentText.match(/^\[([\s\S]+)\]$/)[1];
                } else {
                    buttonEl.style.display = "none";
                    const paragraphEl = document.createElement("p");
                    textEl.append(paragraphEl);
                    appendText(currentText, paragraphEl);
                }
            }
        }
        handleParagraph();
        document.addEventListener("click", handleParagraph);
    };

    reader.readAsText(files[0], "UTF-8");
}

const appendText = (str, el) => {
    let i = 0;
    running = true;
    const addLetter = () => {
        if (i < str.length) {
            el.innerHTML += str[i];
            i += 1;
            setTimeout(addLetter, 5);
            el.parentElement.scrollTop = el.parentElement.scrollHeight;
        } else {
            running = false;
        }
    }
    setTimeout(addLetter, 5);
}

const preventDefaults = (e) => {
    e.preventDefault()
    e.stopPropagation()
}

const handleDrop = (e) => {
    let dt = e.dataTransfer;
    let files = dt.files;

    parseTxt(files);
}

window.onload = async () => {
    const uploadEl = document.getElementById("upload");
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadEl.addEventListener(eventName, preventDefaults, false);
    })
    uploadEl.addEventListener('drop', handleDrop, false);
}