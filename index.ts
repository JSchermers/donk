import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("donk-voetbalstanden")
class DonkVoetbalstanden extends LitElement {
  @property()
  clientId?: string;

  private URL: string = "https://data.sportlink.com";

  // private async getData(): Promise<void> {

  // }

  connectedCallback(): void {
    super.connectedCallback();
    // this.getData();
    this.dispatchEvent(new CustomEvent("connected"));
  }

  render(): any {
    return html`
          <img src=${this.URL}/clublogo?client_id=${this.clientId} alt="logo"/>
        `;
  }
}
