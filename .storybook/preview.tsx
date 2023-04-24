import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";
import { withThemeByDataAttribute } from "@storybook/addon-styling";
import { Roboto, League_Spartan } from "next/font/google";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: "400",
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  weight: ["400", "700"],
  subsets: ["latin"],
});


const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
    attributeName: 'data-mode',
  }),
  (Story) => (<main className={`${roboto.variable} ${leagueSpartan.variable} font-default`}><Story /></main>),
];

export default preview;
