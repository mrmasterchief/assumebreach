"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
    ));

    return (
        <div className="w-full h-full py-20">
            <Carousel items={cards} />
        </div>
    );
}



const data = [
    {
        category: "Awareness & Culture",
        title: "Raise Security Awareness",
        src: "https://s3.eu-central-1.amazonaws.com/workingtalent-cms/media/_1600x900_crop_center-center_100_none/wat-doet-developer.png",
    },
    {
        category: "Secure Coding Education",
        title: "Educate Developers About Web Vulnerabilities",
        src: "https://eu-images.contentstack.com/v3/assets/blt69509c9116440be8/blt2af7e0fde2f4e8c2/64cb31dfda1ddbf8b56e9432/online_classes_casey.jpg",
    },
    {
        category: "Academic & Training Use",
        title: "Make Security Courses Fun",
        src: "https://www.continia.com/media/cmpjntis/man-laughing-while-working-on-laptop.jpg?width=640&height=600&rnd=133548043039870000",
    },
    {
        category: "Offensive Security Training",
        title: "Train Ethical Hackers",
        src: "https://www.futuretaleslab.com/images/page/cover/1O3zH537k.jpg",
    },

];
