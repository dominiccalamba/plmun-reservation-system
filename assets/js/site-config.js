/* Site settings for the browser. Everything here is PUBLIC (it is downloaded by every visitor), so never put passwords here.
 *
 * backend: 'auto'  -> use PHP + MySQL when the server has them (XAMPP, php -S), otherwise the built-in browser backend (GitHub Pages).
 *          'local' -> always use the browser backend.   'php' -> always use PHP.
 *
 * emailjs: only used by the browser backend, to send the sign-up verification code and the "ready for release" notice.
 *          Create a free account at https://www.emailjs.com, then fill in the three values below (see README, "Email on GitHub Pages").
 *          The public key is meant to be public. Leave them '' and the site still works: the verification code is shown on screen instead.
 */
window.PLMUN_CONFIG = {
  backend: 'auto',
  emailjs: {
    serviceId: '',    // e.g. 'service_abc123'
    templateId: '',   // e.g. 'template_xyz789'
    publicKey: '',    // e.g. 'AbCdEfGhIjKlMnOp'
  },
};
