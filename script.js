const navToggle=document.getElementById("navToggle"),navLinks=document.getElementById("navLinks");
navToggle?.addEventListener("click",()=>{const open=navLinks.classList.toggle("open");navToggle.setAttribute("aria-expanded",String(open))});
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>{navLinks.classList.remove("open");navToggle?.setAttribute("aria-expanded","false")}));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const modal=document.getElementById("resultModal"),openBtn=document.getElementById("openResult"),closeBtn=document.getElementById("closeResult"),resultTitle=document.getElementById("resultTitle"),resultLabel=document.getElementById("resultLabel"),resultContent=document.getElementById("resultContent");
function openModal(){modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";setTimeout(()=>{resultContent.innerHTML='<div class="cgpa-label">CGPA</div><div class="cgpa">3.75</div><p>Honours · 1st Year</p>';resultTitle.textContent='1st Year Result';resultLabel.textContent='Academic Result'},150)}
openBtn?.addEventListener("click",()=>{resultLabel.textContent="Academic Result";resultTitle.textContent="1st Year Result";resultContent.innerHTML='<div class="cgpa-label">CGPA</div><div class="cgpa">3.75</div><p>Honours · 1st Year</p>';openModal()});
document.querySelectorAll(".education-result-btn").forEach(btn=>btn.addEventListener("click",()=>{const type=btn.dataset.result;if(type==="alim"){resultLabel.textContent="Alim Result";resultTitle.textContent="Alim · 2024";resultContent.innerHTML='<iframe class="pdf-frame" src="alim-result-2024.pdf#view=FitH" title="Alim 2024 result"></iframe><div class="pdf-fallback">If the PDF does not load here, <a href="alim-result-2024.pdf" target="_blank" rel="noopener noreferrer">open the original result</a>.</div>';}else if(type==="dakhil"){resultLabel.textContent="Dakhil Result";resultTitle.textContent="Dakhil · 2022";resultContent.innerHTML='<iframe class="pdf-frame" src="dakhil-result-2022.pdf#view=FitH" title="Dakhil 2022 result"></iframe><div class="pdf-fallback">If the PDF does not load here, <a href="dakhil-result-2022.pdf" target="_blank" rel="noopener noreferrer">open the original result</a>.</div>';}openModal()}));
closeBtn?.addEventListener("click",closeModal);
modal?.addEventListener("click",e=>{if(e.target.dataset.close==="true")closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeModal()});


/* Gallery lightbox */
const galleryItems=[...document.querySelectorAll(".gallery-item")];
const galleryLightbox=document.getElementById("galleryLightbox");
const galleryImage=document.getElementById("galleryImage");
const galleryCaption=document.getElementById("galleryCaption");
const galleryClose=document.getElementById("galleryClose");
const galleryPrev=document.getElementById("galleryPrev");
const galleryNext=document.getElementById("galleryNext");
let galleryIndex=0;
function showGalleryImage(index){
  galleryIndex=(index+galleryItems.length)%galleryItems.length;
  const item=galleryItems[galleryIndex];
  const img=item.querySelector("img");
  galleryImage.src=img.src;
  galleryImage.alt=img.alt;
  galleryCaption.textContent=item.querySelector("span")?.textContent||"";
}
function openGallery(index){showGalleryImage(index);galleryLightbox.classList.add("open");galleryLightbox.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeGallery(){galleryLightbox.classList.remove("open");galleryLightbox.setAttribute("aria-hidden","true");document.body.style.overflow=""}
galleryItems.forEach(item=>item.addEventListener("click",()=>openGallery(Number(item.dataset.index))));
galleryClose?.addEventListener("click",closeGallery);
galleryPrev?.addEventListener("click",()=>showGalleryImage(galleryIndex-1));
galleryNext?.addEventListener("click",()=>showGalleryImage(galleryIndex+1));
galleryLightbox?.addEventListener("click",e=>{if(e.target.dataset.galleryClose==="true")closeGallery()});
document.addEventListener("keydown",e=>{
  if(!galleryLightbox?.classList.contains("open"))return;
  if(e.key==="Escape")closeGallery();
  if(e.key==="ArrowLeft")showGalleryImage(galleryIndex-1);
  if(e.key==="ArrowRight")showGalleryImage(galleryIndex+1);
});


/* Hero background slideshow */
const heroSlides=[...document.querySelectorAll(".hero-slide")];
const heroSlideshow=document.querySelector(".hero-slideshow");
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
let heroIndex=0;
let heroTimer=null;

heroSlides.forEach(slide=>{
  const img=slide.querySelector("img");
  img?.addEventListener("error",()=>slide.remove());
});

function showHeroSlide(index){
  const slides=[...document.querySelectorAll(".hero-slide")];
  if(!slides.length)return;
  heroIndex=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle("is-active",i===heroIndex));
}

function startHeroSlideshow(){
  const slides=[...document.querySelectorAll(".hero-slide")];
  if(slides.length<2||reduceMotion.matches)return;
  clearInterval(heroTimer);
  heroTimer=setInterval(()=>showHeroSlide(heroIndex+1),6000);
}

function stopHeroSlideshow(){
  clearInterval(heroTimer);
  heroTimer=null;
}

startHeroSlideshow();
document.addEventListener("visibilitychange",()=>{
  if(document.hidden) stopHeroSlideshow();
  else startHeroSlideshow();
});
