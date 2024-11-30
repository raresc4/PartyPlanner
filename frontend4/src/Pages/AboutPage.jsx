import React from "react";
import BaseLayout from "../Layouts/BaseLayout";
import Footer from "../Components/Footer";

export default function AboutPage() {
    return (
        <>
        <BaseLayout>
        <div class="container mx-auto py-12 px-4">
         <section class="text-center">
            <h2 class="text-5xl font-extrabold mb-4 text-black">About Us</h2>
            <p class="text-lg text-gray-700 max-w-4xl mx-auto">
                My name is Rares Catana and I am the main and only developer of this project. I am a second year student at the Polytechnic University of Timisoara where I study Computer Science.  This project was started in November 2024 at a local 8 hour hackathon at Haufe Group in Timisoara and it was later finished at home.

                
            </p>
            <p class="text-lg text-gray-700 max-w-4xl my-4 mx-auto">
                All the technical details of the project and the codebase can be found on my Github account : raresc4 
            </p>
            <p class="text-lg text-gray-700 max-w-4xl my-4 mx-auto">
                Hope you like it, 
            </p>
            <p class="text-lg text-gray-700 max-w-4xl my-4 mx-auto">
                Rares : )
            </p>
             </section>
        </div>
        
        </BaseLayout>
        <Footer/>
            </>
    )
}