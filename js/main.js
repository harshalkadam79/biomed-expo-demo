var BIO = "https://www.eventbrite.com/e/biomed-expo-las-vegas-2026-tickets-1766791975359";
var ALI = "https://www.eventbrite.com/e/alien-event-cosmic-command-las-vegas-tickets-1884918244209";
/* To receive chat leads automatically, paste a form endpoint here (Formspree, Zapier, a Google Apps Script URL).
   Left empty, the assistant offers the visitor a button that emails their details to the team. */
var LEAD_WEBHOOK = "";
var LEAD_EMAIL = "info@biomedexpo.com";

var root = document.documentElement;
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function el(tag, cls, text){ var e = document.createElement(tag); if(cls) e.className = cls; if(text) e.textContent = text; return e; }
function mkShape(w){ var i = el("i", "mk " + w); i.setAttribute("aria-hidden","true"); return i; }

/* ---------- Page theme ---------- */
function setTheme(t){
  root.setAttribute("data-theme", t);
  document.querySelectorAll("[data-theme-set]").forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.themeSet === t)); });
}
document.querySelectorAll("[data-theme-set]").forEach(function(b){ b.addEventListener("click", function(){ setTheme(b.dataset.themeSet); }); });
function setMode(m){
  root.setAttribute("data-mode", m);
  document.querySelectorAll("[data-mode-set]").forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.modeSet === m)); });
}
document.querySelectorAll("[data-mode-set]").forEach(function(b){ b.addEventListener("click", function(){ setMode(b.dataset.modeSet); }); });
if(window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) setMode("day");

/* ---------- Hero portal ---------- */
var hero = document.getElementById("hero"), seam = document.getElementById("seam");
var cur = 50, dragging = false, introOn = false, raf;
function setSeam(p){ cur = Math.min(82, Math.max(18, p)); hero.style.setProperty("--seam", cur + "%"); seam.setAttribute("aria-valuenow", Math.round(cur)); }
function userSeam(p){ setSeam(p); if(cur >= 64) setTheme("bio"); else if(cur <= 36) setTheme("alien"); }
function stopIntro(){ introOn = false; cancelAnimationFrame(raf); }
seam.addEventListener("pointerdown", function(e){ dragging = true; stopIntro(); seam.setPointerCapture(e.pointerId); });
seam.addEventListener("pointermove", function(e){ if(!dragging) return; var r = hero.getBoundingClientRect(); userSeam((e.clientX - r.left) / r.width * 100); });
seam.addEventListener("pointerup", function(){ dragging = false; });
seam.addEventListener("pointercancel", function(){ dragging = false; });
seam.addEventListener("keydown", function(e){
  var k = e.key; if(["ArrowLeft","ArrowRight","Home","End"].indexOf(k) < 0) return;
  e.preventDefault(); stopIntro();
  userSeam(k === "ArrowLeft" ? cur - 4 : k === "ArrowRight" ? cur + 4 : k === "Home" ? 18 : 82);
});
if(!reduce && window.innerWidth > 900){
  var path = [[0,50],[1000,30],[2200,70],[3000,50]], t0 = null; introOn = true;
  var ease = function(x){ return x < .5 ? 2*x*x : 1 - Math.pow(-2*x + 2, 2)/2; };
  (function step(ts){
    if(!introOn) return; if(t0 === null) t0 = ts; var t = ts - t0;
    for(var i = 1; i < path.length; i++){ if(t <= path[i][0]){ var a = path[i-1], b = path[i]; setSeam(a[1] + (b[1]-a[1]) * ease((t-a[0])/(b[0]-a[0]))); break; } }
    if(t < path[path.length-1][0]) raf = requestAnimationFrame(step); else { introOn = false; setSeam(50); }
  })(performance.now());
}

