"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import { HeroDrawing } from "./HeroDrawing";
import { HeroV2 } from "./HeroV2";
import { readHeroTemplate, type HeroTemplate } from "./heroTemplate";

/** l'indirizzo non cambia mentre si è sulla home: niente da ascoltare */
const noSubscribe = () => () => {};

/**
 * Hero della home secondo ?template= (heroTemplate.ts): 1 l'hero v2 con la filigrana (HeroV2), 2 e 3 il
 * disegno al tratto (HeroDrawing). Il parametro si legge nel browser, così la pagina resta statica: sul
 * server e in idratazione vale 1. Con ?template=2 o 3 lo script in testa marca subito <html> e il CSS
 * nasconde l'hero 1 finché non arriva il disegno, senza lampi del template sbagliato.
 */
export function HeroSwitch({ drawing, v2 }: { drawing: ComponentProps<typeof HeroDrawing>; v2: ComponentProps<typeof HeroV2> }) {
  const template = useSyncExternalStore(noSubscribe, () => readHeroTemplate(window.location.search), () => 1 as HeroTemplate);
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: `var m=/[?&]template=([23])(&|$)/.exec(location.search)||(/[?&]colori=logo(&|$)/.test(location.search)?[0,"3"]:null);if(m)document.documentElement.dataset.heroTemplate=m[1]` }}
      />
      {template === 1 ? <HeroV2 {...v2} /> : <HeroDrawing {...drawing} template={template} />}
    </>
  );
}
