/* eslint-disable */
"use client";
import { animate, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LinkPreview } from "./link-preview";

export function SkillCard({
    title,
    description,
    links,
    icons,
}: {
    title: string;
    description: string;
    links?: {
        title: string;
        href: string;
    }[];
    icons: {
        icon: React.ReactNode;
    }[];
}) {
  return (
    <Card>
      <CardSkeletonContainer>
        <Skeleton 
          icons={icons}
          links={links || []}
        />
      </CardSkeletonContainer>
      <CardTitle>{title}</CardTitle>
      <CardDescription>
        {description}
      </CardDescription>
    </Card>
  );
}

const Skeleton = ({
    icons,
    links,
}: {
    icons: {
        icon: React.ReactNode;
    }[];
    links: {
        title: string;
        href: string;
    }[];
}) => {
  const scale = [1, 1.1, 1];
  const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"];
  const sequence = [
    [
      ".circle-1",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-2",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-3",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-4",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-5",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
  ];

  useEffect(() => {
    animate(sequence, {
      // @ts-ignore
      repeat: Infinity,
      repeatDelay: 1,
    });
  }, []);

  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center bg-black-100">
      <div className="flex flex-row shrink-0 justify-center items-center gap-2">
        {icons.map((icon, index) => (
            <div
              key={index}
            >
                <Container className={`h-12 w-12 circle-${index + 1}`}>
                    {links.length >= 1 && links[index] && (
                        <LinkPreview
                            url={links[index].href}
                        >
                    {icon.icon}
                        </LinkPreview>
                    )}
                    {links.length < 1 && icon.icon}
                </Container>
            </div>
        ))}
        
      </div>

      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-move">
        <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10">
          <Sparkles />
        </div>
      </div>
    </div>
  );
};
const Sparkles = () => {
    const [randomValues, setRandomValues] = useState<any[]>([]);
  
    useEffect(() => {
      // Generate random values once after the initial render
      const generateRandomValues = () => {
        return [...Array(12)].map(() => ({
          move: Math.random() * 2 - 1,
          opacity: Math.random(),
          scale: [1, 1.2, 0],
          top: Math.random() * 100,
          left: Math.random() * 100,
        }));
      };
  
      setRandomValues(generateRandomValues());
    }, []); // Empty dependency array means this only runs once on the client-side
  
    return (
      <div className="absolute inset-0">
        {randomValues.map((value, i) => (
          <motion.span
            key={`star-${i}`}
            animate={{
              top: `calc(${value.top}% + ${value.move}px)`,
              left: `calc(${value.left}% + ${value.move}px)`,
              opacity: value.opacity,
              scale: value.scale,
            }}
            transition={{
              duration: Math.random() * 2 + 4,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              top: `${value.top}%`,
              left: `${value.left}%`,
              width: `2px`,
              height: `2px`,
              borderRadius: "50%",
              zIndex: 1,
            }}
            className="inline-block bg-white"
          ></motion.span>
        ))}
      </div>
    );
  };
  

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "max-w-sm w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] bg-black-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-white py-2",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-sm font-normal text-neutral-400 max-w-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-[15rem] md:h-[20rem] rounded-xl z-40",
        className,
        showGradient &&
          "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
};

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
        className
      )}
    >
      {children}
    </div>
  );
};


