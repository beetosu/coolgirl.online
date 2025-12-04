class BlogList extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <p>hi</p>
        `
    }
}

customElements.define("blog-list", BlogList);