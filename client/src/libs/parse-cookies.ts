interface CookieAttributes {
  maxAge?: number;
  domain?: string;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
}

interface Cookie {
  value: string;
  attributes: CookieAttributes;
}

type ParsedCookies = Record<string, Cookie | undefined>;

export function parseCookies(cookieString: string): ParsedCookies {
  return cookieString.split(", ").reduce((acc: ParsedCookies, cookie) => {
    const [nameValue, ...attributes] = cookie.split("; ");
    const [name, value] = nameValue.split("=");

    const decodedName = decodeURIComponent(name);
    const decodedValue = decodeURIComponent(value);

    const cookieAttributes = attributes.reduce(
      (attrAcc: CookieAttributes, attr) => {
        const [key, attrValue] = attr.split("=");
        const decodedKey = decodeURIComponent(key.toLowerCase());
        const decodedAttrValue = attrValue
          ? decodeURIComponent(attrValue)
          : undefined;

        switch (decodedKey) {
          case "max-age":
            attrAcc.maxAge = Number(decodedAttrValue);
            break;
          case "domain":
            attrAcc.domain = decodedAttrValue;
            break;
          case "path":
            attrAcc.path = decodedAttrValue;
            break;
          case "httponly":
            attrAcc.httpOnly = true;
            break;
          case "secure":
            attrAcc.secure = true;
            break;
          case "samesite":
            attrAcc.sameSite = decodedAttrValue as "lax" | "strict" | "none";
            break;
        }
        return attrAcc;
      },
      {},
    );

    acc[decodedName] = { value: decodedValue, attributes: cookieAttributes };
    return acc;
  }, {});
}
