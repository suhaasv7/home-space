import { catalog, fit, type Item } from './room';

export const defaultDimensions = { width:4.8, kitchenWidth:3.1, kitchenDepth:2.5, livingDepth:3.9, bedroomDepth:3.2, bathroomWidth:1.8, bathroomDepth:2, balconyWidth:.9, balconyDepth:2.5, height:2.8 };
export type Dimensions = typeof defaultDimensions;
export type ZoneId = 'kitchen'|'unknown'|'living'|'bedroom'|'bathroom'|'balcony';
export type Zone = { id:ZoneId; name:string; x:number; z:number; width:number; depth:number; color:string };
export type HomeItem = Item & {zone:ZoneId};
export type HomePlan = {version:2; dimensions:Dimensions; items:HomeItem[]};
export const dimensionFields:{key:keyof Dimensions;label:string;min:number;max:number}[] = [
 {key:'width',label:'Home width',min:4,max:8}, {key:'kitchenWidth',label:'Kitchen width',min:2,max:5},
 {key:'kitchenDepth',label:'Kitchen length',min:2,max:4}, {key:'livingDepth',label:'Living room length',min:3,max:6},
 {key:'bedroomDepth',label:'Bedroom length',min:2.8,max:5}, {key:'bathroomWidth',label:'Bathroom width',min:1.4,max:2.5},
 {key:'bathroomDepth',label:'Bathroom length',min:1.5,max:2.8}, {key:'balconyWidth',label:'Balcony depth',min:.7,max:1.8},
 {key:'balconyDepth',label:'Balcony length',min:1.8,max:4}, {key:'height',label:'Ceiling height',min:2.4,max:3.4},
];
export function normalizeDimensions(d:Dimensions):Dimensions {
 const next={...d};for(const f of dimensionFields)next[f.key]=Math.max(f.min,Math.min(f.max,next[f.key]));
 next.kitchenWidth=Math.min(next.kitchenWidth,next.width-1.2);
 next.bathroomWidth=Math.min(next.bathroomWidth,next.width-2.6);
 next.bathroomDepth=Math.min(next.bathroomDepth,next.bedroomDepth-.3);
 next.balconyDepth=Math.min(next.balconyDepth,next.livingDepth-.4);return next;
}
export function zones(d:Dimensions):Zone[]{
 const total=d.kitchenDepth+d.livingDepth+d.bedroomDepth, left=-d.width/2, back=-total/2;
 return [
 {id:'kitchen',name:'Kitchen',x:left+d.kitchenWidth/2,z:back+d.kitchenDepth/2,width:d.kitchenWidth,depth:d.kitchenDepth,color:'#bfc3b3'},
 {id:'unknown',name:'Unconfirmed area',x:d.kitchenWidth/2,z:back+d.kitchenDepth/2,width:d.width-d.kitchenWidth,depth:d.kitchenDepth,color:'#d9d2c4'},
 {id:'living',name:'Living room',x:0,z:back+d.kitchenDepth+d.livingDepth/2,width:d.width,depth:d.livingDepth,color:'#b5b4a8'},
 {id:'bedroom',name:'Bedroom',x:-d.bathroomWidth/2,z:back+d.kitchenDepth+d.livingDepth+d.bedroomDepth/2,width:d.width-d.bathroomWidth,depth:d.bedroomDepth,color:'#c6b6a3'},
 {id:'bathroom',name:'Bathroom',x:(d.width-d.bathroomWidth)/2,z:total/2-d.bathroomDepth/2,width:d.bathroomWidth,depth:d.bathroomDepth,color:'#91aaa7'},
 {id:'balcony',name:'Balcony',x:left-d.balconyWidth/2,z:back+d.kitchenDepth+d.livingDepth/2,width:d.balconyWidth,depth:d.balconyDepth,color:'#7ea8a6'},
 ];
}
export const defaultItems:HomeItem[] = [
 {id:'chair-1',kind:'chair',zone:'living',x:-.6,z:.6,rotation:180,color:'#e59a26'},
 {id:'chair-2',kind:'chair',zone:'living',x:.5,z:.6,rotation:180,color:'#e59a26'},
 {id:'plant',kind:'plant',zone:'living',x:-1.8,z:-1.3,rotation:0,color:'#547650'},
 {id:'bed',kind:'bed',zone:'bedroom',x:.35,z:.25,rotation:0,color:'#344d67'},
 ];
export function canFit(i:HomeItem,d:Dimensions):boolean {const z=zones(d).find(z=>z.id===i.zone);if(!z)return false;const size=catalog.find(c=>c.kind===i.kind)!.size,a=i.rotation*Math.PI/180;return Math.abs(Math.cos(a))*size[0]+Math.abs(Math.sin(a))*size[2]<=z.width&&Math.abs(Math.sin(a))*size[0]+Math.abs(Math.cos(a))*size[2]<=z.depth;}
export function fitHomeItem(i:HomeItem,d:Dimensions):HomeItem { const zone=zones(d).find(z=>z.id===i.zone)!;return {...i,...fit(i,zone)}; }
export function initialHome():HomePlan {return {version:2,dimensions:{...defaultDimensions},items:defaultItems.map(i=>fitHomeItem({...i},defaultDimensions))};}
export function validHome(value:unknown):value is HomePlan {
 if(!value||typeof value!=='object')return false;const p=value as HomePlan;
 if(p.version!==2||!p.dimensions||!Array.isArray(p.items)||p.items.length>100)return false;
 if(!dimensionFields.every(f=>Number.isFinite(p.dimensions[f.key])&&p.dimensions[f.key]>=f.min&&p.dimensions[f.key]<=f.max))return false;
 const ids=zones(p.dimensions).map(z=>z.id);
 return new Set(p.items.map(i=>i?.id)).size===p.items.length&&p.items.every(i=>i&&typeof i.id==='string'&&ids.includes(i.zone)&&catalog.some(c=>c.kind===i.kind)&&[i.x,i.z,i.rotation].every(Number.isFinite)&&/^#[0-9a-f]{6}$/i.test(i.color)&&canFit(i,normalizeDimensions(p.dimensions)));
}
