## General component for showing upcoming matches or results from futball

It is a webcomponent for displaying the next upcoming match(es) or previous match (result) from a amateurteam in the Netherlands. It needs a clientId for sportlink and a teamCode. This code can be as meta element or as property.

### meta
`<meta name="teamCode" content="[yourcontent]" />`
`<meta name="clientId" content="[yourcontent]" />`

### property
`<sportlink-wedstrijd clientId="[yourcontent]" teamCode="[yourcontent]"></sportlink-wedstrijd>`


### Properties

| Property    | Value |
| -------- | ------- |
| clientId  | [your_id] |
| teamCode  | [your_id] |
| single  | [some_value] |
| type  | programma / uitslag |


### css vars

| Property    | Default Value |
| -------- | ------- |
| --sportlink-wedstrijd-color  | inherit |
| --sportlink-wedstrijd-text-align  | center |
| --sportlink-wedstrijd-font-family  | inherit |
| --sportlink-wedstrijd-gutter  | 1rem |
| --sportlink-wedstrijd-background  | #fff |
| --sportlink-wedstrijd-padding-inline  | 1rem |
| --sportlink-wedstrijd-padding-block  | 1rem |
| --sportlink-wedstrijd-font-family-header  | inherit |
| --sportlink-wedstrijd-font-family-header-size  | inherit |
| --sportlink-wedstrijd-font-family-header-weight  | 600 |
| --sportlink-wedstrijd-padding-inline-start  | 0 |
| --sportlink-wedstrijd-padding-inline-end  | 0 |
| --sportlink-wedstrijd-padding-block-start  | 0 |
| --sportlink-wedstrijd-padding-block-end  | 0 |
| --sportlink-wedstrijd-wedstrijd-border-bottom | 0 |
| --sportlink-wedstrijd-wedstrijd-team-font-size | inherit |
| --sportlink-wedstrijd-wedstrijd-team-color | inherit |
| --sportlink-wedstrijd-wedstrijd-poule-color | inherit |
| --sportlink-wedstrijd-datum-padding-inline | 0 |
| --sportlink-wedstrijd-datum-padding-block | 0 |
| --sportlink-wedstrijd-datum-team-font-size | inherit |
| --sportlink-wedstrijd-datum-font-family-weight | inherit |
| --sportlink-wedstrijd-aanvangstijd-padding-inline | 0 |
| --sportlink-wedstrijd-aanvangstijd-padding-block | 0 |
| --sportlink-wedstrijd-aanvangstijd-team-font-size | inherit |
| --sportlink-wedstrijd-aanvangstijd-font-family-weight | inherit |
| --sportlink-wedstrijd-wedstrijd-team-logo-width | 6rem |

### This component is in beta mode and not production ready
