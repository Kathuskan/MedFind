# Deploy MedFind on Render

This configuration publishes the synthetic demo. It does not enable real pharmacy operations, patient accounts, or reservations.

## Resources

- One Docker web service (`medfind-demo`) in Singapore. FastAPI serves the compiled React app and `/api/v1` from the same HTTPS origin. No CORS configuration or frontend API secret is needed.
- One PostgreSQL 17 database (`medfind-demo-db`) in the same region. External database access is disabled. Render injects the private connection string; do not copy it into Git.
- Free plans are selected explicitly. Render's free database expires after 30 days and has no backups. The free web service sleeps when idle. Bandwidth and build usage limits also apply. Review Render's displayed terms and cost before creating resources; use a paid database plan only when separately approved.

## Publish

1. Sign in to [Render](https://dashboard.render.com/).
2. Open [Deploy MedFind](https://render.com/deploy?repo=https://github.com/Kathuskan/MedFind).
3. Review `render.yaml`: one free web service and one free database. If the account already has a free database or the plans are unavailable, stop and choose an alternative rather than accepting an unexpected charge.
4. Deploy the Blueprint. The Docker build compiles React and packages it with the API. Startup applies migrations, inserts demo fixtures only if the catalogue is empty, then starts the server on Render's assigned port.
5. Wait for the readiness health check to pass. Open the actual URL shown by Render; the hostname is assigned during provisioning.
6. Check `/api/v1/health/ready`, reload `/search` directly, search for Metformin, choose 500 mg, and check pharmacy results. Reload `/staff/login` and a pharmacy detail URL to verify browser routes.

`DEMO_MODE=true` and `SEED_DEMO=true` are intentional. Existing stock timestamps are never refreshed on restart. After 24 hours the seeded reports become Unconfirmed; this is the expected freshness behavior.

## Update and recovery

Automatic deploys are disabled. After tests pass, deploy the selected Git commit manually from Render. Keep one service instance during this prototype: migrations run on startup and the seed is not a multi-instance provisioning mechanism. Future scaled deployment should move migrations and seed setup into a controlled one-time release process.

Use Render's previous successful deploy for application rollback only when its code remains compatible with the database schema. Do not undo migrations or recreate the database to fix a failed app build. Before a destructive migration or moving beyond synthetic data, arrange verified backups and a supported persistent database plan.

## Verification scope

Local checks cover the production frontend build, API behavior, database URL normalization, static assets, browser-route fallbacks, and missing-resource responses. GitHub Actions checks the API against PostgreSQL and builds the hosted image. Docker is not installed on the authoring machine; the image must pass CI or Render's build before it is considered verified. A pushed configuration is not a live deployment.

References: [Render free limits](https://render.com/docs/free), [Blueprint reference](https://render.com/docs/blueprint-spec), [Deploy button](https://render.com/docs/deploy-to-render). Reviewed 10 October 2026.
