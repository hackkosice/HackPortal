import React, { ReactNode } from "react";
import { render } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import createMockRouter from "@/services/test/createMockRouter";
import { NextRouter } from "next/router";

type RenderWithRouterProviderOpts = {
  router: NextRouter;
};

const renderWithRouterProvider = (
  children: ReactNode,
  { router }: RenderWithRouterProviderOpts = { router: createMockRouter({}) }
) => {
  return render(
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
};

export default renderWithRouterProvider;
