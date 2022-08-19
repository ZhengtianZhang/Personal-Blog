const blogForm = document.querySelector(".blog-form");
const blogList = document.querySelector(".blog-list");

const clicked = [];
let updateFormExist = false;

const refreshAllBlogs = () => {
  fetch("http://localhost:8000/blogs")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      const html = data.map(blog => 
        `<li class="blog">
          <h3 class="title-${blog.id}" id="${blog.id}">${blog.title}</h3>
        </li>`
      ).join("");

      blogList.innerHTML = html;
      clicked.length = 0;
    });
};

blogForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newBlog = {
    title: e.currentTarget.title.value,
    content: e.currentTarget.content.value,
  };

  fetch("http://localhost:8000/blogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBlog),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      e.target.reset();
      refreshAllBlogs();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

blogList.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.matches("button")) {
    
    if (e.target.dataset.type == "delete") {
      const id = parseInt(e.target.value);

      fetch("http://localhost:8000/blog/" + id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          refreshAllBlogs();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    if (e.target.dataset.type == "edit") {
      const id = parseInt(e.target.value);
      if (!updateFormExist) {
        updateFormExist = true;
        fetch("http://localhost:8000/blog/" + id)
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          defaultTitle = data.title;
          defaultContent = data.content;
          const updatePart = `<form class="updateForm" autocomplete="off">
          <div>
            <label for="title">Title: </label>
            <input type="text" name="title" id="title" value="${defaultTitle}" required />
          </div>
          <div>
            <textarea id="content" name="content" rows="5" required>${defaultContent} </textarea>
          </div>
          <div>
            <input type="submit" value="Update" />
          </div>
          </form>`;
          blogList.insertAdjacentHTML("afterend", updatePart);
          const update = document.querySelector(".updateForm");
      
          update.addEventListener("submit", (e) => {
            e.preventDefault();
      
            const updateBlog = {
              title: e.currentTarget.title.value,
              content: e.currentTarget.content.value,
            };
      
            fetch("http://localhost:8000/blog/" + id, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateBlog),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Success:", data);
                e.target.reset();
                refreshAllBlogs();
                window.location.reload();
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
    }
    
  }

  if (e.target.matches("h3")) {
    const id = parseInt(e.target.id);
    console.log(id);
    if (!clicked.includes(id)) {
      clicked.push(id);
      fetch("http://localhost:8000/blog/" + id)
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          const subject = document.querySelector(".title-" + id);
          const htmlElement = `<p>${data.content}</p>
          <button data-type="delete" value="${data.id}"> Remove </button>
          <button data-type="edit" value="${data.id}"> Edit </button>`;
          subject.insertAdjacentHTML("afterend", htmlElement);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
});

refreshAllBlogs();
