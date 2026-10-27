'use client';
import {Canvas,useThree} from '@react-three/fiber';
import {Grid,Html,OrbitControls} from '@react-three/drei';
import {useEffect} from 'react';
import {Box,Furniture} from './scene';
import {zones,type HomePlan,type ZoneId,type Zone} from '@/lib/home';

function Wall({x,z,width,depth,height,top,color='#eee5d4'}:{x:number;z:number;width:number;depth:number;height:number;top:boolean;color?:string}){return <Box size={[width,top?.1:height,depth]} position={[x,top?.05:height/2,z]} color={color}/>}
function Fixtures({zone:z,top}:{zone:Zone;top:boolean}){
 const w=z.width,d=z.depth;
 const box=(size:[number,number,number],position:[number,number,number],color:string)=> <Box size={size} position={position} color={color}/>;
 return <group position={[z.x,0,z.z]}>
 {z.id==='living'&&<group position={[-.4,0,-d/2+.3]}>{box([2.15,.4,.4],[0,.25,0],'#665b50')}{!top&&<>{box([2.2,2.25,.08],[0,1.2,-.16],'#94897a')}{box([1.2,.7,.06],[0,1.35,-.08],'#171c1e')}{box([2.3,.08,.3],[0,2.35,-.08],'#6b6054')}</>}</group>}
 {z.id==='living'&&<group position={[-w/2+.55,0,.7]}>{box([.04,1.55,.5],[-.38,.8,0],'#e79b32')}{box([.04,1.55,.5],[.38,.8,0],'#e79b32')}{[.4,.9,1.4].map(y=><Box key={y} size={[.8,.035,.45]} position={[0,y,0]} color='#d7d6c8'/>)}</group>}
 {z.id==='living'&&<mesh position={[-1.6,.3,-d/2+1]} scale={[.45,.35,.45]} castShadow><sphereGeometry args={[1,24,16]}/><meshStandardMaterial color='#24344b'/></mesh>}
 {z.id==='bedroom'&&<>{box([.5,2.4,Math.min(1.8,d-.3)],[-w/2+.25,1.2,-.3],'#958a7b')}{box([1,.75,.5],[-.4,.38,-d/2+.3],'#534a41')}{box([.5,.8,.5],[-.4,.4,-d/2+1],'#2f3437')}</>}
 {z.id==='bathroom'&&<>{box([.4,.45,.65],[0,.25,d/2-.5],'#edece3')}{box([.43,.42,.15],[0,.55,d/2-.2],'#edece3')}{box([.48,.15,.36],[w/2-.25,.8,-d/2+.35],'#e3e5df')}{box([.03,1.7,.03],[w/2-.1,1.2,.1],'#adb8b8')}{box([.3,.04,.3],[w/2-.25,2,.1],'#adb8b8')}{box([.42,.5,.4],[w/2-.24,2.3,.5],'#e4e9e3')}</>}
 {z.id==='balcony'&&<>{box([Math.min(.6,w-.1),.9,.6],[0,.45,-d/2+.35],'#b8b6ac')}{box([Math.min(.61,w-.08),.04,.61],[0,.92,-d/2+.35],'#4f5352')}</>}
 {z.id==='kitchen'&&<>{box([w-.2,.85,.55],[0,.425,-d/2+.3],'#a7a095')}{box([w-.15,.06,.6],[0,.9,-d/2+.3],'#414544')}</>}
 </group>;
}
function Camera({top,depth}:{top:boolean;depth:number}){const {camera}=useThree();useEffect(()=>{camera.position.set(...(top?[0,depth*1.65,.001]:[depth*.9,depth*1.05,depth*1.1]) as [number,number,number]);camera.lookAt(0,0,0)},[camera,top,depth]);return null}
export default function HomeScene({plan,top,cutaway,active,selected,onSelect,onZone}:{plan:HomePlan;top:boolean;cutaway:boolean;active:ZoneId|null;selected:string|null;onSelect:(id:string|null)=>void;onZone:(id:ZoneId)=>void}){
 const d=plan.dimensions, rooms=zones(d), total=d.kitchenDepth+d.livingDepth+d.bedroomDepth;
 const left=-d.width/2,right=d.width/2,back=-total/2,front=total/2,kitchenLine=back+d.kitchenDepth,bedroomLine=kitchenLine+d.livingDepth,bathroomLeft=right-d.bathroomWidth;
 const h=top?.1:cutaway?1.05:d.height,wall=(x:number,z:number,width:number,depth:number)=> <Wall x={x} z={z} width={width} depth={depth} height={h} top={top}/>;
 const living=rooms.find(z=>z.id==='living')!;
 return <Canvas shadows dpr={[1,1.6]} camera={{position:[9,11,12],fov:40}} onPointerMissed={()=>onSelect(null)} fallback={<div className='canvas-message'>Enable WebGL to explore the 3D model.</div>}>
 <color attach='background' args={['#101813']}/><ambientLight intensity={1.7}/><directionalLight position={[-3,12,6]} intensity={2.5} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15}/>
 {rooms.map(z=><group key={z.id}><group onClick={e=>{e.stopPropagation();onZone(z.id)}}><Box size={[z.width,.12,z.depth]} position={[z.x,-.07,z.z]} color={active===z.id?'#cfbf9b':z.color}/></group>
 {Array.from({length:Math.floor(z.width/.6)},(_,i)=><Box key={`x${i}`} size={[.008,.005,z.depth]} position={[z.x-z.width/2+(i+1)*.6,.001,z.z]} color='#a5a69c'/>)}
 {Array.from({length:Math.floor(z.depth/.6)},(_,i)=><Box key={`z${i}`} size={[z.width,.005,.008]} position={[z.x,.001,z.z-z.depth/2+(i+1)*.6]} color='#a5a69c'/>)}
 <Html position={[z.x,.1,z.z+z.depth/2-.25]} center zIndexRange={[20,10]}><button className={`zone-label ${active===z.id?'selected':''}`} onClick={()=>onZone(z.id)}>{z.name}<small>≈ {z.width.toFixed(1)} × {z.depth.toFixed(1)} m</small></button></Html>
 <Fixtures zone={z} top={top}/></group>)}
 {wall(0,back,d.width,.12)}{wall(left,back+d.kitchenDepth/2,.12,d.kitchenDepth)}
 {wall(left,bedroomLine+d.bedroomDepth/2,.12,d.bedroomDepth)}
 {/* Balcony opening in the living room's west wall. */}
 {wall(left,kitchenLine+.3,.12,.6)}{wall(left,bedroomLine-.3,.12,.6)}
 {!top&&<><Box size={[.12,.25,1.6]} position={[left,d.height-.125,living.z]} color='#eee5d4'/>{[-.85,.85].map(offset=><Box key={offset} size={[.12,2.4,.08]} position={[left,1.2,living.z+offset]} color='#65503e'/>)}</>}
 {/* Two front-facing outside walls are cut away for a clear dollhouse view. */}
 {top&&<>{wall(right,0,.12,total)}{wall(0,front,d.width,.12)}</>}
 {wall(left+d.kitchenWidth/2-.4,kitchenLine,d.kitchenWidth-.8,.12)}
 {wall(left+d.kitchenWidth,back+(d.kitchenDepth-.8)/2,.12,d.kitchenDepth-.8)}
 {wall((left+bathroomLeft)/2,bedroomLine,d.width-d.bathroomWidth,.12)}
 {wall(bathroomLeft,front-d.bathroomDepth/2,.12,d.bathroomDepth)}
 {wall(right-(d.bathroomWidth-.75)/2,front-d.bathroomDepth,d.bathroomWidth-.75,.12)}
 <Wall x={left-d.balconyWidth} z={living.z} width={.1} depth={d.balconyDepth} height={top?.1:1} top={top} color='#8eb9b6'/>
 {[-1,1].map(s=><Wall key={s} x={left-d.balconyWidth/2} z={living.z+s*d.balconyDepth/2} width={d.balconyWidth} depth={.1} height={top?.1:1} top={top} color='#8eb9b6'/>)}
 {plan.items.map(i=>{const z=rooms.find(z=>z.id===i.zone)!;return <group key={i.id} position={[z.x,0,z.z]}><Furniture item={i} selected={i.id===selected} onSelect={()=>onSelect(i.id)}/></group>})}
 <Grid position={[0,-.15,0]} args={[40,40]} cellSize={1} cellColor='#35483b' sectionColor='#35483b' fadeDistance={30}/>
 <OrbitControls key={`${top}-${total}`} makeDefault target={[0,0,0]} minDistance={3} maxDistance={35} enableRotate={!top} maxPolarAngle={Math.PI/2.05}/><Camera top={top} depth={total}/>
 </Canvas>;
}