/* ---------- DNA helix (BioMed side) ---------- */
(function(){
  var c = document.getElementById("helix"); if(!c) return; var ctx = c.getContext("2d"), W, H, run = true, t = 0;
  function size(){ var d = window.devicePixelRatio || 1; W = c.clientWidth; H = c.clientHeight; c.width = W*d; c.height = H*d; ctx.setTransform(d,0,0,d,0,0); }
  function draw(){
    ctx.clearRect(0,0,W,H); var cx = W/2, A = W*.34;
    for(var y = -10; y < H + 10; y += 13){
      var ph = y*.026 + t, s = Math.sin(ph), z = Math.cos(ph), x1 = cx + A*s, x2 = cx - A*s;
      ctx.strokeStyle = "rgba(15,42,32," + (.10 + .10*Math.abs(z)) + ")"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y); ctx.stroke();
      var r1 = Math.max(1.2, 3.4 + 2.2*z), r2 = Math.max(1.2, 3.4 - 2.2*z);
      ctx.fillStyle = "rgba(31,107,74," + (.45 + .4*Math.max(0,z)) + ")"; ctx.beginPath(); ctx.arc(x1,y,r1,0,6.3); ctx.fill();
      ctx.fillStyle = "rgba(255,91,34," + (.45 + .4*Math.max(0,-z)) + ")"; ctx.beginPath(); ctx.arc(x2,y,r2,0,6.3); ctx.fill();
    }
  }
  function loop(){ if(run){ t += .018; draw(); } requestAnimationFrame(loop); }
  size(); draw(); window.addEventListener("resize", function(){ size(); draw(); });
  if(!reduce){
    new IntersectionObserver(function(en){ run = en[0].isIntersecting; }).observe(hero);
    requestAnimationFrame(loop);
  }
})();

/* ---------- Countdown ---------- */
var target = new Date("2026-10-16T10:00:00-07:00").getTime(), cd = document.getElementById("cd");
function pad(n){ return String(n).padStart(2,"0"); }
function tick(){ var t = Math.max(0, target - Date.now()); cd.textContent = Math.floor(t/864e5) + " days  " + pad(Math.floor(t%864e5/36e5)) + ":" + pad(Math.floor(t%36e5/6e4)) + ":" + pad(Math.floor(t%6e4/1e3)); }
tick(); setInterval(tick, 1000);

/* ---------- Video (loads only when played) ---------- */
var vid = document.getElementById("vid");
function playVideo(){
  if(vid.querySelector("iframe")) return;
  var f = document.createElement("iframe");
  f.src = "https://www.youtube-nocookie.com/embed/WL4R-wLjWu4?autoplay=1&rel=0";
  f.title = "BioMed Expo and Alien Event, past events";
  f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true;
  vid.textContent = ""; vid.appendChild(f); vid.style.cursor = "default";
}
vid.addEventListener("click", playVideo);
document.getElementById("watch").addEventListener("click", function(){
  document.getElementById("video").scrollIntoView({behavior: reduce ? "auto" : "smooth"});
  setTimeout(playVideo, reduce ? 0 : 600);
});

/* ---------- Pass picker ---------- */
var DATA = {
  bio: [
    {n:"Day pass", p:"$120", d:"One day of lectures and the full exhibit hall. Priced per day.", u:BIO, w:"bio"},
    {n:"Full event", p:"$299", d:"All three days of lectures, workshops, panels and exhibits.", u:BIO, w:"bio"},
    {n:"Full event with 2 dinners", p:"$499", d:"Adds the Friday and Saturday buffet banquets with speakers.", u:BIO, w:"bio", rec:"Fullest BioMed weekend"},
    {n:"Live stream", p:"$99", d:"All three days on four channels at once. Watch from anywhere.", u:"https://bizton.com/live-streaming", w:"bio", cta:"Stream live"}
  ],
  ali: [
    {n:"3-day general", p:"$399", d:"Every Alien Event talk and panel, plus BioMed lectures and all 69 exhibits.", u:ALI, w:"ali"},
    {n:"Full event with 2 dinners", p:"$599", d:"Adds buffet dinner, a glass of wine and dancing on both nights.", u:ALI, w:"ali"},
    {n:"VIP", p:"$1,200", d:"Front-row seating, a VIP swag bag, conference recordings and both dinners.", u:ALI, w:"ali"}
  ]
};
var VERDICT = {
  bio: "<strong>BioMed Expo is built around its conference.</strong> The expo floor is free to walk, and a pass unlocks the lectures and workshops.",
  ali: "<strong>Every Alien Event pass also opens BioMed Expo.</strong> You get the lectures and all 69 exhibits at no extra cost.",
  both: "<strong>One ticket covers both worlds.</strong> The Alien Event 3-day pass includes BioMed lectures and the full exhibit hall, so you do not need to buy twice."
};
var box = document.getElementById("tickets"), verdict = document.getElementById("verdict");
function render(goal){
  var list = goal === "bio" ? DATA.bio : DATA.ali;
  verdict.innerHTML = VERDICT[goal]; box.textContent = "";
  list.forEach(function(t, idx){
    var rec = (goal === "both" && idx === 0) ? "Best for both worlds" : (goal !== "both" ? t.rec : "");
    var a = el("article", "ticket" + (rec ? " rec" : ""));
    var m = el("div", "t-main"), h = el("h3");
    h.appendChild(mkShape(goal === "both" && idx === 0 ? "both" : t.w)); h.appendChild(document.createTextNode(t.n));
    m.appendChild(h); m.appendChild(el("p", "", t.d)); if(rec) m.appendChild(el("span", "flag", rec));
    var s = el("div", "t-stub"); s.appendChild(el("div", "price", t.p));
    var link = el("a", "btn" + (rec ? "" : " alt"), t.cta || "Buy on Eventbrite"); link.href = t.u;
    s.appendChild(link); a.appendChild(m); a.appendChild(s); box.appendChild(a);
  });
}
function pickGoal(g){ document.getElementById("g-" + g).checked = true; render(g); }
document.querySelectorAll('input[name="goal"]').forEach(function(r){ r.addEventListener("change", function(){ render(r.value); }); });
document.querySelectorAll("[data-goal]").forEach(function(b){ b.addEventListener("click", function(){ pickGoal(b.dataset.goal); document.getElementById("passes").scrollIntoView({behavior: reduce ? "auto" : "smooth"}); }); });
render("both");

