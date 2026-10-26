export type Kind = 'sofa'|'chair'|'table'|'rug'|'plant'|'lamp'|'shelf'|'bed';
export type Item = {id:string;kind:Kind;x:number;z:number;rotation:number;color:string};
export type Room = {name:string;width:number;depth:number;height:number;wall:string;floor:string;items:Item[]};
export const catalog: {kind:Kind;name:string;size:[number,number,number];color:string;symbol:string}[] = [
 {kind:'sofa',name:'Linen sofa',size:[2.3,.85,.9],color:'#c4b79f',symbol:'▰'},
 {kind:'chair',name:'Accent chair',size:[.85,.85,.85],color:'#a3ad91',symbol:'▣'},
 {kind:'table',name:'Coffee table',size:[1.2,.42,.65],color:'#946c48',symbol:'▱'},
 {kind:'rug',name:'Woven rug',size:[2.7,.025,1.9],color:'#d5c8b2',symbol:'▧'},
 {kind:'plant',name:'Indoor plant',size:[.6,1.35,.6],color:'#5f7957',symbol:'♧'},
 {kind:'lamp',name:'Floor lamp',size:[.5,1.65,.5],color:'#e9d8ae',symbol:'♙'},
 {kind:'shelf',name:'Bookcase',size:[1.4,1.8,.35],color:'#a68460',symbol:'▤'},
 {kind:'bed',name:'Double bed',size:[1.65,.65,2.1],color:'#d0c3b4',symbol:'▥'},
];
export const initial:Room = {name:'My living room',width:6,depth:5,height:2.8,wall:'#ece7dc',floor:'#b9936b',items:[
 {id:'rug',kind:'rug',x:0,z:.25,rotation:0,color:'#d5c8b2'},
 {id:'sofa',kind:'sofa',x:0,z:-1.65,rotation:0,color:'#c4b79f'},
 {id:'table',kind:'table',x:0,z:0,rotation:0,color:'#946c48'},
 {id:'chair',kind:'chair',x:1.9,z:.65,rotation:-30,color:'#a3ad91'},
 {id:'plant',kind:'plant',x:-2.35,z:-1.85,rotation:0,color:'#5f7957'},
 {id:'lamp',kind:'lamp',x:1.85,z:-1.9,rotation:0,color:'#e9d8ae'},
 {id:'shelf',kind:'shelf',x:-2.65,z:.2,rotation:90,color:'#a68460'},
]};
export function fit(item:Item,room:Pick<Room,'width'|'depth'>):Item { const s=catalog.find(c=>c.kind===item.kind)!.size;const a=item.rotation*Math.PI/180;const w=Math.abs(Math.cos(a))*s[0]+Math.abs(Math.sin(a))*s[2];const d=Math.abs(Math.sin(a))*s[0]+Math.abs(Math.cos(a))*s[2];return {...item,x:Math.max(-(room.width-w)/2,Math.min((room.width-w)/2,item.x)),z:Math.max(-(room.depth-d)/2,Math.min((room.depth-d)/2,item.z))}; }
export function validRoom(value:unknown):value is Room { if(!value||typeof value!=='object')return false; const r=value as Room;return typeof r.name==='string'&&r.name.length<100&&[r.width,r.depth].every(n=>Number.isFinite(n)&&n>=3&&n<=15)&&Number.isFinite(r.height)&&r.height>=2&&r.height<=5&&/^#[0-9a-f]{6}$/i.test(r.wall)&&/^#[0-9a-f]{6}$/i.test(r.floor)&&Array.isArray(r.items)&&r.items.length<=100&&new Set(r.items.map(i=>i.id)).size===r.items.length&&r.items.every(i=>i&&typeof i.id==='string'&&catalog.some(c=>c.kind===i.kind)&&[i.x,i.z,i.rotation].every(Number.isFinite)&&/^#[0-9a-f]{6}$/i.test(i.color)); }
