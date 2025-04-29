import React from "react";
import { cn } from "@/lib/utils";


export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Buy luxury products",
      description:
        "Use the website like an ordinary user. Put items in the cart and checkout.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-3 border-b lg:border-r border-neutral-800",
    },
    {
      title: "Find vulnerabilities",
      description:
        "Check the CTF section to see what vulnerabilities you can find.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-3 border-neutral-800",
    },
    {
      title: "Check the scoreboard",
      description:
        "Fight for the top spot on the leaderboard. See how you stack up against others in finding vulnerabilities.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r border-neutral-800",
    },
    {
      title: "Find out how to mitigate vulnerabilities",
      description:
        "Check out the secure code for each vulnerability. Learn how to fix them.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
          How it works
        </h4>

        <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-center font-normal text-neutral-300">
          We&apos;ve built an e-commerce website to buy luxury products. Along with that we intentionally 
          added vulnerabilities that you can exploit.
        </p>
      </div>

      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        "text-center font-normal text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10">
        <div className="flex flex-1 w-full h-auto flex-col space-y-2">
          <img
            src="/shopScreen.png"
            alt="header"
            width={1920}
            height={1080}
            className="h-auto w-full object-cover object-left-top rounded-sm"
          />
        </div>

    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10">
        <div className="flex flex-1 w-full h-auto flex-col space-y-2">
          <img
            src="/scoreboard.png"
            alt="header"
            width={1920}
            height={1080}
            className="h-auto w-full object-cover object-left-top rounded-sm"
          />
        </div>

    </div>
  );
};

export const SkeletonTwo = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10">
    <div className="flex flex-1 w-full h-auto flex-col space-y-2">
      <img
        src="/ctfScreen.png"
        alt="header"
        width={1920}
        height={1080}
        className="h-auto w-full object-cover object-left-top rounded-sm"
      />
    </div>
</div>
  )
}

export const SkeletonFour = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10">
    <div className="flex flex-1 w-full h-auto flex-col space-y-2">
      <img
        src="/secureCode.png"
        alt="header"
        width={1920}
        height={1080}
        className="h-auto w-full object-cover object-left-top rounded-sm"
      />
    </div>

</div>
  );
};


