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
      width: var(
        --sportlink-wedstrijd-wedstrijd-team-logo-width,
        var(--sportlink-wedstrijd-wedstrijd-team-width, 10ch)
      );
      max-width: var(--sportlink-wedstrijd-wedstrijd-team-width, 10ch);
      font-size: var(--sportlink-wedstrijd-wedstrijd-team-font-size, 0.8rem);
    }

    .wedstrijd-meta {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      font-size: var(--sportlink-wedstrijd-wedstrijd-team-font-size, 0.8rem);
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
  type?: string;

  @property()
  allgames?: boolean;

  @property()
  wedstrijdType?: string = "BOND";

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
    const url: URL = new URL(`${this.URL}${this.getType()}`);
    url.searchParams.append("client_id", this.clientId as unknown as string);
    if (!this.allgames) {
      url.searchParams.append("teamcode", this.teamCode as unknown as string);
      url.searchParams.append(
        "wedstrijdtype",
        this.wedstrijdType as unknown as string,
      );
    }
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

    if (!this.clientId) {
      this.error = true;
    } else if (!this.allgames && !this.teamCode) {
      this.error = true;
    } else {
      this.data = await this.getData();
      this.data = this.modifiedArray(this.data);
      this.loading = false;
    }
  }

  private modifiedArray = (data: any | undefined[]) => {
    if (this.type === "uitslag") {
      return data.reverse();
    }
    if (this.allgames) {
      return data;
    }
    if (this.single) {
      return data.slice(0, 1);
    } else if (this.data.length > 3) {
      return this.data.slice(0, 3);
    }
    return data;
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.getMeta();
    this.dispatchEvent(new CustomEvent("connected"));
  }

  private renderTeamCard(team: string, code: string) {
    return html`
      <div>
        ${code
          ? html`<img src=https://logoapi.voetbal.nl/logo.php?clubcode=${code} alt="club logo ${team}" />`
          : null}
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
      ? html`<slot name="next_game"></slot>`
      : html`<slot name="previous_game"></slot>`;
  }

  private renderWedstrijd(): any {
    return this.data?.length > 0
      ? this.data.map((wedstrijd) => {
          return html` <div class="wedstrijd">
            <div class="wedstrijd-thuis">
              ${this.renderTeamCard(
                wedstrijd.thuisteam,
                wedstrijd.thuisteamclubrelatiecode,
              )}
            </div>
            <div class="wedstrijd-meta">${this.renderMeta(wedstrijd)}</div>
            <div class="wedstrijd-uit">
              ${this.renderTeamCard(
                wedstrijd.uitteam,
                wedstrijd.uitteamclubrelatiecode,
              )}
            </div>
          </div>`;
        })
      : html`
          <p><slot name="nogames">Er zijn geen wedstrijden bekend.</slot></p>
        `;
  }

  render(): TemplateResult {
    return this.error
      ? html`<div><slot name="error">Helaas, er is iets misgegaan.<slot></div>`
      : this.loading
        ? html` <div>loading</div>`
        : html` <div class="wedstrijd-main">
            <h2>${this.wedstrijdTitel()}</h2>
            ${this.renderWedstrijd()}
          </div>`;
  }
}
