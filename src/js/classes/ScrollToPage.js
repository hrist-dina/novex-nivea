import $ from "jquery";
import {Menu} from "./Menu";


export class ScrollToPage {
    constructor(options) {
        this.pages = options.pages;
        this.inScroll = false;
        this.pageScrollOwner = $('.js-page-scroll-owner');
    }

    init() {
        $(window).on('resize',() => {
            if (!this.isMobile()) {
                this.events();
            } else {
                this.pageScrollOwner.off('wheel');
            }
        }).resize();
    }

    //EVENTS

    isMobile() {
        return $(window).width() <= 992;
    }

    events() {
        this.bindScrollPage();
        this.bindScrollBan();
        this.bindPositionTracking();
    }

    bindScrollPage() {
        const self = this;
        this.pageScrollOwner.on('wheel', function (event) {
            let deltaY = event.originalEvent.deltaY,
                activePage = self.pages.filter('.is-show'),
                nextPage = activePage.next(),
                prevPage = activePage.prev(),
                linkToPage = 'main';
            if (deltaY > 0) {
                if (nextPage.length) {
                    self.scroll(nextPage.index());
                    linkToPage = nextPage.attr('id');
                }
            }
            if (deltaY < 0) {
                if (prevPage.length) {
                    self.scroll(prevPage.index());
                    linkToPage = prevPage.attr('id');
                }
            }
            let link = $('.js-menu').find('.js-scroll-link').filter(`[href="#${linkToPage}"]`);
            Menu.prototype.setActiveLink(link);
            if (!activePage.hasClass('.js-winners')) {
                self.pageScrollOwner.addClass('o-hidden');
            }
        });
    }

    bindScrollBan() {
        this.pageScrollOwner.on('wheel', function (event) {
            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
            return false;
        });
    }

    bindPositionTracking() {
        const self = this;

        $('.js-winners:not(.is-hide)').on('wheel', function (event) {
            if ($(this).closest('.js-page').hasClass('is-show')) {
                setTimeout(function () {
                    event.stopPropagation();
                }, 2000);
            }

            let height = $('.js-winners-content').map(function (i, item) {
                return $(item).height();
            });
            let maxHeight = Math.max(...height.toArray());
            if (maxHeight > $(window).height()) {
                self.pageScrollOwner.off('wheel');
            }

            let position = $(this).offset().top;
            let deltaY = event.originalEvent.deltaY;

            if (deltaY < 0 && window.pageYOffset === 0 && position === 0) {
                self.inScroll = true;
                let pageWinners = $(this).closest('.js-page');
                pageWinners.removeClass('is-show').addClass('is-hide');
                pageWinners.prev().removeClass('is-hide').addClass('is-show');
                setTimeout(function () {
                    self.inScroll = false;
                }, 1000);

                self.bindScrollPage();
                self.bindScrollBan();
                self.pageScrollOwner.addClass('o-hidden');
            } else {
                self.pageScrollOwner.removeClass('o-hidden');
            }
            if ($(this).hasClass('is-hide')) {
                self.pageScrollOwner.addClass('o-hidden');
                self.bindScrollPage();
            }
        });
    }

    //METHODS

    scroll(pageEq) {
        const self = this;

        if (!self.inScroll) {
            self.inScroll = true;

            if (pageEq === 0) {
                this.pages.removeClass(['is-show', 'is-hide']);
            }

            let curPage = this.pages.eq(pageEq);

            curPage.addClass('is-show').siblings().removeClass('is-show');
            $('.is-show').removeClass('is-hide').prev().addClass('is-hide');

            $('.js-menu__item').eq(pageEq).addClass('active').siblings().removeClass('active');

            self.pageScrollOwner.addClass('o-hidden');
            setTimeout(function () {
                self.inScroll = false;
            }, 1000);
        }
    }
}