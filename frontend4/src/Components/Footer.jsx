import { Facebook, Github, Instagram } from "lucide-react";

export default function Footer() {
    return(<>
        <div className="w-full h-[15rem] flex flex-row items-center justify-center ">
            <div className="h-full w-[30rem] bg-black rounded-tr-xl rounded-tl-xl flex flex-row items-end justify-center">
                <div className="h-[85%] w-[90%] bg-black border-2 border-white border-dashed rounded-tr-2xl rounded-tl-2xl border-b-0 flex flex-col items-center justify-start gap-y-5">
                    
                    <div className="flex flex-row items-center justify-between mt-5 gap-x-3">
                        <a><Github size={48} className="text-4xl text-white hover:text-green-300 hover:cursor-pointer hover:transition-all"/></a>
                        <a><Instagram size={48} className="text-4xl text-white hover:text-pink-300 hover:cursor-pointer hover:transition-all"/></a>
                        <a><Facebook size={48} className="text-4xl text-white hover:text-cyan-300 hover:cursor-pointer hover:transition-all"/></a>
                    </div>
                    
                    <div className="w-[10rem] h-1 bg-white rounded-full"/>
                    <p className="text-white">by <a className="font-bold" href="https://github.com/raresc4" target="_blank">Catana Rarest</a></p>
                </div>
            </div>
        </div>
    </>)
}