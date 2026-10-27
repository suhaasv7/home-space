import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Home Space — My home', description: 'Explore your home in 2D and 3D, refine dimensions, and arrange furniture.' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
