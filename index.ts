import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("sportlink-wedstrijd")
class SportlinkWedstrijd extends LitElement {
  static styles = css`
    :host {
      text-align: var(--sportlink-wedstrijd-text-align, center);
      color: var(--sportlink-wedstrijd-color, inherit);
      font-family: var(--sportlink-wedstrijd-font-family, inherit);
    }

    .wedstrijd {
      display: flex;
      justify-content: space-between;
      gap: var(--sportlink-wedstrijd-gutter, 1rem);
    }

    .wedstrijd-main {
      background: var(--sportlink-wedstrijd-background, #fff);
      padding-inline: var(--sportlink-wedstrijd-padding-inline, 1rem);
      padding-block: var(--sportlink-wedstrijd-padding-block, 1rem);
    }

    .wedstrijd-main h2 {
      margin-top: 0;
      font-family: var(--sportlink-wedstrijd-font-family-header, inherit);
      font-size: var(--sportlink-wedstrijd-font-family-header-size, inherit);
      font-weight: var(--sportlink-wedstrijd-font-family-header-weight, 600);
    }

    .wedstrijd img {
      aspect-ratio: 1.5 / 2;
      max-width: 50px;
    }

    .wedstrijd-thuis,
    .wedstrijd-uit {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: var(--sportlink-wedstrijd-team-color);
      font-size: var(--sportlink-wedstrijd-team-size);
    }

    .wedstrijd-meta {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }
  `;

  @property()
  clientId?: string;

  @property()
  pouleCode?: string;

  @property()
  loading: boolean = true;

  @property()
  error: boolean = false;

  data: any[] = [];

  URL = "https://data.sportlink.com/";

  private returnDutchDate(date: string): any {
    const formatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    } as any;
    const newDate = new Date(date);
    return new Intl.DateTimeFormat("nl-NL", formatOptions).format(newDate);
  }

  private async getData(): Promise<any[]> {
    const url: URL = new URL(`${this.URL}/poule-programma`);
    url.searchParams.append("client_id", this.clientId as unknown as string);
    url.searchParams.append("poulecode", this.pouleCode as unknown as string);
    return await fetch(url).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return new Error("error in call");
      }
    });
  }

  private async getMeta() {
    const metaEls = document.getElementsByTagName("meta");
    this.clientId =
      this.clientId !== undefined
        ? this.clientId
        : metaEls.namedItem("clientId")?.content;
    this.pouleCode =
      this.pouleCode !== undefined
        ? this.pouleCode
        : metaEls.namedItem("pouleCode")?.content;

    if (!this.clientId || !this.pouleCode) {
      this.error = true;
    } else {
      this.data = await this.getData();
      this.loading = false;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.getMeta();
    this.dispatchEvent(new CustomEvent("connected"));
  }

  private renderTeam(team: string) {
    return html` <div>${team}</div> `;
  }

  private renderDonk(team: string) {
    return html`
    <div>
    <img src=${this.URL}/clublogo?client_id=${this.clientId} alt="thuis logo donk" />
    ${this.renderTeam(team)}
    </div>
    `;
  }

  private renderThuisClub(): any {
    return this.data[0]?.thuisteam.toLocaleLowerCase().includes("donk") === true
      ? this.renderDonk(this.data[0]?.thuisteam)
      : this.renderTeam(this.data[0]?.thuisteam);
  }

  private renderUitClub(): any {
    return this.data[0]?.uitteam.toLocaleLowerCase().includes("donk") === true
      ? this.renderDonk(this.data[0]?.uitteam)
      : this.renderTeam(this.data[0]?.uitteam);
  }

  private renderMeta(): any {
    return html`
      <span>To do klasse</span>
      <time class="datum" datetime="${this.data[0]?.datum}">${this.returnDutchDate(this.data[0]?.datum)}</time>
      <time class"aanvrangstijd" datetime="${this.data[0]?.aanvangstijd}">${this.data[0]?.aanvangstijd}</time>
    `;
  }

  private renderWedstrijd(): any {
    return this.data?.length > 0
      ? html`
          <div class="wedstrijd-main">
            <h2>Volgende wedstrijd</h2>
            <div class="wedstrijd">
              <div class="wedstrijd-thuis">${this.renderThuisClub()}</div>
              <div class="wedstrijd-meta">${this.renderMeta()}</div>
              <div class="wedstrijd-uit">${this.renderUitClub()}</div>
            </div>
          </div>
        `
      : html` <p>Er is geen eerstvolgende wedstrijd bekend</p> `;
  }

  render(): any {
    return this.error
      ? html`<div>Er is helaas iets misgegaan</div>`
      : this.loading
        ? html` <div>loading</div>`
        : this.renderWedstrijd();
  }
}