/* ---------- Speakers ---------- */
var shared = ["Dr. Carrie Madej","Sir Bill Walsh","Saeed David Farman","Shahrokh Zadeh","Sean Bond","Jimmy Blanchette","Arcturus RA","Donna McGrath","Marysol Rezanov","Pauline Kiwasz","Venus Saffaric"];
var bioOnly = ["Dr. Michael Grossman","Dr. Virginia Marston","Dr. Barbara Grossman","Dr. Cie Allman-Scott","Michael Dignam","Phillip Wilson","Brent Bruning","Alan Bedian","Ocean Sky","Christopher Key","Samuel Kiwasz","Philip Laing"];
var aliOnly = ["Mike Bara","Kerry Cassidy","Brad Olsen","YssaH","Ashleigh Spellens","Bret Lueder","Anuhazi Aqueion","Brad Markus","Colin Woolford"];
var roll = document.getElementById("roll");
function addRoll(names, cls, shape){ names.forEach(function(n){ var s = el("span", cls); s.appendChild(mkShape(shape)); s.appendChild(document.createTextNode(n)); roll.appendChild(s); }); }
addRoll(shared, "x", "both"); addRoll(bioOnly, "b", "bio"); addRoll(aliOnly, "a", "ali");

/* ---------- Exhibit map lightbox ---------- */
var dlg = document.getElementById("mapDlg");
function openMap(){ if(dlg.showModal) dlg.showModal(); }
document.getElementById("mapOpen").addEventListener("click", openMap);
document.getElementById("mapOpen2").addEventListener("click", openMap);
dlg.addEventListener("click", function(e){ if(e.target === dlg) dlg.close(); });

/* ---------- AI assistant ---------- */
var chat = document.getElementById("chat"), log = document.getElementById("log"), chips = document.getElementById("chips"), form = document.getElementById("chatForm"), inp = document.getElementById("chatIn"), openBtn = document.getElementById("chatOpen");
var lead = {name:"", phone:"", email:"", q:[]}, step = "name", started = false, sent = false, dismissed = false, teaser = document.getElementById("teaser");

