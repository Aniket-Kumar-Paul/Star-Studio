// TO USE GSAP WITH LOCOMOTIVE SCROLL,
// WE HAVE TO USE SCROLLER PROXY PROVIDED BY GSAP
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect } from 'react';
import { useLocomotiveScroll } from 'react-locomotive-scroll'

const ScrollTriggerProxy = () => {
    // get instance of locomotive scroll
    const { scroll } = useLocomotiveScroll();
    // register scroll trigger plugin
    gsap.registerPlugin(ScrollTrigger)

    useEffect(() => {
        if (scroll) {
            const element = scroll?.el;  // locomotive scrolling element [in our case it's app(main)]
            scroll.on('scroll', ScrollTrigger.update); // on scroll of locomotive, update scrolltrigger

            // using gsap scroller proxy
            // ScrollTrigger.scrollerProxy( scroller:String | Element, vars:Object ) ;
            // Allows you to hijack the scrollTop and/or scrollLeft getters/setters for a particular scroller element so that you can implement things like smooth scrolling or other custom effects.
            ScrollTrigger.scrollerProxy(element, {
                scrollTop(value) {
                    return arguments.length
                        ? scroll.scrollTo(value, 0, 0)
                        : scroll.scroll.instance.scroll.y;
                }, // we don't have to define a scrollLeft because we're only scrolling vertically.
                getBoundingClientRect() {
                    return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight
                    };
                },
                // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
                pinType: element.style.transform
                    ? "transform"
                    : "fixed"
            });
        }

        return () => {
            ScrollTrigger.addEventListener('refresh', () => scroll?.update());
            ScrollTrigger.refresh();
        }
    }, [scroll])

    return null;
}

export default ScrollTriggerProxy