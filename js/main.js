/* ==========================================================================
   翼脉相传 · 逐梦长空 —— 交互与动画
   依赖：GSAP + ScrollTrigger + Lenis + Swiper（均已本地化）
   ========================================================================== */
(function () {
  "use strict";

  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 队员名录（改这里即可） ---------- */
  var ROSTER = [
    "万有恒", "韩轶", "高峰", "宋雨轩", "王睿琪", "王浩淼", "陈梓铭", "杨元旭", "苏园钧", "周剑宇",
    "瞿综", "康秭懿", "石恒源", "王浩祎", "李展慷", "涂进忱", "杨焌诚", "蔡浩然", "龚浩然", "马煜超"
  ];
  var rosterEl = $("#rosterList");
  if (rosterEl) {
    rosterEl.innerHTML = ROSTER.map(function (n) { return "<li>" + n + "</li>"; }).join("");
  }

  /* ---------- 平滑滚动 ---------- */
  var lenis = null;
  if (window.Lenis && !REDUCE) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.6 });
    if (window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }
  function scrollTo(target) {
    var el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 70, behavior: "smooth" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      e.preventDefault();
      scrollTo(id);
      var links = $("#navLinks");
      if (links) links.classList.remove("is-open");
    });
  });

  /* ---------- 注册插件 ---------- */
  if (window.ScrollTrigger && window.gsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- 文字逐字拆分 ---------- */
  function split(el) {
    var text = el.textContent;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    var frag = document.createDocumentFragment();
    text.split("").forEach(function (ch) {
      var s = document.createElement("span");
      s.className = "char";
      s.textContent = ch === " " ? "\u00A0" : ch;
      s.style.display = "inline-block";
      s.style.willChange = "transform,opacity";
      frag.appendChild(s);
    });
    el.appendChild(frag);
    return $$(".char", el);
  }
  $$("[data-split]").forEach(function (el) { el._chars = split(el); });

  /* ---------- 数字滚动 ---------- */
  function runCount(el) {
    var to = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var o = { v: 0 };
    gsap.to(o, {
      v: to, duration: 1.7, ease: "power2.out",
      onUpdate: function () {
        var v = Math.round(o.v);
        el.textContent = (to >= 1000 ? v.toLocaleString("en-US") : v) + (o.v >= to ? suffix : "");
      }
    });
  }

  /* ---------- 星空粒子 ---------- */
  (function stars() {
    var cv = $("#stars");
    if (!cv || REDUCE) return;
    var ctx = cv.getContext("2d"), dots = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      var r = cv.parentElement.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr;
      cv.style.width = w + "px"; cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(150, w * h / 12000));
      dots = [];
      for (var i = 0; i < n; i++) dots.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.5 + .3, a: Math.random() * .6 + .25,
        s: Math.random() * .22 + .05, p: Math.random() * Math.PI * 2
      });
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.y -= d.s; d.p += .012;
        if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
        var a = d.a * (.6 + .4 * Math.sin(d.p));
        ctx.beginPath();
        ctx.fillStyle = "rgba(200,232,255," + a.toFixed(3) + ")";
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    resize(); tick();
    window.addEventListener("resize", resize);
  })();

  /* ---------- 光标光晕 ---------- */
  (function cursor() {
    var c = $("#cursor");
    if (!c || REDUCE) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("pointer-fine");
    var x = window.innerWidth / 2, y = window.innerHeight / 2, cx = x, cy = y;
    window.addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; });
    (function loop() {
      cx += (x - cx) * .12; cy += (y - cy) * .12;
      c.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      requestAnimationFrame(loop);
    })();
  })();

  /* ---------- 打卡：载入 → 首屏 ---------- */
  var heroChars = [];
  var heroTitle = $(".hero__title");
  if (heroTitle) $$(".line b", heroTitle).forEach(function (b) { heroChars = heroChars.concat(b._chars || []); });

  function intro() {
    document.body.classList.remove("is-loading");
    if (REDUCE) { gsap.set(".reveal", { opacity: 1 }); return; }
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero__kicker", { y: 22, opacity: 0, duration: .8 }, .1)
      .from(heroChars, { yPercent: 118, opacity: 0, duration: 1.05, stagger: .045 }, .18)
      .from(".hero__title .line--accent b", { yPercent: 118, opacity: 0, duration: 1.1, ease: "power3.out" }, .42)
      .from(".hero__lede", { y: 26, opacity: 0, duration: .9 }, .75)
      .from(".hero__facts > div", { y: 24, opacity: 0, duration: .7, stagger: .1 }, .9)
      .from(".hero__cue", { opacity: 0, duration: .8 }, 1.2);
  }

  (function loader() {
    var box = $("#loader"), num = $("#loaderNum"), plane = $("#loaderPlane"), path = $("#loaderPath");
    if (!box) { intro(); return; }
    if (REDUCE) { document.body.classList.remove("is-loading"); gsap.set(".reveal", { opacity: 1 }); box.style.display = "none"; return; }

    var stage = $(".loader__stage");
    var total = path.getTotalLength();
    var state = { t: 0 };
    function place(t) {
      var p = path.getPointAtLength(total * t);
      var r = stage.getBoundingClientRect();
      plane.style.left = (p.x * (r.width / 1200) - 15) + "px";
      plane.style.top = (p.y * (r.height / 300) - 15) + "px";
    }
    place(0);
    var tl = gsap.timeline();
    tl.to(state, { t: 1, duration: 2.1, ease: "power1.inOut", onUpdate: function () {
        place(state.t);
        if (num) num.textContent = Math.round(state.t * 100);
      } })
      .to(box, { opacity: 0, duration: .7, ease: "power2.inOut", onComplete: function () {
        box.style.display = "none";
        intro();
        ScrollTrigger && ScrollTrigger.refresh();
      } }, "-=.15");
  })();

  /* ---------- 导航 / 进度 / 章节指示 ---------- */
  var nav = $("#nav"), bar = $("#progressBar"), totop = $("#totop");
  var sections = $$("main > section[id]");
  var dotsWrap = $("#dots");
  var LABEL = { hero: "封面", origin: "缘起", c1: "科普筑梦", c2: "一线寻航", c3: "前辈开讲", c4: "镜头传声", c5: "成果回响", outro: "尾声" };
  if (dotsWrap) {
    dotsWrap.innerHTML = sections.map(function (s) {
      return '<a href="#' + s.id + '" data-target="' + s.id + '" data-label="' + (LABEL[s.id] || s.id) + '" aria-label="' + (LABEL[s.id] || s.id) + '"></a>';
    }).join("");
    $$("a", dotsWrap).forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); scrollTo("#" + a.getAttribute("data-target")); });
    });
  }
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("is-solid", y > window.innerHeight * .85);
    if (totop) totop.classList.toggle("is-on", y > window.innerHeight * 1.5);
    var mid = y + window.innerHeight * .35, cur = sections[0] && sections[0].id;
    sections.forEach(function (s) { if (s.offsetTop <= mid) cur = s.id; });
    $$("a", dotsWrap).forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("data-target") === cur); });
    $$("#navLinks a").forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + cur); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (totop) totop.addEventListener("click", function () { lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }); });

  var burger = $("#burger"), links = $("#navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- 滚动动画 ---------- */
  function scrollAnimations() {
    if (!window.gsap) return;
    if (REDUCE) { gsap.set(".reveal", { opacity: 1 }); return; }

    /* 首屏视差 */
    gsap.to(".hero__media img", {
      yPercent: 14, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".hero__inner", {
      y: -70, opacity: 0, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    /* 通用入场 */
    ScrollTrigger.batch(".reveal", {
      start: "top 88%",
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: .95, ease: "power3.out", stagger: .085, overwrite: true });
      },
      once: true
    });

    /* 队员名录逐个浮现 */
    var rItems = $$("#rosterList li");
    if (rItems.length) {
      gsap.from(rItems, {
        opacity: 0, y: 14, duration: .55, ease: "power2.out", stagger: .04,
        scrollTrigger: { trigger: "#rosterList", start: "top 92%", once: true }
      });
    }

    /* 标题逐字 */
    $$("[data-split]").forEach(function (el) {
      var chars = el._chars || [];
      if (!chars.length || el.closest(".hero__title")) return;
      gsap.from(chars, {
        yPercent: 110, opacity: 0, duration: .9, ease: "power3.out", stagger: .03,
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    /* 章节序号描边 */
    $$(".chapter__no").forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, x: -26 }, {
        opacity: 1, x: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true }
      });
    });

    /* 数字计数 */
    $$("[data-count]").forEach(function (el) {
      ScrollTrigger.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: function () { runCount(el); }
      });
    });

    /* 图片轻推 */
    $$(".mosaic img, .strip img, .split__media img").forEach(function (img) {
      gsap.fromTo(img, { yPercent: -4 }, {
        yPercent: 4, ease: "none",
        scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    /* 跑马灯 */
    var row = $("[data-marquee]");
    if (row) {
      var clone = row.innerHTML;
      row.innerHTML = clone + clone;
      var half = row.scrollWidth / 2;
      var tw = gsap.to(row, { x: -half, duration: half / 60, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        trigger: row, start: "top bottom", end: "bottom top",
        onEnter: function () { tw.play(); }, onLeave: function () { tw.pause(); },
        onEnterBack: function () { tw.play(); }, onLeaveBack: function () { tw.pause(); }
      });
    }

    /* 卡片光晕跟随 */
    $$("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        if (REDUCE) return;
        gsap.to(card, {
          rotateY: (px - .5) * 7, rotateX: (.5 - py) * 7, transformPerspective: 900,
          duration: .6, ease: "power2.out"
        });
      });
      card.addEventListener("mouseleave", function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: .7, ease: "power3.out" });
      });
    });

    /* 兜底：带 #hash 直开、或浏览器带着滚动位置刷新时，补上已越过视口的入场动画 */
    function revealPassed() {
      if (window.scrollY < 40) return;
      $$(".reveal").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
          gsap.to(el, { opacity: 1, y: 0, duration: .8, ease: "power3.out", overwrite: true });
        }
      });
      var items = $$("#rosterList li");
      if (items.length && items[0].getBoundingClientRect().top < window.innerHeight * 0.92) {
        gsap.to(items, { opacity: 1, y: 0, duration: .55, ease: "power2.out", stagger: .04, overwrite: true });
      }
    }
    setTimeout(function () { ScrollTrigger.refresh(); revealPassed(); }, 300);
    if (location.hash) { setTimeout(revealPassed, 1000); setTimeout(revealPassed, 2200); }
    window.addEventListener("hashchange", function () { setTimeout(revealPassed, 800); });
  }

  /* ---------- 画廊 ---------- */
  function gallery() {
    if (!window.Swiper || !$("#gallery")) return;
    new Swiper("#gallery", {
      slidesPerView: 1.15,
      spaceBetween: 14,
      grabCursor: true,
      speed: 750,
      loop: true,
      autoplay: REDUCE ? false : { delay: 3200, disableOnInteraction: false },
      pagination: { el: "#gallery .swiper-pagination", clickable: true },
      navigation: { nextEl: "#gallery .swiper-button-next", prevEl: "#gallery .swiper-button-prev" },
      breakpoints: { 640: { slidesPerView: 2.1 }, 1024: { slidesPerView: 3.15 }, 1440: { slidesPerView: 3.6 } }
    });
  }

  function ready(fn) { document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn(); }
  ready(function () {
    scrollAnimations();
    gallery();
    if (window.ScrollTrigger) setTimeout(function () { ScrollTrigger.refresh(); }, 400);
  });
})();