function linkify(node, text){
  var re = /\[([^\]]+)\]\(((?:https?:|mailto:|tel:)[^)]+)\)/g, last = 0, m;
  while((m = re.exec(text))){
    if(m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
    var a = el("a", "", m[1]); a.href = m[2]; if(m[2].indexOf("http") === 0){ a.target = "_blank"; a.rel = "noopener"; } node.appendChild(a); last = re.lastIndex;
  }
  if(last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
}
function addMsg(who, text){ var m = el("div", "msg " + who); linkify(m, text); log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
function say(texts, done){
  texts = Array.isArray(texts) ? texts : [texts]; var i = 0;
  (function next(){
    if(i >= texts.length){ if(done) done(); return; }
    var ty = el("div", "msg bot typing"); ty.appendChild(el("i")); ty.appendChild(el("i")); ty.appendChild(el("i")); log.appendChild(ty); log.scrollTop = log.scrollHeight;
    setTimeout(function(){ ty.remove(); addMsg("bot", texts[i++]); next(); }, reduce ? 0 : 450);
  })();
}
function setChips(items){
  chips.textContent = "";
  items.forEach(function(it){
    var b;
    if(it.href){ b = el("a", it.cls || "", it.label); b.href = it.href; }
    else { b = el("button", it.cls || "", it.label); b.type = "button"; b.addEventListener("click", function(){ handle(it.say || it.label, true); }); }
    chips.appendChild(b);
  });
}
var TOPIC_LIST = [{label:"Book my pass"},{label:"Tickets"},{label:"Schedule"},{label:"Speakers"},{label:"Hotel"},{label:"Exhibit a booth"},{label:"Parking"}];
function topicChips(){ var c = TOPIC_LIST.slice(); if(!LEAD_WEBHOOK && (lead.phone || lead.email)) c.push({label:"Email my details to the team", href:mailtoLink(), cls:"go"}); return c; }

function priceLine(list){ return list.map(function(t){ return t.n + " " + t.p; }).join(", "); }
var PANELS = [
  {n:"Opening ceremony (Fri 10:00 AM, Room Zeus A)", who:["saeed david farman"]},
  {n:"Functional wellness panel (Sat 5:00 PM, Room Zeus A)", who:["carrie madej","michael grossman","barbara grossman","cie allman-scott","virginia marston","donna mcgrath"]},
  {n:"Secret space panel (Sat 2:00 PM, P3 Ballroom)", who:["mike bara","kerry cassidy","brad olsen","sean bond","yssah","bret lueder"]},
  {n:"Transhumanism vs. humanity (Sun 3:30 PM, Room P3)", who:["brad olsen","mike bara","kerry cassidy","carrie madej","arcturus ra","bret lueder"]},
  {n:"Friday banquet keynote recognition (8:00 PM)", who:["bill walsh"]}
];
var KB = [
  {k:["ticket","tickets","price","prices","pricing","cost","how much","admission","register","registration","buy","pass","passes","general admission"], a:function(){ return ["BioMed Expo: " + priceLine(DATA.bio.slice(0,3)) + ". Live stream $99 for all three days.", "Alien Event: " + priceLine(DATA.ali) + ". Alien Event passes include BioMed lectures and exhibits.", "Buy here: [BioMed Expo tickets](" + BIO + ") or [Alien Event tickets](" + ALI + "). The prices above are door prices, and both listings say registering early saves money."]; }},
  {k:["book","booking","reserve","book now","book my event","book event","sign up"], b:2, a:function(){ return ["Happy to help you book. Most people choose the Alien Event 3-day pass at $399 because it also opens BioMed Expo. BioMed-only passes are $120 for a day or $299 for three days.", "Book here: [BioMed Expo](" + BIO + ") or [Alien Event](" + ALI + "). Tell me what you're most interested in and I'll point you to the right pass."]; }},
  {k:["which pass","which ticket","both","recommend","what should i buy","best pass","should i get"], a:function(){ return ["If you want both worlds, the Alien Event 3-day pass at $399 is the best value because it includes BioMed lectures and all exhibits.", "Mostly health and science? BioMed Expo is $299 for three days or $120 for one day. Want the dinners too? Add them for $99 each night."]; }},
  {k:["vip","vip ticket","vip pass","vip price"], b:4, a:function(){ return "The Alien Event VIP pass is $1,200. It includes the full event, both dinner banquets, front-row seating, a VIP swag bag and recordings of the conference. [Buy VIP](" + ALI + ")"; }},
  {k:["dinner","banquet","meal","dance","buffet","wine","food"], a:function(){ return ["Banquet dinners run Friday and Saturday, 7:00 to 11:00 PM, with a buffet and dancing and a chance to meet speakers. Each dinner is $99 per person.", "Full-event tickets with two dinners: BioMed $499, Alien Event $599. Menu: [dinner menu](https://bizton.com/vegas-dinner-menu)."]; }},
  {k:["schedule","program","agenda","panel","panels","lecture","lectures","workshop","workshops","sessions","opening","what time","hours","when does"], a:function(){ return ["Highlights: Friday opening ceremony 10:00 AM, grand panel of alientologists 5:00 PM. Saturday secret space panel 2:00 PM and functional wellness panel 5:00 PM. Sunday transhumanism vs. humanity 3:30 PM and the achieving results panel 5:45 PM. Banquets Friday and Saturday 7 to 11 PM.", "Event hours are 10 AM to 6 PM Friday, then 9 AM to 6 PM Saturday and Sunday (Pacific). Full list: [program](https://www.bizton.com/program-for-biomed-expo-and-alien-event)."]; }},
  {k:["speaker","speakers","who is speaking","lineup","line up","keynote","presenters"], a:function(){ return ["Speakers include Dr. Michael Grossman, Dr. Carrie Madej, Dr. Virginia Marston, Dr. Barbara Grossman, Dr. Cie Allman-Scott, Mike Bara, Kerry Cassidy, Brad Olsen, Sean Bond, Saeed David Farman and many more.", "Sir Bill Walsh is recognized as VIP keynote on Friday at 8:00 PM. Bios: [BioMed speakers](https://www.bizton.com/biomed-speakers-p1/) and [Alien Event speakers](https://bizton.com/alien-speakers-p1)."]; }},
  {k:["hotel","room","rooms","stay","lodging","group rate","resort fee","book a room","sleep","suite","accommodation"], a:function(){ return ["The group rate at Alexis Park Resort is $110 a night plus a $20 resort fee, up to four people per suite, from Oct 15 to 19. Use group code BIOMEDA.", "The listed cutoff for the rate was Sept 30, so call to ask about availability: 800-582-2228 or 702-796-3322. Or try the [group booking link](https://bookings.travelclick.com/85179?groupID=4968787)."]; }},
  {k:["parking","park","car","drive","driving"], a:function(){ return "Parking is free: about 500 spaces around the resort plus 1,000+ at the Virgin Casino across the street."; }},
  {k:["where","address","venue","location","airport","directions","strip","uber","lyft","getting there","how far"], a:function(){ return "Alexis Park Resort, 375 E. Harmon Ave, Las Vegas, NV 89169. It is about 8 to 10 minutes from the airport and two blocks from the Strip. [Open in Google Maps](https://maps.google.com/?q=375+E+Harmon+Ave+Las+Vegas+NV+89169)"; }},
  {k:["age","18","kids","children","minors","dress","dress code","pets","backpack","backpacks","recording","rules","allowed","alcohol","bring"], a:function(){ return "You must be 18 or older. Dress is business casual for BioMed Expo and dressy casual for Alien Event. Pets, outside food, alcohol, drugs, recording and backpacks are not allowed."; }},
  {k:["exhibit","exhibitor","booth","booths","vendor","vendors","sponsor","sponsors","table","sell","floor plan","map"], a:function(){ return ["There are about 69 exhibit spaces. The map lists 24 booths of 10' x 10', 3 of 20' x 10', and 48 tables with 2 chairs each. Booths include electricity, a table and chairs, and three free badges. Setup is Friday 8:30 to 10:00 AM.", "To reserve: [exhibitor form](https://www.bizton.com/exhibits), sales@biomedexpo.com or 702-890-1290. You can see the layout in the Exhibit hall section of this page."]; }},
  {k:["stream","streaming","online","virtual","watch from home","remote","livestream","live stream"], a:function(){ return "The live stream is $99 for all three days, with four channels to watch at once. [Get the stream](https://bizton.com/live-streaming)"; }},
  {k:["refund","refunds","cancel","cancellation"], a:function(){ return "Refund rules are set per Eventbrite listing. The BioMed Expo listing says no refunds, and the Alien Event listing allows refunds up to 7 days before the event. Please re-check the listing you buy from."; }},
  {k:["contact","phone","call","email","human","person","talk to","speak to","someone","team","organizer"], a:function(){ return "You can reach the team at 1-702-890-1290, [info@biomedexpo.com](mailto:info@biomedexpo.com) or [sales@biomedexpo.com](mailto:sales@biomedexpo.com)."; }},
  {k:["what is biomed","about biomed","biomed expo","biohacking","longevity","stem cell","peptides","quantum healing"], a:function(){ return "BioMed Expo is a three-day biohacking, health, science and consciousness expo and conference. Expect 100+ lectures and workshops on stem cells, peptides, longevity, quantum healing, DNA and more, plus about 69 exhibits. The expo floor is free and the conference is paid."; }},
  {k:["what is alien","about alien","alien event","disclosure","ufo","uap","secret space","et ","extraterrestrial","aliens"], a:function(){ return "Alien Event: Cosmic Command is three days of ET disclosure, secret space and UFOlogy with panels, workshops and banquets. It runs in the same hotel as BioMed Expo, and every ticket also opens BioMed lectures and exhibits."; }},
  {k:["volunteer","volunteers","volunteering"], a:function(){ return "Volunteers are welcome. Email [info@biomedexpo.com](mailto:info@biomedexpo.com) to apply."; }},
  {k:["media","press","interview","journalist"], a:function(){ return "Media inquiries go to [davidfarman@biomedexpo.com](mailto:davidfarman@biomedexpo.com) or 1-702-890-1290."; }},
  {k:["date","dates","what day","which days","oct"], a:function(){ return "Friday Oct 16 to Sunday Oct 18, 2026. Registration opens at 9:30 AM Friday and 8:30 AM on Saturday and Sunday."; }},
  {k:["thanks","thank you","thx","great","awesome"], a:function(){ return "You're welcome! Anything else you'd like to know?"; }},
  {k:["hello","hi","hey","good morning","good afternoon"], a:function(){ return "Hi " + lead.name + "! Ask me about tickets, the schedule, speakers, hotel, parking or exhibiting."; }}
];
/* Speaker lookup built from the speaker lists */
var ALLS = shared.map(function(n){ return {n:n, w:"both"}; }).concat(bioOnly.map(function(n){ return {n:n, w:"bio"}; }), aliOnly.map(function(n){ return {n:n, w:"ali"}; }));
var tokCount = {};
function words(s){ return s.toLowerCase().replace(/[^a-z\s-]/g, " ").split(/\s+/).filter(Boolean); }
ALLS.forEach(function(s){ words(s.n).forEach(function(t){ if(t.length >= 4 && t !== "sir") tokCount[t] = (tokCount[t] || 0) + 1; }); });
function findSpeaker(msg){
  var m = " " + words(msg).join(" ") + " ", best = null;
  ALLS.forEach(function(s){
    var full = " " + words(s.n).join(" ") + " ";
    if(m.indexOf(full) >= 0) best = s;
    else if(!best) words(s.n).forEach(function(t){ if(t.length >= 4 && tokCount[t] === 1 && m.indexOf(" " + t + " ") >= 0) best = s; });
  });
  return best;
}
function speakerAnswer(s){
  var where = s.w === "both" ? "both BioMed Expo and Alien Event" : s.w === "bio" ? "BioMed Expo" : "Alien Event";
  var key = words(s.n).join(" "), on = PANELS.filter(function(p){ return p.who.some(function(w){ return key.indexOf(w) >= 0 || w.indexOf(key) >= 0; }); }).map(function(p){ return p.n; });
  var t = s.n + " is on the speaker list for " + where + ".";
  if(on.length) t += " Listed on: " + on.join("; ") + ".";
  return t + " Full bios: [BioMed speakers](https://www.bizton.com/biomed-speakers-p1/) and [Alien Event speakers](https://bizton.com/alien-speakers-p1).";
}
function answer(msg){
  var sp = findSpeaker(msg); if(sp) return speakerAnswer(sp);
  var low = " " + words(msg).join(" ") + " ", best = null, score = 0;
  KB.forEach(function(e){
    var sc = 0; e.k.forEach(function(kw){ var k = " " + kw.trim() + " "; if(low.indexOf(k) >= 0) sc += kw.indexOf(" ") > 0 ? 3 : 1; });
    if(sc > 0) sc += (e.b || 0); if(sc > score){ score = sc; best = e; }
  });
  return best ? best.a() : null;
}

function mailtoLink(){
  var body = "Name: " + lead.name + "\nPhone: " + (lead.phone || "not shared") + "\nEmail: " + (lead.email || "not shared") + "\n\nQuestions asked in chat:\n" + (lead.q.length ? lead.q.map(function(x){ return "- " + x; }).join("\n") : "- none yet");
  return "mailto:" + LEAD_EMAIL + "?subject=" + encodeURIComponent("Event inquiry from " + lead.name) + "&body=" + encodeURIComponent(body);
}
function sendLead(){
  if(!LEAD_WEBHOOK || sent) return; sent = true;
  try { fetch(LEAD_WEBHOOK, {method:"POST", mode:"no-cors", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name:lead.name, phone:lead.phone, email:lead.email, questions:lead.q, source:"event-landing-chat", at:new Date().toISOString()})}); } catch(e){}
}
function afterLead(){
  step = "chat"; inp.placeholder = "Ask about tickets, schedule, hotel...";
  var intro = LEAD_WEBHOOK ? "Thanks " + lead.name + ", I've passed your details to the team. What would you like to know?" : "Thanks " + lead.name + "! What would you like to know? Ask me anything about tickets, the schedule, speakers, hotel, parking or exhibiting.";
  sendLead();
  say(intro, function(){ setChips(topicChips()); });
}
function handle(text, fromChip){
  text = text.trim(); if(!text) return;
  addMsg("me", text); chips.textContent = ""; inp.value = "";
  var low = text.toLowerCase();
  if(step === "name"){
    var n = text.replace(/^(my name is|i am|i'm|im|this is|it's|its)\s+/i, "").replace(/[^\p{L}\s'.-]/gu, "").trim().slice(0, 60);
    if(!n){ say("Sorry, I didn't catch that. What's your name?"); return; }
    lead.name = n.replace(/\b\p{L}/gu, function(c){ return c.toUpperCase(); }); step = "phone";
    say("Nice to meet you, " + lead.name + ". What's the best phone number to reach you?", function(){ setChips([{label:"Skip for now", say:"skip"}]); inp.type = "tel"; inp.placeholder = "Phone number"; });
    return;
  }
  if(step === "phone"){
    var digits = text.replace(/\D/g, "");
    if(low === "skip"){ lead.phone = ""; }
    else if(digits.length >= 7 && digits.length <= 15){ lead.phone = text.slice(0, 30); }
    else { say("That doesn't look like a phone number. Please include the area code, or tap Skip.", function(){ setChips([{label:"Skip for now", say:"skip"}]); }); return; }
    step = "email"; inp.type = "email"; inp.placeholder = "Email address";
    say("And your email address?", function(){ setChips([{label:"Skip for now", say:"skip"}]); });
    return;
  }
  if(step === "email"){
    if(low === "skip"){ lead.email = ""; }
    else if(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text)){ lead.email = text.slice(0, 80); }
    else { say("That email doesn't look right. Try name@example.com, or tap Skip.", function(){ setChips([{label:"Skip for now", say:"skip"}]); }); return; }
    inp.type = "text"; afterLead(); return;
  }
  lead.q.length < 10 && lead.q.push(text.slice(0, 120));
  var a = answer(text);
  if(a){ say(a, function(){ setChips(topicChips()); }); }
  else { say(["I don't have that in the event listings. The team can help directly at 1-702-890-1290 or [info@biomedexpo.com](mailto:info@biomedexpo.com).", "You can also ask me about tickets, schedule, speakers, hotel, parking or exhibiting."], function(){ setChips(topicChips()); }); }
}
function openChat(auto){
  teaser.classList.remove("show"); chat.classList.add("open"); openBtn.style.display = "none";
  if(!started){ started = true; say(["Hi there! This is Riley, your AI assistant. Let me help you book your event today.", "I can answer questions about tickets, the schedule, speakers, hotel and more. First, what's your name? (By sharing your details you agree the organizers may contact you about the events.)"]); }
  if(!auto) setTimeout(function(){ inp.focus(); }, 50);
}
function closeChat(){ dismissed = true; chat.classList.remove("open"); openBtn.style.display = ""; openBtn.focus(); }
openBtn.addEventListener("click", function(){ dismissed = true; teaser.classList.remove("show"); openChat(); });
document.getElementById("chatClose").addEventListener("click", closeChat);
chat.addEventListener("keydown", function(e){ if(e.key === "Escape") closeChat(); });
form.addEventListener("submit", function(e){ e.preventDefault(); handle(inp.value); });
document.getElementById("teaserOpen").addEventListener("click", function(){ dismissed = true; openChat(); });
document.getElementById("teaserClose").addEventListener("click", function(){ dismissed = true; teaser.classList.remove("show"); });
/* Riley greets visitors after a few seconds: opens on desktop, shows a small bubble on phones. Once per visit. */
setTimeout(function popup(){
  if(dismissed || started || chat.classList.contains("open")) return;
  if(dlg.open){ setTimeout(popup, 4000); return; }
  if(window.innerWidth > 900) openChat(true); else teaser.classList.add("show");
}, 7000);
