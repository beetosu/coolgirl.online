class BlogList extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" }),
            sheet = new CSSStyleSheet();
        
        sheet.replaceSync(`
            align-self: end;
            
            h2 {
                font-size: 20px;
                margin: 0;
            }

            ul {
                margin: 0;

                a { 
                    color: initial; 
                }
            }
        `);
        shadow.adoptedStyleSheets = [ sheet ];
        
        fetch('metadata.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the JSON data
            })
            .then(blogs => buildBloglist(blogs, shadow));
    }
}

function buildBloglist(blogs, shadow) {
    if (!Object.keys(blogs).length) return;

    const title = document.createElement('h2');
    title.textContent = 'Recent Posts:';
    shadow.appendChild(title);

    const ul = document.createElement('ul');
    Object.entries(blogs).forEach(([url, blog]) => {
        const li = document.createElement('li'),
            link = document.createElement('a');
        
        link.href = `/blog/${url}.html`
        link.textContent = blog.date ? `${blog.date} - ${blog.title}` : blog.title; // Assuming each blog object has a "title" property
        li.appendChild(link);
        ul.appendChild(li);
    });

    shadow.appendChild(ul);
}

customElements.define("blog-list", BlogList);