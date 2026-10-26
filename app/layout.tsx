import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Home Space — Make room for your ideas', description: 'An interactive 3D home decoration studio. Plan your room, arrange furniture, and explore colours.' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
