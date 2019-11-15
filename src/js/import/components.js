import $ from "jquery";
import {MainPageCntl} from "../controllers/MainPageCntl";

$(function () {
    new MainPageCntl();
    console.clear();
    var controller = new ScrollMagic.Controller();
    var sections = document.querySelectorAll("section");
    var tl = new TimelineMax();
    var offset = window.innerHeight;

    for (let i = 1; i < sections.length; i++) {
        tl.from(sections[i], 1, { xPercent:100, ease: Linear.easeNone }, "+=1");
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
                indent: 40
            });
    });

});
