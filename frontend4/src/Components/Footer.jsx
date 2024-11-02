import { Facebook, Github, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <div className="w-full h-[10rem] flex flex-row items-center justify-center">
            <div className="h-full w-[24rem] bg-black rounded-tr-xl rounded-tl-xl flex flex-row items-end justify-center">
                <div className="h-[80%] w-[90%] bg-black border-2 border-white border-dashed rounded-tr-2xl rounded-tl-2xl border-b-0 flex flex-col items-center justify-start gap-y-3">
                    
                    <div className="flex flex-row items-center justify-center mt-4 gap-x-2">
                        <a><Github size={32} className="text-2xl text-white hover:text-green-300 hover:cursor-pointer hover:transition-all" /></a>
                        <a><Instagram size={32} className="text-2xl text-white hover:text-pink-300 hover:cursor-pointer hover:transition-all" /></a>
                        <a><Facebook size={32} className="text-2xl text-white hover:text-cyan-300 hover:cursor-pointer hover:transition-all" /></a>
                    </div>
                    
                    <div className="w-[8rem] h-0.5 bg-white rounded-full" />
                    <p className="text-white text-sm">by <a className="font-bold" href="https://github.com/raresc4" target="_blank" rel="noopener noreferrer">Catana Rares</a></p>
                </div>
            </div>
        </div>
    );
}
