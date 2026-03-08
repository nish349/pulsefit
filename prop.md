You're right, I missed it. Here it is.

---

## 9. Settings — Full Spec

Settings is the deepest page in the product. Nothing here is used daily — this is where the gym owner comes to wire up the system, configure hardware, and control how PulseAdmin behaves globally. No member management, no reporting, no day-to-day tasks live here.

The page is organised into clearly labelled sections, stacked vertically on a single scrollable page. Each section has a heading, a subtitle describing what it controls, and its configuration fields below it. No tabs, no nested navigation — everything visible on one scroll.

---

### Section 1 — Gym Profile

The gym's public-facing and operational identity.

| Field | Type | Notes |
|---|---|---|
| Gym Name | Text input | Required |
| Address | Textarea | Required |
| City | Text input | Required |
| Phone Number | Tel input | Required |
| Email Address | Email input | Required |
| Logo | Image upload | PNG or JPG, max 2MB, preview shown after upload |
| Operating Timezone | Dropdown | Defaults to IST, full timezone list available |

Changes to Gym Profile do not take effect until the admin clicks a Save button at the bottom of this section. Do not auto-save on blur for this section — changes here are consequential.

---

### Section 2 — Operational Mode

Controls the global default for how the facility operates. This feeds directly into the Schedule page.

| Option | Behaviour |
|---|---|
| Flexible Hours | Default open and close times apply across all days unless overridden per day in Schedule |
| 24 / 7 Open | Gym is always open — time pickers hidden globally, per-day override still available in Schedule |

This is a radio-style selection, not a toggle. Current mode displayed clearly with a green active indicator. Edit button or inline selector to change. Changing this updates the Schedule page's Operational Mode card in real time.

---

### Section 3 — Access Control Configuration

Controls which entry methods are active across the facility. This directly determines what options appear in the Add Member modal Step 3 and in the Access Log method column.

| Field | Type | Notes |
|---|---|---|
| QR Code | Toggle | Enable or disable QR entry globally |
| Biometric | Toggle | Enable or disable fingerprint or facial recognition |
| RFID / Keycard | Toggle | Enable or disable RFID card entry |
| Default Entry Method | Select | Which method is assigned to new members by default |
| Emergency QR Override | Button | Instantly switches all active entry to QR only — for use when biometric hardware fails |

At least one method must be active at all times. If an admin attempts to disable all three, show an inline error: "At least one entry method must be active."

The Emergency QR Override button requires a confirmation step before executing. It is styled in amber to signal it is a significant action. After activation a banner appears at the top of Settings and at the top of Access Log reading "Emergency QR Override is active" with a Deactivate button.

---

### Section 4 — Hardware Integration

Connection status and configuration for all physical systems connected to PulseAdmin.

Each hardware item follows the same row pattern — hardware name on the left, current connection status badge in the centre, and a Configure or Recalibrate action on the right.

| Hardware | Status Values | Action |
|---|---|---|
| Smart Lockers | Connected, Disconnected | Configure |
| Door Biometric System | Online, Offline, Degraded | Recalibrate |
| HVAC System | Operational, Maintenance, Offline | Configure |
| Access Control Panel | Online, Offline | Recalibrate |

Recalibrate triggers an API call to the connected hardware. While the recalibration is running, the button becomes a loading state with a spinner. On completion a success or failure toast appears. This replaces the Recalibrate Sensors button that was previously on the Dashboard.

Configure opens a small modal per hardware item with connection credentials or IP address fields relevant to that device. These are technical fields — this section is owner-only, not front desk staff territory.

---

### Section 5 — Notifications

Controls which system events trigger alerts and how those alerts are delivered.

Two layers of configuration — what triggers an alert, and how it is delivered.

**Trigger events — each with an on/off toggle:**
- New member enrolled
- Member payment received
- Member payment overdue
- Membership expiring within 7 days
- Membership expired with no renewal
- Member frozen or unfrozen
- Access denied event
- Staff member clocked in or out
- System health status change (hardware goes offline or into maintenance)

