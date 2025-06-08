import{S as T,P as _,W as A,O as N,A as W,H as B,D as z,G as F,B as M,V as j}from"./GLTFLoader-CBrhpRA9.js";function q(){const e=document.getElementById("threejs-canvas-hardware-sensor-platform");if(!e)return console.error("Container fehlt.");const s=new T,o=new _(45,e.clientWidth/e.clientHeight,.1,1e4);o.position.set(0,0,10);const a=new A({antialias:!0,alpha:!0});a.setSize(e.clientWidth,e.clientHeight),a.setPixelRatio(window.devicePixelRatio),a.domElement.style.position="relative",a.domElement.style.zIndex="0",e.appendChild(a.domElement);const d=new N(o,a.domElement);d.enableDamping=!0,s.add(new W(16777215,1.5));const E=new B(16777215,4473924,1.5);E.position.set(0,10,0),s.add(E);const C=new z(16777215,1.5);C.position.set(15,20,20),s.add(C);const L=new z(16777215,1);L.position.set(-15,-20,-20),s.add(L),e.style.position="relative";const h=document.createElement("div");h.style.cssText=`
    position: absolute;
    top: 16px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 8px;
    z-index: 10;
    background: rgba(0,0,0,0.5);
    padding: 4px 8px;
    border-radius: 4px;
    color: #fff;
    font-family: sans-serif;
  `;const b=document.createElement("span");b.textContent="…";const p=document.createElement("button");p.textContent="Next ▶",p.style.cssText=`
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
    padding: 2px 6px;
    cursor: pointer;
    border-radius: 3px;
  `,h.append(b,p),e.appendChild(h);const g=document.createElement("div");g.style.cssText=`
    position: absolute;
    top: 16px; right: 16px;
    display: flex; align-items: center; gap: 8px;
    flex-wrap: nowrap; white-space: nowrap;
    z-index: 10;
    background: rgba(0,0,0,0.5);
    padding: 4px 8px;
    border-radius: 4px;
  `;const i=document.createElement("button");i.textContent="⟳",i.style.cssText=`
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
    padding: 2px 6px;
    cursor: pointer;
    border-radius: 3px;
  `,i.disabled=!0;const t=document.createElement("select");t.classList.add("scene-ui-select","form-select","form-select-sm"),t.disabled=!0,t.style.cssText=`
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
    padding: 2px 6px;
    cursor: pointer;
    border-radius: 3px;
  `,t.appendChild(new Option("Show All","")),g.append(i,t),e.appendChild(g);const P=[{url:"/3D-objects/SpiderClip_Prototype_2.glb",name:"Prototype_2"},{url:"/3D-objects/VR-controller-integration.glb",name:"Prototype_3"},{url:"/3D-objects/SpiderClip_Prototype_1.glb",name:"Prototype_1"}];let f=0,n=null;const S=new F,m=[];function D(l){n&&(s.remove(n),n.traverse(w=>{var y;return(y=w.geometry)==null?void 0:y.dispose()}),m.length=0);const{url:x,name:u}=P[l];b.textContent=u,i.disabled=t.disabled=!0,S.load(x,w=>{n=w.scene;const H=new M().setFromObject(n).getCenter(new j);n.position.sub(H),s.add(n),(n.children.length===1?n.children[0].children:n.children).forEach((r,R)=>{(r.isMesh||r.getObjectByProperty("isMesh",!0))&&(r.userData.displayName=r.name||`Part ${R+1}`,m.push(r))}),t.innerHTML="",t.append(new Option("Show All","")),m.forEach(r=>t.append(new Option(r.userData.displayName,r.userData.displayName))),i.disabled=t.disabled=!1;const v=new M().setFromObject(n).getSize(new j),c=Math.max(v.x,v.y,v.z),O=o.fov*Math.PI/180,k=Math.abs(c/2/Math.tan(O/2))*1.2;o.position.set(0,0,k),o.near=c/100,o.far=c*100,o.updateProjectionMatrix(),d.minDistance=c*.5,d.maxDistance=c*5})}i.addEventListener("click",()=>d.autoRotate=!d.autoRotate),t.addEventListener("change",l=>{const x=l.target.value;m.forEach(u=>u.visible=!x||u.userData.displayName===x)}),p.addEventListener("click",()=>{f=(f+1)%P.length,D(f)}),D(f),function l(){requestAnimationFrame(l),d.update(),a.render(s,o)}(),window.addEventListener("resize",()=>{o.aspect=e.clientWidth/e.clientHeight,o.updateProjectionMatrix(),a.setSize(e.clientWidth,e.clientHeight)})}export{q as initHardwareCanvas};
