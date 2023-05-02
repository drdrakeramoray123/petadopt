const selectedImage = document.getElementById("selected-img");
const images = document.querySelectorAll("#image-container img");

images[0].parentNode.classList.add("border-indigo-500");

images.forEach((image) => {
    image.addEventListener("mouseover", clickedImage);
});

images.forEach((image) => {
    image.addEventListener("click", clickedImage);
});

function clickedImage(e) {
    images.forEach((image) => {
        const parent = image.parentNode;
        parent.classList.remove("border-indigo-500");
        parent.classList.add("hover:border-indigo-400");
    });

    const image = e.target;
    const parent = image.parentNode;
    parent.classList.add("border-indigo-500");
    parent.classList.remove("hover:border-indigo-400");
    selectedImage.src = image.src;
}
