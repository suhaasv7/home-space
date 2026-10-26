'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Grid, Html } from '@react-three/drei';
import { catalog, type Item, type Room } from '@/lib/room';

function Box({position=[0,0,0],size,color}:{position?:[number,number,number];size:[number,number,number];color:string}) {return <RoundedBox args={size} position={position} radius={.035} smoothness={2} castShadow receiveShadow><meshStandardMaterial color={color} roughness={.8}/></RoundedBox>}
function Furniture({item,selected,onSelect}:{item:Item;selected:boolean;onSelect:()=>void}){
 const {kind,color}=item;
 const size=catalog.find(c=>c.kind===kind)!.size;
 return <group position={[item.x,.03,item.z]} rotation={[0,item.rotation*Math.PI/180,0]} onClick={e=>{e.stopPropagation();onSelect()}}>
 {selected&&<mesh rotation={[-Math.PI/2,0,0]} position={[0,.008,0]}><planeGeometry args={[size[0]+.16,size[2]+.16]}/><meshBasicMaterial color="#b47b46" transparent opacity={.45}/></mesh>}
 {(kind==='sofa'||kind==='chair')&&<><Box size={[size[0],.25,.8]} position={[0,.3,0]} color={color}/><Box size={[size[0],.55,.18]} position={[0,.65,-.35]} color={color}/>{[-1,1].map(s=><Box key={s} size={[.16,.42,.85]} position={[s*(size[0]/2-.08),.5,0]} color={color}/>)}{[-1,1].map(s=><Box key={s} size={[size[0]/2-.2,.12,.59]} position={[s*(size[0]/4-.05),.48,.04]} color={color}/>)}{[-1,1].flatMap(x=>[-1,1].map(z=><Box key={`${x}${z}`} size={[.08,.19,.08]} position={[x*(size[0]/2-.16),.12,z*.28]} color="#5d4632"/>))}</>}
 {kind==='table'&&<><Box size={[1.2,.1,.65]} position={[0,.42,0]} color={color}/>{[-1,1].flatMap(x=>[-1,1].map(z=><Box key={`${x}${z}`} size={[.07,.38,.07]} position={[x*.48,.2,z*.22]} color="#674c35"/>))}<Box size={[.25,.025,.2]} position={[-.22,.49,0]} color="#e5dfd3"/><mesh position={[.25,.56,0]}><cylinderGeometry args={[.07,.07,.16,24]}/><meshStandardMaterial color="#c6a881"/></mesh></>}
 {kind==='rug'&&<Box size={size} position={[0,.02,0]} color={color}/>}
 {kind==='plant'&&<><mesh position={[0,.23,0]} castShadow><cylinderGeometry args={[.22,.16,.45,24]}/><meshStandardMaterial color="#c99a76"/></mesh><Box size={[.035,.65,.035]} position={[0,.65,0]} color="#6d6344"/>{[0,1,2,3,4,5,6].map(n=><mesh key={n} position={[Math.sin(n*2.4)*.18,.65+n*.09,Math.cos(n*2.4)*.18]} scale={[.19,.28,.12]} rotation={[0,n,Math.sin(n)*.8]} castShadow><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color={color}/></mesh>)}</>}
 {kind==='lamp'&&<><mesh position={[0,.025,0]}><cylinderGeometry args={[.23,.23,.05,24]}/><meshStandardMaterial color="#4e493e"/></mesh><Box size={[.035,1.4,.035]} position={[0,.7,0]} color="#655f4e"/><mesh position={[0,1.45,0]} castShadow><cylinderGeometry args={[.18,.3,.4,32]}/><meshStandardMaterial color={color}/></mesh></>}
 {kind==='shelf'&&<><Box size={[1.4,1.8,.08]} position={[0,.9,-.13]} color={color}/>{[0,.55,1.1,1.75].map(y=><Box key={y} size={[1.4,.06,.35]} position={[0,y+.04,0]} color={color}/>)}{[-.67,.67].map(x=><Box key={x} size={[.06,1.8,.35]} position={[x,.9,0]} color={color}/>)}{[0,1,2,3,4].map(n=><Box key={n} size={[.1,.3+n*.025,.2]} position={[-.45+n*.15,.75,0]} color={['#6c7966','#b69a7d','#d4cbb9'][n%3]}/>)}</>}
 {kind==='bed'&&<><Box size={[1.65,.25,2.1]} position={[0,.2,0]} color="#87664d"/><Box size={[1.58,.25,2.02]} position={[0,.45,0]} color={color}/><Box size={[1.65,.9,.12]} position={[0,.5,-1]} color="#87664d"/>{[-.4,.4].map(x=><Box key={x} size={[.6,.12,.4]} position={[x,.62,-.65]} color="#f2ece2"/>)}<Box size={[1.6,.05,1]} position={[0,.6,.5]} color="#82917c"/></>}
 </group>;
}
export default function Scene({room,selected,onSelect,top}:{room:Room;selected:string|null;onSelect:(id:string|null)=>void;top:boolean}){
 return <Canvas shadows dpr={[1,1.8]} camera={{position:[8,8,9],fov:40}} onPointerMissed={()=>onSelect(null)} fallback={<div className="canvas-message">Your browser needs WebGL to show the 3D room. Try a browser with hardware acceleration enabled.</div>}>
 <color attach="background" args={['#eeeae3']}/><ambientLight intensity={1.5}/><directionalLight position={[3,8,4]} intensity={3} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12}/>
 <group position={[0,-.15,0]}><Box size={[room.width,.25,room.depth]} color={room.floor}/></group>
 {Array.from({length:Math.floor(room.width/.3)},(_,n)=><mesh key={n} position={[-room.width/2+n*.3,.003,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.009,room.depth]}/><meshStandardMaterial color="#806143" transparent opacity={.28}/></mesh>)}
 {!top&&<><Box size={[room.width,room.height,.12]} position={[0,room.height/2,-room.depth/2]} color={room.wall}/><Box size={[.12,room.height,room.depth]} position={[-room.width/2,room.height/2,0]} color={room.wall}/><Box size={[room.width,.09,.05]} position={[0,.05,-room.depth/2+.08]} color="#faf5eb"/><Box size={[.05,.09,room.depth]} position={[-room.width/2+.08,.05,0]} color="#faf5eb"/>
 <Box size={[1.6,1.2,.045]} position={[.3,1.7,-room.depth/2+.075]} color="#f8f8ee"/><Box size={[1.42,1.02,.05]} position={[.3,1.7,-room.depth/2+.105]} color="#b7cbd0"/><Box size={[.045,1.1,.06]} position={[.3,1.7,-room.depth/2+.14]} color="#fffaf1"/>
 </>}
 {room.items.map(i=><Furniture key={i.id} item={i} selected={i.id===selected} onSelect={()=>onSelect(i.id)}/>)}
 <Grid position={[0,-.29,0]} args={[40,40]} cellSize={1} cellThickness={.5} cellColor="#d3cdc4" sectionColor="#d3cdc4" sectionThickness={.5} fadeDistance={35}/>
 <Html position={[0,.05,room.depth/2+.45]} center><span className="dimension">{room.width.toFixed(1)} m</span></Html>
 <OrbitControls key={`${top}-${room.width}-${room.depth}`} makeDefault target={[0,0,0]} minDistance={4} maxDistance={30} maxPolarAngle={Math.PI/2.05} minPolarAngle={top?.001:0} enableRotate={!top} onStart={()=>{}} />
 <CameraPosition top={top}/>
 </Canvas>;
}
import {useThree} from '@react-three/fiber';
import {useEffect} from 'react';
function CameraPosition({top}:{top:boolean}){const {camera}=useThree();useEffect(()=>{camera.position.set(...(top?[0,13,.01]:[8,8,9]) as [number,number,number]);camera.lookAt(0,0,0)},[top,camera]);return null}
