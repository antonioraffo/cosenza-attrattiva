"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import { HeroDrawing } from "./HeroDrawing";
import { HeroV2 } from "./HeroV2";
import { readHeroTemplate, type HeroTemplate } from "./heroTemplate";

/** l'indirizzo non cambia mentre si è sulla home: niente da ascoltare */
const noSubscribe = () => () => {};

/**
 * Hero della home secondo ?template= (heroTemplate.ts): 1 e 2 il disegno al tratto (HeroDrawing),
 * 3 l'hero v2 con la filigrana (HeroV2). Il parametro si legge nel browser, così la pagina resta statica:
 * sul server e in idratazione vale 1. Lo script in testa marca subito <html> con ?template=3 e il CSS
 * nasconde l'hero 1 finché non arriva il 3, senza lampi del template sbagliato.
 */
export function HeroSwitch({ drawing, v2 }: { drawing: ComponentProps<typeof HeroDrawing>; v2: ComponentProps<typeof HeroV2> }) {
  const template = useSyncExternalStore(noSubscribe, () => readHeroTemplate(window.location.search), () => 1 as HeroTemplate);
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: `if(/[?&]template=3(&|$)/.test(location.search))document.documentElement.dataset.heroTemplate="3"` }}
      />
      {template === 3 ? <HeroV2 {...v2} /> : <HeroDrawing {...drawing} template={template} />}
    </>
  );
}
