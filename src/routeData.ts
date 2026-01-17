// Customize edit links for sample modules and apps
// https://github.com/withastro/starlight/discussions/1468#discussioncomment-14074010

import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

export const onRequest = defineRouteMiddleware((context) => {
  const { starlightRoute } = context.locals;

  if (starlightRoute.editUrl) {
      const { entry, id } = context.locals.starlightRoute;
      const parts = id.split('/');

      // Check if the file is inside the "modules" or "samples" folder
      // and redirect to the source README.md for that project
      if ((parts[1] === 'modules' || parts[1] === 'samples') && parts.length >= 2) {
        const repoName = parts[2];
        // Return the specific GitHub edit URL for the README
        starlightRoute.editUrl = new URL(`https://github.com/skiptools/${repoName}/edit/main/README.md`);
      }
  }
});

