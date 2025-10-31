# End-to-End Testing Notes

This directory can house Cypress or Playwright end-to-end tests. A sample Playwright
scenario could:

1. Launch the app and navigate to the login page.
2. Log in as an admin test user.
3. Create a new lead through the UI.
4. Assert the lead appears on the Leads page and that success notifications render.

To get started with Playwright:

```bash
npx playwright codegen http://localhost:3000
```

And add a CI job to run `npx playwright test` on each pull request.
