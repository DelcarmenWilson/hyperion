
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'
import Image from 'next/image';
const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
  });

  interface HeaderProps{
    label:string
  }

export const Header = ({label}:HeaderProps) => {
  return (
    <div className='width-full flex flex-col gap-y-4 items-center justify-center'>
        <h1 className={cn("text-3xl font-semibold flex justify-between items-center gap-x-2",font.className)}> 
        <Image src="/logo.png" width="10" height="10" className='w-10 h-10' alt="logo" />
        <span>

         Auth
        </span>
         </h1>
        <p className='text-muted-forground text-sm'>{label}</p>
        
    </div>
  )
}
