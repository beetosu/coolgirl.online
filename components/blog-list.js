class BlogList extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        fetch('metadata.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the JSON data
            })
            .then(blogs => {
                if (!Object.keys(blogs).length) return;

                const title = document.createElement('h2');
                title.textContent = 'Recent Posts:';
                shadow.appendChild(title);

                const ul = document.createElement('ul');
                Object.values(blogs).forEach(blog => {
                    const li = document.createElement('li');
                    li.textContent = blog.date ? `${blog.date} - ${blog.title}` : blog.title; // Assuming each blog object has a "title" property
                    ul.appendChild(li);
                });

                shadow.appendChild(ul);
            });
    }
}

customElements.define("blog-list", BlogList);