import { catalog, type Item } from './room';

export const feet = (ft:number, inches=0) => (ft + inches/12)*0.3048;
export function imperial(m:number){const n=Math.round(m/.0254);return `${Math.floor(n/12)}′${n%12?`${n%12}″`:''}`;}
export const reference = {
 kitchenClearWidth:feet(6,3), kitchenClearDepth:feet(4,3), kitchenDivider:feet(4,9), kitchenShortWall:feet(2,5),
 tvWall:feet(6,10), bedroomWidth:feet(8,10), bedroomClearDepth:feet(6,9), entryWidth:feet(5),
 bed:[feet(5),feet(1,6),feet(6,9)] as [number,number,number],
 desk:[feet(3),feet(2,7),feet(2)] as [number,number,number],
 washer:[feet(1,9),feet(2,10),feet(1,9)] as [number,number,number],
 fridge:[feet(1,10),feet(3,9),feet(1,10)] as [number,number,number],
};
export const defaultDimensions = {width:feet(13,10),kitchenWidth:feet(8,10),kitchenDepth:feet(6,3),livingDepth:feet(12,6),bedroomDepth:feet(9,3),bathroomWidth:feet(5),bathroomDepth:feet(7,6),balconyWidth:feet(2,6),balconyDepth:feet(13,6),height:2.8,cupboardDepth:feet(1,3)};
export type Dimensions=typeof defaultDimensions;
export type ZoneId='kitchen'|'unknown'|'living'|'bedroom'|'bathroom'|'balcony';
export type Zone={id:ZoneId;name:string;x:number;z:number;width:number;depth:number;color:string;inferred:boolean;outline?:[number,number][]};
export type HomeItem=Item & {zone:ZoneId;size?:[number,number,number]};
export type HomePlan={version:3;dimensions:Dimensions;items:HomeItem[]};
export const dimensionFields:{key:keyof Dimensions;label:string;min:number;max:number;source:'Measured'|'Inferred'|'Derived'}[]=[
 {key:'width',label:'Overall width',min:3.7,max:8,source:'Derived'},
 {key:'kitchenWidth',label:'Kitchen zone width',min:2,max:5,source:'Derived'},
 {key:'kitchenDepth',label:'Kitchen zone length',min:1.5,max:4,source:'Derived'},
 {key:'livingDepth',label:'Living room · wall to wall',min:2.5,max:6,source:'Measured'},
 {key:'bedroomDepth',label:'Bedroom + doorway zone',min:2.4,max:5,source:'Derived'},
 {key:'bathroomWidth',label:'Bathroom width',min:1.2,max:2.5,source:'Inferred'},
 {key:'bathroomDepth',label:'Bathroom length',min:1.5,max:3,source:'Inferred'},
 {key:'balconyWidth',label:'Balcony width',min:.65,max:1.8,source:'Measured'},
 {key:'balconyDepth',label:'Balcony length',min:2,max:5,source:'Measured'},
 {key:'cupboardDepth',label:'Bottom cupboard depth',min:.2,max:.7,source:'Inferred'},
 {key:'height',label:'Ceiling height',min:2.4,max:3.4,source:'Inferred'},
];
export function normalizeDimensions(d:Dimensions):Dimensions{
 const n={...d};for(const f of dimensionFields)n[f.key]=Math.max(f.min,Math.min(f.max,Number.isFinite(n[f.key])?n[f.key]:defaultDimensions[f.key]));
 n.kitchenWidth=Math.min(n.kitchenWidth,n.width-feet(3));n.bathroomWidth=Math.min(n.bathroomWidth,n.width-feet(8));
 n.bathroomDepth=Math.min(n.bathroomDepth,n.bedroomDepth+n.cupboardDepth-.3);return n;
}
export function layout(d:Dimensions){
 const bedroomWidth=d.width-d.bathroomWidth;
 const livingInset=Math.max(0,bedroomWidth-reference.tvWall);
 const kitchenLine=d.kitchenDepth,bedroomLine=kitchenLine+d.livingDepth;
 const balconyStart=kitchenLine-feet(0,6),balconyEnd=balconyStart+d.balconyDepth;
 const bedroomNotch=Math.max(0,Math.min(feet(1),balconyEnd-bedroomLine));
 const cupboardStart=bedroomLine+d.bedroomDepth,total=cupboardStart+d.cupboardDepth;
 return {bedroomWidth,livingInset,kitchenLine,bedroomLine,balconyStart,balconyEnd,bedroomNotch,cupboardStart,total,bathroomTop:total-d.bathroomDepth,entryLeft:d.kitchenWidth,entryDoorWidth:Math.min(feet(2,6),d.width-d.kitchenWidth-.1)};
}
export function zones(d:Dimensions):Zone[]{
 const g=layout(d),toWorld=(x:number,z:number):[number,number]=>[x-d.width/2,z-g.total/2];
 const zone=(id:ZoneId,name:string,x:number,z:number,width:number,depth:number,color:string,inferred:boolean,outline?:[number,number][]):Zone=>{const [wx,wz]=toWorld(x+width/2,z+depth/2);return{id,name,x:wx,z:wz,width,depth,color,inferred,outline:outline?.map(([px,pz])=>toWorld(px,pz))};};
 return [
 zone('kitchen','Kitchen',0,0,d.kitchenWidth,d.kitchenDepth,'#bfc3b3',true,[[0,0],[d.kitchenWidth,0],[d.kitchenWidth,d.kitchenDepth],[g.livingInset,d.kitchenDepth],[g.livingInset,g.balconyStart],[0,g.balconyStart]]),
 zone('unknown','Entry / open area',d.kitchenWidth,0,d.width-d.kitchenWidth,d.kitchenDepth,'#d9d2c4',false),
 zone('living','Living room',g.livingInset,g.kitchenLine,d.width-g.livingInset,d.livingDepth,'#b5b4a8',false),
 zone('bedroom','Bedroom',0,g.bedroomLine,g.bedroomWidth,d.bedroomDepth,'#c6b6a3',true,[[g.livingInset,g.bedroomLine],[g.bedroomWidth,g.bedroomLine],[g.bedroomWidth,g.cupboardStart],[0,g.cupboardStart],[0,g.bedroomLine+g.bedroomNotch],[g.livingInset,g.bedroomLine+g.bedroomNotch]]),
 zone('bathroom','Bathroom',g.bedroomWidth,g.bathroomTop,d.bathroomWidth,d.bathroomDepth,'#91aaa7',true),
 zone('balcony','Balcony',g.livingInset-d.balconyWidth,g.balconyStart,d.balconyWidth,d.balconyDepth,'#7ea8a6',false),
 ];
}
export function itemSize(i:HomeItem):[number,number,number]{return i.size??catalog.find(c=>c.kind===i.kind)!.size;}
function footprint(i:HomeItem){const [w,,d]=itemSize(i),a=i.rotation*Math.PI/180;return {width:Math.abs(Math.cos(a))*w+Math.abs(Math.sin(a))*d,depth:Math.abs(Math.sin(a))*w+Math.abs(Math.cos(a))*d};}
function bounds(i:HomeItem,d:Dimensions){const z=zones(d).find(z=>z.id===i.zone)!;const inset=i.zone==='bedroom'?layout(d).bedroomNotch:0;return {width:z.width,depth:z.depth-inset,inset};}
export function canFit(i:HomeItem,d:Dimensions){if(!zones(d).some(z=>z.id===i.zone))return false;const b=bounds(i,d),s=footprint(i);return s.width<=b.width+1e-8&&s.depth<=b.depth+1e-8;}
export function fitHomeItem(i:HomeItem,d:Dimensions):HomeItem{const b=bounds(i,d),s=footprint(i),zone=zones(d).find(z=>z.id===i.zone)!;const minZ=-zone.depth/2+b.inset+s.depth/2,maxZ=zone.depth/2-s.depth/2;return{...i,x:Math.max(-(b.width-s.width)/2,Math.min((b.width-s.width)/2,i.x)),z:Math.max(minZ,Math.min(maxZ,i.z))};}
export function initialHome():HomePlan{
 const d={...defaultDimensions},g=layout(d),bed=reference.bed,desk=reference.desk;
 const items:HomeItem[]=[
 {id:'chair-1',kind:'chair',zone:'living',x:-.4,z:0,rotation:0,color:'#e59a26'},
 {id:'chair-2',kind:'chair',zone:'living',x:.6,z:0,rotation:0,color:'#e59a26'},
 {id:'bed',kind:'bed',zone:'bedroom',x:-g.bedroomWidth/2+bed[0]/2+.03,z:-d.bedroomDepth/2+g.bedroomNotch+bed[2]/2,rotation:0,color:'#344d67',size:[...bed]},
 {id:'desk',kind:'table',zone:'bedroom',x:g.bedroomWidth/2-desk[2]/2,z:-d.bedroomDepth/2+feet(6,3),rotation:90,color:'#958a7b',size:[...desk]},
 ];return{version:3,dimensions:d,items:items.map(i=>fitHomeItem(i,d))};
}
export function validHome(value:unknown):value is HomePlan{
 if(!value||typeof value!=='object')return false;const p=value as HomePlan;
 if(p.version!==3||!p.dimensions||!Array.isArray(p.items)||p.items.length>100)return false;
 if(!dimensionFields.every(f=>Number.isFinite(p.dimensions[f.key])&&p.dimensions[f.key]>=f.min&&p.dimensions[f.key]<=f.max))return false;
 if(Object.entries(normalizeDimensions(p.dimensions)).some(([k,v])=>Math.abs(v-p.dimensions[k as keyof Dimensions])>1e-8))return false;
 const ids=zones(p.dimensions).map(z=>z.id);
 return new Set(p.items.map(i=>i?.id)).size===p.items.length&&p.items.every(i=>i&&typeof i.id==='string'&&ids.includes(i.zone)&&catalog.some(c=>c.kind===i.kind)&&[i.x,i.z,i.rotation].every(Number.isFinite)&&/^#[0-9a-f]{6}$/i.test(i.color)&&(i.size===undefined||(Array.isArray(i.size)&&i.size.length===3&&i.size.every(n=>Number.isFinite(n)&&n>=.01&&n<=5)))&&canFit(i,p.dimensions));
}