**Delivery methods — per event, select one or more:**
- In-app notification (always available)
- Email
- SMS (if SMS gateway is configured in Billing & Integrations)

If SMS is not configured, the SMS option appears greyed out with a note "Configure SMS gateway in Billing & Integrations to enable."

---

### Section 6 — Billing & Payment Gateway

Connection and configuration for the payment processing layer.

| Field | Type | Notes |
|---|---|---|
| Payment Gateway | Select — Razorpay, Stripe, PayU, Manual | Required |
| API Key | Password input — masked | Required if gateway selected |
| Webhook URL | Text — read only, auto-generated | For gateway callback configuration |
| Currency | Select — defaults to INR | |
| Tax Rate (GST) | Number input — percentage | Applied to all invoices |
| Invoice Prefix | Text input | e.g. "PA-" produces invoice numbers like PA-0001 |

A Test Connection button validates the API key against the selected gateway. On success a green Connected badge appears next to the gateway name. On failure an inline error describes what went wrong.

Manual mode — if the gym owner selects Manual, all gateway fields are hidden. Payments are recorded by staff without integration. This accommodates gyms that collect cash or use external POS systems.

---

### Section 7 — Admin Accounts & Permissions

Manage who has access to PulseAdmin and what they can do.

**Account table columns:**
- Name and email
- Role — Owner, Manager, Front Desk, Custom
- Access Level — which menu sections they can see and whether they have View or Edit rights per section
- Status — Active, Invited (not yet accepted), Deactivated
- Actions — Edit Permissions, Deactivate, Resend Invite

**Permission matrix per staff account:**
Each section of PulseAdmin can be set independently per account to No Access, View Only, or Full Access.

| Section | Permission options |
|---|---|
| Dashboard | View Only (always, no Full Access option — Dashboard is read-only) |
| Members | No Access, View Only, Full Access |
| Schedule | No Access, View Only, Full Access |
| Access Log | No Access, View Only, Full Access |
| Sales Leads | No Access, View Only, Full Access |
| Reports & Analytics | No Access, View Only, Full Access |
| Staff | No Access, View Only, Full Access |
| Membership Plans | No Access, View Only, Full Access |
| Settings | No Access, Full Access only (no View Only — Settings contains credentials) |

**Owner account rules:**
- Owner account always has Full Access to everything
- Owner account cannot be demoted, deactivated, or deleted
- Only one Owner account per gym
- Owner is set at the time of gym onboarding

**Invite flow:**
Clicking "+ Invite Admin" opens a small modal — name, email, role selection, and permission matrix. On confirm an invitation email is sent. The account appears in the table with Invited status until the invite is accepted. Uninvited or expired invites can be resent from the Actions column.

---

### Section 8 — Data & Privacy

Controls for data retention and export at the system level. Not per-page export — this is full account data management.

| Control | Behaviour |
|---|---|
| Export All Data | Generates a full ZIP export of all gym data — members, transactions, logs, schedules — as CSV files |
| Data Retention Period | Select — 1 year, 2 years, 5 years, Forever. Logs and records older than the selected period are archived |
| Delete All Data | Destructive action — requires the owner to type the gym name to confirm. Irreversible. |

Delete All Data is styled in red, separated visually from the other controls with a warning banner above it reading "This action is permanent and cannot be undone."

---

### Save Behaviour Across Settings

Not all sections should auto-save. The pattern is:

- **Sections with a single toggle or selection** (Operational Mode, individual notification toggles, entry method toggles) — save immediately on change, show a brief inline "Saved" confirmation next to the changed control
- **Sections with multiple fields** (Gym Profile, Billing, Hardware credentials) — show an explicit Save button at the bottom of that section, changes do not apply until saved
- **Destructive actions** (Emergency QR Override, Delete All Data, Deactivate account) — always require a confirmation step before executing, regardless of section save behaviour

---

*This section completes the Developer Handoff Note. Settings combined with the earlier nine sections now covers the full PulseAdmin scope as of March 2026.*