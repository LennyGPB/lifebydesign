import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import test from "node:test";
import { Pool } from "@neondatabase/serverless";
import "dotenv/config";

// Explicit integration run against the configured DB and a running local server.
// Only records bearing these random test identities are created and removed.
const baseURL = process.env.TEST_BASE_URL || "http://localhost:3001";
const runId = randomUUID();
const emails = [`auth-test-${runId}@example.com`, `auth-test-other-${runId}@example.com`];
const ids = [randomUUID(), randomUUID()];
const password = randomBytes(24).toString("base64url");
const answers = {
  firstName: "Test", email: emails[0], telegram: "@test_profile", location: "idf", adult: "yes",
  level: "new", experience: ["none"], blocker: "strategy", job: "employee", time: "3to6",
  format: "distance", rhythm: "monthly", reserve: "ready", budget: "2300plus", commitment: "9",
  motivation: "Test automatique du parcours de compte.", money: "calm", source: "instagram",
  confirmations: ["skill", "education", "coachable"],
};

async function request(path, { body, cookie, origin = baseURL } = {}) {
  const response = await fetch(`${baseURL}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { origin, ...(body === undefined ? {} : { "content-type": "application/json" }), ...(cookie ? { cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  return { status: response.status, data: text ? JSON.parse(text) : null,
    cookie: response.headers.getSetCookie().map(value => value.split(";")[0]).join("; "), headers: response.headers };
}

test("registration, questionnaire ownership, retries and session lifecycle", async t => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await t.test("anonymous submissions and private history are rejected", async () => {
      assert.equal((await request("/api/questionnaire", { body: { id: ids[0], answers } })).status, 401);
      assert.equal((await request("/api/compte/questionnaires")).status, 401);
    });
    await t.test("short passwords are rejected on the server", async () => {
      const response = await request("/api/auth/sign-up/email", { body: { name: "Test", email: emails[0], password: "short" } });
      assert.ok(response.status >= 400);
    });
    const signup = await request("/api/auth/sign-up/email", { body: { name: "Test", email: emails[0], password } });
    assert.equal(signup.status, 200, "registration succeeds");
    assert.ok(signup.cookie, "registration immediately creates a session cookie");
    const userId = signup.data.user.id;
    await t.test("passwords are hashed and the new session is authenticated", async () => {
      const session = await request("/api/auth/get-session", { cookie: signup.cookie });
      assert.equal(session.data.user.id, userId);
      assert.match(signup.headers.get("set-cookie"), /httponly/i);
      const account = await pool.query('SELECT "password" FROM "Account" WHERE "userId" = $1', [userId]);
      assert.notEqual(account.rows[0].password, password);
      assert.ok(account.rows[0].password.length > 64);
    });
    await t.test("questionnaire is saved against the authenticated user and survives retry", async () => {
      const body = { id: ids[0], answers, userId: "forged-client-user" };
      const sent = await request("/api/questionnaire", { body, cookie: signup.cookie });
      assert.equal(sent.status, 200);
      assert.equal(sent.data.saved, true);
      assert.equal(sent.data.result.status, "recommended");
      const retry = await request("/api/questionnaire", { body, cookie: signup.cookie });
      assert.equal(retry.data.saved, true);
      const records = await pool.query('SELECT "userId" FROM "QuestionnaireSubmission" WHERE "id" = $1', [ids[0]]);
      assert.equal(records.rowCount, 1);
      assert.equal(records.rows[0].userId, userId);
      const changed = await request("/api/questionnaire", { body: { ...body, answers: { ...answers, commitment: "8" } }, cookie: signup.cookie });
      assert.equal(changed.status, 409);
    });
    await t.test("private history exposes only the account's own submissions", async () => {
      const own = await request("/api/compte/questionnaires", { cookie: signup.cookie });
      assert.equal(own.data.submissions[0].id, ids[0]);
      assert.equal(own.headers.get("cache-control"), "private, no-store");
      assert.equal("priority" in own.data.submissions[0], false);
      const other = await request("/api/auth/sign-up/email", { body: { name: "Other", email: emails[1], password } });
      assert.equal(other.status, 200);
      const history = await request("/api/compte/questionnaires", { cookie: other.cookie });
      assert.deepEqual(history.data.submissions, []);
      const forged = await request("/api/questionnaire", { body: { id: ids[0], answers }, cookie: other.cookie });
      assert.equal(forged.status, 409);
    });
    await t.test("cross-origin submissions are rejected", async () => {
      const response = await request("/api/questionnaire", { origin: "https://untrusted.example", body: { id: ids[1], answers }, cookie: signup.cookie });
      assert.equal(response.status, 403);
    });
    await t.test("sign-out revokes the session and existing users can sign in and submit", async () => {
      assert.equal((await request("/api/auth/sign-out", { cookie: signup.cookie, body: {} })).status, 200);
      assert.equal((await request("/api/auth/get-session", { cookie: signup.cookie })).data, null);
      const wrong = await request("/api/auth/sign-in/email", { body: { email: emails[0], password: "incorrect-password" } });
      assert.ok(wrong.status >= 400);
      const signin = await request("/api/auth/sign-in/email", { body: { email: emails[0], password } });
      assert.equal(signin.status, 200);
      const sent = await request("/api/questionnaire", { body: { id: ids[1], answers }, cookie: signin.cookie });
      assert.equal(sent.data.saved, true);
    });
  } finally {
    await pool.query('DELETE FROM "QuestionnaireSubmission" WHERE "id" = ANY($1::text[]) AND "email" = $2', [ids, emails[0]]);
    await pool.query('DELETE FROM "User" WHERE "email" = ANY($1::text[])', [emails]);
    await pool.end();
  }
});
