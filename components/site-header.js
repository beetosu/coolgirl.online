class SiteHeader extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });
        const sheet = new CSSStyleSheet();

        sheet.replaceSync(`
            header {
                text-align: center;

                p {
                    margin: 0;
                }

                .site-name {
                    font-size: 32px;
                    font-weight: bold;
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
            <p class="site-name">coolgirl.online</p>
            <img src="/assets/coolgirl.png"/>
        `;

        this.headerElement.replaceChildren(titleElement);
    }
}

customElements.define("site-header", SiteHeader);