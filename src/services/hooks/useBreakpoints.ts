import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";
import { useEffect, useMemo, useState } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const fullConfig = resolveConfig(tailwindConfig);

type Breakpoints = {
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isXLarge: boolean;
  is2XLarge: boolean;
};

const breakpointsMapper: { [key: string]: keyof Breakpoints } = {
  sm: "isSmall",
  md: "isMedium",
  lg: "isLarge",
  xl: "isXLarge",
  "2xl": "is2XLarge",
};

export const useBreakpoints = (): Breakpoints => {
  const tailwindBreakpoints = fullConfig?.theme?.screens;
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return useMemo((): Breakpoints => {
    const breakpoints: Breakpoints = {
      isSmall: false,
      isMedium: false,
      isLarge: false,
      isXLarge: false,
      is2XLarge: false,
    };

    if (!tailwindBreakpoints || !windowSize.width || !windowSize.height) {
      return breakpoints;
    }

    Object.keys(tailwindBreakpoints).forEach((breakpoint) => {
      const minWidthString = (tailwindBreakpoints as never)[
        breakpoint
      ] as string;
      const minWidth = parseInt(minWidthString.replace("px", ""));
      const breakPoint = breakpointsMapper[breakpoint];
      if ((windowSize.width as number) >= minWidth) {
        breakpoints[breakPoint] = true;
      }
    });

    return breakpoints;
  }, [tailwindBreakpoints, windowSize.height, windowSize.width]);
};
