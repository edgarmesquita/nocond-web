import ReactGA from 'react-ga';

export const metaTags = {
    title: "NoCond",
    description: "NoCond",
    author: "Wan Security",
    fbId: "0",
    keywords: "condomínio",
    site: "http://www.nocond.com.br/"
}
export const initGA = () => {       
    ReactGA.initialize('UA-000000000-1');
};

export const GAmodalView = (modal: string) => {
    ReactGA.modalview(modal);
};

export const GApageView = (page: string) => {   
    ReactGA.pageview(page);   
}

export function debounce(func: () => void, wait: number, immediate?: boolean) {
    let timeout: any;
    return function (this: void): void {
        var context: any = this,
        args: any = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}

function currentYPosition() {
    if (!window) {
        return;
    }
    // Firefox, Chrome, Opera, Safari
    if (window.pageYOffset) return window.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}

function elmYPosition(elm: HTMLElement) {
    var y = elm.offsetTop;
    let node: any = elm;
    while (node.offsetParent && node.offsetParent !== document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    }
    return y;
}

export function scrollTo(elmID: string) {
    var elm = document.getElementById(elmID);
    if (!elmID || !elm) {
        return;
    }
    var startY = currentYPosition() || 0;
    var stopY = elmYPosition(elm) || 0;
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
        elm.scrollTo(0, stopY);
        return;
    }
    var speed = Math.round(distance / 50);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
        for (var i = startY; i < stopY; i += step) {
            setTimeout(
                (function (leapY) {
                    return () => {
                        window.scrollTo(0, leapY);
                    };
                })(leapY),
                timer * speed
                );
                leapY += step;
                if (leapY > stopY) leapY = stopY;
                timer++;
            }
            return;
        }
        for (let i = startY; i > stopY; i -= step) {
            setTimeout(
                (function (leapY) {
                    return () => {
                        window.scrollTo(0, leapY);
                    };
                })(leapY),
                timer * speed
                );
                leapY -= step;
                if (leapY < stopY) leapY = stopY;
                timer++;
            }
            return false;
        }
        
        export function classList(classes: any) {
            return Object.entries(classes)
            .filter(entry => entry[1])
            .map(entry => entry[0])
            .join(" ");
        }
        