/**
 * Bundled by jsDelivr using Rollup v2.79.2 and Terser v5.37.0.
 * Original file: /npm/@neodrag/vanilla@2.2.0/dist/min/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var t={dragStart:!0},e={delay:0,distance:3};function n(n,c={}){let u,g,{bounds:f,axis:h="both",gpuAcceleration:p=!0,legacyTranslate:m=!1,transform:y,applyUserSelectHack:b=!0,disabled:w=!1,ignoreMultitouch:v=!1,recomputeBounds:x=t,grid:_,threshold:E=e,position:S,cancel:A,handle:C,defaultClass:D="neodrag",defaultClassDragging:N="neodrag-dragging",defaultClassDragged:M="neodrag-dragged",defaultPosition:B={x:0,y:0},onDragStart:R,onDrag:$,onDragEnd:X}=c,Y=!1,q=!1,H=0,P=!1,T=!1,k=0,L=0,j=0,z=0,I=0,O=0,{x:U,y:W}=S?{x:S?.x??0,y:S?.y??0}:B;ot(U,W);let F,G,J,K,Q,V="",Z=!!S;x={...t,...x},E={...e,...E??{}};let tt=new Set;function et(){Y&&!q&&T&&P&&Q&&(q=!0,it("neodrag:start",R),rt.add(N),b&&(V=nt.userSelect,nt.userSelect="none"))}const nt=document.body.style,rt=n.classList;function ot(t=k,e=L){if(!y){if(m){let r=`${+t}px, ${+e}px`;return d(n,"transform",p?`translate3d(${r}, 0)`:`translate(${r})`)}return d(n,"translate",`${+t}px ${+e}px`)}const r=y({offsetX:t,offsetY:e,rootNode:n});o(r)&&d(n,"transform",r)}function it(t,e){const r={offsetX:k,offsetY:L,rootNode:n,currentNode:Q};n.dispatchEvent(new CustomEvent(t,{detail:r})),e?.(r)}const at=addEventListener,st=new AbortController,dt={signal:st.signal,capture:!1};function lt(){let t=n.offsetWidth/G.width;return isNaN(t)&&(t=1),t}return d(n,"touch-action","none"),at("pointerdown",(t=>{if(w)return;if(2===t.button)return;if(tt.add(t.pointerId),v&&tt.size>1)return t.preventDefault();if(x.dragStart&&(F=s(f,n)),o(C)&&o(A)&&C===A)throw new Error("`handle` selector can't be same as `cancel` selector");if(rt.add(D),J=function(t,e){if(!t)return[e];if(l(t))return[t];if(Array.isArray(t))return t;const n=e.querySelectorAll(t);if(null===n)throw new Error("Selector passed for `handle` option should be child of the element on which the action is applied");return Array.from(n.values())}(C,n),K=function(t,e){if(!t)return[];if(l(t))return[t];if(Array.isArray(t))return t;const n=e.querySelectorAll(t);if(null===n)throw new Error("Selector passed for `cancel` option should be child of the element on which the action is applied");return Array.from(n.values())}(A,n),u=/(both|x)/.test(h),g=/(both|y)/.test(h),a(K,J))throw new Error("Element being dragged can't be a child of the element on which `cancel` is applied");const e=t.composedPath()[0];if(!J.some((t=>t.contains(e)||t.shadowRoot?.contains(e)))||a(K,[e]))return;Q=1===J.length?n:J.find((t=>t.contains(e))),Y=!0,H=Date.now(),E.delay||(P=!0),G=n.getBoundingClientRect();const{clientX:r,clientY:i}=t,d=lt();u&&(j=r-U/d),g&&(z=i-W/d),F&&(I=r-G.left,O=i-G.top)}),dt),at("pointermove",(t=>{if(!Y||v&&tt.size>1)return;if(!q){if(P||Date.now()-H>=E.delay&&(P=!0,et()),!T){const e=t.clientX-j,n=t.clientY-z;Math.sqrt(e**2+n**2)>=E.distance&&(T=!0,et())}if(!q)return}x.drag&&(F=s(f,n)),t.preventDefault(),G=n.getBoundingClientRect();let e=t.clientX,o=t.clientY;const a=lt();if(F){const t={left:F.left+I,top:F.top+O,right:F.right+I-G.width,bottom:F.bottom+O-G.height};e=r(e,t.left,t.right),o=r(o,t.top,t.bottom)}if(Array.isArray(_)){let[t,n]=_;if(isNaN(+t)||t<0)throw new Error("1st argument of `grid` must be a valid positive number");if(isNaN(+n)||n<0)throw new Error("2nd argument of `grid` must be a valid positive number");let r=e-j,s=o-z;[r,s]=i([t/a,n/a],r,s),e=j+r,o=z+s}u&&(k=Math.round((e-j)*a)),g&&(L=Math.round((o-z)*a)),U=k,W=L,it("neodrag",$),ot()}),dt),at("pointerup",(t=>{tt.delete(t.pointerId),Y&&(q&&(at("click",(t=>t.stopPropagation()),{once:!0,signal:st.signal,capture:!0}),x.dragEnd&&(F=s(f,n)),rt.remove(N),rt.add(M),b&&(nt.userSelect=V),it("neodrag:end",X),u&&(j=k),g&&(z=L)),Y=!1,q=!1,P=!1,T=!1)}),dt),{destroy:()=>st.abort(),update:n=>{h=n.axis||"both",w=n.disabled??!1,v=n.ignoreMultitouch??!1,C=n.handle,f=n.bounds,x=n.recomputeBounds??t,A=n.cancel,b=n.applyUserSelectHack??!0,_=n.grid,p=n.gpuAcceleration??!0,m=n.legacyTranslate??!0,y=n.transform,E={...e,...n.threshold??{}};const r=rt.contains(M);rt.remove(D,M),D=n.defaultClass??"neodrag",N=n.defaultClassDragging??"neodrag-dragging",M=n.defaultClassDragged??"neodrag-dragged",rt.add(D),r&&rt.add(M),Z&&(U=k=n.position?.x??k,W=L=n.position?.y??L,ot())}}}var r=(t,e,n)=>Math.min(Math.max(t,e),n),o=t=>"string"==typeof t,i=([t,e],n,r)=>{const o=(t,e)=>0===e?0:Math.ceil(t/e)*e;return[o(n,t),o(r,e)]},a=(t,e)=>t.some((t=>e.some((e=>t.contains(e)))));function s(t,e){if(void 0===t)return;if(l(t))return t.getBoundingClientRect();if("object"==typeof t){const{top:e=0,left:n=0,right:r=0,bottom:o=0}=t;return{top:e,right:window.innerWidth-r,bottom:window.innerHeight-o,left:n}}if("parent"===t)return e.parentNode.getBoundingClientRect();const n=document.querySelector(t);if(null===n)throw new Error("The selector provided for bound doesn't exists in the document.");return n.getBoundingClientRect()}var d=(t,e,n)=>t.style.setProperty(e,n),l=t=>t instanceof HTMLElement,c=class{constructor(t,e={}){this.node=t,this._drag_instance=n(t,this._options=e)}_drag_instance;_options={};updateOptions(t){this._drag_instance.update(Object.assign(this._options,t))}set options(t){this._drag_instance.update(this._options=t)}get options(){return this._options}destroy(){this._drag_instance.destroy()}};export{c as Draggable};export default null;
//# sourceMappingURL=/sm/70ba544fb627adbd329d51ee70b31e9d0748ada5b93eee67c7427541db259723.map