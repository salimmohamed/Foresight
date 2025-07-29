"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import React from "react";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string | number;
  blur?: string;
}

const BlurFade = ({
  children,
  className,
  variant,
  duration = 0.5,
  delay = 0,
  yOffset = 6,
  inView = true,
  inViewMargin = "-50px",
  blur = "8px",
}: BlurFadeProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: inViewMargin });
  const defaultVariants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: `blur(0px)` },
  };
  const combinedVariants = variant || defaultVariants;
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? (isInView ? "visible" : "hidden") : "visible"}
      whileInView={inView ? "visible" : "hidden"}
      variants={combinedVariants}
      transition={{
        delay,
        duration,
        ease: "easeOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

export default BlurFade;