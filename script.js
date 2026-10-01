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
galleryLightbox?.addEventListener("click",e=>{if(e.target.dataset.galleryClose==="true")closeGallery()});
document.addEventListener("keydown",e=>{
  if(!galleryLightbox?.classList.contains("open"))return;
  if(e.key==="Escape")closeGallery();
});


/* Hero background slideshow */
const heroSlides=[...document.querySelectorAll(".hero-slide")];
const heroImageCaption=document.getElementById("heroImageCaption");
let heroSlideIndex=0;
const HERO_INTERVAL=3000;
const HERO_FADE=1200;

function showHeroSlide(index){
  if(!heroSlides.length)return;
  heroSlideIndex=(index+heroSlides.length)%heroSlides.length;
  heroSlides.forEach((slide,i)=>slide.classList.toggle("is-active",i===heroSlideIndex));
  const caption=heroSlides[heroSlideIndex]?.dataset.caption||"";
  if(heroImageCaption)heroImageCaption.textContent=caption;
}

if(heroSlides.length){
  showHeroSlide(0);
  heroSlides.slice(1).forEach(slide=>{
    const img=slide.querySelector("img");
    if(img){const preloader=new Image();preloader.src=img.src;}
  });
  window.setInterval(()=>showHeroSlide(heroSlideIndex+1),HERO_INTERVAL);
}

/* Certificate full-screen preview + zoom/pan */
const certificateTrigger=document.getElementById("openCertificate");
const certificateLightbox=document.getElementById("certificateLightbox");
const certificateClose=document.getElementById("closeCertificate");
const certificateViewport=document.getElementById("certificateZoomViewport");
const certificateZoomImage=document.getElementById("certificateZoomImage");
const certificateZoomIn=document.getElementById("certificateZoomIn");
const certificateZoomOut=document.getElementById("certificateZoomOut");
const certificateZoomReset=document.getElementById("certificateZoomReset");
const certificateZoomLevel=document.getElementById("certificateZoomLevel");
let certificateScale=1, certificateX=0, certificateY=0;
let certificateDragging=false, certificateStartX=0, certificateStartY=0, certificateStartPanX=0, certificateStartPanY=0;
let certificatePointers=new Map(), certificatePinchStartDistance=0, certificatePinchStartScale=1;

function updateCertificateZoom(){
  certificateScale=Math.min(5,Math.max(1,certificateScale));
  if(certificateScale===1){certificateX=0;certificateY=0;}
  certificateZoomImage.style.transform=`translate3d(${certificateX}px,${certificateY}px,0) scale(${certificateScale})`;
  certificateZoomLevel.textContent=`${Math.round(certificateScale*100)}%`;
}
function setCertificateScale(next){
  const old=certificateScale;
  certificateScale=Math.min(5,Math.max(1,next));
  if(old!==certificateScale && certificateScale===1){certificateX=0;certificateY=0;}
  updateCertificateZoom();
}
function resetCertificateZoom(){certificateScale=1;certificateX=0;certificateY=0;updateCertificateZoom();}
function openCertificate(){
  certificateLightbox.classList.add("open");
  certificateLightbox.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  resetCertificateZoom();
  certificateClose.focus();
}
function closeCertificate(){
  certificateLightbox.classList.remove("open");
  certificateLightbox.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
  resetCertificateZoom();
  certificateTrigger.focus();
}
certificateTrigger?.addEventListener("click",openCertificate);
certificateClose?.addEventListener("click",closeCertificate);
certificateZoomIn?.addEventListener("click",()=>setCertificateScale(certificateScale+0.25));
certificateZoomOut?.addEventListener("click",()=>setCertificateScale(certificateScale-0.25));
certificateZoomReset?.addEventListener("click",resetCertificateZoom);

certificateViewport?.addEventListener("dblclick",()=>{
  setCertificateScale(certificateScale===1?2:1);
});
certificateViewport?.addEventListener("wheel",e=>{
  e.preventDefault();
  setCertificateScale(certificateScale+(e.deltaY<0?0.15:-0.15));
},{passive:false});

certificateViewport?.addEventListener("pointerdown",e=>{
  certificateViewport.setPointerCapture(e.pointerId);
  certificatePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(certificatePointers.size===1 && certificateScale>1){
    certificateDragging=true;
    certificateViewport.classList.add("is-dragging");
    certificateStartX=e.clientX; certificateStartY=e.clientY;
    certificateStartPanX=certificateX; certificateStartPanY=certificateY;
  }else if(certificatePointers.size===2){
    const pts=[...certificatePointers.values()];
    certificatePinchStartDistance=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);
    certificatePinchStartScale=certificateScale;
  }
});
certificateViewport?.addEventListener("pointermove",e=>{
  if(!certificatePointers.has(e.pointerId))return;
  certificatePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(certificatePointers.size===2){
    const pts=[...certificatePointers.values()];
    const distance=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);
    if(certificatePinchStartDistance>0){
      setCertificateScale(certificatePinchStartScale*(distance/certificatePinchStartDistance));
    }
  }else if(certificateDragging){
    certificateX=certificateStartPanX+(e.clientX-certificateStartX);
    certificateY=certificateStartPanY+(e.clientY-certificateStartY);
    updateCertificateZoom();
  }
});
function endCertificatePointer(e){
  certificatePointers.delete(e.pointerId);
  if(certificatePointers.size===0){
    certificateDragging=false;
    certificateViewport?.classList.remove("is-dragging");
  }else if(certificatePointers.size===1){
    const p=[...certificatePointers.values()][0];
    certificateStartX=p.x; certificateStartY=p.y;
    certificateStartPanX=certificateX; certificateStartPanY=certificateY;
    certificateDragging=certificateScale>1;
  }
}
certificateViewport?.addEventListener("pointerup",endCertificatePointer);
certificateViewport?.addEventListener("pointercancel",endCertificatePointer);
certificateLightbox?.addEventListener("click",e=>{
  if(e.target.dataset.certificateClose==="true")closeCertificate();
});
document.addEventListener("keydown",e=>{
  if(!certificateLightbox?.classList.contains("open"))return;
  if(e.key==="Escape")closeCertificate();
  if(e.key==="+"||e.key==="=")setCertificateScale(certificateScale+0.25);
  if(e.key==="-"||e.key==="_")setCertificateScale(certificateScale-0.25);
  if(e.key==="0")resetCertificateZoom();
  if(e.key==="Tab"){e.preventDefault();certificateClose.focus();}
});
