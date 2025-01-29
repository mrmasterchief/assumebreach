import helmet from "helmet";

const helmetMiddleware = helmet({
  frameguard: {
    action: "deny",
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      scriptSrc: ["'self'", "cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:"],
    },
  },
  referrerPolicy: {
    policy: "same-origin",
  },
  noSniff: true,
  xssFilter: true,
});

export default helmetMiddleware;
