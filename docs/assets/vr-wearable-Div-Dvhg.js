import{S as z,C as E,P as L,W as R,O as M,A as D,H as P,D as b,G as W,B as H,V as w}from"./GLTFLoader-CBrhpRA9.js";function j(){const e=document.getElementById("threejs-canvas-vr-wearable");if(!e){console.error("VR-Container fehlt.");return}const i=new z;i.background=new E(0);const t=new L(45,e.clientWidth/e.clientHeight,.1,1e4);t.position.set(0,0,10);const n=new R({antialias:!0,alpha:!0});n.setSize(e.clientWidth,e.clientHeight),n.setPixelRatio(window.devicePixelRatio),n.domElement.style.position="relative",n.domElement.style.zIndex="0",e.appendChild(n.domElement);const o=new M(t,n.domElement);o.enableDamping=!0,o.dampingFactor=.1,i.add(new D(16777215,1.5));const m=new P(16777215,4473924,1.5);m.position.set(0,10,0),i.add(m);const x=new b(16777215,1.5);x.position.set(15,20,20),i.add(x);const u=new b(16777215,1);u.position.set(-15,-20,-20),i.add(u),e.style.position="relative";const c=document.createElement("div");c.style.cssText=`
    position: absolute;
    top: 16px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 8px;
    z-index: 10;
    background: rgba(0,0,0,0.5);
    padding: 4px 8px;
    border-radius: 4px;
    color: #fff;
    font-family: sans-serif;
    font-size: 0.9rem;
  `;const l=document.createElement("span");l.textContent="",c.appendChild(l),e.appendChild(c);const p=document.createElement("div");p.style.cssText=`
    position: absolute;
    top: 16px; right: 16px;
    display: flex; align-items: center;
    z-index: 10;
    background: rgba(0,0,0,0.5);
    padding: 4px 8px;
    border-radius: 4px;
  `;const s=document.createElement("button");s.textContent="⟳",s.style.cssText=`
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
    padding: 2px 6px;
    cursor: pointer;
    border-radius: 3px;
    font-size: 0.9rem;
  `,p.appendChild(s),e.appendChild(p),new W().load("/3D-objects/vr-wearable.glb",a=>{const d=a.scene||a;l.textContent="VR Wearable",d.traverse(g=>{g.isMesh&&g.geometry.computeBoundingSphere()}),i.add(d),s.addEventListener("click",()=>{o.autoRotate=!o.autoRotate,s.style.opacity=o.autoRotate?"0.7":"1"});const h=new H().setFromObject(d),f=h.getSize(new w),v=h.getCenter(new w);d.position.sub(v);const r=Math.max(f.x,f.y,f.z),y=t.fov*Math.PI/180,C=Math.abs(r/2/Math.tan(y/2))*1.2;t.position.set(0,0,C),t.near=r/100,t.far=r*100,t.updateProjectionMatrix(),o.minDistance=r*.5,o.maxDistance=r*5},void 0,a=>console.error("Fehler beim Laden VR-Modell:",a)),function a(){requestAnimationFrame(a),o.update(),n.render(i,t)}(),window.addEventListener("resize",()=>{t.aspect=e.clientWidth/e.clientHeight,t.updateProjectionMatrix(),n.setSize(e.clientWidth,e.clientHeight)})}export{j as initVRCanvas};
