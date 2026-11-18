# PLMun Smart Event Equipment Reservation & Borrowing System

PHP + MySQL backend, plain HTML/CSS/JS frontend. Every page has its own folder with its own `.html`, `.css`, `.js`.

## Run it (VS Code + XAMPP)
1. Copy this whole folder to `C:\xampp\htdocs\plmun` and start **Apache** and **MySQL** in XAMPP.
2. Import the database: phpMyAdmin > Import > `database/plmun_reservation_db.sql`
   (optional demo history: then import `database/sample_activity.sql`).
   Or in the VS Code terminal: `mysql -u root < database/plmun_reservation_db.sql`
3. Copy `config/config.local.example.php` to `config/config.local.php` and fill in your private settings (Gmail App Password for the verification emails, optional DB password / AI key). This file is git-ignored so secrets never reach GitHub. Without a mail password, emails are only written to `storage/mail.log`. Edit `config/config.php` if your MySQL user differs.
4. Open **http://localhost/plmun/** (do NOT open the .html files by double-clicking; the PHP API needs a server).

No XAMPP? From this folder run `php -S localhost:8000` and open http://localhost:8000/


## Publish on GitHub Pages (free, no domain needed)
GitHub Pages can only host static files (no PHP, no MySQL), so on Pages the site automatically switches to a **browser-only backend**
(`assets/js/localapi.js`). It has the same features and demo data, but everything is saved **in each visitor's own browser** (accounts and
reservations are not shared between devices). On XAMPP / `php -S` the real PHP + MySQL is still used; nothing to change.

1. Create a new repository on github.com and upload the contents of this folder (so `index.html` is at the top level of the repo).
   Do **not** upload `config/config.local.php`.
2. Repo > **Settings** > **Pages** > Source: *Deploy from a branch* > Branch: `main`, folder `/ (root)` > Save.
3. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.
4. Demo accounts are the same as below. To wipe the browser data and start over, clear the site data in the browser (or run `LocalAPI.reset()` in the console).

### Email on GitHub Pages (sign-up code + "ready for release" notice)
A static site has no mail server, so it uses **EmailJS** (free, 200 emails/month). No Gmail password is ever stored in the code.
1. Sign up at https://www.emailjs.com > **Email Services** > Add service > Gmail > connect the sender Gmail account. Copy the **Service ID**.
2. **Email Templates** > Create template. Set **To email** = `{{to_email}}`, **Subject** = `{{subject}}`, and put `{{{html}}}` (three braces) as the content. Copy the **Template ID**.
3. **Account** > **General** > copy your **Public Key**.
4. Put the three values in `assets/js/site-config.js` (they are meant to be public) and upload it again.

Until those values are filled in, the site still works: the verification code is simply shown on screen ("Demo mode").
Note: on Pages the code is generated inside the browser, so it is fine for a school project/demo but is not tamper-proof like the PHP version.

## Demo accounts
| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@plmun.edu.ph | admin123 |
| User  | juan@plmun.edu.ph  | user123  |
Sign-up asks for Surname, First name and M.I. Both `users` and `admin` store them separately (`full_name` is built automatically).
Reviews are per product (chair, table, ...). Already have the old database? Import `database/migrate_names_and_reviews.sql` instead of re-importing everything.
New sign-ups are saved to the `users` table (password hashed with `password_hash`).

## Folder map
```
plmun-reservation/
├─ index.html                 login page (site entry point)
├─ .nojekyll                  tells GitHub Pages to serve every folder as-is
├─ assets/js/localapi.js      browser-only backend (used on GitHub Pages)
├─ assets/js/site-config.js   public site settings (backend mode, EmailJS keys)
├─ config/
│  ├─ config.php              DB login + late fee
│  └─ bootstrap.php           shared PHP helpers (db, auth, availability)
├─ database/                  plmun_reservation_db.sql, sample_activity.sql, migrate_names_and_reviews.sql
├─ api/                       PHP endpoints, one folder per module
│  ├─ auth/                   auth.php, users.php
│  ├─ booking/                reservations.php, reviews.php                 (Module 1)
│  ├─ borrowing/              borrowings.php                                (Module 2)
│  ├─ returns/                returns.php, penalties.php                    (Module 3)
│  ├─ inventory/              equipment.php, categories.php                 (Module 4)
│  └─ analytics/              analytics.php, overview.php                   (Module 5)
├─ assets/
│  ├─ css/                    base.css (colours, fonts) · layout.css (client top bar, admin sidebar)
│  │                          components.css (buttons, forms, tables) · charts.css (dashboard widgets)
│  ├─ js/                     app.js (shell, routes, helpers) · charts.js (line, donut, bar charts)
│  ├─ img/                    logo.png, campus.jpg, icon_*.png product photos
│  └─ uploads/                photos uploaded from the Inventory page
└─ pages/                     every page = its own folder with .html + .css + .js
   ├─ auth/                   login, signup
   ├─ client/                 dashboard, catalog, equipment-details, reserve, my-reservations, my-penalties, reviews
   └─ admin/                  dashboard, reservations, borrowing, returns, penalties, inventory, users
```
Page links live in one place: the `ROUTES` table at the top of `assets/js/app.js`. API folders are mapped in the `API` table next to it, so page scripts still just call `App.api('reservations.php')`.

## Design
Green and gold PLMun theme on a cream background. Client pages use a top navigation bar (Home, Catalog, Reserve, My Reservations, Penalties, Reviews, plus name and Log out). Admin pages use a left sidebar (Dashboard, Reservations, Borrowing & Dispatch, Returns & Inspection, Penalties, Inventory, Users). Both dashboards keep the stat cards and charts (line, donut, bar). Colours are variables in `assets/css/base.css`; the layout lives in `assets/css/layout.css`.

## Modules
1. Client Booking & Interactive Catalog: catalog, live availability by date/time, request form, reviews
2. Digital Borrowing & Dispatching: admin approves, then releases items with a dispatch record
3. Smart Returning, Inspection & Penalty: item-by-item inspection, auto late fee, damage/loss penalties
4. Advanced Inventory & Asset Life-Cycle: stock, condition, maintenance, retire, incident counts
5. Operational Analytics & Revenue Intelligence: dashboard with trends, top equipment, penalty revenue

## Email notification and chatbot
- **Email:** when the admin approves a reservation, the borrower is emailed that it is ready for release (Borrowing & Dispatch also has a **Notify** button to resend). Set `MAIL_ENABLED = true` and your Gmail App Password in `config/config.php`. While it is `false`, emails are only written to `storage/mail.log`.
- **Chatbot:** floating button on every logged-in page (`api/chat/chat.php`, `assets/js/chatbot.js`). Add `AI_API_KEY` in `config/config.php` to use Claude; without a key it answers with built-in rules from the database.
