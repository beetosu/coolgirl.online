class SiteHeader extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });
        const sheet = new CSSStyleSheet();

        sheet.replaceSync(`
            header {
                text-align: center;

                h1, p {
                    margin: 0;
                }

                img {
                    filter: var(--drawing);
                }

                .title {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    color: inherit;
                }
            }
        `);

        shadow.adoptedStyleSheets = [sheet];

        this.headerElement = document.createElement('header');
        shadow.appendChild(this.headerElement);
    }

    connectedCallback() {
        const isLink = this.hasAttribute('is-link');

        const titleElement = document.createElement(isLink ? 'a' : 'div');
        titleElement.className = 'title';

        if (isLink) {
            titleElement.href = '/';
        }

        titleElement.innerHTML = `
            <h1>coolgirl.online</h1>
            <img src="/assets/coolgirl.png"/>
        `;

        this.headerElement.replaceChildren(titleElement);
    }
}

customElements.define("site-header", SiteHeader);