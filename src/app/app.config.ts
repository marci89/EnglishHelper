import { NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { environment } from 'src/environments/environment';

export const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: environment.domainUrl, // this is important to fit the domain
    expiryDays: 365, // Set the cookie to expire after 1 day
  },
  position: 'bottom',
  theme: "classic",
  palette: {
    popup: {
      background: "#000000",
      text: "#ffffff",
      link: "#ffffff"
    },
    button: {
      background: "#f1d600",
      text: "#000000",
      border: "transparent"
    }
  },
  type: 'info',
  content: {
    message: 'This website uses cookies to ensure you get the best experience on our website.',
    dismiss: 'Got it!',
    link: 'Learn more',
    href: "https://cookiesandyou.com",
    policy: "Cookie Policy"
  }
};
