import $ from "jquery";
import { MainPageCntl } from "../controllers/MainPageCntl";
import ScrollMagic from 'scrollmagic';
import { TimelineMax, TweenMax, ScrollToPlugin, Linear, Circ} from "gsap/all";
import 'animation.gsap';
import 'debug.addIndicators';

$(function () {
    new MainPageCntl();


    console.clear();
    let controller = new ScrollMagic.Controller();
    let sections = document.querySelectorAll("section");
    let tl = new TimelineMax();
    let offset = window.innerHeight;
    console.log(sections);

    for (let i = 1; i < sections.length; i++) {
        console.log(sections[i]);
        tl.from(sections[i], 1, { xPercent: 200, ease: Linear.easeNone }, "+=1");
    }

    new ScrollMagic.Scene({
        triggerElement: "#pinMaster",
        triggerHook: "onLeave",
        duration: "500%"
    })
        .setPin("#pinMaster")
        .setTween(tl)
        .addIndicators({
            colorTrigger: "white",
            colorStart: "white",
            colorEnd: "white",
            indent: 40
        })
        .addTo(controller);


    // change behaviour of controller to animate scroll instead of jump
    controller.scrollTo(function (newpos) {
        console.log(newpos);
        TweenMax.to(window, .8, { scrollTo: {y: 500}, ease: Circ.easeOut}, "-=.5");
    });

    //  bind scroll to anchor links
    $(document).on("click", "a[href^='#']", function (e) {
        var id = $(this).attr("href");
        if ($(id).length > 0) {
            e.preventDefault();

            // trigger scroll
            controller.scrollTo(id);

            // if supported by the browser we can even update the URL.
            if (window.history && window.history.pushState) {
                history.pushState("", document.title, id);
            }
        }
    });


    $("section").each(function(i) {
        var tl = new TimelineMax();

        new ScrollMagic.Scene({
            triggerElement: "#pinMaster",
            triggerHook: 0,
            offset: i * offset
        })
            .setTween(tl)
            .addTo(controller)
            .addIndicators({
                colorTrigger: "white",
                colorStart: "white",
                colorEnd: "white",
                indent: 1
            });
    });

});
