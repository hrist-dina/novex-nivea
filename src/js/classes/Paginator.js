import $ from "jquery";
import {ScrollToPage} from "./ScrollToPage";
import {Menu} from "./Menu";

export class Paginator {
    constructor(options) {
        this.scrollOwner = options.scrollOwner;
    }

    init() {
        this.events();
    }

    events() {

    }

    scrollTo(targetElem, link = false) {

        this.scrollToPage = new ScrollToPage(
            {
                pages: $('.js-page')
            }
        );

        const id = targetElem.attr('id');
        let activePage = this.scrollToPage.pages.filter(`#${id}`);

        if (activePage.length) {
            this.scrollToPage.scroll(activePage.index());
            if (link) {
                Menu.prototype.setActiveLink(link);
            }
        }

        $('html, body').animate({
            scrollTop: this.scrollOwner.scrollTop() + targetElem.offset().top
        }, 1000);

    }
}