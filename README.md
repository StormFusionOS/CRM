# CRM Testing Scaffolding

This repository now includes backend and frontend testing scaffolding for a CRM platform.

## Backend (pytest)

* Test configuration lives under [`tests/`](tests/).
* Run tests with:
  ```bash
  poetry run pytest --cov=app
  ```
  or, if Poetry is not used:
  ```bash
  pip install -r requirements.txt
  pytest --cov=app
  ```
* Fixtures in [`tests/conftest.py`](tests/conftest.py) spin up an in-memory SQLite
  database and FastAPI `TestClient`.

## Frontend (Jest + React Testing Library)

* Example component tests are in [`frontend/src/__tests__/`](frontend/src/__tests__/).
* Install dependencies and run tests with:
  ```bash
  cd frontend
  npm install
  npm test
  ```

## End-to-End Tests

* Placeholder documentation for future Cypress/Playwright coverage can be found in
  [`tests/e2e/README.md`](tests/e2e/README.md).
