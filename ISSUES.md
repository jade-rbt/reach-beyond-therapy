# Reach Beyond Therapy — GitHub Pages Replica: Known Issues & Gaps

This document tracks gaps between the static GitHub Pages replica and the original Squarespace site at [reachbeyondtherapy.com](https://www.reachbeyondtherapy.com/), along with proposed resolution paths.

---

## 🖼️ IMAGES

### Issue 1: All images are placeholders
**Description:** The original Squarespace site uses photography throughout — hero images, staff headshots, splint gallery photos (20+), blog post thumbnails, and media feature screenshots. These images are hosted on Squarespace's CDN and cannot be directly referenced from a GitHub Pages site.

**Impact:** All image slots currently display gray placeholder boxes with text labels.

**Resolution Options:**
- A. **Download from source:** Use a browser devtools Network tab or a site scraper (e.g., `wget --mirror`) to download all images from the Squarespace site and commit them to an `images/` directory.
- B. **Request assets directly:** Ask the client to export images from Squarespace admin → Settings → Backup → Export, then provide the assets for inclusion.
- C. **Re-photograph / re-source:** Commission new photography for the static site (recommended for a true independent deployment).

**Files affected:** All HTML pages — specifically hero sections, staff cards, splint gallery, blog cards, media cards.

---

## 🎨 EXACT VISUAL DESIGN

### Issue 2: Color palette is approximated
**Description:** The exact hex color values from the Squarespace theme are not publicly accessible via HTML source (Squarespace inlines many styles in ways that are difficult to extract without direct CSS inspection). The replica uses an approximated palette (dark navy `#1c2b3a`, warm gold `#c79e5a`) based on the visible design aesthetic.

**Resolution:**
- Use browser DevTools on the original site to inspect specific elements and extract exact hex values.
- Update `css/styles.css` `:root` variables accordingly.

### Issue 3: Fonts may not be an exact match
**Description:** The replica uses **Playfair Display** (headings) and **Inter** (body) as close approximations. The Squarespace site's exact font stack was not determinable from the fetched content.

**Resolution:**
- Inspect the original site's `<head>` for `@font-face` declarations or Google Fonts `<link>` tags.
- Update the `@import` in `css/styles.css` to match.

### Issue 4: Hero background images
**Description:** The hero section on the home page features a dramatic photograph (hand showing a peace sign against a dark background). The replica uses a CSS gradient fallback.

**Resolution:** Provide the hero image file as `images/hero-bg.jpg` and it will automatically be used (the CSS `background-image` is already wired up in `.hero-bg`).

---

## ⚙️ FUNCTIONALITY

### Issue 5: Contact form does not submit
**Description:** The contact form on `contact.html` performs client-side validation only. There is no form backend, so submissions are not sent anywhere.

**Resolution Options:**
- A. **Formspree:** Add `action="https://formspree.io/f/YOUR_FORM_ID"` and `method="POST"` to the form — free tier supports 50 submissions/month.
- B. **Netlify Forms:** If hosting on Netlify instead of GitHub Pages, add `netlify` attribute to the form.
- C. **EmailJS:** Use the EmailJS SDK to send form submissions to an email address directly from the browser.
- D. **GitHub Actions + SMTP:** Create a GitHub Actions workflow triggered by a repository dispatch event.

### Issue 6: Blog posts have no content pages
**Description:** The blog listing page (`blog.html`) includes all 9 post titles and dates, but individual blog post pages do not exist. Clicking "Read More" links to `#` placeholders.

**Resolution:**
- Fetch each blog post's full content from the Squarespace site.
- Create individual HTML files (e.g., `blog/hand-therapy-vs-physical-therapy.html`).
- Update the blog listing links accordingly.

### Issue 7: Shopping cart functionality removed
**Description:** The original Squarespace site includes a shopping cart (0 items) in the navigation, likely for booking/service payments via Squarespace Commerce. This is not replicated.

**Resolution:**
- If booking/payment is needed, integrate a third-party solution such as:
  - **Acuity Scheduling** or **Jane App** for appointment booking
  - **Square**, **Stripe**, or **PayPal** for payment links
- Add a booking button linking to the external scheduling tool.

### Issue 8: Privacy Policy and SMS Terms pages are placeholders
**Description:** The footer links to `#` for Privacy Policy and SMS Terms & Conditions. These pages were not accessible during the scraping phase (returned 404).

**Resolution:**
- Obtain the full text of these documents from the Squarespace site's admin or legal counsel.
- Create `privacy-policy.html` and `sms-terms.html` pages.

---

## 🗺️ GOOGLE MAPS

### Issue 9: Map embed is a placeholder
**Description:** The contact page includes a placeholder for a Google Maps embed of the office address.

**Resolution:**
- Go to Google Maps → search "2512 Artesia Blvd, Suite 305F, Redondo Beach, CA 90278" → Share → Embed a map → Copy HTML.
- Replace the placeholder `div` in `contact.html` with the `<iframe>` embed code.

---

## 🔗 EXTERNAL LINKS

### Issue 10: Media external links are approximate
**Description:** The Media page links to Spotify, VoyageLA, and NBCOT using the root domains only (specific article/episode URLs were not captured during analysis).

**Resolution:**
- Obtain the specific URLs from the original Squarespace site's Media page.
- Update the `href` attributes in `media.html`.

---

## 📱 SOCIAL MEDIA

### Issue 11: Social media profile URLs are assumed
**Description:** Instagram and TikTok links use `@reachbeyondtherapy` as the assumed handle. These should be verified against the actual profile URLs on the original site.

**Resolution:**
- Verify the correct social handles and update links in the footer of all HTML pages.

---

## 🚀 DEPLOYMENT

### Issue 12: GitHub Pages deployment not yet configured
**Description:** The repository has not yet been configured to deploy via GitHub Pages. The `.nojekyll` file is in place to suppress Jekyll processing.

**Resolution:**
1. Push the repository to GitHub.
2. Go to Repository → Settings → Pages.
3. Under "Source," select **Deploy from a branch**.
4. Select **main** branch, **/ (root)** directory.
5. Click Save. GitHub will provide a `github.io` URL within minutes.

### Issue 13: Custom domain not configured
**Description:** If the intent is to point `reachbeyondtherapy.com` (or a subdomain) to the GitHub Pages site, a `CNAME` file and DNS changes are required.

**Resolution:**
1. Create a `CNAME` file in the repo root containing the custom domain (e.g., `reachbeyondtherapy.com`).
2. At the DNS provider, set an `A` record pointing to GitHub Pages IPs:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
3. Or set a `CNAME` DNS record to `<username>.github.io`.
4. Enable "Enforce HTTPS" in the GitHub Pages settings after DNS propagates.

---

## 📋 SUMMARY TABLE

| # | Category | Severity | Status |
|---|----------|----------|--------|
| 1 | Images — all placeholders | High | Open |
| 2 | Exact color values unknown | Low | Open |
| 3 | Fonts may not match exactly | Low | Open |
| 4 | Hero image missing | Medium | Open |
| 5 | Contact form non-functional | High | Open |
| 6 | Blog post pages missing | Medium | Open |
| 7 | Shopping cart removed | Medium | Open |
| 8 | Legal pages missing | Medium | Open |
| 9 | Google Map placeholder | Low | Open |
| 10 | Media URLs approximate | Low | Open |
| 11 | Social URLs unverified | Low | Open |
| 12 | GitHub Pages not deployed | High | Open |
| 13 | Custom domain not configured | Medium | Open |
