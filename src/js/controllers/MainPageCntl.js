import $ from "jquery";
import slick from 'slick-carousel';
import Inputmask from 'inputmask/dist/inputmask/inputmask.numeric.extensions';
import {Menu} from "../classes/Menu";
import {ScrollToPage} from "../classes/ScrollToPage";
import {Paginator} from "../classes/Paginator";
import {TicketForm} from "../classes/TicketForm";
import {Parallax} from "../classes/Parallax";

export class MainPageCntl {
    constructor() {
        this.init();
    }

    init() {
        this.initMenu();
        this.initScrollToPage();
        this.initPaginator();
        this.initTicketForm();
        this.initSlider();
        this.initInputMask();
        //this.initParallax();

        this.events();
    }

    events() {
        this.bindScrollLinks();
    }

    initMenu() {
        this.menu = new Menu({
            menu: $('.js-menu'),
            menuBtn: $('.js-menu-panel'),
            scrollOwner: $('.js-page-scroll-owner')
        });
        this.menu.init();
    }

    initScrollToPage() {
        this.scrollToPage = new ScrollToPage({
            pages: $('.js-page')
        });
        this.scrollToPage.init();
    }

    initPaginator() {
        this.paginator = new Paginator({
            scrollOwner: $('.js-page-scroll-owner')
        });
        this.paginator.init();
    }

    initTicketForm() {
        this.ticketForm = new TicketForm({
            form: $('.js-ticket-form')
        });
        this.ticketForm.init();
    }

    bindScrollLinks() {
        let self = this;
        if($('body').hasClass('ios')) {
            $(document).on('touchstart', '.menu .js-scroll-link', function( event ) {
                event.preventDefault();
                self.scrollToHref( $(this) );
            });
        }
        $(document).on('click', '.js-scroll-link', function( event ) {
            event.preventDefault();
            self.scrollToHref( $(this) );
        });
    }

    scrollToHref(link) {
        let scrollToElem = $(link.attr('href'));
        this.paginator.scrollTo(scrollToElem, link);
        this.menu.closeMenu();
    }

    initSlider() {
        const settings = {
            mobileFirst: true,
            arrows: false,
            slidesPerRow: 1,
            rows: 2,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            responsive: [
                {
                    breakpoint: 993,
                    settings: "unslick"
                },
                {
                    breakpoint: 992,
                    settings: {
                        mobileFirst: true,
                        arrows: false,
                        slidesPerRow: 1,
                        rows: 2,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        dots: true,
                    }
                },
            ]
        };

        const sl =
            $('.js-slider-container').slick(settings);

        $(window).on('resize',() => {
            if( $(window).width() > 420 &&  !sl.hasClass('slick-initialized')) {
                $('.js-slider-container').slick(settings);
            }
        });
    }

    initInputMask() {
        let imPhone = new Inputmask({
            mask: '+7(999)999-99-99',
            showMaskOnHover: false,
        });
        imPhone.mask($('.js-phone-mask'));
        let imCard = new Inputmask({
            mask: '999-999-9999',
            showMaskOnHover: false,
        });
        imCard.mask($('.js-card-mask'));
    }

    initParallax() {
        new Parallax(
            '.js-parallax-page-0',
            '.js-parallax-balloons'
        );
        new Parallax(
            '.js-parallax-page-0',
            '.js-parallax-balloon-29-year',
            50
        );
        new Parallax(
            '.js-parallax-page-2',
            '.js-parallax-balloons',
            50
        );
    }
}