import { LitElement, html, css, TemplateResult } from "lit";
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

    .wedstrijd {
      padding-inline-start: var(--sportlink-wedstrijd-padding-inline-start, 0);
      padding-inline-end: var(--sportlink-wedstrijd-inline-end, 0);
      padding-block-start: var(--sportlink-wedstrijd-block-start, 0);
      padding-block-end: var(--sportlink-wedstrijd-block-end, 0);
    }

    .wedstrijd:not(:last-of-type) {
      border-bottom: 1px solid
        var(--sportlink-wedstrijd-wedstrijd-border-bottom, lightgrey);
    }

    .wedstrijd-thuis,
    .wedstrijd-uit {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: var(--sportlink-wedstrijd-wedstrijd-team-color, inherit);
      font-size: var(--sportlink-wedstrijd-wedstrijd-team-font-size, inherit);
    }

    .wedstrijd-meta {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }

    .wedstrijd-datum {
      padding-inline: var(--sportlink-wedstrijd-datum-padding-inline, 0);
      padding-block: var(--sportlink-wedstrijd-datum-padding-block, 0);
      font-size: var(--sportlink-wedstrijd-datum-team-font-size, inherit);
      font-weight: var(--sportlink-wedstrijd-datum-font-family-weight, inherit);
    }

    .wedstrijd-aanvangstijd-or-uitslag {
      padding-inline: var(--sportlink-wedstrijd-aanvangstijd-padding-inline, 0);
      padding-block: var(--sportlink-wedstrijd-aanvangstijd-padding-block, 0);
      font-size: var(
        --sportlink-wedstrijd-aanvangstijd-team-font-size,
        inherit
      );
      font-weight: var(
        --sportlink-wedstrijd-aanvangstijd-font-family-weight,
        inherit
      );
    }

    .wedstrijd-klassepoule {
      color: var(--sportlink-wedstrijd-poule-color, inherit);
    }
  `;

  @property()
  clientId?: string;

  @property()
  teamCode?: string;

  @property()
  type?: string = "uitslag" || "programma";

  @property()
  single?: any;

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

  private getType() {
    return this.type !== undefined && this.type === "uitslag"
      ? `uitslagen`
      : `programma`;
  }

  private async getData(): Promise<any[]> {
    const url: URL = new URL(`${this.URL}/${this.getType()}`);
    url.searchParams.append("client_id", this.clientId as unknown as string);
    url.searchParams.append("teamcode", this.teamCode as unknown as string);
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
    this.teamCode =
      this.teamCode !== undefined
        ? this.teamCode
        : metaEls.namedItem("teamCode")?.content;

    if (!this.clientId || !this.teamCode) {
      this.error = true;
    } else {
      this.data = await this.getData();
      this.data = this.single
        ? this.data.slice(0, 1)
        : this.data.length > 3
          ? this.data.slice(0, 3)
          : this.data;
      this.loading = false;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.getMeta();
    this.dispatchEvent(new CustomEvent("connected"));
  }

  private renderTeamCard(team: string, logo: string) {
    return html`
      <div>
        ${logo ? html`<img src=${logo} alt="club logo ${team}" />` : null}
        <div>${team}</div>
      </div>
    `;
  }

  private renderMeta(wedstrijd: any): TemplateResult {
    return html`
      ${wedstrijd.klassepoule
        ? html`<span class="wedstrijd-klassepoule"
            >${wedstrijd.klassepoule}</span
          >`
        : null}
      <time class="wedstrijd-datum" datetime="${wedstrijd.wedstrijddatum}"
        >${this.returnDutchDate(wedstrijd.wedstrijddatum)}</time
      >
      ${wedstrijd.uitslag
        ? html`<span class="wedstrijd-aanvrangstijd-or-uitslag"
            >${wedstrijd.uitslag}</span
          >`
        : html`<time class"wedstrijd-aanvrangstijd-or-uitslag" datetime="${wedstrijd.aanvangstijd}">${wedstrijd.aanvangstijd}</time>`}
    `;
  }

  private wedstrijdTitel() {
    return this.type === "programma" || this.type === undefined
      ? html` Volgende wedstrijd `
      : html` Vorige wedstrijd `;
  }

  private renderWedstrijd(): any {
    return this.data?.length > 0
      ? this.data.map((wedstrijd) => {
          return html` <div class="wedstrijd">
            <div class="wedstrijd-thuis">
              ${this.renderTeamCard(
                wedstrijd.thuisteam,
                wedstrijd.thuisteamlogo,
              )}
            </div>
            <div class="wedstrijd-meta">${this.renderMeta(wedstrijd)}</div>
            <div class="wedstrijd-uit">
              ${this.renderTeamCard(wedstrijd.uitteam, wedstrijd.uitteamlogo)}
            </div>
          </div>`;
        })
      : html` <p>Er is geen eerstvolgende wedstrijd bekend</p> `;
  }

  render(): TemplateResult {
    return this.error
      ? html`<div>Er is helaas iets misgegaan</div>`
      : this.loading
        ? html` <div>loading</div>`
        : html` <div class="wedstrijd-main">
            <h2>${this.wedstrijdTitel()}</h2>
            ${this.renderWedstrijd()}
          </div>`;
  }
}
