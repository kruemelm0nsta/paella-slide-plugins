import { Events, EventLogPlugin, createElementWithHtmlText } from 'paella-core';

import { checkSlides, nextSlide, previousSlide } from '../js/SlideNavigation';

import "../styles/arrowSlidesNavigator.css";
import defaultArrowLeftIcon from '../icons/arrow-left.svg';
import defaultArrowRightIcon from '../icons/arrow-right.svg';

export default class ArrowSlidesNavigatorPlugin extends EventLogPlugin {

    get events() {
        return [
            Events.PLAYER_LOADED
        ];
    }

    async onEvent(event) {
        const arrowLeftIcon = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || defaultArrowLeftIcon;
        const arrowRightIcon = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || defaultArrowRightIcon;

        console.debug("Loading arrow slides navigation plugin");
        const targets = Array.isArray(this.config.target) ? this.config.target : [this.config.target];
        const streams = this.player.videoContainer.streamProvider.streams;
        const target = targets.find(t => {
            return streams[t] !== null
        });

        const stream = streams[target];

        this.frames = this.player.videoManifest?.frameList;
        this.frames?.sort((a,b) => {
            return a.time - b.time;
        });

        if (stream && this.frames?.length) {
            const mainContainer = createElementWithHtmlText(`<div class="arrow-slides-navigator"></div>`, stream.canvas.userArea);
            const leftButton = createElementWithHtmlText(`
            <button class="button-prev"><i>${arrowLeftIcon}</i></button>
            `, mainContainer);
            leftButton.addEventListener("click", async evt => {
                evt.stopPropagation();
                await previousSlide(this.player, this.frames);
            });

            const rightButton = createElementWithHtmlText(`
            <button class="button-next"><i>${arrowRightIcon}</i></button>
            `, mainContainer);
            rightButton.addEventListener("click", async evt => {
                evt.stopPropagation();
                await nextSlide(this.player, this.frames);
            });
        }
        else {
            console.warn("No matching stream content or frames found for arrow slides navigator plugin");
        }
    }
}