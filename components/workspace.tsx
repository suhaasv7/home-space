'use client';
import {useState} from 'react';
import dynamic from 'next/dynamic';
import HomePlanner from './home-planner';
const Planner=dynamic(()=>import('./planner'));
export default function Workspace(){const [studio,setStudio]=useState(false);return studio?<><button className='return-home button' onClick={()=>setStudio(false)}>← Back to my home</button><Planner/></>:<HomePlanner onStudio={()=>setStudio(true)}/>}
