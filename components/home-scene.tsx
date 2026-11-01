'use client';
import {Canvas,useThree} from '@react-three/fiber';
import {Grid,Html,OrbitControls} from '@react-three/drei';
import {useEffect,useMemo} from 'react';
import {Shape,DoubleSide} from 'three';
import {Box,Furniture} from './scene';
import {feet,imperial,layout,reference,zones,type HomePlan,type ZoneId,type Zone} from '@/lib/home';

function Floor({zone,onClick,active}:{zone:Zone;onClick:()=>void;active:boolean}){
 const shape=useMemo(()=>{const points=zone.outline??[[zone.x-zone.width/2,zone.z-zone.depth/2],[zone.x+zone.width/2,zone.z-zone.depth/2],[zone.x+zone.width/2,zone.z+zone.depth/2],[zone.x-zone.width/2,zone.z+zone.depth/2]];const s=new Shape();points.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();return s;},[zone]);
 return <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.01,0]} receiveShadow onClick={e=>{e.stopPropagation();onClick()}}><shapeGeometry args={[shape]}/><meshStandardMaterial color={active?'#cfbf9b':zone.color} side={DoubleSide} roughness={.9}/></mesh>;
}
function Camera({top,depth}:{top:boolean;depth:number}){const {camera}=useThree();useEffect(()=>{camera.position.set(...(top?[0,depth*1.6,.001]:[depth*.85,depth*.95,depth*1.1]) as [number,number,number]);camera.lookAt(0,0,0)},[camera,top,depth]);return null;}
export default function HomeScene({plan,top,cutaway,active,selected,onSelect,onZone}:{plan:HomePlan;top:boolean;cutaway:boolean;active:ZoneId|null;selected:string|null;onSelect:(id:string|null)=>void;onZone:(id:ZoneId)=>void}){
 const d=plan.dimensions,g=layout(d),rooms=zones(d),h=top?.08:cutaway?1.05:d.height;
 const X=(x:number)=>x-d.width/2,Z=(z:number)=>z-g.total/2;
 const box=(x:number,z:number,w:number,depth:number,height:number,color:string,y=height/2)=><Box size={[w,height,depth]} position={[X(x),y,Z(z)]} color={color}/>;
 const wall=(x:number,z:number,w:number,depth:number)=>box(x,z,w,depth,h,'#eee5d4');
 const edge=(x1:number,z1:number,x2:number,z2:number)=>wall((x1+x2)/2,(z1+z2)/2,Math.max(.075,Math.abs(x2-x1)),Math.max(.075,Math.abs(z2-z1)));
 const doorColor='#68b7db',sideCounter=Math.max(.3,d.kitchenWidth-reference.kitchenClearWidth),upperCounter=Math.max(.3,d.kitchenDepth-reference.kitchenClearDepth);
 const bathroomDoorWidth=Math.min(feet(2,6),d.bathroomWidth-.2),bathroomDoorX=g.bedroomWidth+(d.bathroomWidth-bathroomDoorWidth)/2;
 return <Canvas shadows dpr={[1,1.6]} camera={{position:[8,10,11],fov:40}} onPointerMissed={()=>onSelect(null)} fallback={<div className='canvas-message'>Enable WebGL to explore the 3D model.</div>}>
 <color attach='background' args={['#101813']}/><ambientLight intensity={1.7}/><directionalLight position={[-3,12,6]} intensity={2.5} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15}/>
 {rooms.map(z=><group key={z.id}><Floor zone={z} active={active===z.id} onClick={()=>onZone(z.id)}/><Html position={[z.x,.08,z.z+z.depth/2-.12]} center zIndexRange={[20,10]}><button className={`zone-label ${active===z.id?'selected':''}`} onClick={()=>onZone(z.id)}>{z.name}<small>{z.inferred?'≈ ':''}{imperial(z.width)} × {imperial(z.depth)}</small></button></Html></group>)}
 {/* Access strip and bottom cupboards are outside the bedroom's usable floor area. */}
 {box(g.bedroomWidth+d.bathroomWidth/2,(g.bedroomLine+g.bathroomTop)/2,d.bathroomWidth,Math.max(.05,g.bathroomTop-g.bedroomLine),.04,'#d9d2c4',-.035)}
 {box(g.bedroomWidth/2,g.cupboardStart+d.cupboardDepth/2,g.bedroomWidth,d.cupboardDepth,.05,'#a59b8d',-.035)}
 {/* Kitchen L shape: clear 6′3″ × 4′3″ at the approved starting dimensions. */}
 {box(sideCounter/2,g.balconyStart/2,sideCounter,g.balconyStart,.88,'#a99b8c')}
 {box(sideCounter+(d.kitchenWidth-sideCounter)/2,upperCounter/2,d.kitchenWidth-sideCounter,upperCounter,.88,'#a99b8c')}
 {box(sideCounter/2,g.balconyStart/2,sideCounter+.02,g.balconyStart,.045,'#484a45',.91)}
 {box(sideCounter+(d.kitchenWidth-sideCounter)/2,upperCounter/2,d.kitchenWidth-sideCounter,upperCounter,.045,'#484a45',.91)}
 {/* Washer and fridge use supplied W × D × H, not generic visual estimates. */}
 {box(g.livingInset-d.balconyWidth/2,g.balconyStart+reference.washer[2]/2+.05,reference.washer[0],reference.washer[2],reference.washer[1],'#b8b6ac')}
 {box(g.livingInset-d.balconyWidth/2,g.balconyStart+reference.washer[2]/2+.05,reference.washer[0]-.04,reference.washer[2]-.04,.03,'#454b4b',reference.washer[1]+.02)}
 {box(g.livingInset+reference.fridge[0]/2+.04,g.kitchenLine+reference.fridge[2]/2+.04,reference.fridge[0],reference.fridge[2],reference.fridge[1],'#a899b8')}
 {/* TV is on the bedroom partition and faces into the living room. */}
 {box(g.livingInset+reference.tvWall/2,g.bedroomLine-.1,Math.min(feet(5,4),reference.tvWall-.1),.2,.4,'#665b50')}
 {!top&&<>{box(g.livingInset+reference.tvWall/2,g.bedroomLine-.04,Math.min(feet(5,4),reference.tvWall-.1),.06,1.95,'#94897a',1.08)}{box(g.livingInset+reference.tvWall/2,g.bedroomLine-.09,1.05,.045,.62,'#171c1e',1.25)}</>}
 {box(g.bedroomWidth/2,g.cupboardStart+d.cupboardDepth/2,g.bedroomWidth,d.cupboardDepth,top?.1:2.3,'#958a7b')}
 {/* Bathroom fittings remain inferred; bathroom footprint is explicitly approximate. */}
 {box(g.bedroomWidth+d.bathroomWidth*.38,g.total-.4,.4,.6,.42,'#edece3')}
 {box(g.bedroomWidth+d.bathroomWidth*.38,g.total-.15,.4,.13,.6,'#edece3')}
 {box(d.width-.23,g.total-.35,.42,.38,.15,'#e3e5df',.8)}
 {box(d.width-.08,g.bathroomTop+.55,.035,.035,1.8,'#adb8b8',1.1)}
 {/* Top wall's opening starts exactly at the left end of the entry area. */}
 {edge(0,0,g.entryLeft,0)}{edge(g.entryLeft+g.entryDoorWidth,0,d.width,0)}
 {edge(0,0,0,g.balconyStart)}{edge(g.entryLeft,0,g.entryLeft,Math.min(reference.kitchenDivider,d.kitchenDepth))}
 {edge(g.livingInset,g.kitchenLine,g.livingInset+Math.min(reference.kitchenShortWall,d.kitchenWidth-g.livingInset),g.kitchenLine)}
 {/* The door's open leaf runs down the LEFT wall; its width is inferred. */}
 {box(g.entryLeft+.065,g.entryDoorWidth/2,.045,g.entryDoorWidth,top?.09:2.05,doorColor)}
 {edge(g.livingInset,g.balconyStart,g.livingInset,g.kitchenLine+.35)}
 {edge(g.livingInset,g.bedroomLine-.35,g.livingInset,g.balconyEnd)}
 {edge(g.livingInset,g.bedroomLine,g.bedroomWidth,g.bedroomLine)}
 {edge(0,g.bedroomLine+g.bedroomNotch,0,g.total)}
 {edge(g.bedroomWidth,g.bedroomLine,g.bedroomWidth,g.bedroomLine+.07)}
 {edge(g.bedroomWidth,g.bathroomTop-.07,g.bedroomWidth,g.total)}
 {edge(g.bedroomWidth,g.bathroomTop,bathroomDoorX,g.bathroomTop)}
 {edge(bathroomDoorX+bathroomDoorWidth,g.bathroomTop,d.width,g.bathroomTop)}
 {box(bathroomDoorX+bathroomDoorWidth/2,g.bathroomTop,bathroomDoorWidth,.035,top?.08:.04,doorColor)}
 {/* Keep the two front exterior walls cut away unless full walls are requested. */}
 {(!cutaway||top)&&<>{edge(d.width,0,d.width,g.total)}{edge(0,g.total,d.width,g.total)}</>}
 {box(g.livingInset-d.balconyWidth,g.balconyStart+d.balconyDepth/2,.075,d.balconyDepth,top?.08:1,'#8eb9b6')}
 {[g.balconyStart,g.balconyEnd].map(z=><group key={z}>{box(g.livingInset-d.balconyWidth/2,z,d.balconyWidth,.075,top?.08:1,'#8eb9b6')}</group>)}
 {plan.items.map(i=>{const z=rooms.find(z=>z.id===i.zone)!;return <group key={i.id} position={[z.x,0,z.z]}><Furniture item={i} selected={i.id===selected} onSelect={()=>onSelect(i.id)}/></group>})}
 <Grid position={[0,-.12,0]} args={[40,40]} cellSize={feet(1)} sectionSize={feet(5)} cellColor='#35483b' sectionColor='#35483b' fadeDistance={30}/>
 <OrbitControls key={`${top}-${g.total}`} makeDefault target={[0,0,0]} minDistance={3} maxDistance={35} enableRotate={!top} maxPolarAngle={Math.PI/2.05}/><Camera top={top} depth={g.total}/>
 </Canvas>;
}
