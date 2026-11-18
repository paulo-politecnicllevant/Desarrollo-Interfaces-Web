const b=document.querySelector('.burger'),n=document.getElementById('nav'),u=document.querySelector('.up');
b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
addEventListener('scroll',()=>u.classList.toggle('show',scrollY>400));
u.addEventListener('click',()=>scrollTo({top:0}));
const d=document.querySelector('input[type=date]');if(d)d.min=new Date().toISOString().slice(0,10);
document.querySelectorAll('form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();document.getElementById(f.dataset.ok).classList.add('show');f.reset()}));
